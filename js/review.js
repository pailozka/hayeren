// ===== REVIEW QUEUE =====
// One mixed queue of everything the SM-2 scheduler says is due today —
// letters, words and phrases together. This is the daily anchor: clearing
// it is the thing that actually keeps material in memory.
//
// When nothing is due, offers to pull in never-studied items (getNewItems in
// srs.js) up to the learner's daily cap, so Review isn't only a mop-up queue.

let reviewQueue = [];
let reviewIndex = 0;
let reviewRevealed = false;
let reviewIsNewBatch = false; // true while working through a "Learn N new" batch

function initReview() {
  reviewQueue = getDueItems();
  reviewIndex = 0;
  reviewRevealed = false;
  reviewIsNewBatch = false;
  renderReviewStats();
  renderReviewCard();
}

function renderReviewStats() {
  const stats = getSrsStats();
  const host = document.getElementById('reviewStats');
  if (!host) return;
  host.innerHTML = `
    <div class="rv-stat"><span class="rv-stat-num">${stats.dueToday}</span><span class="rv-stat-label">due today</span></div>
    <div class="rv-stat"><span class="rv-stat-num">${stats.learning}</span><span class="rv-stat-label">learning</span></div>
    <div class="rv-stat"><span class="rv-stat-num">${stats.mature}</span><span class="rv-stat-label">known well</span></div>
    <div class="rv-stat"><span class="rv-stat-num">${stats.tracked}</span><span class="rv-stat-label">tracked</span></div>
  `;
}

function renderReviewCard() {
  const host = document.getElementById('reviewCard');
  const actions = document.getElementById('reviewActions');
  const progress = document.getElementById('reviewProgress');
  const counter = document.getElementById('reviewCounter');
  const inProgress = reviewIndex < reviewQueue.length;
  progress.parentElement.hidden = !inProgress;
  if (counter) counter.textContent = inProgress ? `${reviewIndex + 1} of ${reviewQueue.length}` : '';
  if (!host) return;

  if (!reviewQueue.length) {
    renderReviewIntake(host, actions, progress);
    return;
  }

  if (reviewIndex >= reviewQueue.length) {
    if (reviewIsNewBatch) {
      renderReviewIntake(host, actions, progress);
      return;
    }
    host.innerHTML = `
      <div class="rv-empty">
        <div class="rv-empty-mark">✓</div>
        <h3>Queue cleared</h3>
        <p>You reviewed ${reviewQueue.length} item${reviewQueue.length === 1 ? '' : 's'}. Each one is now scheduled further out — come back tomorrow.</p>
      </div>
      ${newIntakeHtml(true)}`;
    if (actions) actions.style.display = 'none';
    if (progress) progress.style.width = '100%';
    renderReviewStats();
    return;
  }

  const entry = reviewQueue[reviewIndex];
  const { type, item, record } = entry;
  reviewRevealed = false;

  if (progress) progress.style.width = (reviewIndex / reviewQueue.length * 100) + '%';

  const front = item.arm;
  let sub, back;
  if (type === 'letter') {
    sub = `${item.lower} · ${item.name}`;
    back = `"${item.sound}" ${item.ipa}`;
  } else if (type === 'phrase') {
    sub = item.romanized;
    back = item.eng + (item.literal ? `<div class="rv-literal">literally "${item.literal}"</div>` : '');
  } else {
    sub = item.romanized;
    back = item.eng;
  }
  const typeLabel = type === 'letter' ? 'Letter' : type === 'word' ? 'Word' : 'Phrase';

  host.innerHTML = `
    <div class="rv-type">${typeLabel}${record.lapses ? ` · struggled ${record.lapses}×` : ''}${reviewIsNewBatch ? ' · new' : ''}</div>
    <div class="rv-front" lang="hy">${front}</div>
    <div class="rv-sub">${sub}</div>
    <div class="rv-back" id="rvBack">${back}</div>
    <button class="mark-btn" id="rvRevealBtn" onclick="revealReview()">Reveal</button>
  `;
  if (actions) actions.style.display = 'none';
}

// The "learn new" offer, as a standalone block. `compact` renders a shorter
// form (no title/copy) for appending below an already-cleared due queue.
function newIntakeHtml(compact) {
  const cap = loadNewPerDay();
  const remaining = Math.max(0, cap - getNewIntroducedToday());
  const available = getNewItems().length;
  const offer = Math.min(remaining, available);

  if (compact) {
    if (offer <= 0) return '';
    return `<div class="rv-intake-append">
      <p>${available} more unstudied item${available === 1 ? '' : 's'} available.</p>
      <button class="mark-btn" onclick="startNewBatch()">Learn ${offer} new</button>
    </div>`;
  }

  if (offer <= 0) {
    return `
      <div class="rv-empty">
        <div class="rv-emblem"></div>
        <h3>Nothing due right now</h3>
        <p>${available > 0
          ? `You've hit today's new-item cap (${cap}/day). Come back tomorrow, or raise the cap below.`
          : 'Your review queue is clear. Items enter it once you have studied them in a Daily session, a Quiz, or Flashcards — then return as the schedule brings them back.'}</p>
        ${renderNewPerDayControl()}
      </div>`;
  }

  return `
    <div class="rv-empty">
      <div class="rv-emblem"></div>
      <h3>Nothing due right now</h3>
      <p>You have ${available} unstudied item${available === 1 ? '' : 's'} unlocked. Learn a few now to get them scheduled.</p>
      <button class="mark-btn" onclick="startNewBatch()">Learn ${offer} new</button>
      ${renderNewPerDayControl()}
    </div>`;
}

function renderReviewIntake(host, actions, progress) {
  if (actions) actions.style.display = 'none';
  if (progress) progress.style.width = '100%';
  host.innerHTML = newIntakeHtml(false);
}

function renderNewPerDayControl() {
  return `
    <div class="rv-newperday">
      <label for="rvNewPerDay">New items per day</label>
      <input type="number" id="rvNewPerDay" min="1" max="50" value="${loadNewPerDay()}"
        onchange="saveNewPerDay(Number(this.value)); renderReviewCard();">
    </div>`;
}

function startNewBatch() {
  const cap = loadNewPerDay();
  const remaining = Math.max(0, cap - getNewIntroducedToday());
  const batch = getNewItems(remaining);
  if (!batch.length) return;

  reviewQueue = batch.map(({ type, id, item }) => ({
    type, id, item, record: { lapses: 0 },
  }));
  reviewIndex = 0;
  reviewIsNewBatch = true;
  renderReviewCard();
  document.getElementById('rvRevealBtn')?.focus();
}

function revealReview() {
  reviewRevealed = true;
  document.getElementById('rvBack')?.classList.add('visible');
  document.getElementById('rvRevealBtn')?.remove();
  const actions = document.getElementById('reviewActions');
  if (actions) {
    actions.style.display = 'flex';
    actions.querySelector('.fc-rate-ok')?.focus();
  }
}

function rateReview(rating) {
  if (!reviewRevealed) return;
  reviewRevealed = false;
  const entry = reviewQueue[reviewIndex];
  if (entry) {
    reviewItem(entry.type, entry.id, rating);
    bumpReviewCount(1);
    if (reviewIsNewBatch) bumpNewIntroduced(1);
  }
  recordActivity();
  if (typeof renderCalendar === 'function') renderCalendar();

  reviewIndex++;
  renderReviewStats();
  updateDueBadge();
  renderReviewCard();
  const next = document.getElementById('rvRevealBtn');
  if (next) next.focus();
  else document.getElementById('reviewCard').focus();
}
