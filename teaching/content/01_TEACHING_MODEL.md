# W.W.J.D. Bible Teaching Model
## The Rosetta Stone Layer

This document is the build spec for the biblical learning feature only.
The WWJD companion already exists. Do not rebuild it here.
This layer teaches the library so a user of any age or background can open a book and actually know what they are holding.

---

## Promise

The Bible feels like a locked museum to many people.
This feature is the label next to every artifact, the map of the building, and the honest tour guide who will say “scholars disagree here” instead of hiding the fork.

A user should leave every book module able to answer, in their own words:

1. What kind of writing is this?
2. Who was it for, in what world, and why?
3. What is the simple story?
4. What is the deeper purpose?
5. Where do honest readers split, and why?
6. Does a translation choice change the picture?
7. How does this book help me see Jesus more clearly?

They should never be forced into one camp.
They should never be talked down to.
They should never be drowned in seminary words without a plain-English translation sitting next to them.

---

## Voice

- Warm, clear, unhurried.
- Fun without being cute. Reverent without being stiff.
- Fifth-grade sentences available. Graduate-level depth available. Same module.
- Never mock faith. Never mock scholarship. Present both cases at full strength.
- Prefer “here is what the text does” over “here is what you must conclude.”
- When Jesus is in view, be specific. Do not flatten every book into a slogan.

Banned tones: debate-club winner, youth-group hype, academic sneer, fear-based gatekeeping.

---

## Three depths, one screen

Every module ships three layers. The user can switch at any time. Content is the same house with three door sizes.

| Layer | Name in the UI | Who it serves | Length |
|---|---|---|---|
| Path | “Tell it simply” | kids, first-time readers, tired adults | 2–4 minutes |
| Trail | “Walk the book” | most users | 8–15 minutes |
| Summit | “Open the case file” | pastors, skeptics, students | as long as the debate needs |

A parent and a teenager can sit on the same book and toggle depth without leaving the page.

---

## The twelve rooms of every book

Every book module uses the same rooms, in this order. Empty rooms are allowed (a tiny letter will not need a huge map). Rooms never change names.

### 1. The Door
- One sentence that is true and memorable.
- One image-idea (not a stock Jesus painting — a scene from that book’s world).
- Genre badge: Law, Story, Song, Wisdom, Vision, Letter, Gospel, etc.
- Time ribbon: where this book sits in the big story.

### 2. The Campfire
The whole book as a story a 12-year-old would lean in for.
No fake voices. No slang that will rot in two years.
If the book is not narrative (Proverbs, Romans), the campfire is “what life felt like for the first readers, and what this writing came to do for them.”

### 3. The Passport
A single card. Two columns where history is disputed.

| Field | Always present |
|---|---|
| Traditional author | What synagogue and church have long said, and why |
| Other serious proposals | What many modern scholars argue, and why |
| Traditional date | Conservative / church-history range |
| Academic range | Critical-scholarship range |
| Setting | City, wilderness, palace, exile, prison, etc. |
| First audience | Who was supposed to hear this |
| Language | Hebrew / Aramaic / Greek |
| Purpose in one line | Why it was written |

Rule: never print a single date as if it were a fact when it is a reconstruction.
Print **range + reason**.

### 4. The World Around the Words
Environment. This is the room that makes the book stop floating in space.
Cover, as relevant:
- empire on the map (Egypt, Assyria, Babylon, Persia, Greece, Rome)
- daily life (farming, taxes, honor/shame, temple, synagogue, household)
- crisis that likely pressed the writing into existence
- what the first hearers were afraid of or hoping for

### 5. The Map
See MAP_SYSTEM.md.
Every book gets at least:
- a locator (“you are here in the ancient Near East / Mediterranean”)
- pins for places the book actually names
- a before/after if the book moves people (Exodus, Acts)
- a “then and now” toggle using modern country names only as a help, never as the main label

### 6. How to Read This Kind of Book
Genre literacy. This is how we stop people from reading poetry like a newspaper and apocalypse like a codebook.
- What this genre is trying to do
- What it is not trying to do
- 3 reading rules for this book
- Common ways people misuse this book

### 7. The Walkthrough
The book in 4–8 movements. Not a commentary on every verse.
Each movement:
- title a human would remember
- the stretch of chapters
- what happens / what is argued
- the feeling in the room
- one verse that carries the movement (user-facing translation + a note if a key word is doing heavy work)

### 8. The People
Short living sketches, not encyclopedia stubs.
If a name only appears once, skip it unless the story hangs on them.

### 9. Two Chairs
The interpretation room.
For every real fork that changes how a faithful reader lives or believes:
- Name the question in plain speech
- Chair A: best case, strongest text, who sits here
- Chair B: best case, strongest text, who sits here
- (Chair C only if it is a live third option, not a straw man)
- What both chairs still share
- What is *not* settled by shouting louder
- “You decide” closer — no winner ribbon

Examples of forks worth a chair: six-day creation vs. framework/old-earth readings; Isaiah one prophet vs. more than one voice; Jonah history vs. parable; premillennial / amillennial / etc. in Revelation; “works of the law” in Romans.

Do not invent a controversy to look smart.
Do not hide a real one to look safe.

### 10. The Ink
Translation and text history, only where it changes meaning.
For each note:
- the English phrase people know
- the underlying Hebrew / Aramaic / Greek word or phrase
- what the main English families do with it (e.g. KJV/NKJV stream, ESV/NASB stream, NIV/NLT stream, NRSV/CEB stream)
- which ancient witness is in play (Masoretic Text, Septuagint, Dead Sea Scrolls, Textus Receptus, modern critical Greek text)
- why a reader might care
- both sides, then a one-line “what is not in dispute”

A beginner can skip this room. A curious reader should feel like someone finally turned the lights on.

### 11. Hard Ground
The passages people trip on: violence, silence of God, gender, judgment, seeming contradictions, scientific questions.
Rules:
- Do not sand them down.
- Do not use them as a wrecking ball.
- Give the strongest pastoral reading and the strongest critical reading.
- Say when the Church has always found this hard.

### 12. The Thread to Jesus
Not a forced allegory on every goat and lampstand.
Ask only:
- How did Jesus use this book, if He did?
- How did the first Christians hear it in light of Him?
- What in Jesus’ life rhymes with this book’s burden?
- What would it mean to read this book as a person trying to follow Him?

Close with three remember-items and one practice (a reread, a map look, a conversation, a prayer). Never a guilt hook.

---

## Special first modules (not books)

Build these before or beside Genesis. They make the rest of the library make sense.

1. **What kind of library is this?** — 66 Protestant books as the default path, plus a clear, respectful Canon Room for Catholic, Orthodox, and Jewish collections.
2. **How a book travels** — oral memory, scroll, copyist, translation, the Bible in your hand.
3. **How to read without getting lost** — genre, context, “a verse is a sentence in a paragraph in a book in a library.”
4. **Maps of the whole story** — one master timeline, one master land map.
5. **Names of God and why they matter** — Elohim, YHWH, Adonai, Father, Son, Spirit, Christ, Lord — without turning it into a secret code.

---

## Age and experience design

| User | What the UI does |
|---|---|
| Child / young teen | Path layer default. Campfire + map + 3 remember-items. Hard Ground hidden behind a parent gate or a “this room is heavier” door. |
| Adult beginner | Trail default. Passport in plain speech. Two Chairs shown as “people who love this book still argue here.” |
| Experienced reader | Summit available from the first screen. Ink and Two Chairs expanded. |
| Skeptic | Same content. No altar-call copy. Extra care to steel-man critical views. |
| Devout reader | Same content. No smirk at tradition. Extra care to steel-man the church’s long reading. |

---

## What every module must never do

- Declare a date or author as proven when it is tradition or reconstruction.
- Treat one English translation as “the real Bible.”
- Use “liberals say / conservatives say” as the only frame. Use *reasons*.
- Turn Two Chairs into a dunk contest.
- Claim Jesus “would” land on a modern political platform.
- Skip Israel’s story and jump only to “this is about you.”
- Shame the user for not already knowing.

---

## Content source of truth for Emergent

Each book is a JSON/Markdown object following `02_BOOK_SCHEMA.md`.
Writers (human or agent) fill the schema.
The app renders the twelve rooms from that object.
Do not let the model invent book modules on the fly as the primary experience — that is how dates, maps, and Hebrew get sloppy.
The model may *tutor* from the locked module, and may say “this is debated” when a user asks beyond the card.

---

## Build order for Emergent

Phase 1 — Shell + five first books that teach the pattern  
Phase 2 — All Gospels + Torah + Acts + Romans + Revelation  
Phase 3 — Remaining Wisdom, History, Prophets, Letters  
Phase 4 — Deuterocanon / Apocrypha as an optional shelf with a clear label  
Phase 5 — Master maps, timeline, and “read the Bible in a year by rooms” paths

Phase 1 books (write these as gold masters):
1. Genesis
2. Exodus
3. Jonah
4. Mark
5. Romans
6. Revelation

Jonah is small and interpretation-heavy. Revelation is map-and-fork heavy. Genesis is origin-and-Ink heavy. Mark is Gospel-literacy heavy. Romans is letter-literacy heavy. Together they train the renderer and the writer.
