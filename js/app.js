// ===== APP ENTRY POINT =====
// Runs after all scripts are loaded.

function init() {

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

// Account for wrapped navigation and larger text without a fixed scroll offset.
const appNav = document.querySelector('.app-nav');
const navTabs = appNav.querySelector('.nav-tabs');
if (window.ResizeObserver) {
  const navigationObserver = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--nav-height', appNav.offsetHeight + 'px');
    document.documentElement.style.setProperty('--mobile-nav-height', navTabs.offsetHeight + 'px');
  });
  navigationObserver.observe(appNav);
  navigationObserver.observe(navTabs);
}
