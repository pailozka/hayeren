// ===== QUIZ MODULE =====
// Handles both Letter Quiz and Word Quiz modes.

// ---- State ----
let quizMode      = 'letters'; // 'letters' | 'words'
let quizDirection = 'toSound'; // 'toSound' | 'toChar'  (letters mode only)
let wordQuizCategory = 'all';

let quizLetters  = [];
let quizIndex    = 0;
let quizScore    = 0;
let quizAnswered = false;

let wordQuizItems    = [];
let wordQuizIndex    = 0;
let wordQuizScore    = 0;
let wordQuizAnswered = false;

// ---- Entry point called by nav ----
function initQuizPanel() {
  if (quizMode === 'letters') {
    initLetterQuiz();
  } else {
    initWordQuiz(wordQuizCategory);
  }
  syncQuizControls();
}

// ---- Mode / Direction controls ----
function setQuizMode(mode) {
  quizMode = mode;
  syncQuizControls();
  if (mode === 'letters') {
    showLetterQuizUI();
    initLetterQuiz();
  } else {
    showWordQuizUI();
    initWordQuiz(wordQuizCategory);
  }
}

function setQuizDirection(dir) {
  quizDirection = dir;
  document.getElementById('btnDirToSound').classList.toggle('active', dir === 'toSound');
  document.getElementById('btnDirToChar').classList.toggle('active', dir === 'toChar');
  initLetterQuiz();
}

function syncQuizControls() {
  document.getElementById('btnModeLetters').classList.toggle('active', quizMode === 'letters');
  document.getElementById('btnModeWords').classList.toggle('active', quizMode === 'words');
  const dirGroup = document.getElementById('directionGroup');
  if (dirGroup) dirGroup.style.display = quizMode === 'letters' ? '' : 'none';
}

function showLetterQuizUI() {
  const wcEl = document.getElementById('wordQuizCats');
  if (wcEl) wcEl.style.display = 'none';
  resetQuizCard();
}

function showWordQuizUI() {
  buildWordQuizCats();
  const wcEl = document.getElementById('wordQuizCats');
  if (wcEl) wcEl.style.display = 'flex';
  resetQuizCard();
}

function resetQuizCard() {
  const card = document.getElementById('quizCard');
  if (card) {
    card.style.display = '';
    card.innerHTML = `
      <div class="quiz-prompt" id="quizPrompt">—</div>
      <div class="quiz-char" id="quizChar">·</div>
      <div class="quiz-subtext" id="quizSub"></div>
    `;
  }
  const opts = document.getElementById('quizOptions');
  if (opts) opts.innerHTML = '';
  const nb = document.getElementById('nextBtn');
  if (nb) { nb.classList.remove('visible'); nb.onclick = nextQuestion; nb.textContent = 'Next →'; }
}

// ---- Letter Quiz ----
function initLetterQuiz() {
  quizLetters  = [...letters].sort(() => Math.random() - 0.5).slice(0, 15);
  quizIndex    = 0;
  quizScore    = 0;
  quizAnswered = false;
  renderLetterQuestion();
}

function renderLetterQuestion() {
  if (quizIndex >= quizLetters.length) { showLetterResult(); return; }

  const l = quizLetters[quizIndex];
  updateScoreAndProgress(quizScore, quizIndex, quizLetters.length);
  quizAnswered = false;
  document.getElementById('nextBtn').classList.remove('visible');

  if (quizDirection === 'toSound') {
    document.getElementById('quizPrompt').textContent = 'What sound does this letter make?';
    const charEl = document.getElementById('quizChar');
    charEl.textContent = l.arm;
    charEl.style.fontSize = '';
    document.getElementById('quizSub').textContent = l.name;
  } else {
    document.getElementById('quizPrompt').textContent = 'Which Armenian letter makes this sound?';
    const charEl = document.getElementById('quizChar');
    charEl.textContent = l.sound;
    charEl.style.fontSize = '2.5rem';
    document.getElementById('quizSub').textContent = l.ipa;
  }

  // Build 4 options
  const correctVal = quizDirection === 'toSound' ? l.sound : l.arm;
  const pool       = quizDirection === 'toSound'
    ? letters.map(x => x.sound)
    : letters.map(x => x.arm);

  const opts = buildOptions(correctVal, pool);
  renderOptions(opts, correctVal);
}

function checkLetterAnswer(selected, correct, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  markOptions(selected, correct);
  if (selected === correct) quizScore++;
  recordActivity();
  updateStreakDisplay();
  buildWeekDots();
  document.getElementById('nextBtn').classList.add('visible');
}

function nextQuestion() {
  quizIndex++;
  if (quizMode === 'letters') renderLetterQuestion();
  else renderWordQuestion();
}

function showLetterResult() {
  const total = quizLetters.length;
  document.getElementById('quizCard').innerHTML = `
    <div class="quiz-prompt">Quiz Complete!</div>
    <div class="quiz-char" style="font-size:3rem;">${quizScore >= 12 ? '🎉' : quizScore >= 8 ? '👍' : '📚'}</div>
    <div style="font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--gold);margin:0.5rem 0;">${quizScore} / ${total}</div>
    <div class="quiz-subtext">${quizScore >= 12 ? 'Excellent! You know these letters well.' : quizScore >= 8 ? 'Good progress! Keep reviewing.' : 'Keep studying — it takes time!'}</div>
  `;
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizProgress').style.width = '100%';
  document.getElementById('quizScore').textContent = `Final: ${quizScore}/${total}`;
  const nb = document.getElementById('nextBtn');
  nb.textContent = 'Try Again →';
  nb.classList.add('visible');
  nb.onclick = initLetterQuiz;
}

// ---- Word Quiz ----
function buildWordQuizCats() {
  const container = document.getElementById('wordQuizCats');
  if (!container) return;
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'ctrl-btn' + (wordQuizCategory === 'all' ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.onclick = () => { wordQuizCategory = 'all'; initWordQuiz('all'); buildWordQuizCats(); };
  container.appendChild(allBtn);

  vocabCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'ctrl-btn' + (wordQuizCategory === cat.id ? ' active' : '');
    btn.textContent = cat.label;
    btn.onclick = () => { wordQuizCategory = cat.id; initWordQuiz(cat.id); buildWordQuizCats(); };
    container.appendChild(btn);
  });
}

function initWordQuiz(category) {
  wordQuizCategory = category;
  const pool = category === 'all' ? vocabulary : vocabulary.filter(w => w.category === category);
  wordQuizItems    = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(12, pool.length));
  wordQuizIndex    = 0;
  wordQuizScore    = 0;
  wordQuizAnswered = false;

  resetQuizCard();
  renderWordQuestion();
}

function renderWordQuestion() {
  if (wordQuizIndex >= wordQuizItems.length) { showWordResult(); return; }

  const w = wordQuizItems[wordQuizIndex];
  updateScoreAndProgress(wordQuizScore, wordQuizIndex, wordQuizItems.length);
  wordQuizAnswered = false;
  document.getElementById('nextBtn').classList.remove('visible');

  // Alternate question type based on index
  const types = ['armToEng', 'engToArm'];
  const qType = types[wordQuizIndex % 2];

  if (qType === 'armToEng') {
    document.getElementById('quizPrompt').textContent = 'What does this word mean?';
    const charEl = document.getElementById('quizChar');
    charEl.textContent = w.arm;
    charEl.style.fontSize = '3rem';
    document.getElementById('quizSub').textContent = w.romanized;

    const correctVal = w.eng;
    const pool = vocabulary.map(x => x.eng);
    const opts = buildOptions(correctVal, pool);
    renderOptions(opts, correctVal);
  } else {
    document.getElementById('quizPrompt').textContent = 'Which Armenian word means this?';
    const charEl = document.getElementById('quizChar');
    charEl.textContent = w.eng;
    charEl.style.fontSize = '2.5rem';
    document.getElementById('quizSub').textContent = w.romanized;

    const correctVal = w.arm;
    const pool = vocabulary.map(x => x.arm);
    const opts = buildOptions(correctVal, pool);
    renderOptions(opts, correctVal);
  }
}

function checkWordAnswer(selected, correct, btn) {
  if (wordQuizAnswered) return;
  wordQuizAnswered = true;
  markOptions(selected, correct);
  if (selected === correct) wordQuizScore++;
  recordActivity();
  updateStreakDisplay();
  buildWeekDots();
  document.getElementById('nextBtn').classList.add('visible');
}

function showWordResult() {
  const total = wordQuizItems.length;
  document.getElementById('quizCard').innerHTML = `
    <div class="quiz-prompt">Word Quiz Complete!</div>
    <div class="quiz-char" style="font-size:3rem;">${wordQuizScore >= total * 0.8 ? '🎉' : wordQuizScore >= total * 0.5 ? '👍' : '📚'}</div>
    <div style="font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--gold);margin:0.5rem 0;">${wordQuizScore} / ${total}</div>
    <div class="quiz-subtext">${wordQuizScore >= total * 0.8 ? 'Excellent vocabulary!' : wordQuizScore >= total * 0.5 ? 'Good progress! Keep at it.' : 'Keep studying — words take time!'}</div>
  `;
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizProgress').style.width = '100%';
  document.getElementById('quizScore').textContent = `Final: ${wordQuizScore}/${total}`;
  const nb = document.getElementById('nextBtn');
  nb.textContent = 'Try Again →';
  nb.classList.add('visible');
  nb.onclick = () => initWordQuiz(wordQuizCategory);
}

// ---- Shared helpers ----
function buildOptions(correctVal, allVals) {
  const opts = [correctVal];
  const candidates = [...new Set(allVals)].filter(v => v !== correctVal);
  candidates.sort(() => Math.random() - 0.5);
  while (opts.length < 4 && candidates.length) opts.push(candidates.pop());
  return opts.sort(() => Math.random() - 0.5);
}

function renderOptions(opts, correctVal) {
  const container = document.getElementById('quizOptions');
  container.innerHTML = '';
  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.onclick = () => {
      if (quizMode === 'letters') checkLetterAnswer(opt, correctVal, btn);
      else checkWordAnswer(opt, correctVal, btn);
    };
    container.appendChild(btn);
  });
}

function markOptions(selected, correct) {
  document.querySelectorAll('.quiz-opt').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });
  const wrongBtns = document.querySelectorAll('.quiz-opt');
  wrongBtns.forEach(b => { if (b.textContent === selected && selected !== correct) b.classList.add('wrong'); });
}

function updateScoreAndProgress(score, index, total) {
  document.getElementById('quizScore').textContent = `Score: ${score}/${index}`;
  document.getElementById('quizProgress').style.width = (index / total * 100) + '%';
}
