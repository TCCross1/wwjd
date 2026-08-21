"""End-to-end backend tests for W.W.J.D. spiritual counsel API.

Tested from the public preview URL (REACT_APP_BACKEND_URL) as a real client.
"""
import io
import json
import os
import time
import uuid

import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@wwjd.app"
ADMIN_PASSWORD = "Shepherd123!"


# --------------------------------------------------------------------------- helpers / fixtures
@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    body = r.json()
    assert body["email"] == ADMIN_EMAIL
    assert body["has_access"] is True
    # For SSE we will also need a Bearer token; grab it from the cookie
    s.headers.update({"Authorization": f"Bearer {s.cookies.get('access_token')}"})
    return s


@pytest.fixture(scope="module")
def fresh_user_session():
    s = requests.Session()
    email = f"tester_{uuid.uuid4().hex[:10]}@wwjdtest.io"
    password = "SolidRock!42"
    r = s.post(f"{API}/auth/register",
               json={"name": "Fresh Tester", "email": email, "password": password}, timeout=30)
    assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
    body = r.json()
    assert body["email"] == email.lower()
    assert body["has_access"] is False  # no gift activated
    s.headers.update({"Authorization": f"Bearer {s.cookies.get('access_token')}"})
    s.email = email
    s.password = password
    return s


# ================================================================= AUTH
class TestAuth:
    def test_register_and_me(self, fresh_user_session):
        r = fresh_user_session.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == fresh_user_session.email.lower()
        assert data["has_access"] is False
        assert data["role"] == "user"
        assert "id" in data

    def test_admin_login_has_access(self, admin_session):
        r = admin_session.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["role"] == "admin"
        assert data["has_access"] is True

    def test_login_invalid_credentials(self):
        r = requests.post(f"{API}/auth/login",
                          json={"email": ADMIN_EMAIL, "password": "wrong-password!"}, timeout=30)
        assert r.status_code == 401

    def test_duplicate_register_rejected(self, fresh_user_session):
        r = requests.post(f"{API}/auth/register",
                          json={"name": "Dup", "email": fresh_user_session.email, "password": "x123456!"},
                          timeout=30)
        assert r.status_code == 400


# ================================================================= DAILY SCRIPTURE
class TestScripture:
    def test_daily_scripture(self):
        r = requests.get(f"{API}/scripture/daily", timeout=30)
        assert r.status_code == 200
        data = r.json()
        for k in ("quote", "reference", "invitation", "date"):
            assert k in data, f"missing {k} in daily scripture"
        assert len(data["quote"]) > 0
        assert len(data["reference"]) > 0


# ================================================================= COUNSEL (LLM STREAMING)
class TestCounsel:
    convo_id = None
    assistant_text = ""

    def test_counsel_gating_for_new_user(self, fresh_user_session):
        r = fresh_user_session.post(f"{API}/counsel/stream",
                                    json={"message": "test"}, timeout=30)
        assert r.status_code == 403, f"expected 403 for un-activated user, got {r.status_code}"

    def test_counsel_stream_admin(self, admin_session):
        # SSE stream: use requests stream=True to accumulate deltas
        with admin_session.post(f"{API}/counsel/stream",
                                json={"message": "I can't forgive my brother"},
                                stream=True, timeout=180) as r:
            assert r.status_code == 200
            ctype = r.headers.get("Content-Type", "")
            assert "text/event-stream" in ctype, f"unexpected content-type: {ctype}"
            saw_meta = False
            saw_delta = False
            saw_done = False
            deltas = []
            conv_id = None
            for line in r.iter_lines(decode_unicode=True):
                if not line or not line.startswith("data: "):
                    continue
                try:
                    payload = json.loads(line[6:])
                except Exception:
                    continue
                t = payload.get("type")
                if t == "meta":
                    saw_meta = True
                    conv_id = payload.get("conversation_id")
                elif t == "delta":
                    saw_delta = True
                    deltas.append(payload.get("content", ""))
                elif t == "done":
                    saw_done = True
                    break
                elif t == "error":
                    pytest.fail(f"stream error: {payload}")
        assistant_text = "".join(deltas)
        assert saw_meta, "no meta event"
        assert saw_delta, "no delta events"
        assert saw_done, "no done event"
        assert conv_id, "no conversation_id in meta"
        assert len(assistant_text) > 200, f"assistant text unusually short: {assistant_text!r}"
        low = assistant_text.lower()
        # Grounding proof: must mention Jesus / Gospel + a scripture reference
        assert any(w in low for w in ("jesus", "christ")), f"no Jesus grounding: {assistant_text[:400]}"
        import re
        ref_match = re.search(r"\b(Matthew|Mark|Luke|John|Timothy|Titus)\s+\d+", assistant_text)
        assert ref_match, f"no scripture reference found: {assistant_text[:400]}"

        # Store for follow-up tests
        TestCounsel.convo_id = conv_id
        TestCounsel.assistant_text = assistant_text

    def test_conversation_persisted(self, admin_session):
        assert TestCounsel.convo_id, "prior stream test didn't populate convo_id"
        r = admin_session.get(f"{API}/counsel/conversations", timeout=30)
        assert r.status_code == 200
        convos = r.json()
        assert any(c["id"] == TestCounsel.convo_id for c in convos)

        r2 = admin_session.get(f"{API}/counsel/conversations/{TestCounsel.convo_id}", timeout=30)
        assert r2.status_code == 200
        c = r2.json()
        assert c["id"] == TestCounsel.convo_id
        msgs = c.get("messages", [])
        # Expect user + assistant persisted (2)
        assert len(msgs) >= 2
        roles = [m["role"] for m in msgs]
        assert "user" in roles and "assistant" in roles

    def test_pray_this_with_me(self, admin_session):
        text = TestCounsel.assistant_text or (
            "Jesus said, love your enemies and pray for those who persecute you (Matthew 5:44)."
        )
        r = admin_session.post(f"{API}/counsel/pray",
                               json={"counsel_text": text}, timeout=180)
        assert r.status_code == 200, f"pray failed: {r.status_code} {r.text}"
        data = r.json()
        prayer = data.get("prayer", "")
        assert len(prayer) > 60, f"prayer too short: {prayer!r}"
        low = prayer.lower()
        # First-person prayer heuristic
        assert any(w in low for w in (" i ", "i ", "my ", "me ", "lord", "father", "god")), \
            f"doesn't read as first-person prayer: {prayer[:300]}"

    def test_pray_requires_access(self, fresh_user_session):
        r = fresh_user_session.post(f"{API}/counsel/pray",
                                    json={"counsel_text": "some counsel"}, timeout=30)
        assert r.status_code == 403


# ================================================================= SAVE ONE COUNSEL
class TestSaveCounsel:
    def test_save_get_delete_flow(self, admin_session):
        # Save
        payload = {"text": "Love your enemies (Matthew 5:44).", "reference": "Matthew 5:44", "source": "counsel"}
        r = admin_session.post(f"{API}/counsel/save", json=payload, timeout=30)
        assert r.status_code == 200
        saved = r.json()
        assert saved["text"] == payload["text"]

        # Get
        r2 = admin_session.get(f"{API}/counsel/saved", timeout=30)
        assert r2.status_code == 200
        got = r2.json()
        assert got.get("text") == payload["text"]

        # Delete
        r3 = admin_session.delete(f"{API}/counsel/saved", timeout=30)
        assert r3.status_code == 200

        # Verify deleted
        r4 = admin_session.get(f"{API}/counsel/saved", timeout=30)
        assert r4.status_code == 200
        assert r4.json() == {}


# ================================================================= DIARY
class TestDiary:
    def test_diary_crud(self, admin_session):
        body = {"title": "TEST_entry", "brought": "worry", "counsel": "trust",
                "response": "prayer", "walked_out": "let go"}
        r = admin_session.post(f"{API}/diary", json=body, timeout=30)
        assert r.status_code == 200
        created = r.json()
        assert created["title"] == "TEST_entry"
        entry_id = created["id"]

        # List
        r2 = admin_session.get(f"{API}/diary", timeout=30)
        assert r2.status_code == 200
        entries = r2.json()
        assert any(e["id"] == entry_id for e in entries)

        # Update
        upd = {**body, "title": "TEST_entry_updated"}
        r3 = admin_session.put(f"{API}/diary/{entry_id}", json=upd, timeout=30)
        assert r3.status_code == 200
        assert r3.json()["title"] == "TEST_entry_updated"

        # Delete
        r4 = admin_session.delete(f"{API}/diary/{entry_id}", timeout=30)
        assert r4.status_code == 200

        # Confirm gone
        r5 = admin_session.get(f"{API}/diary", timeout=30)
        assert not any(e["id"] == entry_id for e in r5.json())

    def test_diary_scoped_to_user(self, admin_session, fresh_user_session):
        # Admin creates
        r = admin_session.post(f"{API}/diary",
                               json={"title": "TEST_admin_only"}, timeout=30)
        assert r.status_code == 200
        eid = r.json()["id"]
        # Other user shouldn't see
        r2 = fresh_user_session.get(f"{API}/diary", timeout=30)
        assert r2.status_code == 200
        assert not any(e["id"] == eid for e in r2.json())
        # And can't update/delete
        r3 = fresh_user_session.put(f"{API}/diary/{eid}", json={"title": "hacked"}, timeout=30)
        assert r3.status_code == 404
        # Admin cleanup
        admin_session.delete(f"{API}/diary/{eid}", timeout=30)


# ================================================================= GIFTS / STRIPE
class TestGiftsStripe:
    session_id = None

    def test_stripe_config(self):
        r = requests.get(f"{API}/config/stripe", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert "publishable_key" in d
        assert d.get("price_usd") == 1
        assert d["publishable_key"].startswith("pk_"), "publishable_key should start with pk_"

    def test_gift_checkout_creates_session(self, admin_session):
        payload = {
            "recipient_name": "Friend",
            "recipient_email": f"friend_{uuid.uuid4().hex[:8]}@wwjdtest.io",
            "message": "Praying for you.",
            "origin_url": BASE_URL,
        }
        r = admin_session.post(f"{API}/gifts/checkout", json=payload, timeout=60)
        assert r.status_code == 200, f"checkout failed: {r.status_code} {r.text}"
        d = r.json()
        assert d["checkout_url"].startswith("https://"), f"unexpected checkout url: {d.get('checkout_url')}"
        assert d["session_id"].startswith("cs_"), f"unexpected session_id: {d.get('session_id')}"
        TestGiftsStripe.session_id = d["session_id"]

    def test_payment_status_pending(self):
        assert TestGiftsStripe.session_id, "checkout test must have run"
        r = requests.get(f"{API}/payments/status/{TestGiftsStripe.session_id}", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["session_id"] == TestGiftsStripe.session_id
        assert d["payment_status"] == "pending"
        assert d["activation_code"] is None  # only revealed once paid

    def test_activate_invalid_code_404(self, admin_session):
        r = admin_session.post(f"{API}/gifts/activate",
                               json={"activation_code": "WWJD-NOPE99"}, timeout=30)
        assert r.status_code == 404

    def test_activate_pending_code_400(self, admin_session):
        # A gift was just created above with status='pending'. Fetch its code from mongo
        # via the payment_status endpoint would only give it after paid, so instead go
        # through the /gifts/mine endpoint (purchaser=admin).
        r = admin_session.get(f"{API}/gifts/mine", timeout=30)
        assert r.status_code == 200
        mine = r.json()
        pending = [g for g in mine if g["status"] == "pending"]
        assert pending, "no pending gift found for admin"
        code = pending[0]["activation_code"]
        assert code.startswith("WWJD-")
        r2 = admin_session.post(f"{API}/gifts/activate",
                                json={"activation_code": code}, timeout=30)
        assert r2.status_code == 400, f"expected 400 for pending gift, got {r2.status_code} {r2.text}"


# ================================================================= TESTIMONIES + OBJECT STORAGE
def _tiny_mp4_bytes() -> bytes:
    # Minimal ftyp header — not a playable video but enough to test upload path.
    return (b"\x00\x00\x00\x20ftypisom\x00\x00\x02\x00isomiso2mp41"
            + b"\x00" * 128)


class TestTestimonies:
    testimony_id = None
    video_path = None

    def test_list_public(self):
        r = requests.get(f"{API}/testimonies", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_with_video(self, admin_session):
        files = {"video": ("clip.mp4", _tiny_mp4_bytes(), "video/mp4")}
        data = {"name": "TEST_Storyteller", "story": "Freed from bondage by grace."}
        r = admin_session.post(f"{API}/testimonies", data=data, files=files, timeout=120)
        assert r.status_code == 200, f"testimony create failed: {r.status_code} {r.text}"
        d = r.json()
        assert d["name"] == "TEST_Storyteller"
        assert d["video_path"], "video_path missing"
        TestTestimonies.testimony_id = d["id"]
        TestTestimonies.video_path = d["video_path"]

    def test_add_update(self, admin_session):
        assert TestTestimonies.testimony_id
        r = admin_session.post(f"{API}/testimonies/{TestTestimonies.testimony_id}/updates",
                               data={"text": "One month clean, still standing."}, timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["text"].startswith("One month")

    def test_serve_file(self):
        assert TestTestimonies.video_path
        r = requests.get(f"{API}/files/{TestTestimonies.video_path}", timeout=60)
        assert r.status_code == 200, f"file serve failed: {r.status_code}"
        assert len(r.content) > 0
        # Sanity: must be a binary blob, not JSON error
        assert r.headers.get("Content-Type", "").startswith(("video", "application/octet")), \
            f"unexpected content-type: {r.headers.get('Content-Type')}"

    def test_serve_file_not_found(self):
        r = requests.get(f"{API}/files/nonexistent/path/nope.mp4", timeout=30)
        assert r.status_code == 404


# ================================================================= DONATIONS (NEW)
class TestDonations:
    session_id = None

    def test_donation_checkout_creates_session(self, admin_session):
        payload = {"amount": 25, "name": "TEST_Grace", "origin_url": BASE_URL}
        r = admin_session.post(f"{API}/donations/checkout", json=payload, timeout=60)
        assert r.status_code == 200, f"donation checkout failed: {r.status_code} {r.text}"
        d = r.json()
        assert d["session_id"].startswith("cs_"), f"unexpected session_id: {d.get('session_id')}"
        assert d["checkout_url"].startswith("https://"), f"unexpected checkout_url: {d.get('checkout_url')}"
        TestDonations.session_id = d["session_id"]

    def test_donation_persisted_as_donation_type(self, admin_session):
        assert TestDonations.session_id
        # Verify via status endpoint (donation-specific)
        r = requests.get(f"{API}/donations/status/{TestDonations.session_id}", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["session_id"] == TestDonations.session_id
        assert d["payment_status"] == "pending"
        assert d["donor_name"] == "TEST_Grace"
        assert d["amount"] == 25.0
        assert d["blessing"] is None  # blessing only revealed on paid

    def test_donation_status_not_found(self):
        r = requests.get(f"{API}/donations/status/cs_test_nonexistent_bogus_1234567", timeout=30)
        assert r.status_code == 404

    def test_donation_amount_too_small(self, admin_session):
        r = admin_session.post(f"{API}/donations/checkout",
                               json={"amount": 0.5, "name": "TEST", "origin_url": BASE_URL}, timeout=30)
        assert r.status_code == 400, f"expected 400 for tiny amount, got {r.status_code} {r.text}"

    def test_donation_amount_too_large(self, admin_session):
        r = admin_session.post(f"{API}/donations/checkout",
                               json={"amount": 200000, "name": "TEST", "origin_url": BASE_URL}, timeout=30)
        assert r.status_code == 400, f"expected 400 for huge amount, got {r.status_code} {r.text}"

    def test_donation_anonymous_allowed(self):
        # No auth session — anyone should be able to donate
        r = requests.post(f"{API}/donations/checkout",
                          json={"amount": 5, "name": "TEST_Anon", "origin_url": BASE_URL}, timeout=60)
        assert r.status_code == 200, f"anon donation failed: {r.status_code} {r.text}"
        d = r.json()
        assert d["session_id"].startswith("cs_")

    def test_angels_wall_shape(self):
        r = requests.get(f"{API}/angels", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert "angels" in d and "total" in d
        assert isinstance(d["angels"], list)
        assert isinstance(d["total"], int)
        # Each angel record (if any) should have name+created_at but no mongo _id
        for a in d["angels"]:
            assert "name" in a
            assert "_id" not in a


# ================================================================= GIFT-WITH-PHONE (NEW/UPDATED)
class TestGiftPhone:
    session_id = None

    def test_gift_checkout_with_phone_no_email(self, admin_session):
        # email now optional; phone is the primary contact
        payload = {
            "recipient_name": "TEST_John",
            "recipient_phone": "5551234567",
            "recipient_email": "",
            "message": "hi brother",
            "origin_url": BASE_URL,
        }
        r = admin_session.post(f"{API}/gifts/checkout", json=payload, timeout=60)
        assert r.status_code == 200, f"gift checkout w/ phone failed: {r.status_code} {r.text}"
        d = r.json()
        assert d["checkout_url"].startswith("https://")
        assert d["session_id"].startswith("cs_")
        TestGiftPhone.session_id = d["session_id"]

    def test_gift_stores_phone_and_hidden_while_pending(self, admin_session):
        assert TestGiftPhone.session_id
        # payment/status should hide phone + activation_code while pending
        r = requests.get(f"{API}/payments/status/{TestGiftPhone.session_id}", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["payment_status"] == "pending"
        assert d["activation_code"] is None
        assert d["recipient_phone"] is None  # only revealed once paid
        assert d["recipient_name"] == "TEST_John"

        # And the record itself in /gifts/mine should have recipient_phone stored
        r2 = admin_session.get(f"{API}/gifts/mine", timeout=30)
        assert r2.status_code == 200
        mine = r2.json()
        match = next((g for g in mine if g["session_id"] == TestGiftPhone.session_id), None)
        assert match is not None, "gift with phone not found in /gifts/mine"
        assert match.get("recipient_phone") == "5551234567"
        assert match.get("recipient_name") == "TEST_John"

    def test_gift_checkout_missing_name_422(self, admin_session):
        # recipient_name is required by the pydantic model
        payload = {
            "recipient_phone": "5551234567",
            "recipient_email": "",
            "message": "",
            "origin_url": BASE_URL,
        }
        r = admin_session.post(f"{API}/gifts/checkout", json=payload, timeout=30)
        assert r.status_code == 422, f"expected 422 for missing name, got {r.status_code} {r.text}"
