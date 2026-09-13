// ===== STORAGE MODULE =====
// All localStorage access routes through here.
// Keys are namespaced with 'hayeren_'.

const KEYS = {
  streak:        'hayeren_streak',
  learnedLetters:'hayeren_learnedLetters',
  learnedWords:  'hayeren_learnedWords',
  tasksDone:     'hayeren_tasksDone',
  srs:           'hayeren_srs',
  dayProgress:   'hayeren_dayProgress',
  reviewCounts:  'hayeren_reviewCounts',
};

// ---- Helpers ----

function isoToday() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function isoYesterday() {
  const d = new Date(Date.now() - 86400000);
  return d.toISOString().slice(0, 10);
}

// ---- Streak ----

function loadStreak() {
  const raw = localStorage.getItem(KEYS.streak);
  if (!raw) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, activeDates: [] };
  try { return JSON.parse(raw); } catch { return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, activeDates: [] }; }
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
    const iso = d.toISOString().slice(0, 10);
    result.push(data.activeDates.includes(iso));
  }
  return result;
}

// ---- Learned Letters ----

// Migrate from old unnamespaced key on first load
function migrateOldKeys() {
  if (!localStorage.getItem(KEYS.learnedLetters)) {
    const old = localStorage.getItem('learnedLetters');
    if (old) {
      localStorage.setItem(KEYS.learnedLetters, old);
      localStorage.removeItem('learnedLetters');
    }
  }
}

function loadLearnedLetters() {
  migrateOldKeys();
  const raw = localStorage.getItem(KEYS.learnedLetters);
  return new Set(raw ? JSON.parse(raw) : []);
}

function saveLearnedLetters(set) {
  localStorage.setItem(KEYS.learnedLetters, JSON.stringify([...set]));
  updateLearnedCountDisplay(set.size);
}

function updateLearnedCountDisplay(size) {
  const el = document.getElementById('learnedCount');
  if (el) el.innerHTML = size + ' <span style="font-size:0.8rem;color:var(--text-muted);font-family:\'DM Sans\',sans-serif;">/ 38</span>';
}

// ---- Tasks Done ----

function loadTasksDone() {
  const raw = localStorage.getItem(KEYS.tasksDone);
  return raw ? JSON.parse(raw) : {};
}

function saveTasksDone(obj) {
  localStorage.setItem(KEYS.tasksDone, JSON.stringify(obj));
}

function isTaskDoneToday(taskId) {
  const all = loadTasksDone();
  const today = isoToday();
  return Array.isArray(all[today]) && all[today].includes(taskId);
}

function toggleTaskDoneInStorage(taskId) {
  const all = loadTasksDone();
  const today = isoToday();
  if (!Array.isArray(all[today])) all[today] = [];
  const idx = all[today].indexOf(taskId);
  if (idx === -1) {
    all[today].push(taskId);
  } else {
    all[today].splice(idx, 1);
  }
  saveTasksDone(all);
  return all[today].includes(taskId); // returns new done state
}

// ---- Spaced Repetition ----

function loadSrsData() {
  const raw = localStorage.getItem(KEYS.srs);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function saveSrsData(obj) {
  localStorage.setItem(KEYS.srs, JSON.stringify(obj));
}

// ---- Day Progress ----
// Session completion is permanent per curriculum day, unlike tasksDone which
// is scoped to a calendar date. Shape: { "3": ["s1","s2"], ... }

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

// ---- Streak Display ----

function updateStreakDisplay() {
  const data = loadStreak();
  const el = document.getElementById('streakNum');
  if (el) {
    const word = data.currentStreak === 1 ? 'day' : 'days';
    el.innerHTML = `${data.currentStreak} <span>${word}</span>`;
  }
  const longest = document.getElementById('longestStreak');
  if (longest) longest.textContent = data.longestStreak;
}
