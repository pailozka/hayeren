// ===== NAV MODULE =====

let _flashcardsInited = false;
let _phrasebookInited = false;

function showPanel(name, btnEl) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (btnEl) btnEl.classList.add('active');

  // Lazy init
  if (name === 'quiz') {
    initQuizPanel();
  }
  if (name === 'flashcards') {
    if (!_flashcardsInited) { _flashcardsInited = true; initFlashcards(); }
  }
  if (name === 'phrases') {
    if (!_phrasebookInited) { _phrasebookInited = true; initPhrasebook(); }
  }
}
