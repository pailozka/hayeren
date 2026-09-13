// ===== NAV MODULE =====

let _flashcardsInited = false;
let _phrasebookInited = false;
let _dailyInited = false;
let _calendarInited = false;

function showPanel(name, btnEl) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

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
}
