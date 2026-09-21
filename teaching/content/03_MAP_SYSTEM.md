# Map System

Maps are not decoration. They are how a modern reader stops hearing “Canaan” as a foggy Sunday-school word.

## Design rules

- Ancient names are primary. Modern country names are a secondary toggle (“roughly in today’s Iraq / Israel / Turkey / Egypt”).
- If a location is unknown or symbolic, the pin must say **traditional**, **disputed**, or **vision-space**.
- Do not draw modern borders as if they were biblical borders.
- One visual language across the app: land in warm parchment, water in slate, movement lines in deep wine, Jesus-era pins in a second color so Gospels do not look like Joshua.
- Respect that some communities treat certain sites as holy. Label tradition as tradition.

## Master maps (always available from the library home)

1. **The Fertile Crescent** — Eden traditions, patriarchs, Egypt, Mesopotamia.
2. **Exodus and Wilderness** — Goshen, Reed Sea crossing traditions, Sinai traditions, Kadesh, Transjordan.
3. **The Land** — tribal allotments as the book of Joshua *describes* them, with a note that archaeology and the text are read differently.
4. **The Two Kingdoms** — Israel (north) and Judah (south), Samaria, Jerusalem, key prophetic cities.
5. **Empires that swallowed them** — Assyria, Babylon, Persia, then Greece and Rome as later overlays.
6. **Exile and Return** — Babylon, Susa, Jerusalem rebuilt.
7. **The land in Jesus’ days** — Galilee, Samaria, Judea, Perea, Decapolis, Jerusalem, Nazareth, Capernaum, Jordan, Jericho.
8. **Jerusalem close-up** — temple mount area as Second Temple readers would picture it, not a modern tourist map pretending to be exact.
9. **Eastern Mediterranean** — Paul’s journeys, seven churches of Asia, Rome, Corinth, Ephesus, Antioch.

## Pin object

```yaml
place_id: capernaum
display_name: Capernaum
aka: ["Kfar Nahum"]
modern_help: "North shore of the Sea of Galilee, in today’s Israel"
certainty: anchored          # anchored | traditional | disputed | symbolic
era_tags: [jesus, nt]
short: "Fishing town that became Jesus’ base in the Gospels."
```

Certainty language in the UI:
- **anchored** — widely identified
- **traditional** — long Christian/Jewish memory, exact spot not proven
- **disputed** — two or more serious proposals
- **symbolic** — the book is doing theology more than tourism (Eden, New Jerusalem)

## Book-to-map wiring

A book module only lights pins it actually uses.
Genesis lights Ur, Haran, Canaan, Egypt, Hebron, Beersheba, and an Eden pin marked traditional/unknown.
Mark lights Nazareth, Jordan River, wilderness of Judea, Capernaum, Sea of Galilee, Tyre/Sidon, Caesarea Philippi, Jericho, Jerusalem.
Revelation lights Patmos, the seven cities of Asia, and a “vision-space” layer so users do not hunt for a literal New Jerusalem zip code.

## Teaching moves the map must support

- Tap a pin, hear one spoken sentence and one “why this place matters in this book.”
- Draw a path (Abram’s road, Exodus, Jesus’ last week, Paul’s third journey).
- Split screen: map left, walkthrough movement right.
- “Then / later” slider on Jerusalem and on the two kingdoms.
- A child’s mode that only shows 5 pins and a story line.

## What we will not do

- Claim we have found Noah’s ark or the exact Eden coordinates.
- Use politically loaded modern maps as the main layer.
- Make Revelation’s Babylon or New Jerusalem look like a travel itinerary without saying “vision.”
