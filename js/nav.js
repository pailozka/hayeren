// ===== NAV MODULE =====

let _flashcardsInited = false;
let _phrasebookInited = false;
let _dailyInited = false;
let _calendarInited = false;

const PANEL_NAMES = ['home', 'lesson', 'dialogue', 'review', 'daily', 'alphabet', 'quiz', 'flashcards', 'phrases', 'calendar', 'resources'];

const panelScrollPositions = {};
let currentPanel = 'home';
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const prefersReducedMotion = window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// `fromHash` is true when called by the hashchange listener (back/forward,
// a deep link, or a manual edit) — in that case the hash is already correct
// and shouldn't be rewritten, only read.
function showPanel(name, btnEl, fromHash) {
  if (!PANEL_NAMES.includes(name)) name = 'home';
  panelScrollPositions[currentPanel] = window.scrollY;
  const changingPanel = currentPanel !== name;
  currentPanel = name;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });
  document.getElementById('panel-' + name).classList.add('active');
  const tab = btnEl || document.querySelector(`.tab-btn[data-panel="${name}"]`);
  if (tab) {
    tab.classList.add('active');
    tab.setAttribute('aria-current', 'page');
    const strip = tab.parentElement;
    strip.scrollTo({ left: tab.offsetLeft - strip.offsetLeft - (strip.clientWidth - tab.clientWidth) / 2, behavior: 'auto' });
  }


  if (!fromHash && location.hash.slice(1) !== name) {
    history.pushState(null, '', '#' + name);
  }

  if (name === 'lesson') renderLesson();
  if (name === 'dialogue') renderDialogue();
  if (name === 'home') {
    initDashboard();
  }
  if (name === 'review') {
    initReview();
  }
  if (name === 'daily') {
    if (!_dailyInited) { _dailyInited = true; initDaily(); }
  }
  if (name === 'quiz') {
    initQuizPanel();
  }
  if (name === 'flashcards') {
    if (!_flashcardsInited) { _flashcardsInited = true; initFlashcards(); }
  }
  if (name === 'phrases') {
    if (!_phrasebookInited) { _phrasebookInited = true; initPhrasebook(); }
  }
  if (name === 'calendar') {
    if (!_calendarInited) { _calendarInited = true; initCalendar(); }
    else renderCalendar();
  }
  if (changingPanel) {
    window.scrollTo({ top: panelScrollPositions[name] || 0, behavior: 'instant' });
    document.getElementById('mainContent').focus({ preventScroll: true });
  }
}

// ---- Hash routing ----
// Panels are deep-linkable (#quiz, #alphabet, …) and Back/Forward move
// between them, without turning this into a real router — there's still
// only one level of navigation.
window.addEventListener('hashchange', () => {
  showPanel(location.hash.slice(1), null, true);
});

function initRouteFromHash() {
  const name = location.hash.slice(1);
  if (name && PANEL_NAMES.includes(name)) showPanel(name, null, true);
}

// ---- Keyboard control ----
// Ignores keystrokes while typing in a field (the quiz's "Type it" input,
// the Review new-per-day setting) so shortcuts don't fight with typing.
function isTypingTarget(el) {
  return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
}

document.addEventListener('keydown', (e) => {
  if (isTypingTarget(e.target)) return;
  if (e.target.closest('button, a, summary, [role=button]') && [' ', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  const activePanel = document.querySelector('.panel.active');
  const panelName = activePanel ? activePanel.id.replace('panel-', '') : null;

  // Flashcards: Space/Enter flips, 1/2/3 rate once flipped.
  if (panelName === 'flashcards') {
    const rating = document.getElementById('fcRating');
    const isFlipped = document.getElementById('flashcard')?.classList.contains('flipped');
    if ((e.key === ' ' || e.key === 'Enter') && !isFlipped) {
      e.preventDefault();
      document.getElementById('flashcard')?.click();
      return;
    }
    if (isFlipped && rating && rating.style.display !== 'none') {
      if (e.key === '1') { rateCard('hard'); return; }
      if (e.key === '2') { rateCard('good'); return; }
      if (e.key === '3') { rateCard('easy'); return; }
    }
  }

  // Review: same reveal + rate pattern as Flashcards.
  if (panelName === 'review') {
    if ((e.key === ' ' || e.key === 'Enter') && !reviewRevealed) {
      e.preventDefault();
      document.getElementById('rvRevealBtn')?.click();
      return;
    }
    if (reviewRevealed) {
      if (e.key === '1') { rateReview('hard'); return; }
      if (e.key === '2') { rateReview('good'); return; }
      if (e.key === '3') { rateReview('easy'); return; }
    }
  }

  // Quiz: 1-4 pick a multiple-choice option; Enter advances once answered.
  if (panelName === 'quiz') {
    if (['1', '2', '3', '4'].includes(e.key)) {
      const opts = document.querySelectorAll('.quiz-opt:not(:disabled)');
      const opt = opts[Number(e.key) - 1];
      if (opt) { opt.click(); return; }
    }
    if (e.key === 'Enter' && document.getElementById('nextBtn')?.classList.contains('visible')) {
      document.getElementById('nextBtn').click();
      return;
    }
  }

  // Program: arrow keys move between curriculum days.
  if (panelName === 'daily') {
    if (e.key === 'ArrowRight') { switchDay(Math.min(activeDay + 1, curriculum.length)); return; }
    if (e.key === 'ArrowLeft')  { switchDay(Math.max(activeDay - 1, 1)); return; }
  }
});
