// ===== APP ENTRY POINT =====
// Runs after all scripts are loaded.

function init() {
  recordActivity();
  buildAlphabet();
  saveLearnedLetters(learnedLetters);
  initDashboard(); // always primes the due badge, even if a hash routes elsewhere
  initRouteFromHash();
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
