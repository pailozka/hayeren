// ===== SPACED REPETITION (SM-2) =====
// One scheduling record per item, keyed "<type>:<id>" (e.g. "letter:12",
// "word:w044", "phrase:ph031"), so letters, words and phrases share one queue.
//
// SM-2, as in SuperMemo/Anki:
//   first successful review  -> interval 1 day
//   second                   -> interval 6 days
//   subsequent               -> round(interval * easeFactor)
// easeFactor starts at 2.5 and is adjusted by recall quality, floored at 1.3.
// A lapse resets the interval to 1 day but KEEPS the ease factor, so the card
// remembers past struggle even after the reset.

const SRS_DEFAULT_EASE = 2.5;
const SRS_MIN_EASE = 1.3;

// Rating buttons -> SM-2 quality score. Below 3 counts as a lapse.
const SRS_QUALITY = { hard: 2, good: 4, easy: 5 };

function srsKey(type, id) {
  return type + ':' + id;
}

function newSrsRecord() {
  return {
    interval: 0,
    easeFactor: SRS_DEFAULT_EASE,
    repetitions: 0,
    lapses: 0,
    due: isoToday(),
    lastReviewed: null,
  };
}

function getSrsRecord(type, id) {
  const all = loadSrsData();
  return all[srsKey(type, id)] || newSrsRecord();
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Applies one review. `rating` is 'hard' | 'good' | 'easy'.
function reviewItem(type, id, rating) {
  const all = loadSrsData();
  const key = srsKey(type, id);
  const rec = all[key] || newSrsRecord();
  const q = SRS_QUALITY[rating] ?? 4;

  if (q < 3) {
    // Lapse: back to a 1-day interval, repetition count restarts,
    // but the ease factor carries the history forward.
    rec.repetitions = 0;
    rec.interval = 1;
    rec.lapses += 1;
  } else {
    rec.repetitions += 1;
    if (rec.repetitions === 1)      rec.interval = 1;
    else if (rec.repetitions === 2) rec.interval = 6;
    else                            rec.interval = Math.round(rec.interval * rec.easeFactor);
  }

  // SM-2 ease adjustment, applied on every review including lapses.
  rec.easeFactor = Math.max(
    SRS_MIN_EASE,
    rec.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  rec.lastReviewed = isoToday();
  rec.due = addDays(isoToday(), rec.interval);

  all[key] = rec;
  saveSrsData(all);
  return rec;
}

function isDue(type, id) {
  const all = loadSrsData();
  const rec = all[srsKey(type, id)];
  if (!rec) return false; // never studied — not "due", it's new
  return rec.due <= isoToday();
}

// Everything scheduled on or before today, newest-struggle first.
function getDueItems() {
  const all = loadSrsData();
  const today = isoToday();
  const due = [];

  Object.entries(all).forEach(([key, rec]) => {
    if (rec.due > today) return;
    const sep = key.indexOf(':');
    const type = key.slice(0, sep);
    const id = key.slice(sep + 1);
    const item = resolveSrsItem(type, id);
    if (item) due.push({ type, id, record: rec, item });
  });

  // Lapsed cards first, then longest overdue.
  due.sort((a, b) => (b.record.lapses - a.record.lapses) || (a.record.due < b.record.due ? -1 : 1));
  return due;
}

function resolveSrsItem(type, id) {
  if (type === 'letter') return letters[Number(id)] || null;
  if (type === 'word')   return getWord(id);
  if (type === 'phrase') return phrases.find(p => p.id === id) || null;
  return null;
}

// Items the learner has unlocked but never reviewed — the "new" pool.
function getNewItems(limit) {
  const all = loadSrsData();
  const out = [];

  learnedLetters.forEach(idx => {
    if (!all[srsKey('letter', idx)]) out.push({ type: 'letter', id: String(idx), item: letters[idx] });
  });
  vocabulary.forEach(w => {
    if (!all[srsKey('word', w.id)]) out.push({ type: 'word', id: w.id, item: w });
  });

  return typeof limit === 'number' ? out.slice(0, limit) : out;
}

function getSrsStats() {
  const all = loadSrsData();
  const today = isoToday();
  const records = Object.values(all);
  return {
    tracked: records.length,
    dueToday: records.filter(r => r.due <= today).length,
    mature: records.filter(r => r.interval >= 21).length,
    learning: records.filter(r => r.interval > 0 && r.interval < 21).length,
    lapses: records.reduce((a, r) => a + r.lapses, 0),
  };
}
