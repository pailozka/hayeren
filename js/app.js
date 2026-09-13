// ===== APP ENTRY POINT =====
// Runs after all scripts are loaded.

function init() {
  recordActivity();
  updateStreakDisplay();
  buildAlphabet();
  saveLearnedLetters(learnedLetters);
  initDashboard();
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
