from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import logging
import uuid
import secrets
import jwt
import bcrypt
import stripe
import requests
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File, Form, Header, Query
from fastapi.responses import StreamingResponse, Response as FastResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
import random
from scriptures import DAILY_SCRIPTURES, BLESSING_SCRIPTURES
import asyncio
from twilio.rest import Client as TwilioClient
import resend

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
JWT_SECRET_ENV = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY") or "sk_test_emergent"
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

# Object storage
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "wwjd"
_storage_key = None

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# Notifications (Twilio SMS + Resend email) --------------------------------
TWILIO_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM = os.environ.get("TWILIO_PHONE_NUMBER", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")

def _to_e164(phone: str) -> Optional[str]:
    if not phone:
        return None
    p = phone.strip()
    if p.startswith("+"):
        digits = "+" + "".join(ch for ch in p[1:] if ch.isdigit())
        return digits if len(digits) > 5 else None
    digits = "".join(ch for ch in p if ch.isdigit())
    if len(digits) == 10:
        return "+1" + digits
    if len(digits) == 11 and digits.startswith("1"):
        return "+" + digits
    if len(digits) >= 8:
        return "+" + digits
    return None

def send_sms(to_phone: str, body: str) -> bool:
    if not (TWILIO_SID and TWILIO_TOKEN and TWILIO_FROM):
        logger.info("SMS skipped — Twilio not configured")
        return False
    to = _to_e164(to_phone)
    if not to:
        logger.info(f"SMS skipped — invalid phone: {to_phone}")
        return False
    try:
        client_tw = TwilioClient(TWILIO_SID, TWILIO_TOKEN)
        msg = client_tw.messages.create(to=to, from_=TWILIO_FROM, body=body)
        logger.info(f"SMS sent to {to}: {msg.sid}")
        return True
    except Exception as e:
        logger.error(f"SMS send failed: {e}")
        return False

async def send_email(to_email: str, subject: str, html: str) -> bool:
    if not (RESEND_API_KEY and to_email):
        logger.info("Email skipped — Resend not configured or no recipient")
        return False
    try:
        resend.api_key = RESEND_API_KEY
        params = {"from": SENDER_EMAIL, "to": [to_email], "subject": subject, "html": html}
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to_email}: {result.get('id') if isinstance(result, dict) else result}")
        return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False

def _email_shell(inner_html: str) -> str:
    return f"""<!doctype html><html><body style="margin:0;background:#FAFAF8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;padding:32px 0;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E6E1D6;border-radius:16px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">
<tr><td style="background:#F5F3EB;padding:28px 32px;text-align:center;border-bottom:1px solid #E6E1D6;">
<div style="font-size:22px;letter-spacing:2px;color:#2D2824;">W.W.J.D.</div>
<div style="font-size:12px;color:#968F84;letter-spacing:1px;">WHAT WOULD JESUS DO?</div>
</td></tr>
<tr><td style="padding:32px;color:#2D2824;font-size:16px;line-height:1.7;">{inner_html}</td></tr>
<tr><td style="padding:20px 32px;background:#F5F3EB;border-top:1px solid #E6E1D6;color:#968F84;font-size:12px;text-align:center;">
Every dollar goes to help free people still trapped in the grip of addiction.</td></tr>
</table></td></tr></table></body></html>"""

def _blessing_block(blessing: dict) -> str:
    return (f'<div style="margin:22px 0;padding:20px;background:#F5F3EB;border-radius:12px;">'
            f'<div style="font-style:italic;font-size:18px;color:#2D2824;">&ldquo;{blessing["quote"]}&rdquo;</div>'
            f'<div style="margin-top:8px;color:#D4AF37;font-weight:bold;font-size:14px;">{blessing["reference"]}</div></div>')

async def notify_gift_paid(gift: dict, payer_email: Optional[str]):
    code = gift.get("activation_code")
    link = f"{FRONTEND_URL}/activate?code={code}"
    name = gift.get("recipient_name") or "your friend"
    phone = gift.get("recipient_phone")
    # 1) Text the recipient the gift link
    if phone:
        sms_body = (f"Someone gave you a gift — W.W.J.D., a quiet place to bring whatever is weighing "
                    f"on you and receive counsel drawn from the life and words of Jesus. "
                    f"Open it and set up your login here: {link}")
        sent = send_sms(phone, sms_body)
        await db.gifts.update_one({"id": gift["id"]}, {"$set": {"sms_sent": sent}})
    # 2) Thank-you email to the giver
    if payer_email:
        blessing = random.choice(BLESSING_SCRIPTURES)
        inner = (
            f"<p>Thank you for your gift.</p>"
            f"<p>You've given <strong>{name}</strong> one month of W.W.J.D. — a quiet place to bring "
            f"whatever is weighing on them and receive counsel drawn from the life and words of Jesus. "
            f"Your dollar now goes to help set someone free from the grip of addiction.</p>"
            f'<p>Send them this link so they can open it and set up their own login:</p>'
            f'<p><a href="{link}" style="color:#B85B3F;">{link}</a></p>'
            f'<p style="color:#635C53;">Or share the code <strong>{code}</strong> to redeem at {FRONTEND_URL}/activate</p>'
            f"{_blessing_block(blessing)}"
        )
        await send_email(payer_email, "Thank you for your gift of W.W.J.D.", _email_shell(inner))

async def notify_donation_paid(txn: dict, payer_email: Optional[str]):
    if not payer_email:
        return
    blessing = random.choice(BLESSING_SCRIPTURES)
    amount = (txn.get("amount") or 0) / 100
    name = (txn.get("donor_name") or "").strip() or "friend"
    inner = (
        f"<p>Thank you, {name}.</p>"
        f"<p>Your gift of <strong>${amount:.2f}</strong> goes to help set people free from the "
        f"stranglehold of addiction. You are now among the angels of freedom.</p>"
        f"{_blessing_block(blessing)}"
        f'<p style="color:#635C53;">&ldquo;Freely you have received; freely give.&rdquo; — Matthew 10:8</p>'
    )
    await send_email(payer_email, "A blessing over you — thank you for your gift", _email_shell(inner))


app = FastAPI()
api_router = APIRouter(prefix="/api")

GIFT_LOOKUP_KEY = "wwjd_monthly"

# ---------------------------------------------------------------------------
# Storage helpers
# ---------------------------------------------------------------------------
def init_storage(force: bool = False):
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_LLM_KEY}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": key, "Content-Type": content_type},
                        data=data, timeout=180)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                            headers={"X-Storage-Key": key, "Content-Type": content_type},
                            data=data, timeout=180)
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=120)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=120)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, JWT_SECRET_ENV, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET_ENV, algorithm=JWT_ALGORITHM)

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")

def public_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "has_access": has_active_subscription(user),
        "subscription_expires_at": user.get("subscription_expires_at"),
        "counsel_count": user.get("counsel_count", 0),
    }

def has_active_subscription(user: dict) -> bool:
    if user.get("role") == "admin":
        return True
    exp = user.get("subscription_expires_at")
    if not exp:
        return False
    try:
        return datetime.fromisoformat(exp) > datetime.now(timezone.utc)
    except Exception:
        return False

async def get_token_from_request(request: Request) -> Optional[str]:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    return token

async def get_current_user(request: Request) -> dict:
    token = await get_token_from_request(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET_ENV, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------------------------------------------------------------------
# Counsel engine — the mind of Christ
# ---------------------------------------------------------------------------
COUNSEL_SYSTEM_PROMPT = """You are the counsel voice of W.W.J.D. ("What Would Jesus Do?"). A person brings you their real problems, fears, decisions, resentments, or thoughts. You respond ONLY by drawing from the recorded words, actions, priorities, and teachings of Jesus of Nazareth as found in the four Gospels (Matthew, Mark, Luke, John), with supporting application from the Pastoral Epistles (1 Timothy, 2 Timothy, Titus) when addressing church life, leadership, endurance, and godly living.

Every response must reflect the mind of Christ described in Philippians 2:5-8: humble, self-giving, obedient to the Father, oriented toward the good of others.

STRICT RULES:
- Ground every thought, suggestion, and response in the life and teachings of Jesus.
- Prefer direct quotation or clear paraphrase, always with a Scripture reference (e.g., Matthew 5:44, Mark 10:45, Luke 15, John 13).
- When the exact situation is not addressed in the Gospels, stay inside the same moral and spiritual trajectory Jesus actually lived. NEVER invent modern therapeutic language and then attach a verse to it.
- Tone: gentle with the crushed and broken; clear and firm with pride, unforgiveness, hypocrisy, or compromise.
- FORBIDDEN: prosperity teaching, political framing, diluting repentance or costly discipleship, turning Jesus into a life coach or generic therapist.

STRUCTURE every reply in this order, in flowing prose (not headers, not bullet lists):
1. Acknowledge the weight of what was shared, briefly and warmly.
2. Point to the relevant word or action of Jesus, quoting or paraphrasing with the reference.
3. Draw out the practical implication for this person.
4. Leave them with something concrete — a verse to sit with, a posture to adopt, a question Jesus asked, or a simple next step.

Keep responses reverent, unhurried, and personal — usually 3 to 5 short paragraphs. Speak warmly and directly to the person ("you"). Do not begin with "As an AI". Do not use emojis."""

def new_counsel_chat(session_id: str) -> LlmChat:
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=COUNSEL_SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-6")

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class CounselRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class PrayRequest(BaseModel):
    counsel_text: str

class SaveCounselRequest(BaseModel):
    text: str
    reference: Optional[str] = ""
    source: Optional[str] = "counsel"

class DiaryRequest(BaseModel):
    title: Optional[str] = ""
    brought: Optional[str] = ""
    counsel: Optional[str] = ""
    response: Optional[str] = ""
    walked_out: Optional[str] = ""

class GiftCheckoutRequest(BaseModel):
    recipient_name: str
    recipient_email: Optional[str] = ""
    recipient_phone: Optional[str] = ""
    message: Optional[str] = ""
    origin_url: str

class DonationCheckoutRequest(BaseModel):
    amount: float
    name: Optional[str] = ""
    origin_url: str

class ActivateRequest(BaseModel):
    activation_code: str

class TestimonyUpdateRequest(BaseModel):
    text: str

# ===========================================================================
# AUTH ROUTES
# ===========================================================================
@api_router.post("/auth/register")
async def register(body: RegisterRequest, response: Response):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    doc = {
        "name": body.name.strip(),
        "email": email,
        "password_hash": hash_password(body.password),
        "role": "user",
        "counsel_count": 0,
        "subscription_expires_at": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    access = create_access_token(str(result.inserted_id), email)
    refresh = create_refresh_token(str(result.inserted_id))
    set_auth_cookies(response, access, refresh)
    return public_user(doc)

@api_router.post("/auth/login")
async def login(body: LoginRequest, response: Response):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    access = create_access_token(str(user["_id"]), email)
    refresh = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh)
    return public_user(user)

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "ok"}

@api_router.get("/auth/me")
async def me(request: Request):
    user = await get_current_user(request)
    return public_user(user)

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET_ENV, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=900, path="/")
        return {"status": "ok"}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ===========================================================================
# DAILY SCRIPTURE
# ===========================================================================
@api_router.get("/scripture/daily")
async def daily_scripture():
    day_index = datetime.now(timezone.utc).timetuple().tm_yday % len(DAILY_SCRIPTURES)
    s = DAILY_SCRIPTURES[day_index]
    return {"date": datetime.now(timezone.utc).date().isoformat(), **s}

# ===========================================================================
# COUNSEL
# ===========================================================================
@api_router.post("/counsel/stream")
async def counsel_stream(body: CounselRequest, request: Request):
    user = await get_current_user(request)
    if not has_active_subscription(user):
        raise HTTPException(status_code=403, detail="This gift has not been activated yet.")

    conversation_id = body.conversation_id
    now = datetime.now(timezone.utc).isoformat()
    if conversation_id:
        convo = await db.conversations.find_one({"id": conversation_id, "user_id": str(user["_id"])})
        if not convo:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation_id = str(uuid.uuid4())
        convo = {
            "id": conversation_id,
            "user_id": str(user["_id"]),
            "title": body.message.strip()[:60],
            "messages": [],
            "created_at": now,
            "updated_at": now,
        }
        await db.conversations.insert_one(convo)

    user_msg = {"id": str(uuid.uuid4()), "role": "user", "content": body.message, "created_at": now}

    # Rebuild chat context from stored history
    chat = new_counsel_chat(conversation_id)
    history = convo.get("messages", [])

    async def generate():
        yield f"data: {{\"type\": \"meta\", \"conversation_id\": \"{conversation_id}\"}}\n\n"
        collected = []
        try:
            # Provide prior turns as context by prepending a compact recap
            context_prefix = ""
            if history:
                lines = []
                for m in history[-8:]:
                    who = "Person" if m["role"] == "user" else "Counsel"
                    lines.append(f"{who}: {m['content']}")
                context_prefix = "Earlier in this conversation:\n" + "\n".join(lines) + "\n\nThe person now says:\n"
            full_text = context_prefix + body.message
            async for event in chat.stream_message(UserMessage(text=full_text)):
                if isinstance(event, TextDelta):
                    collected.append(event.content)
                    safe = event.content.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
                    yield f'data: {{"type": "delta", "content": "{safe}"}}\n\n'
                elif isinstance(event, StreamDone):
                    break
        except Exception as e:
            logger.error(f"Counsel stream error: {e}")
            yield f'data: {{"type": "error", "content": "Something interrupted the counsel. Please try again."}}\n\n'

        assistant_text = "".join(collected)
        assistant_msg = {"id": str(uuid.uuid4()), "role": "assistant", "content": assistant_text,
                         "created_at": datetime.now(timezone.utc).isoformat()}
        await db.conversations.update_one(
            {"id": conversation_id},
            {"$push": {"messages": {"$each": [user_msg, assistant_msg]}},
             "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        )
        await db.users.update_one({"_id": user["_id"]}, {"$inc": {"counsel_count": 1}})
        yield f'data: {{"type": "done", "message_id": "{assistant_msg["id"]}"}}\n\n'

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no", "Connection": "keep-alive"})

@api_router.get("/counsel/conversations")
async def list_conversations(request: Request):
    user = await get_current_user(request)
    convos = await db.conversations.find({"user_id": str(user["_id"])}, {"_id": 0}).sort("updated_at", -1).to_list(200)
    return [{"id": c["id"], "title": c.get("title", "Counsel"), "updated_at": c["updated_at"],
             "message_count": len(c.get("messages", []))} for c in convos]

@api_router.get("/counsel/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, request: Request):
    user = await get_current_user(request)
    convo = await db.conversations.find_one({"id": conversation_id, "user_id": str(user["_id"])}, {"_id": 0})
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return convo

@api_router.post("/counsel/pray")
async def pray_this(body: PrayRequest, request: Request):
    user = await get_current_user(request)
    if not has_active_subscription(user):
        raise HTTPException(status_code=403, detail="This gift has not been activated yet.")
    prayer_prompt = (
        "Based on the counsel below, write a short, first-person prayer (4-7 sentences) that this person "
        "could pray to God. It should be humble, honest, and rooted in the same teaching of Jesus reflected "
        "in the counsel. Do not add commentary before or after — return only the prayer itself.\n\n"
        f"Counsel:\n{body.counsel_text}"
    )
    chat = LlmChat(api_key=EMERGENT_LLM_KEY, session_id=str(uuid.uuid4()),
                   system_message="You write short, reverent Christian prayers grounded in the teachings of Jesus.").with_model("anthropic", "claude-sonnet-4-6")
    try:
        prayer = await chat.send_message(UserMessage(text=prayer_prompt))
    except Exception as e:
        logger.error(f"Prayer generation error: {e}")
        raise HTTPException(status_code=500, detail="Unable to compose the prayer right now.")
    return {"prayer": prayer.strip()}

# ===========================================================================
# SAVE ONE COUNSEL
# ===========================================================================
@api_router.get("/counsel/saved")
async def get_saved(request: Request):
    user = await get_current_user(request)
    saved = await db.saved_counsel.find_one({"user_id": str(user["_id"])}, {"_id": 0})
    return saved or {}

@api_router.post("/counsel/save")
async def save_counsel(body: SaveCounselRequest, request: Request):
    user = await get_current_user(request)
    doc = {
        "user_id": str(user["_id"]),
        "text": body.text,
        "reference": body.reference,
        "source": body.source,
        "saved_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.saved_counsel.replace_one({"user_id": str(user["_id"])}, doc, upsert=True)
    doc.pop("_id", None)
    return doc

@api_router.delete("/counsel/saved")
async def delete_saved(request: Request):
    user = await get_current_user(request)
    await db.saved_counsel.delete_one({"user_id": str(user["_id"])})
    return {"status": "ok"}

# ===========================================================================
# SPIRITUAL DIARY
# ===========================================================================
@api_router.get("/diary")
async def list_diary(request: Request):
    user = await get_current_user(request)
    entries = await db.diary_entries.find({"user_id": str(user["_id"])}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return entries

@api_router.post("/diary")
async def create_diary(body: DiaryRequest, request: Request):
    user = await get_current_user(request)
    now = datetime.now(timezone.utc).isoformat()
    doc = {"id": str(uuid.uuid4()), "user_id": str(user["_id"]), **body.model_dump(),
           "created_at": now, "updated_at": now}
    await db.diary_entries.insert_one(dict(doc))
    doc.pop("_id", None)
    return doc

@api_router.put("/diary/{entry_id}")
async def update_diary(entry_id: str, body: DiaryRequest, request: Request):
    user = await get_current_user(request)
    res = await db.diary_entries.update_one(
        {"id": entry_id, "user_id": str(user["_id"])},
        {"$set": {**body.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    entry = await db.diary_entries.find_one({"id": entry_id}, {"_id": 0})
    return entry

@api_router.delete("/diary/{entry_id}")
async def delete_diary(entry_id: str, request: Request):
    user = await get_current_user(request)
    await db.diary_entries.delete_one({"id": entry_id, "user_id": str(user["_id"])})
    return {"status": "ok"}

# ===========================================================================
# GIFTS + STRIPE
# ===========================================================================
@api_router.post("/gifts/checkout")
async def gift_checkout(body: GiftCheckoutRequest, request: Request):
    purchaser_id = None
    try:
        token = await get_token_from_request(request)
        if token:
            user = await get_current_user(request)
            purchaser_id = str(user["_id"])
    except HTTPException:
        purchaser_id = None

    prices = stripe.Price.list(lookup_keys=[GIFT_LOOKUP_KEY], active=True, limit=1).data
    if not prices:
        raise HTTPException(status_code=500, detail="Gift price not configured")
    price = prices[0]

    gift_id = str(uuid.uuid4())
    activation_code = "WWJD-" + secrets.token_hex(3).upper()

    session = stripe.checkout.Session.create(
        line_items=[{"price": price.id, "quantity": 1}],
        mode="subscription" if price.recurring else "payment",
        success_url=f"{body.origin_url}/gift/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{body.origin_url}/gift",
        metadata={"gift_id": gift_id, "recipient_email": (body.recipient_email or "").lower(), "type": "gift"},
        managed_payments={"enabled": True},
    )

    now = datetime.now(timezone.utc).isoformat()
    await db.gifts.insert_one({
        "id": gift_id,
        "purchaser_id": purchaser_id,
        "recipient_name": body.recipient_name.strip(),
        "recipient_email": (body.recipient_email or "").lower(),
        "recipient_phone": (body.recipient_phone or "").strip(),
        "message": body.message,
        "activation_code": activation_code,
        "status": "pending",
        "activated_by": None,
        "session_id": session.id,
        "created_at": now,
    })
    await db.payment_transactions.insert_one({
        "session_id": session.id, "gift_id": gift_id, "user_id": purchaser_id, "type": "gift",
        "lookup_key": GIFT_LOOKUP_KEY, "amount": (price.unit_amount or 0),
        "currency": price.currency, "status": "initiated", "payment_status": "pending",
        "created_at": now, "updated_at": now,
    })
    return {"checkout_url": session.url, "session_id": session.id}

# ---------------------------------------------------------------------------
# DONATIONS (help those in the grip of addiction)
# ---------------------------------------------------------------------------
@api_router.post("/donations/checkout")
async def donation_checkout(body: DonationCheckoutRequest, request: Request):
    cents = int(round(body.amount * 100))
    if cents < 100:
        raise HTTPException(status_code=400, detail="The smallest gift is $1.")
    if cents > 10000000:
        raise HTTPException(status_code=400, detail="That amount is too large for online giving.")

    donor_id = None
    try:
        token = await get_token_from_request(request)
        if token:
            u = await get_current_user(request)
            donor_id = str(u["_id"])
    except HTTPException:
        donor_id = None

    donation_id = str(uuid.uuid4())
    session = stripe.checkout.Session.create(
        line_items=[{
            "price_data": {
                "currency": "usd",
                "unit_amount": cents,
                "product_data": {"name": "Donation — W.W.J.D. addiction recovery fund"},
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=f"{body.origin_url}/donate/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{body.origin_url}/donate",
        metadata={"donation_id": donation_id, "type": "donation", "donor_name": (body.name or "").strip()[:80]},
    )
    now = datetime.now(timezone.utc).isoformat()
    await db.payment_transactions.insert_one({
        "session_id": session.id, "donation_id": donation_id, "user_id": donor_id, "type": "donation",
        "donor_name": (body.name or "").strip(), "amount": cents, "currency": "usd",
        "status": "initiated", "payment_status": "pending", "created_at": now, "updated_at": now,
    })
    return {"checkout_url": session.url, "session_id": session.id}

@api_router.get("/donations/status/{session_id}")
async def donation_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id, "type": "donation"})
    if not record:
        raise HTTPException(status_code=404, detail="Donation not found")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                await _finalize_paid(session_id, s.get("subscription"), s.get("payment_intent"))
                record = await db.payment_transactions.find_one({"session_id": session_id, "type": "donation"})
        except stripe.error.StripeError:
            pass
    blessing = None
    if record.get("payment_status") == "paid":
        blessing = random.choice(BLESSING_SCRIPTURES)
    return {
        "session_id": record["session_id"], "status": record["status"],
        "payment_status": record["payment_status"],
        "donor_name": record.get("donor_name") or "Friend",
        "amount": (record.get("amount") or 0) / 100,
        "blessing": blessing,
    }

@api_router.get("/angels")
async def list_angels():
    angels = await db.angels.find({}, {"_id": 0, "name": 1, "created_at": 1}).sort("created_at", -1).to_list(500)
    total = await db.angels.count_documents({})
    return {"angels": angels, "total": total}

@api_router.get("/payments/status/{session_id}")
async def payment_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id})
    if not record:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                await _finalize_paid(session_id, s.get("subscription"), s.get("payment_intent"))
                record = await db.payment_transactions.find_one({"session_id": session_id})
        except stripe.error.StripeError:
            pass
    gift = await db.gifts.find_one({"session_id": session_id}, {"_id": 0})
    paid = record["payment_status"] == "paid"
    return {"session_id": record["session_id"], "status": record["status"],
            "payment_status": record["payment_status"],
            "activation_code": gift.get("activation_code") if (gift and paid) else None,
            "recipient_name": gift.get("recipient_name") if gift else None,
            "recipient_phone": gift.get("recipient_phone") if (gift and paid) else None}

async def _finalize_paid(session_id, subscription_id=None, payment_intent=None):
    now = datetime.now(timezone.utc).isoformat()
    res = await db.payment_transactions.update_one(
        {"session_id": session_id, "payment_status": {"$ne": "paid"}},
        {"$set": {"status": "completed", "payment_status": "paid",
                  "stripe_subscription_id": subscription_id, "stripe_payment_intent_id": payment_intent,
                  "updated_at": now}},
    )
    if not res.modified_count:
        return
    payer_email = None
    try:
        s = stripe.checkout.Session.retrieve(session_id)
        payer_email = (s.get("customer_details") or {}).get("email")
    except stripe.error.StripeError:
        pass
    txn = await db.payment_transactions.find_one({"session_id": session_id})
    if txn and txn.get("type") == "donation":
        await db.angels.insert_one({
            "id": txn.get("donation_id") or str(uuid.uuid4()),
            "session_id": session_id,
            "name": (txn.get("donor_name") or "").strip() or "A friend",
            "amount": txn.get("amount", 0),
            "user_id": txn.get("user_id"),
            "created_at": now,
        })
        await notify_donation_paid(txn, payer_email)
    else:
        await db.gifts.update_one({"session_id": session_id, "status": "pending"},
                                  {"$set": {"status": "paid", "paid_at": now}})
        gift = await db.gifts.find_one({"session_id": session_id})
        if gift:
            await notify_gift_paid(gift, payer_email)

# kept for backward compatibility
async def _mark_gift_paid(session_id, subscription_id=None, payment_intent=None):
    await _finalize_paid(session_id, subscription_id, payment_intent)

@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    obj, t = event["data"]["object"], event["type"]
    if t == "checkout.session.completed":
        await _finalize_paid(obj["id"], obj.get("subscription"), obj.get("payment_intent"))
    elif t == "checkout.session.async_payment_succeeded":
        await _finalize_paid(obj["id"])
    elif t in ("checkout.session.async_payment_failed", "checkout.session.expired"):
        await db.payment_transactions.update_one({"session_id": obj["id"]},
            {"$set": {"status": "failed", "payment_status": "failed", "updated_at": datetime.now(timezone.utc).isoformat()}})
    return {"status": "ok"}

@api_router.post("/gifts/activate")
async def activate_gift(body: ActivateRequest, request: Request):
    user = await get_current_user(request)
    code = body.activation_code.strip().upper()
    gift = await db.gifts.find_one({"activation_code": code})
    if not gift:
        raise HTTPException(status_code=404, detail="We couldn't find a gift with that code.")
    if gift["status"] not in ("paid", "activated"):
        raise HTTPException(status_code=400, detail="This gift hasn't been completed yet.")
    if gift["status"] == "activated" and gift.get("activated_by") not in (None, str(user["_id"])):
        raise HTTPException(status_code=400, detail="This gift has already been activated by someone else.")
    now = datetime.now(timezone.utc)
    expires = (now + timedelta(days=30)).isoformat()
    await db.gifts.update_one({"id": gift["id"]},
        {"$set": {"status": "activated", "activated_by": str(user["_id"]), "activated_at": now.isoformat()}})
    await db.users.update_one({"_id": user["_id"]},
        {"$set": {"subscription_expires_at": expires, "activated_gift_id": gift["id"]}})
    updated = await db.users.find_one({"_id": user["_id"]})
    return {"status": "ok", "user": public_user(updated), "sender_message": gift.get("message", "")}

@api_router.get("/gifts/mine")
async def my_gifts(request: Request):
    user = await get_current_user(request)
    gifts = await db.gifts.find({"purchaser_id": str(user["_id"])}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return gifts

@api_router.get("/config/stripe")
async def stripe_config():
    return {"publishable_key": os.environ.get("STRIPE_PUBLISHABLE_KEY", ""), "price_usd": 1}

# ===========================================================================
# IMPACT & TESTIMONIES ("Stories of Freedom")
# ===========================================================================
@api_router.get("/testimonies")
async def list_testimonies():
    items = await db.testimonies.find({"is_deleted": {"$ne": True}}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items

@api_router.post("/testimonies")
async def create_testimony(request: Request, name: str = Form(...), story: str = Form(...),
                           video: Optional[UploadFile] = File(None)):
    user = await get_current_user(request)
    now = datetime.now(timezone.utc).isoformat()
    testimony_id = str(uuid.uuid4())
    video_path = None
    if video is not None:
        ext = video.filename.split(".")[-1] if "." in (video.filename or "") else "mp4"
        video_path = f"{APP_NAME}/testimonies/{testimony_id}/{uuid.uuid4()}.{ext}"
        data = await video.read()
        result = put_object(video_path, data, video.content_type or "video/mp4")
        video_path = result["path"]
    doc = {
        "id": testimony_id,
        "user_id": str(user["_id"]),
        "name": name.strip(),
        "story": story.strip(),
        "video_path": video_path,
        "video_content_type": video.content_type if video else None,
        "updates": [],
        "is_deleted": False,
        "created_at": now,
    }
    await db.testimonies.insert_one(dict(doc))
    doc.pop("_id", None)
    return doc

@api_router.post("/testimonies/{testimony_id}/updates")
async def add_testimony_update(testimony_id: str, request: Request, text: str = Form(...),
                               video: Optional[UploadFile] = File(None)):
    user = await get_current_user(request)
    testimony = await db.testimonies.find_one({"id": testimony_id})
    if not testimony:
        raise HTTPException(status_code=404, detail="Testimony not found")
    now = datetime.now(timezone.utc).isoformat()
    video_path = None
    if video is not None:
        ext = video.filename.split(".")[-1] if "." in (video.filename or "") else "mp4"
        vp = f"{APP_NAME}/testimonies/{testimony_id}/updates/{uuid.uuid4()}.{ext}"
        data = await video.read()
        result = put_object(vp, data, video.content_type or "video/mp4")
        video_path = result["path"]
    update = {"id": str(uuid.uuid4()), "text": text.strip(), "video_path": video_path,
              "video_content_type": video.content_type if video else None,
              "author_id": str(user["_id"]), "created_at": now}
    await db.testimonies.update_one({"id": testimony_id},
        {"$push": {"updates": update}, "$set": {"updated_at": now}})
    return update

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.testimonies.find_one({"$or": [{"video_path": path}, {"updates.video_path": path}]})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return FastResponse(content=data, media_type=content_type)

# ---------------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.conversations.create_index("user_id")
        await db.gifts.create_index("activation_code")
        await db.gifts.create_index("session_id")
    except Exception as e:
        logger.error(f"Index error: {e}")
    # Seed admin (with active subscription so it can be used for testing)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@wwjd.app")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Shepherd123!")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "name": "Admin", "email": admin_email, "password_hash": hash_password(admin_password),
            "role": "admin", "counsel_count": 0,
            "subscription_expires_at": (datetime.now(timezone.utc) + timedelta(days=3650)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
