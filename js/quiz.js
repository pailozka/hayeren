// ===== QUIZ MODULE =====
// Handles both Letter Quiz and Word Quiz modes, each answerable two ways:
// multiple choice (recognition) or typed (production). Typing always asks
// for the Latin side — romanization for letters, English for words — since
// producing the Armenian glyphs themselves needs a script the learner
// hasn't been taught to type, only to read.

// ---- State ----
let quizMode       = 'letters'; // 'letters' | 'words'
let quizDirection  = 'toSound'; // 'toSound' | 'toChar'  (letters mode, choice answers only)
let quizAnswerMode = 'choice';  // 'choice' | 'type'
let wordQuizCategory = 'all';
let quizLetterUpTo = null; // scopes the letter pool to letters[0..upTo) — set by a Daily drill

let quizLetters  = [];
let quizIndex    = 0;
let quizScore    = 0;
let quizAnswered = false;
let quizTypedMiss = false; // true once the learner has gotten a typed answer wrong once this question

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
function setQuizMode(mode, upTo) {
  quizMode = mode;
  if (mode === 'letters') quizLetterUpTo = typeof upTo === 'number' ? upTo : null;
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

function setQuizAnswerMode(mode) {
  quizAnswerMode = mode;
  document.getElementById('btnAnsChoice').classList.toggle('active', mode === 'choice');
  document.getElementById('btnAnsType').classList.toggle('active', mode === 'type');
  // Direction only means something for multiple-choice letters — typed
  // answers always go Armenian -> Latin, so hide it in type mode.
  const dirGroup = document.getElementById('directionGroup');
  if (dirGroup) dirGroup.style.display = (quizMode === 'letters' && mode === 'choice') ? '' : 'none';
  if (quizMode === 'letters') renderLetterQuestion();
  else renderWordQuestion();
}

function syncQuizControls() {
  document.getElementById('btnModeLetters').classList.toggle('active', quizMode === 'letters');
  document.getElementById('btnModeWords').classList.toggle('active', quizMode === 'words');
  const dirGroup = document.getElementById('directionGroup');
  if (dirGroup) dirGroup.style.display = (quizMode === 'letters' && quizAnswerMode === 'choice') ? '' : 'none';
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

// ---- Answer normalization (typed mode) ----
// Strips the noise a correct answer shouldn't be marked wrong for, and
// expands a field's "/"- or ","-separated alternates into a set of any of
// which counts as correct — e.g. sound "vo/o" accepts either "vo" or "o".
function normalizeAnswer(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ʼ‘’'`ʻʾ]/g, '') // apostrophes & aspiration marks
    .replace(/[.,!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function acceptableAnswers(field) {
  return String(field).split(/[/,]/).map(normalizeAnswer).filter(Boolean);
}

// ---- Letter Quiz ----
function initLetterQuiz() {
  const pool = typeof quizLetterUpTo === 'number' ? letters.slice(0, quizLetterUpTo) : letters;
  quizLetters  = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(15, pool.length));
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
  quizTypedMiss = false;
  document.getElementById('nextBtn').classList.remove('visible');

  if (quizAnswerMode === 'type') {
    document.getElementById('quizPrompt').textContent = 'Type the romanization';
    const charEl = document.getElementById('quizChar');
    charEl.textContent = l.arm;
    charEl.style.fontSize = '';
    document.getElementById('quizSub').textContent = l.armName;
    renderTypedAnswer(acceptableAnswers(l.sound), (correctOnFirstTry) => {
      reviewItem('letter', l.id, correctOnFirstTry ? 'good' : 'hard');
      bumpReviewCount(1);
      recordActivity();
    });
    return;
  }

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

  const l = quizLetters[quizIndex];
  reviewItem('letter', l.id, selected === correct ? 'good' : 'hard');
  bumpReviewCount(1);

  recordActivity();
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
    <img class="quiz-result-mark" src="images/pomegranate-cutout.png" alt="">
    <div class="quiz-result-score">${quizScore} <span>/ ${total}</span></div>
    <div class="quiz-subtext">${quizScore >= total * 0.8 ? 'Excellent! You know these letters well.' : quizScore >= total * 0.5 ? 'Good progress! Keep reviewing.' : 'Keep studying — it takes time!'}</div>
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
  quizTypedMiss = false;
  document.getElementById('nextBtn').classList.remove('visible');

  if (quizAnswerMode === 'type') {
    document.getElementById('quizPrompt').textContent = 'What does this word mean?';
    const charEl = document.getElementById('quizChar');
    charEl.textContent = w.arm;
    charEl.style.fontSize = '3rem';
    document.getElementById('quizSub').textContent = w.romanized;
    renderTypedAnswer(acceptableAnswers(w.eng), (correctOnFirstTry) => {
      reviewItem('word', w.id, correctOnFirstTry ? 'good' : 'hard');
      bumpReviewCount(1);
      recordActivity();
    });
    return;
  }

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

  const w = wordQuizItems[wordQuizIndex];
  if (w) reviewItem('word', w.id, selected === correct ? 'good' : 'hard');
  bumpReviewCount(1);

  recordActivity();
  document.getElementById('nextBtn').classList.add('visible');
}

function showWordResult() {
  const total = wordQuizItems.length;
  document.getElementById('quizCard').innerHTML = `
    <div class="quiz-prompt">Word Quiz Complete!</div>
    <img class="quiz-result-mark" src="images/pomegranate-cutout.png" alt="">
    <div class="quiz-result-score">${wordQuizScore} <span>/ ${total}</span></div>
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
  container.className = 'quiz-options';
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

// Renders a text input + submit for typed-answer questions. `onSettled(good)`
// fires once the question is fully resolved (right first try, right after a
// miss, or given up), with `good` true only for a clean first-try match.
function renderTypedAnswer(accepted, onSettled) {
  const container = document.getElementById('quizOptions');
  container.className = 'quiz-type';
  container.innerHTML = `
    <input type="text" id="quizTypeInput" class="quiz-type-input" autocomplete="off"
      autocapitalize="off" spellcheck="false" placeholder="Type your answer…">
    <button class="mark-btn" id="quizTypeSubmit">Check</button>
    <div class="quiz-type-feedback" id="quizTypeFeedback" aria-live="polite"></div>
  `;
  const input = document.getElementById('quizTypeInput');
  const submitBtn = document.getElementById('quizTypeSubmit');
  const feedback = document.getElementById('quizTypeFeedback');
  let settled = false;

  function submit() {
    if (settled) return;
    const val = normalizeAnswer(input.value);
    if (!val) return;
    const correct = accepted.includes(val);

    if (correct) {
      settled = true;
      input.disabled = true;
      submitBtn.disabled = true;
      feedback.textContent = quizTypedMiss ? `Correct — it was "${accepted[0]}."` : 'Correct!';
      feedback.className = 'quiz-type-feedback correct';
      onSettled(!quizTypedMiss);
      document.getElementById('nextBtn').classList.add('visible');
    } else if (!quizTypedMiss) {
      quizTypedMiss = true;
      feedback.textContent = 'Not quite — try once more.';
      feedback.className = 'quiz-type-feedback wrong';
      input.select();
    } else {
      settled = true;
      input.disabled = true;
      submitBtn.disabled = true;
      feedback.textContent = `The answer was "${accepted[0]}."`;
      feedback.className = 'quiz-type-feedback wrong';
      onSettled(false);
      document.getElementById('nextBtn').classList.add('visible');
    }
  }

  submitBtn.onclick = submit;
  input.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
  input.focus();
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
