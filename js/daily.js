// ===== DAILY PANEL MODULE =====

function buildWeekDots() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;
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

function toggleSession(id) {
  const card = document.getElementById(id);
  if (card) card.classList.toggle('expanded');
}

function toggleTaskDone(event, id) {
  event.stopPropagation();
  const card = document.getElementById(id);
  const btn = event.target;
  const nowDone = toggleTaskDoneInStorage(id); // call the storage function

  card.classList.toggle('done', nowDone);
  btn.classList.toggle('completed', nowDone);

  if (nowDone) {
    recordActivity();
    updateStreakDisplay();
    buildWeekDots();
  }
}

function initDailyTaskStates() {
  ['task1', 'task2', 'task3', 'task4'].forEach(id => {
    const card = document.getElementById(id);
    const btn = card?.querySelector('.session-done-btn');
    if (card && isTaskDoneToday(id)) {
      card.classList.add('done');
      if (btn) btn.classList.add('completed');
    }
  });
}
