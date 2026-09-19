// ===== CALENDAR =====
// A year heatmap plus a month grid. Intensity comes from how many reviews
// happened that day, not merely whether the day was touched — so a missed
// day costs one cell rather than erasing the record.

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-11

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function isoOf(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// 0 = untouched, 1-4 = increasing study volume.
function intensityFor(count, active) {
  if (count >= 40) return 4;
  if (count >= 20) return 3;
  if (count >= 8)  return 2;
  if (count > 0)   return 1;
  return active ? 1 : 0;
}

function initCalendar() {
  renderCalendar();
}

function renderCalendar() {
  renderCalendarSummary();
  renderMonthGrid();
  renderYearHeatmap();
}

function renderCalendarSummary() {
  const host = document.getElementById('calSummary');
  if (!host) return;
  const streak = loadStreak();
  const counts = loadReviewCounts();
  const totalReviews = Object.values(counts).reduce((a, b) => a + b, 0);
  const stats = getSrsStats();

  host.innerHTML = `
    <div class="cal-stat"><span class="cal-stat-num">${streak.currentStreak}</span><span class="cal-stat-label">current streak</span></div>
    <div class="cal-stat"><span class="cal-stat-num">${streak.longestStreak}</span><span class="cal-stat-label">longest streak</span></div>
    <div class="cal-stat"><span class="cal-stat-num">${streak.activeDates.length}</span><span class="cal-stat-label">days studied</span></div>
    <div class="cal-stat"><span class="cal-stat-num">${totalReviews}</span><span class="cal-stat-label">total reviews</span></div>
    <div class="cal-stat"><span class="cal-stat-num">${stats.mature}</span><span class="cal-stat-label">items known well</span></div>
  `;
}

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderMonthGrid();
}

function renderMonthGrid() {
  const host = document.getElementById('calMonthGrid');
  if (!host) return;

  const label = document.getElementById('calMonthLabel');
  if (label) label.textContent = `${MONTH_NAMES[calMonth]} ${calYear}`;

  const streak = loadStreak();
  const activeSet = new Set(streak.activeDates);
  const counts = loadReviewCounts();
  const todayIso = isoToday();

  const first = new Date(calYear, calMonth, 1);
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  // Monday-first offset
  const lead = (first.getDay() + 6) % 7;

  let html = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    .map(d => `<div class="cal-dow">${d}</div>`).join('');

  for (let i = 0; i < lead; i++) html += `<div class="cal-cell empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = isoOf(calYear, calMonth, d);
    const count = counts[iso] || 0;
    const level = intensityFor(count, activeSet.has(iso));
    const isToday = iso === todayIso;
    const title = count
      ? `${iso} — ${count} review${count === 1 ? '' : 's'}`
      : (activeSet.has(iso) ? `${iso} — studied` : `${iso} — no study`);
    html += `<div class="cal-cell level-${level}${isToday ? ' today' : ''}" title="${title}">${d}</div>`;
  }

  host.innerHTML = html;
}

// Shared by the Calendar panel's year map and the Home dashboard's heatmap —
// both show the same 52-week grid, just mounted into different elements.
function render52WeekHeatmap(hostId) {
  const host = document.getElementById(hostId);
  if (!host) return;

  const activeSet = new Set(loadStreak().activeDates);
  const counts = loadReviewCounts();
  const todayIso = isoToday();

  // 52 weeks back from the end of the current week, Monday-first columns.
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + (7 - ((today.getDay() + 6) % 7) - 1));
  const cursor = new Date(end);
  cursor.setDate(cursor.getDate() - (52 * 7 - 1));

  let html = '';
  for (let w = 0; w < 52; w++) {
    html += '<div class="hm-week">';
    for (let d = 0; d < 7; d++) {
      const iso = cursor.toISOString().slice(0, 10);
      const count = counts[iso] || 0;
      const level = intensityFor(count, activeSet.has(iso));
      const future = iso > todayIso;
      const title = count
        ? `${iso} — ${count} review${count === 1 ? '' : 's'}`
        : (activeSet.has(iso) ? `${iso} — studied` : iso);
      html += `<div class="hm-cell level-${level}${future ? ' future' : ''}${iso === todayIso ? ' today' : ''}" title="${title}"></div>`;
      cursor.setDate(cursor.getDate() + 1);
    }
    html += '</div>';
  }

  host.innerHTML = html;
}

function renderYearHeatmap() {
  render52WeekHeatmap('calYearMap');
}
