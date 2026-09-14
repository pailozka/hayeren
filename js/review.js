// ===== REVIEW QUEUE =====
// One mixed queue of everything the SM-2 scheduler says is due today —
// letters, words and phrases together. This is the daily anchor: clearing
// it is the thing that actually keeps material in memory.

let reviewQueue = [];
let reviewIndex = 0;
let reviewRevealed = false;

function initReview() {
  reviewQueue = getDueItems();
  reviewIndex = 0;
  reviewRevealed = false;
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
  if (!host) return;

  if (!reviewQueue.length) {
    host.innerHTML = `
      <div class="rv-empty">
        <div class="rv-emblem"></div>
        <h3>Nothing due right now</h3>
        <p>Your review queue is clear. Items enter it once you have studied them in a Daily session, a Quiz, or Flashcards — then return as the schedule brings them back.</p>
      </div>`;
    if (actions) actions.style.display = 'none';
    if (progress) progress.style.width = '100%';
    return;
  }

  if (reviewIndex >= reviewQueue.length) {
    host.innerHTML = `
      <div class="rv-empty">
        <div class="rv-empty-mark">✓</div>
        <h3>Queue cleared</h3>
        <p>You reviewed ${reviewQueue.length} item${reviewQueue.length === 1 ? '' : 's'}. Each one is now scheduled further out — come back tomorrow.</p>
      </div>`;
    if (actions) actions.style.display = 'none';
    if (progress) progress.style.width = '100%';
    renderReviewStats();
    return;
  }

  const entry = reviewQueue[reviewIndex];
  const { type, item, record } = entry;
  reviewRevealed = false;

  if (progress) progress.style.width = (reviewIndex / reviewQueue.length * 100) + '%';
  const counter = document.getElementById('reviewCounter');
  if (counter) counter.textContent = `${reviewIndex + 1} / ${reviewQueue.length}`;

  const front = type === 'letter' ? item.arm : item.arm;
  const sub = type === 'letter' ? `${item.lower} · ${item.name}` : item.romanized;
  const back = type === 'letter' ? `"${item.sound}" ${item.ipa}` : item.eng;
  const typeLabel = type === 'letter' ? 'Letter' : type === 'word' ? 'Word' : 'Phrase';

  host.innerHTML = `
    <div class="rv-type">${typeLabel}${record.lapses ? ` · struggled ${record.lapses}×` : ''}</div>
    <div class="rv-front">${front}</div>
    <div class="rv-sub">${sub}</div>
    <div class="rv-back" id="rvBack">${back}</div>
    <button class="mark-btn" id="rvRevealBtn" onclick="revealReview()">Reveal</button>
  `;
  if (actions) actions.style.display = 'none';
}

function revealReview() {
  reviewRevealed = true;
  document.getElementById('rvBack')?.classList.add('visible');
  document.getElementById('rvRevealBtn')?.remove();
  const actions = document.getElementById('reviewActions');
  if (actions) actions.style.display = 'flex';
}

function rateReview(rating) {
  if (!reviewRevealed) return;
  const entry = reviewQueue[reviewIndex];
  if (entry) {
    reviewItem(entry.type, entry.id, rating);
    bumpReviewCount(1);
  }
  recordActivity();
  updateStreakDisplay();
  buildWeekDots();
  if (typeof renderCalendar === 'function') renderCalendar();

  reviewIndex++;
  renderReviewCard();
}
