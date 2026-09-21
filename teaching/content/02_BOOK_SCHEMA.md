# Book Module Schema

One object per book. This is what Emergent should store and render.
Keep strings human. Do not store sermons. Store teaching.

```yaml
id: genesis                    # slug
canon: protestant_ot           # protestant_ot | protestant_nt | deuterocanon | orthodox_extra
section: torah                 # torah | history | poetry_wisdom | major_prophets | minor_prophets | gospel | acts | pauline | general | apocalypse
title: Genesis
hebrew_title: Bereshit
greek_title: Genesis
genre: origin_narrative        # see genre list
door:
  one_sentence: ""
  image_idea: ""
  time_ribbon: ""              # e.g. "Beginning of the story — before Israel is a nation"
campfire:
  path: ""                     # 180-280 words
  trail: ""                    # 350-500 words
passport:
  traditional_author:
    claim: ""
    why_people_hold_this: ""
  other_proposals:
    claim: ""
    why_people_hold_this: ""
  traditional_date: ""
  academic_range: ""
  why_dates_differ: ""
  setting: ""
  first_audience: ""
  language: ""
  purpose_one_line: ""
world:
  empires: []
  daily_life: ""
  crisis: ""
  hope_or_fear: ""
map:
  region_id: "fertile_crescent"
  pins:                        # place_id must exist in map catalog
    - place_id: eden_tradition
      label: "Eden (location unknown)"
      note: ""
    - place_id: ur
      label: "Ur"
      note: "Abram’s starting world"
  movement:                    # optional path
    - from: ur
      to: haran
      who: "Abram’s household"
how_to_read:
  this_genre_does: ""
  this_genre_does_not: ""
  rules:
    - ""
  common_misuse: ""
walkthrough:                   # 4-8 movements
  - id: m1
    title: ""
    chapters: "1–11"
    happens: ""
    feeling: ""
    carry_verse:
      ref: "Genesis 1:1"
      text: ""
      word_note: ""            # optional
people:
  - name: ""
    sketch: ""
chairs:                        # 0-4 real forks
  - question: ""
    chair_a:
      name: ""
      who_sits_here: ""
      best_case: ""
      texts: []
    chair_b:
      name: ""
      who_sits_here: ""
      best_case: ""
      texts: []
    shared_ground: ""
    not_settled_by: ""
oldest_copy:
  id: ""
  date_range: ""
  language: ""
  how_much_survives: ""
  agrees_mainly_with: ""
  one_difference: ""
other_shelves:
  badges: []
  who_set_aside: ""
  why_set_aside: ""
  why_kept: ""
ink:                           # only meaning-changing items
  - phrase: ""
    original: ""
    language: "Hebrew"
    witnesses: ""
    family_a: ""
    family_b: ""
    why_it_matters: ""
    not_in_dispute: ""
hard_ground:
  - passage: ""
    why_hard: ""
    pastoral_reading: ""
    critical_reading: ""
    church_history_note: ""
jesus_thread:
  did_jesus_use_it: ""
  first_christians: ""
  rhyme_in_his_life: ""
  following_him: ""
remember:
  - ""
  - ""
  - ""
practice:
  prompt: ""
path_hidden_rooms:             # rooms to collapse on Path layer
  - ink
  - hard_ground
```

## Genre list

`origin_narrative` `covenant_law` `conquest_story` `judges_cycle` `court_history` `exile_history` `novella` `songbook` `wisdom_instruction` `wisdom_protest` `love_poetry` `prophetic_oracle` `lament` `vision_apocalypse` `gospel` `acts_history` `congregation_letter` `personal_letter` `sermon_letter` `apocalypse`

## Writing rules for agents filling this schema

1. If you cannot name a real reason for a date, do not print the date.
2. Every Chair must be a view a serious synagogue, church, or scholar actually holds.
3. Ink notes need a specific word or witness. No vague “translations differ.”
4. Campfire may simplify. It may not invent scenes the book does not contain.
5. Jesus thread may not baptize every detail. If the link is typological, say so.
6. Maps: if the location is traditional rather than known, the pin label must say so.
7. Word count discipline: Path campfire under 300 words. Passport under 160 words per column.
8. No copyrighted translation dumped at length. Use short public-domain wording (KJV) or original paraphrase clearly marked as paraphrase.
