// ===== DASHBOARD =====
// The landing view. Its job is to show where you stand and offer several
// honest ways in — not to push you into Day 1.

function initDashboard() {
  renderLessonLaunch();
  renderDashGreeting();
  renderDashPrimary();
  renderDashFigures();
  renderDashBlocks();
  renderDashJump();
  renderDashHeatmap();
  updateDueBadge();
}

function renderDashGreeting() {
  const h = new Date().getHours();
  const greeting = h < 12
    ? { arm: 'Բարի՛ <em>լույս</em>', rom: 'Bari luys' }
    : h < 18
      ? { arm: 'Բարի՛ <em>օր</em>', rom: 'Bari or' }
      : { arm: 'Բարի՛ <em>երեկո</em>', rom: 'Bari yereko' };

  const el = document.getElementById('dashGreeting');
  if (el) el.innerHTML = greeting.arm;
  const line = document.getElementById('dashLine');
  if (line) line.textContent = greeting.rom + ' — pick up where you left off, clear your review queue, or wander wherever you like.';
}

function renderDashPrimary() {
  const host = document.getElementById('dashPrimary');
  if (!host) return;

  const stats = getSrsStats();
  const resumeDay = getCurrentDay();
  const day = getDay(resumeDay);
  const { done, total } = getDayCompletion(resumeDay);
  const started = done > 0;

  const dueCard = stats.dueToday > 0
    ? `
      <button class="dash-card lead" onclick="goPanel('review')">
        <div class="dash-card-kicker">Due now</div>
        <div class="dash-card-figure">${stats.dueToday}</div>
        <div class="dash-card-title">item${stats.dueToday === 1 ? '' : 's'} to review</div>
        <div class="dash-card-note">Scheduled by how well you knew them last time. Clearing this is the single highest-value thing you can do today.</div>
        <span class="dash-card-go">Start reviewing →</span>
      </button>`
    : `
      <button class="dash-card" onclick="goPanel('review')">
        <div class="dash-card-kicker">Review queue</div>
        <div class="dash-card-figure">✓</div>
        <div class="dash-card-title">Nothing due</div>
        <div class="dash-card-note">${stats.tracked ? 'You are current. Study something new and it will enter the queue.' : 'Study anything — a Daily session, a quiz, a flashcard — and it starts being scheduled.'}</div>
        <span class="dash-card-go">Open review →</span>
      </button>`;

  host.innerHTML = dueCard + `
    <button class="dash-card" onclick="goDay(${resumeDay})">
      <div class="dash-card-kicker">${started ? 'Continue' : 'Next up'}</div>
      <div class="dash-card-figure">${resumeDay}</div>
      <div class="dash-card-title">Day ${resumeDay} — ${day.title}</div>
      <div class="dash-card-note">${day.subtitle}</div>
      <div class="dash-progress"><div class="dash-progress-fill" style="width:${total ? (done / total * 100) : 0}%"></div></div>
      <span class="dash-card-go">${done}/${total} sessions · ${started ? 'Resume' : 'Begin'} →</span>
    </button>

    <button class="dash-card" onclick="goPanel('flashcards')">
      <div class="dash-card-kicker">Free practice</div>
      <div class="dash-card-figure">${learnedLetters.size}<span>/${letters.length}</span></div>
      <div class="dash-card-title">Letters marked learned</div>
      <div class="dash-card-note">No schedule, no program. Shuffle a deck and drill whatever you feel like.</div>
      <span class="dash-card-go">Open flashcards →</span>
    </button>`;
}

function renderDashFigures() {
  const host = document.getElementById('dashFigures');
  if (!host) return;
  const streak = loadStreak();
  const stats = getSrsStats();
  const counts = loadReviewCounts();
  const totalReviews = Object.values(counts).reduce((a, b) => a + b, 0);

  const figures = [
    { n: streak.currentStreak, label: 'day streak' },
    { n: streak.longestStreak, label: 'longest streak' },
    { n: stats.mature, label: 'items known well' },
    { n: stats.learning, label: 'still learning' },
    { n: totalReviews, label: 'reviews all time' },
    { n: vocabulary.length, label: 'words available' },
  ];

  host.innerHTML = figures.map(f =>
    `<div class="figure"><span class="figure-num">${f.n}</span><span class="figure-label">${f.label}</span></div>`
  ).join('');
}

function renderDashBlocks() {
  const host = document.getElementById('dashBlocks');
  if (!host) return;

  host.innerHTML = curriculumBlocks.map(block => {
    let done = 0, total = 0;
    block.days.forEach(n => {
      const c = getDayCompletion(n);
      done += c.done; total += c.total;
    });
    const pct = total ? Math.round(done / total * 100) : 0;
    return `
      <div class="dash-block">
        <div class="dash-block-top">
          <span class="dash-block-name">${block.label}</span>
          <span class="dash-block-pct">${pct}%</span>
        </div>
        <div class="dash-progress"><div class="dash-progress-fill" style="width:${pct}%"></div></div>
        <div class="dash-block-days">
          ${block.days.map(n => {
            const c = getDayCompletion(n);
            const state = c.done === c.total ? 'complete' : c.done > 0 ? 'partial' : '';
            return `<button class="day-chip ${state}" onclick="goDay(${n})" title="${getDay(n).title}">${n}</button>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');
}

function renderDashJump() {
  const host = document.getElementById('dashJump');
  if (!host) return;
  const jumps = [
    { panel: 'alphabet',   title: 'The alphabet',  note: `All ${letters.length} letters, with sound, notes and example words.` },
    { panel: 'quiz',       title: 'Quiz',          note: 'Multiple choice, letters or vocabulary, both directions.' },
    { panel: 'flashcards', title: 'Flashcards',    note: 'Flip cards that feed the review scheduler.' },
    { panel: 'phrases',    title: 'Phrasebook',    note: `${phrases.length} phrases across ${phraseCategories.length} situations.` },
    { panel: 'calendar',   title: 'Calendar',      note: 'Month grid and a full year of study history.' },
    { panel: 'resources',  title: 'Resources',     note: 'Textbooks, audio, dictionaries and courses worth your time.' },
  ];
  host.innerHTML = jumps.map(j => `
    <button class="jump-card" onclick="goPanel('${j.panel}')">
      <span class="jump-title">${j.title}</span>
      <span class="jump-note">${j.note}</span>
    </button>`).join('');
}

function renderDashHeatmap() {
  render52WeekHeatmap('dashHeatmap');
}

function updateDueBadge() {
  const badge = document.getElementById('tabDueBadge');
  if (!badge) return;
  const n = getSrsStats().dueToday;
  badge.textContent = n > 0 ? n : '';
  badge.classList.toggle('visible', n > 0);
}

// ---- Navigation helpers used by the dashboard ----

function goPanel(name) {
  showPanel(name, document.querySelector(`.tab-btn[data-panel="${name}"]`));
}

function goDay(n) {
  goPanel('daily');
  switchDay(n);
}
