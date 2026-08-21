# W.W.J.D. — Product Requirements & Build Log

## Original Problem Statement
A quiet, reverent spiritual web app. Users bring real problems/fears/decisions and receive AI counsel drawn STRICTLY from the life & teachings of Jesus (four Gospels + Pastoral Epistles), reflecting the mind of Christ (Phil 2:5–8). Distributed as a $1/month GIFT (not self-purchase); all proceeds help people in addiction recovery. Flow: Person A gifts Person B → B activates → after use, B is invited to pay it forward. Includes Impact & Testimonies ("Stories of Freedom") with video testimonies + ability to add updates years later.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). All routes under `/api`.
- **Frontend**: React 19 (CRA/craco), Tailwind, shadcn/ui, framer-motion, sonner. `@` alias = `src`.
- **Auth**: JWT (httpOnly cookies), bcrypt. Admin seeded on startup.
- **AI**: Claude Sonnet 4.6 via emergentintegrations (EMERGENT_LLM_KEY) — counsel is SSE-streamed; prayer generation non-streaming.
- **Payments**: Stripe claimable sandbox (US account). Gift = subscription (lookup_key `wwjd_monthly`, $1/mo, managed payments/SMP tax mode). Donations = one-time `price_data` payment mode (no tax).
- **Storage**: Emergent Object Storage for testimony videos, served via `/api/files/{path}`.

## User Personas
- **Giver**: buys a $1 gift for someone struggling; sends link by text.
- **Recipient**: activates via link, sets own login, brings burdens to counsel.
- **Donor ("Angel")**: gives any amount to the recovery fund; receives a blessing + wall placement.
- **Freed person**: shares a video testimony and returns later to add updates.

## Core Requirements (static)
1. Exact uploaded WWJD hero image used prominently across key screens. ✅
2. Counsel grounded only in Jesus (Gospels + Pastorals), structured reply. ✅
3. $1/month gift + activation + pay-it-forward (exact verbatim message). ✅
4. Daily Scripture, Spiritual Diary, "Pray This With Me", Save One Counsel. ✅
5. Impact & Testimonies with video + updatable testimonies. ✅
6. All proceeds support addiction recovery, stated transparently. ✅
7. Quiet, reverent, mobile-first design; no gamification/feeds. ✅

## Implemented (2026-06)
- **Auth** (register/login/me/logout/refresh, JWT cookies, admin seed). Access gated by activated subscription; admin bypasses.
- **Counsel engine** — Claude Sonnet 4.6 SSE streaming, conversation persistence, strict Gospel-grounded system prompt.
- **Pray This With Me** — generates editable first-person prayer from a counsel message.
- **Save One Counsel** — single pinned counsel per user, shown on dashboard.
- **Daily Scripture** — 31-entry curated set (Gospels + Pastorals), day-of-year rotation.
- **Spiritual Diary** — full CRUD (brought / counsel / response / walked-out), per-user.
- **Gift flow** — Stripe checkout; recipient PHONE primary (email optional); success page shows text-link (`sms:` prefilled) + copyable `/activate?code=` link + code. Recipient activation page creates their own login inline then auto-activates.
- **Pay-it-forward** — exact verbatim message + gift form.
- **Donations** — presets $5/$10/$25/$50 + custom; blessing scripture on success; donor becomes an "Angel" with a golden halo badge on a public wall (`/api/angels`).
- **Impact & Testimonies** — public list; auth users share (video upload to object storage) + add dated updates later; videos served via `/api/files`.
- **Design** — heavenly clouds fixed background with warm veil; Playfair Display + Manrope; warm gold/terracotta palette; hero logo verbatim.

## Testing
- iteration_1.json: 23/23 pass. iteration_2.json: 33/33 pass (donations, phone-gift, angels, regressions). Counsel verified with real Claude output + scripture refs.

## Backlog / Remaining (P1/P2)
- P1: Real SMS auto-send via Twilio (currently giver sends the prefilled text themselves — user chose this for now).
- P1: Email delivery of gift links (Resend/SendGrid).
- P2: Testimony ownership checks on updates; video size/type validation; is_deleted respected on `/api/files`.
- P2: Subscription renewal handling beyond 30-day activation window; login brute-force lockout.
- P2: Donor "angel" amount tiers / private vs public toggle.

## Next Tasks
- Offer Twilio for automatic texts; add transactional email for gift + donation receipts.
