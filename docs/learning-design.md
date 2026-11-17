# Hayeren learning direction

Reference: Dora Sakayan, *Eastern Armenian for the English-speaking World: A Contrastive Approach*, Yerevan State University Press, 2007. Consulted the supplied PDF in Desktop/books, especially the preface (printed pp. xv–xvi), unit contents, and Unit 1. The PDF uses legacy Armenian font encoding, so extracted Armenian is not safe to import as Unicode.

The book teaches communicative situations, then connects vocabulary, grammar, pronunciation, writing and English–Armenian contrasts. The app should introduce useful speech while learners acquire the script. Its alphabetical Program is an independent sequence, not a reproduction of Sakayan's writing sequence.

## Implemented

- A short daily entry point: three letters and three vocabulary items, followed by recognition and reverse recall. Letter audio uses the existing museum recordings (letter names, not isolated phonemes).
- Missed questions return at the end. Completion requires answering all queued questions correctly. SRS receives one rating per item after completion; an item missed during the lesson receives a conservative rating even after correction.
- Saving and resuming survives reloads. Short-lesson completion is separate from the longer Program's session checkboxes.
- Document scrolling with per-panel position restoration, measured sticky-header clearance, keyboard-accessible Program accordions, and responsive practice cards.

## Next learning experiments

1. Situation-led units: introduce yourself, identify a person or object, order food, ask directions. Write original mini-dialogues and map each to a specific Sakayan section. Do not label generated exercises as textbook exercises.
2. Sentence construction: assemble a reply from word tiles, then type it without hints. Teach one useful English–Armenian contrast in context before testing it.
3. Listening: obtain checked native word and dialogue recordings. Keep audio provenance visible; letter-name recordings cannot test spoken-word comprehension.
4. Gradually remove romanization, with an explicit learner-controlled hint. Offer Armenian keyboard support for production exercises.
5. Track first-attempt recall and delayed retention rather than rewarding app launches. Separate evidence of mastery from self-marked study completion.
6. Validate the existing vocabulary, IPA, grammar and translations with an Eastern Armenian speaker before claiming full course accuracy. This change does not audit the entire existing dataset.

## Local verification

Serve the repository with `python3 -m http.server 8000 --bind 127.0.0.1`. With Playwright installed, run `node tests/browser.cjs`; alternatively set `PLAYWRIGHT_MODULE` to the installed package path. The browser check uses an isolated profile and covers retry scheduling, lesson reload/resume, completion, SRS, keyboard accordions, history, scroll restoration, and all panels at desktop and narrow mobile widths.
