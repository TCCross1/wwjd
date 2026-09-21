# Emergent build prompt
## Feature name: Bible Rosetta Stone
## App: W.W.J.D.
## Do not rebuild the WWJD companion. It already exists.
## Build only the biblical teaching library described here.

You are building a creative, in-depth, simple-to-enter Bible learning module inside an existing app called W.W.J.D.

### Product job
Give people of every age and every level of Bible knowledge a Rosetta Stone for Scripture:
- a fun but serious summary of each book
- author, date, audience, environment, purpose — with tradition and scholarship both shown
- maps
- translation / wording notes when they change meaning
- multiple interpretations presented at full strength so the user can judge
- a clear thread to Jesus without forcing allegory onto every detail

### What this is not
Not a sermon machine.
Not a denomination.
Not a verse-of-the-day widget.
Not an AI that invents dates, maps, or Hebrew on the fly as the source of truth.

### Architecture
1. Library Home
   - 66 Protestant books as the default path
   - Sections: Torah, History, Poetry & Wisdom, Major Prophets, The Twelve, Gospels & Acts, Paul, General Letters & Revelation
   - An “Other Shelves” door for deuterocanonical / Orthodox extras (content can be phase 4)
   - Three learning paths visible: First time, Grew up in church, Want the footnotes
2. Book Module — twelve rooms, same names every time
   1. The Door
   2. The Campfire
   3. The Passport
   4. The World Around the Words
   5. The Map
   6. How to Read This Kind of Book
   7. The Walkthrough
   8. The People
   9. Two Chairs
   10. The Ink
   11. Hard Ground
   12. The Thread to Jesus
3. Depth toggle on every book: Path / Trail / Summit
   - Path hides Ink and Hard Ground behind a labeled door
   - Child mode uses Path + max 5 map pins
4. Canon Room and Ink Primer as first-class pages, not blog posts
5. Maps
   - Ancient names primary
   - Modern country names as a help toggle
   - Pin certainty: anchored / traditional / disputed / symbolic
   - Vision-space layer for Revelation (must look different from geography)

### Data
Store each book as structured content (JSON matching the project schema).
Seed GOLD modules first:
- Genesis
- Exodus
- Jonah
- Mark
- Romans
- Revelation

All other books may show the Door sentence from the catalog plus a “module coming” state. Do not auto-generate full modules from a raw LLM call in production. Hallucinated authorship dates will break trust.

A tutor chat may sit *on top of* a locked module (“explain this chair to me like I’m 14”) but must not overwrite the module.

### UI tone
Warm parchment + deep ink + one wine/cord accent.
Not neon spirituality. Not clip-art Jesus.
Big readable type. Rooms as a vertical journey, not 12 tiny tabs a child cannot use.
A progress ribbon of rooms the user has opened — never a guilt streak.

Passport must always be two columns when author or date is disputed:
- Church / synagogue tradition
- Other serious proposals
Never print one year as a fact when it is a reconstruction.

Two Chairs layout:
- Question in plain speech
- Chair A / Chair B as equal columns
- Shared ground bar underneath
- No winner badge
- “You decide” is the footer, not a shrug. It is respect.

Ink layout:
- English phrase people know
- Original word
- Witness (MT / LXX / DSS / TR / critical text)
- Two translation families
- Why it matters
- What is not in dispute

### Maps phase 1
Ship these even if pins are incomplete:
- Fertile Crescent (Genesis)
- Exodus & Wilderness
- Jesus’ land (Mark)
- Eastern Mediterranean (Romans / Revelation seven churches)
- Revelation vision-space overlay

### Copy rules for any agent writing a book
- Campfire Path: under 300 words
- Do not invent scenes the book does not contain
- Do not mock faith or scholarship
- Label Christian typological readings as Christian readings
- Short quotes only; paraphrase marked as paraphrase
- If location unknown, the pin says so

### Build order
Week 1: shell, depth toggle, Canon Room, Ink primer, six GOLD books rendered from structured content, four maps.
Week 2: learning paths, search, “continue this book,” family/child mode.
Week 3+: fill remaining books from the catalog using the same twelve rooms.

### Acceptance tests
- A 13-year-old can finish Jonah Path in one sitting and tell you what God asks at the end.
- A skeptical adult can open Genesis Two Chairs and feel both chairs were written by someone who respects them.
- A churchgoer can open Mark Ink and finally understand why 16:9–20 has a footnote.
- No screen claims “Moses wrote Genesis in 1491 BC” as if it were a measured fact.
- Revelation’s New Jerusalem is not a tourist pin.
- The WWJD companion is linked from Thread to Jesus (“bring a life question”) but is not rebuilt here.
