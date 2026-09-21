# World Engine
## How to make time, power, and daily life felt — not footnoted

Most Bible apps fail here. They print “Assyria was a major empire” and move on.
A user still cannot smell the house, know who could beat them, or feel why a prophet’s sentence landed like a stone.

This engine is the expansion of Room 4: **The World Around the Words**.
It is also a library-wide layer: era cards reused by many books, plus a thin overlay unique to each book.

The test is simple. After three minutes a 13-year-old should be able to answer:

1. Where would I sleep?
2. What would I eat most days?
3. Who can take my grain, my son, or my life?
4. What is this year’s fear?
5. Why would someone bother to write this?

If they cannot, the world room is still a lecture.

---

## 1. Do not paint “Bible times”

There is no single biblical daily life.

A herdsman in the hill country, a brick-slave in Egypt, a court scribe in Samaria, a farmer in a Babylonian land-for-service village, a fisherman in Capernaum, and a leather-worker in Corinth do not share a lifestyle. They share a library.

So the engine has **eras**, not one museum diorama.

| Era ID | When the user should feel it | Books that borrow it |
|---|---|---|
| `primeval_memory` | Origin stories told later, not a datable kitchen | Genesis 1–11 |
| `ancestor_road` | Mobile households among city-states | Genesis 12–50 |
| `empire_egypt` | Store-cities, brick, Nile, palace gods | Exodus 1–15 |
| `wilderness_camp` | Tents, manna story-world, a people between homes | Exodus 16–40, Numbers |
| `hill_village` | Iron Age four-room house, terrace farms | Judges, Ruth, early Samuel |
| `two_kingdoms` | Palaces, prophets in the gate, Assyria on the road | Kings, Amos, Hosea, Isaiah 1–39, Micah |
| `exile_babylon` | Canals, barley plots, a temple that is gone | Ezekiel, parts of Jeremiah, Lamentations, Psalm 137 |
| `persian_return` | Rebuild, papers, a small province under a far king | Ezra, Nehemiah, Haggai, Zechariah, Malachi, Esther |
| `greek_pressure` | Gymnasium, edicts, pig on the altar | Daniel (court + visions), 1–2 Maccabees, Sirach, Wisdom, Jubilees, Enoch |
| `herod_rome` | Taxes, cobbled power, Galilee villages, Jerusalem feast crowds | Gospels, Acts start |
| `synagogue_diaspora` | Greek cities, house-churches, Caesar’s peace | Paul, general letters, Revelation’s seven cities |

A book may stand in two eras (Isaiah; Daniel; Revelation). Say so. Do not average them into mush.

---

## 2. The seven lenses of every world room

Every era card and every book overlay uses the same seven lenses, in this order. Short. Sensory. Human.

### Lens 1 — Ground
Land, water, season, house.
- Four-room house: animals and storage below, family above, bread oven in the courtyard.
- Galilee: fieldstone rooms around a shared court, dirt alleys that dust in summer and glue in winter.
- Babylon: canals, barley and date plots, beer as a thick staple.

Always include **one house sketch** and **one day’s water problem**. Water is how you feel a climate.

### Lens 2 — Table
What most people actually ate.
Default Levantine triad: **grain, oil, wine/grape**, plus legumes, figs, milk-products. Meat is a feast, not a Tuesday.
Name the labor behind the bite: two hours of grinding for a family’s day’s bread if you do it by hand.

### Lens 3 — House of people
Who lives under one roof.
`beit av` — father’s house — three generations in the ideal. Archaeology says many houses held fewer because death was common.
Women’s work is not color commentary. It is the economy: grinding, weaving, water, small animals, the household gods in some periods, the Sabbath lamps in others.
Children are labor and hope, not a childhood industry.

### Lens 4 — Clock
How the year feels.
Agricultural calendar first: plant, wait, pray for rain, harvest barley, wheat, grapes, olives.
Feasts sit on that clock. Passover is not a theme. It is lamb and unleavened bread at the hinge of barley harvest and a memory of exit.
In exile and in Rome the civic calendar (emperor, tax, festival of a god) presses against Israel’s clock. That friction *is* the story of Daniel, Maccabees, and Revelation.

### Lens 5 — Power
Not a list of kings. A chain of who can touch you.

Ask, for this book:
- Who owns the land I plow?
- Who takes a cut of my fish, grain, or catch?
- Whose soldiers walk my road?
- Whose image is on the coin in my hand?
- What happens if I will not burn a pinch of incense?

Translate titles:
- Pharaoh = the living hinge between gods and grain.
- “King of Assyria” = the machine that moves populations.
- Satrap / governor = the far king’s local teeth.
- Herod Antipas = Rome’s local client, not a cartoon villain.
- Publican / *telones* = the man at the booth who makes empire feel personal.

### Lens 6 — Honor and wound
Most biblical people do not think like modern individuals with a brand.
They think in name, land, son, shame, and the gate where disputes are heard.
A barren womb, a lost field, a crucified body, a sister sold, a prophet mocked in his hometown — these are public wounds.

### Lens 7 — The desk
Who could write, on what, and who was meant to hear.
Most people in these worlds were not literate in our sense. A “book” is often a performed scroll. Prophets may shout in a gate. Paul hires a scribe and a woman carries the letter. John is on an island and still expects seven churches to *hear* Revelation read aloud.

This lens stops users from imagining a quiet author in a study with a study Bible.

---

## 3. The human unit converter

Never leave ancient measures hanging.

| Then | Say instead |
|---|---|
| A cubit | a forearm, about 18 inches |
| A Sabbath day’s walk | about 3/4 of a mile — the edge of your village world |
| Capernaum to Jerusalem | several days on foot, uphill at the end |
| Ur to Canaan | a life, not a weekend |
| A denarius | a day-laborer’s wage |
| A talent | a crushing sum — years of wages, not a coin in a pocket |
| “Nineveh is three days’ walk” | a city so large the warning has to travel |
| “40 years” | a generation that dies waiting |
| Tribute of a third of the catch | the sea is not free |

If a number does not become a body or a week, it is still decoration.

---

## 4. Five illustration formats that work on a phone

These are the actual UI objects. Mix two or three per book. Never all five at once on Path.

### A. Dawn-to-dark
A 8–12 beat day in one household.
Not a novel. Beats like:
`4:30 light the oven` → `grind` → `men to field / boat` → `tax booth on the road` → `siesta heat` → `second work window` → `shared dish` → `roof / mat`.

Write three versions of the same day when the book needs it: a woman, a hired man, a child, a priest, an exile.

### B. The pressure map
A simple stacked diagram, top to bottom:
`Emperor / Pharaoh / Great King`  
→ `local client or governor`  
→ `city elders / high priest / village head`  
→ `tax farmer / overseer`  
→ `this household`.

Tap a layer: one sentence on what they extract and what they fear.

### C. Object tray
Five things on a table, each with one tap:
grindstone, oil lamp, clay bullae / seal, bronze coin with a face, fishing net weight, cuneiform tablet, phylactery, broken figurine.
Objects beat paragraphs. A net-weight from Galilee teaches economics faster than “commerce was important.”

### D. Two rooms
Split screen. Same hour of the day, two lives.
- Brick-pit and palace (Exodus)
- Capernaum court and Sepphoris dining room
- Judean farmer in Āl-Yāhūdu and Jehoiachin on a ration list in Babylon’s palace
- Laodicean banker and Smyrna’s poor (Revelation 2–3)

The book’s argument often lives in the gap between those rooms.

### E. This year’s fear
One card, dated in the book’s world:
- “The Assyrians took the next valley last year.”
- “The temple is gone. We still have a canal and a contract.”
- “If I skip the guild feast I lose work.”
- “If I say Caesar is not lord, someone will notice.”

Fear is the most honest environment.

---

## 5. Whose life, not only the narrator’s

The person holding the pen is rarely the person the book is trying to save.

Every world room names **four seats**:

1. **The writer / speaker** — prophet, scribe, apostle, singer, court historian.
2. **The first hearers** — the village, the remnant, the house-church.
3. **The powerful** — Pharaoh, Ahaz, Nebuchadnezzar, Caiaphas, Nero’s local cult.
4. **The ones with no line in the book** — the unnamed wife grinding, the child on the roof, the slave in Romans 16, the Egyptian in Goshen who did not leave.

Path layer may only show seats 1 and 2.
Trail and Summit add 3 and 4.
Seat 4 is how the app stays humane. Exodus is not only Moses’ day. It is also a midwife’s night and a brick-quota evening.

---

## 6. What we know vs. what we reconstruct

Label every picture.

| Badge | Meaning |
|---|---|
| `from the ground` | archaeology: house plans, grindstones, tablets, boats, coins |
| `from the text` | the book itself describes this |
| `from a neighbor text` | a letter, stele, ration tablet, Roman record |
| `careful guess` | how we stitch a day together |

Never render a glossy Hollywood Jerusalem as fact.
Never put modern forks on an Iron Age table.
Never make every Israelite house look like a palace model of Solomon.

Honesty increases trust. Users can feel the difference.

---

## 7. Sound, body, and season (the cheap cinematic tools)

You do not need a video studio.

- **Sound bed, 20 seconds, optional:** millstone, goats, a harbor, a reed stylus on clay, a crowd in a court, rain on a mud roof.
- **Heat and dark:** work windows at dawn and dusk in Mesopotamia and Egypt; lamps as expensive light; winter mud in Galilee alleys.
- **Smell words, used once:** dung cakes for fuel, fish sauce, olive crush, incense covering other smells in a temple court.
- **Feet:** how long to the well, the field, the synagogue, the next village.

One good sensory line beats a page of “socio-economic context.”

---

## 8. Powers as weather, not logos

Empires should arrive the way weather arrives.

- **Egypt** — the river makes life; the palace claims it. Gods are official technology for flood and grain.
- **Assyria** — speed, terror, deportation. You may not meet the king. You meet the policy that empties a town.
- **Babylon** — the city as world. You can farm a plot and still sing “how can we sing the LORD’s song.”
- **Persia** — paper empire. Decrees, horses, a far kindness that is still control. Esther and Ezra live in paperwork.
- **Greece** — the handsome pressure. Language, gymnasium, “be reasonable, be modern.”
- **Rome** — roads, coins, crosses. Peace that taxes. A soldier’s sandal in your alley is the gospel’s weather in Mark.

Each empire card has three fields only:
`what they sold as a gift` / `what they extracted` / `what a small people feared this year`.

---

## 9. Book overlay (the part unique to each module)

The era card is shared.
The overlay is eight lines, max:

```yaml
era_ids: [herod_rome]
where_exactly: "Capernaum, north shore, border-toll town"
this_year_fear: "Antipas and the booth that takes a cut of the catch"
who_writes: "a church that has seen crosses and still calls a crucified man Son of God"
who_hears: "villagers who know boats, debt, and synagogue"
who_can_hurt_them: "Rome far off, Herod near, temple leadership in the festival city"
object_tray: [basalt grindstone, lead net-weight, bronze coin of Tiberius, oil lamp, reed mat]
dawn_to_dark_ref: "capernaum_fisher_household"
```

That is enough for the renderer. Do not write a second commentary.

---

## 10. Age gates

**Path (child / first-time)**  
House, food, one fear, one map pin. No torture detail. Empires are “a huge kingdom that took people from their homes,” not flaying manuals.

**Trail**  
Dawn-to-dark + pressure map + object tray.

**Summit**  
Add neighbor-texts (Yāhūdu tablets, Roman tax structure, Josephus, Egyptian brick-making scenes), and the “careful guess” badges.

Hard Ground already exists for violence. Daily-life rooms should not compete with it by becoming grim tourism.

---

## 11. Worked pictures (use as gold masters)

See `world/ERA_CARDS.md` and the three sample days:
- `world/DAY_EGYPT_BRICK.md`
- `world/DAY_YAHUDU_EXILE.md`
- `world/DAY_CAPERNAUM.md`

Build those three first. They teach the pattern for every other book.
Then add `DAY_NINEVEH_ROAD.md` for Jonah and `DAY_PATMOS_ASIA.md` for Revelation.
