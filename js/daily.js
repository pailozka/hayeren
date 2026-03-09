// ===== DAILY PANEL MODULE =====

function buildWeekDots() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0
  const weekActivity = getWeekActivity();

  const container = document.getElementById('weekDots');
  if (!container) return;
  container.innerHTML = '';

  days.forEach((d, i) => {
    const dot = document.createElement('div');
    const isToday = i === todayIdx;
    const isDone = weekActivity[i];
    dot.className = 'day-dot'
      + (isDone && !isToday ? ' done' : '')
      + (isToday && isDone ? ' done today' : '')
      + (isToday && !isDone ? ' today' : '');
    dot.textContent = d;
    container.appendChild(dot);
  });
}

// ===== DAY SWITCHER =====
const daySubtitles = {
  1: 'Ա Բ Գ Դ · First consonants & vowels',
  2: 'Ե Զ Է Ը · Vowel mastery + 8-letter review'
};

function switchDay(day) {
  document.getElementById('day1-content').style.display = day === 1 ? 'block' : 'none';
  document.getElementById('day2-content').style.display = day === 2 ? 'block' : 'none';
  document.getElementById('dsBtn1').classList.toggle('active', day === 1);
  document.getElementById('dsBtn2').classList.toggle('active', day === 2);
  const sub = document.getElementById('day-subtitle');
  if (sub) sub.textContent = daySubtitles[day] || '';

  if (day === 1) {
    document.getElementById('body1').classList.add('open');
    document.getElementById('chev1').classList.add('open');
  }
  if (day === 2) {
    document.getElementById('body-d2-1').classList.add('open');
    document.getElementById('chev-d2-1').classList.add('open');
  }
}

// ===== SESSION TOGGLE =====
function toggleSession(id) {
  let bodyId, chevId;
  if (id.startsWith('d2session')) {
    const n = id.replace('d2session', '');
    bodyId = 'body-d2-' + n;
    chevId = 'chev-d2-' + n;
  } else {
    const n = id.replace('session', '');
    bodyId = 'body' + n;
    chevId = 'chev' + n;
  }
  document.getElementById(bodyId).classList.toggle('open');
  document.getElementById(chevId).classList.toggle('open');
}

// ===== MARK DONE =====
function markDone(badgeId, sessionId, btn) {
  document.getElementById(badgeId).classList.add('visible');
  document.getElementById(sessionId).classList.add('completed');
  btn.textContent = '✓ Completed';
  btn.disabled = true;

  toggleTaskDoneInStorage(sessionId);
  recordActivity();
  updateStreakDisplay();
  buildWeekDots();
}

// ===== REVEAL ANSWERS =====
function revealAnswers() {
  document.querySelectorAll('#body2 .recall-ans').forEach(el => el.style.display = 'block');
}

function revealAnswers2() {
  document.querySelectorAll('#body-d2-2 .recall-ans').forEach(el => el.style.display = 'block');
}

// ===== SELF-RATING =====
const ratingLabels = ['needs work', 'getting there', 'got it!'];
function rate(letter, stars, el) {
  const container = el.closest('.rating-stars');
  const spans = container.querySelectorAll('span');
  spans.forEach((s, i) => s.classList.toggle('lit', i < stars));
  document.getElementById('r' + letter).textContent = ratingLabels[stars - 1];
}

// ===== RESTORE DONE STATES =====
function initDailyTaskStates() {
  const day1Sessions = ['session1', 'session2', 'session3', 'session4'];
  const day2Sessions = ['d2session1', 'd2session2', 'd2session3', 'd2session4'];

  day1Sessions.forEach(id => {
    if (isTaskDoneToday(id)) {
      document.getElementById(id)?.classList.add('completed');
      const n = id.replace('session', '');
      document.getElementById('badge' + n)?.classList.add('visible');
      const btn = document.getElementById(id)?.querySelector('.complete-btn');
      if (btn) { btn.textContent = '✓ Completed'; btn.disabled = true; }
    }
  });

  day2Sessions.forEach(id => {
    if (isTaskDoneToday(id)) {
      document.getElementById(id)?.classList.add('completed');
      const n = id.replace('d2session', '');
      document.getElementById('badge-d2-' + n)?.classList.add('visible');
      const btn = document.getElementById(id)?.querySelector('.complete-btn');
      if (btn) { btn.textContent = '✓ Completed'; btn.disabled = true; }
    }
  });
}
