// ===== APP ENTRY POINT =====
// Runs after all scripts are loaded.

function init() {
  // Record that the app was opened today
  recordActivity();

  // Update streak display in the daily panel
  updateStreakDisplay();

  // Build week dots with real activity data
  buildWeekDots();

  // Build alphabet grid
  buildAlphabet();

  // Sync learned count display
  saveLearnedLetters(learnedLetters);

  // Initialize day view and restore completion states
  switchDay(1);
  initDailyTaskStates();
}

init();
