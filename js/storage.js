// ===== STORAGE MODULE =====
// All localStorage access routes through here.
// Keys are namespaced with 'hayeren_'.

const KEYS = {
  streak:        'hayeren_streak',
  learnedLetters:'hayeren_learnedLetters',
  srs:           'hayeren_srs',
  dayProgress:   'hayeren_dayProgress',
  reviewCounts:  'hayeren_reviewCounts',
  newPerDay:     'hayeren_newPerDay',
  newIntroduced: 'hayeren_newIntroduced',
  schemaVersion: 'hayeren_schemaVersion',
};

// The letter order as it existed before letters.js gained stable `id` slugs and
// the letters array was indexed by position for everything, including SRS keys
// and the learned-letters set. Needed only to translate old numeric records
// during the one-time migration below — do not use this list anywhere else.
const LEGACY_LETTER_ORDER = [
  'ayb','ben','gim','da','yech','za','eh','et','to','zhe','ini','liwn','khe',
  'ca','ken','ho','ja','ghad','che','men','yi','now','sha','vo','ch','peh',
  'jheh','ra','seh','vev','tiwn','reh','tsa','yiwn','piwr','keh','oh','feh',
];

// ---- Helpers ----

function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isoToday() {
  return localDateKey(new Date());
}

function isoYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
}

// ---- Schema migration ----
// v1: letter SRS keys and the learned-letters set moved from numeric array
// index ("letter:12") to a stable slug id ("letter:khe"), so reordering or
// inserting letters can never silently corrupt old progress again.
function runMigrations() {
  const version = Number(localStorage.getItem(KEYS.schemaVersion) || 0);
  if (version >= 1) return;

  // Learned letters: array of old numeric indices -> array of slugs.
  const rawLearned = localStorage.getItem(KEYS.learnedLetters);
  if (rawLearned) {
    try {
      const arr = JSON.parse(rawLearned);
      if (Array.isArray(arr) && arr.some(v => typeof v === 'number')) {
        const migrated = arr
          .map(v => (typeof v === 'number' ? LEGACY_LETTER_ORDER[v] : v))
          .filter(Boolean);
        localStorage.setItem(KEYS.learnedLetters, JSON.stringify(migrated));
      }
    } catch { /* leave as-is */ }
  }

  // SRS records: "letter:<digits>" keys -> "letter:<slug>" keys.
  const rawSrs = localStorage.getItem(KEYS.srs);
  if (rawSrs) {
    try {
      const all = JSON.parse(rawSrs);
      const migrated = {};
      Object.entries(all).forEach(([key, rec]) => {
        const m = /^letter:(\d+)$/.exec(key);
        if (m) {
          const slug = LEGACY_LETTER_ORDER[Number(m[1])];
          if (slug) migrated['letter:' + slug] = rec;
        } else {
          migrated[key] = rec;
        }
      });
      localStorage.setItem(KEYS.srs, JSON.stringify(migrated));
    } catch { /* leave as-is */ }
  }

  localStorage.setItem(KEYS.schemaVersion, '1');
}

// ---- Streak ----

function loadStreak() {
  const raw = localStorage.getItem(KEYS.streak);
  if (!raw) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, activeDates: [] };
  try { return JSON.parse(raw); } catch { return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, activeDates: [] }; }
}

// Stored streaks are updated when activity happens. Derive the visible value
// from the last study date so a missed day never leaves an old streak on screen.
function getCurrentStreak() {
  const data = loadStreak();
  return data.lastActiveDate === isoToday() || data.lastActiveDate === isoYesterday()
    ? (data.currentStreak || 0)
    : 0;
}

function saveStreak(data) {
  localStorage.setItem(KEYS.streak, JSON.stringify(data));
}

function recordActivity() {
  const data = loadStreak();
  const today = isoToday();
  if (data.activeDates.includes(today)) return data; // already counted today

  const wasYesterday = data.lastActiveDate === isoYesterday();
  const newStreak = wasYesterday ? data.currentStreak + 1 : 1;

  data.activeDates.push(today);
  data.lastActiveDate = today;
  data.currentStreak = newStreak;
  data.longestStreak = Math.max(data.longestStreak, newStreak);

  saveStreak(data);
  return data;
}

// Returns array of 7 booleans: Mon=0 … Sun=6 for the current week
function getWeekActivity() {
  const data = loadStreak();
  const result = [];
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + mondayOffset + i);
    const iso = localDateKey(d);
    result.push(data.activeDates.includes(iso));
  }
  return result;
}

// ---- Learned Letters ----
// Set of letter `id` slugs (e.g. "ayb", "khe") — see runMigrations() above.

function loadLearnedLetters() {
  runMigrations();
  const raw = localStorage.getItem(KEYS.learnedLetters);
  return new Set(raw ? JSON.parse(raw) : []);
}

function saveLearnedLetters(set) {
  localStorage.setItem(KEYS.learnedLetters, JSON.stringify([...set]));
}

// ---- Spaced Repetition ----

function loadSrsData() {
  runMigrations();
  const raw = localStorage.getItem(KEYS.srs);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function saveSrsData(obj) {
  localStorage.setItem(KEYS.srs, JSON.stringify(obj));
}

// ---- New-card intake (Review tab) ----
// How many never-studied items the learner wants introduced per day, and how
// many have already been introduced today so the cap actually holds.

function loadNewPerDay() {
  const raw = localStorage.getItem(KEYS.newPerDay);
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 10;
}

function saveNewPerDay(n) {
  if (Number.isFinite(n)) localStorage.setItem(KEYS.newPerDay, String(Math.min(50, Math.max(1, Math.round(n)))));
}

function getNewIntroducedToday() {
  const raw = localStorage.getItem(KEYS.newIntroduced);
  if (!raw) return 0;
  try {
    const rec = JSON.parse(raw);
    return rec.date === isoToday() ? rec.count : 0;
  } catch { return 0; }
}

function bumpNewIntroduced(n) {
  const count = getNewIntroducedToday() + n;
  localStorage.setItem(KEYS.newIntroduced, JSON.stringify({ date: isoToday(), count }));
}

// ---- Day Progress ----
// Session completion is permanent per curriculum day, unlike a calendar-scoped
// key. Shape: { "3": ["s1","s2"], ... }

function loadDayProgress() {
  const raw = localStorage.getItem(KEYS.dayProgress);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function saveDayProgress(obj) {
  localStorage.setItem(KEYS.dayProgress, JSON.stringify(obj));
}

function isSessionComplete(dayNum, sessionKey) {
  const all = loadDayProgress();
  return Array.isArray(all[dayNum]) && all[dayNum].includes(sessionKey);
}

function markSessionComplete(dayNum, sessionKey) {
  const all = loadDayProgress();
  if (!Array.isArray(all[dayNum])) all[dayNum] = [];
  if (!all[dayNum].includes(sessionKey)) all[dayNum].push(sessionKey);
  saveDayProgress(all);
}

function getDayCompletion(dayNum) {
  const day = getDay(dayNum);
  if (!day) return { done: 0, total: 0 };
  const all = loadDayProgress();
  const done = Array.isArray(all[dayNum]) ? all[dayNum].length : 0;
  return { done: Math.min(done, day.sessions.length), total: day.sessions.length };
}

// The furthest day with every session complete, +1 — i.e. where to resume.
function getCurrentDay() {
  for (const day of curriculum) {
    const { done, total } = getDayCompletion(day.day);
    if (done < total) return day.day;
  }
  return curriculum[curriculum.length - 1].day;
}

// ---- Review Counts (per-day study volume, for the heatmap) ----

function loadReviewCounts() {
  const raw = localStorage.getItem(KEYS.reviewCounts);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function bumpReviewCount(n) {
  const all = loadReviewCounts();
  const today = isoToday();
  all[today] = (all[today] || 0) + (n || 1);
  localStorage.setItem(KEYS.reviewCounts, JSON.stringify(all));
}
