# Scripture road — branch `scripture-road`

This branch **adds** the biblical teaching feature. It does not replace Counsel, gifts, diary, or donations.

## What was added

- `teaching/content/` — the full teaching library written with Grok (principles, Path books, trust card, fact-and-faith).
- `frontend/src/data/scriptureRoad.js` — every book on the road + the “beside” shelf, with the association pair (ground + page).
- `frontend/src/pages/teaching/` — The Word home, book visit, beside shelf.
- Two hooks into existing files only:
  - routes `/word`, `/word/beside`, `/word/:id` in `App.js`
  - nav label **The Word** in `Header.js`

## Rules this code obeys

- Scripture first. Beginning to end.
- No denomination chooser.
- No fight.
- Jesus last in a book visit.
- Counsel (`/counsel`) stays the WWJD chat. This road is the teacher.

## Open it

Run the app as you already do. Visit `/word`.
