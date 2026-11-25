// Short lessons reuse the app's Eastern Armenian content. Progress is separate
// from the longer Program: finishing six cards does not complete a study day.
const LESSON_KEY = 'hayeren_guidedLesson_v1';
let lessonState = null;
try { lessonState = JSON.parse(localStorage.getItem(LESSON_KEY)); } catch {}
if (!lessonState || !Number.isInteger(lessonState.unit) || lessonState.unit < 0 || !Array.isArray(lessonState.queue)) lessonState = null;
const lessonTopics = ['greetings', 'family', 'numbers', 'food', 'verbs', 'pronouns'];
const lessonEscape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lessonItems(unit) {
  const start = (unit * 3) % letters.length;
  const topic = lessonTopics[unit % lessonTopics.length];
  const words = vocabulary.filter(w => w.category === topic);
  return [0,1,2].map(i => ({ type: 'letter', ...letters[(start + i) % letters.length] }))
    .concat([0,1,2].map(i => ({ type: 'word', ...words[(Math.floor(unit / lessonTopics.length) * 3 + i) % words.length] })));
}
function saveLesson() { localStorage.setItem(LESSON_KEY, JSON.stringify(lessonState)); }
function renderLessonLaunch() {
  const resume = lessonState && !lessonState.finished;
  const unit = lessonState ? lessonState.unit + (resume ? 0 : 1) : 0;
  const topic = lessonTopics[unit % lessonTopics.length];
  const topicName = topic[0].toUpperCase() + topic.slice(1);
  const step = resume ? (lessonState.phase === 'learn' ? lessonState.index : 6 + lessonState.index) : 0;
  document.getElementById('lessonLaunch').innerHTML = `
    <div class="lesson-launch-copy">
      <p class="lesson-eyebrow">Lesson ${unit + 1} · 5–8 min</p>
      <h2>${topicName} &amp; the alphabet</h2>
      <p>${resume ? 'Pick up where you left off.' : 'Meet three letters and three words, then try to recall them.'}</p>
      ${resume ? `<progress class="lesson-launch-progress" max="${6 + lessonState.queue.length}" value="${step}" aria-label="Current lesson progress"></progress>` : ''}
      <button class="lesson-primary" onclick="startLesson()">${resume ? 'Continue lesson' : 'Start a short lesson'} <span aria-hidden="true">→</span></button>
    </div>
    <img class="lesson-launch-art" src="images/letter-a-cutout.png" alt="" width="240" height="240">`;

}
function startLesson() {
  if (!lessonState || lessonState.finished) {
    const unit = lessonState ? lessonState.unit + 1 : 0;
    lessonState = { unit, phase: 'learn', index: 0, queue: Array.from({length:12}, (_,i) => ({item:i % 6, reverse:i >= 6})), mistakes: [], answered: null, finished: false };
    saveLesson();
  }
  showPanel('lesson');
  document.getElementById('lessonStage')?.focus({ preventScroll: true });
  document.getElementById('lessonHost').scrollIntoView({ block: 'start', behavior: 'instant' });
}
function lessonAnswer(item, reverse) { return reverse ? item.arm : item.type === 'letter' ? item.sound : item.eng; }
function renderLesson() {
  const host = document.getElementById('lessonHost');
  if (!lessonState) { host.innerHTML = '<h1>Your first short lesson</h1><p>Learn three letters and three everyday words, then put them into practice.</p><button class="lesson-primary" onclick="startLesson()">Begin →</button>'; return; }
  const state = lessonState;
  const items = lessonItems(state.unit);
  const learning = state.phase === 'learn';
  const task = state.queue[state.index];
  const item = learning ? items[state.index] : task ? items[task.item] : null;
  const step = learning ? state.index : 6 + state.index;
  host.innerHTML = `<div class="lesson-toolbar"><button class="ctrl-btn" onclick="showPanel('home')">← Save &amp; leave</button><span>Lesson ${state.unit + 1} · ${lessonTopics[state.unit % lessonTopics.length]}</span></div>
    <progress class="lesson-progress" max="${6 + state.queue.length}" value="${state.finished ? 6 + state.queue.length : step + Number(state.answered !== null)}" aria-label="Lesson progress"></progress>
    <div id="lessonStage" class="lesson-stage" tabindex="-1"></div>`;
  const stage = document.getElementById('lessonStage');
  if (state.finished) {
    stage.innerHTML = `<h1>Lesson complete</h1><p>You practiced ${items.length} items in both directions${state.mistakes.length ? ' and worked through the tricky ones' : ''}. They’ll be ready for review when due.</p><div class="lesson-summary">${items.map(i => `<span lang="hy">${i.arm}</span>`).join('')}</div><div class="lesson-summary-actions"><button class="lesson-primary" onclick="startLesson()">Another lesson →</button> <button class="ctrl-btn" onclick="showPanel('home')">Back to Home</button></div>`;
    return;
  }
  if (learning) {
    stage.innerHTML = `<p class="lesson-eyebrow">Meet ${state.index + 1} of 6 · ${item.type === 'letter' ? 'Letter & sound' : 'Useful word'}</p>
      <h1 class="lesson-glyph" lang="hy">${item.arm}${item.lower ? ' <small>' + item.lower + '</small>' : ''}</h1>
      <h2>${lessonEscape(item.type === 'letter' ? item.name + ' · ' + item.sound : item.eng)}</h2>
      <p class="lesson-romanization">${lessonEscape(item.romanized || item.ipa)}</p>
      <p>${lessonEscape(item.desc || 'Say the word aloud, then look away and try to remember it.')}</p>
      ${item.audio ? '<button class="ctrl-btn" id="lessonAudio">▶ Hear the letter name</button>' : ''}
      `;
    renderLessonActions(host, state.index === 5 ? 'Start practice' : 'Continue');
    if (item.audio) document.getElementById('lessonAudio').onclick = e => playLetterAudio(item, e.currentTarget);
  } else {
    const answer = lessonAnswer(item, task.reverse);
    const pool = item.type === 'letter' ? letters.map(l => ({type:'letter', ...l})) : vocabulary.map(w => ({type:'word', ...w}));
    const distractors = [...new Set(pool.map(i => lessonAnswer(i, task.reverse)))].filter(a => a !== answer);
    // Keep choices stable when resuming or showing feedback.
    const offset = (state.unit * 7 + state.index * 3) % distractors.length;
    const options = [answer, ...[0,1,2].map(i => distractors[(offset + i) % distractors.length])];
    const rotation = (state.index + state.unit) % 4;
    options.push(...options.splice(0, rotation));
    stage.innerHTML = `<p class="lesson-eyebrow">${state.index >= 12 ? 'Retry' : `Recall · ${state.index + 1} of 12`}</p>
      <h1>${task.reverse ? 'Choose the Armenian' : item.type === 'letter' ? 'Which sound?' : 'What does this mean?'}</h1>
      <div class="lesson-question" ${task.reverse ? '' : 'lang="hy"'}>${lessonEscape(task.reverse ? lessonAnswer(item, false) : item.arm)}</div>
      <div class="lesson-options">${options.map((option, index) => `<button class="lesson-option" data-option="${index}" ${task.reverse ? 'lang="hy"' : ''}>${lessonEscape(option)}</button>`).join('')}</div>`;
    renderLessonActions(host, state.index >= state.queue.length - 1 ? 'Finish lesson' : 'Continue', true);
    stage.querySelectorAll('[data-option]').forEach((button, index) => {
      button.onclick = () => answerLesson(options[index], answer);
    });
    if (state.answered !== null) showLessonFeedback(answer);

  }
}
function renderLessonActions(host, label, checking = false) {
  host.insertAdjacentHTML('beforeend', `<div class="guided-lesson-actions">
    ${checking ? '<p id="lessonFeedback" class="lesson-feedback" role="status" aria-atomic="true"></p>' : ''}
    <button id="lessonContinue" class="lesson-primary" onclick="advanceLesson()" ${checking ? 'disabled' : ''}>${label} →</button>
  </div>`);
}

function showLessonFeedback(correctAnswer) {
  const correct = lessonState.answered === correctAnswer;
  document.querySelectorAll('#lessonStage [data-option]').forEach(button => {
    button.disabled = true;
    if (button.textContent === correctAnswer) button.classList.add('correct');
    else if (button.textContent === lessonState.answered) button.classList.add('incorrect');
  });
  const feedback = document.getElementById('lessonFeedback');
  feedback.classList.add(correct ? 'correct' : 'incorrect');
  feedback.textContent = correct ? '✓ Correct' : `Correct answer: ${correctAnswer}. You’ll try again.`;
  const next = document.getElementById('lessonContinue');
  next.disabled = false;
  next.textContent = lessonState.index === lessonState.queue.length - 1 ? 'Finish lesson →' : 'Continue →';
}

function answerLesson(answer, correctAnswer) {
  if (lessonState.answered !== null || lessonState.finished) return;
  const task = lessonState.queue[lessonState.index];
  lessonState.answered = answer;
  if (answer !== correctAnswer) {
    if (!lessonState.mistakes.includes(task.item)) lessonState.mistakes.push(task.item);
    lessonState.queue.push({...task});
  }
  saveLesson();
  const progress = document.querySelector('#lessonHost .lesson-progress');
  progress.max = 6 + lessonState.queue.length;
  progress.value = 7 + lessonState.index;
  showLessonFeedback(correctAnswer);
  document.getElementById('lessonContinue').focus();
}
function advanceLesson() {
  if (!lessonState || lessonState.finished || (lessonState.phase === 'practice' && lessonState.answered === null)) return;
  lessonState.index++;
  if (lessonState.phase === 'learn' && lessonState.index === 6) {
    lessonState.phase = 'practice'; lessonState.index = 0;
  } else if (lessonState.phase === 'practice' && lessonState.index >= lessonState.queue.length) {
    lessonState.finished = true;
    lessonItems(lessonState.unit).forEach((item,i) => reviewItem(item.type, item.id, lessonState.mistakes.includes(i) ? 'hard' : 'good'));
    bumpReviewCount(lessonItems(lessonState.unit).length);
    recordActivity();
    updateDueBadge();
  }
  lessonState.answered = null;
  saveLesson();
  renderLesson();
  document.getElementById('lessonStage').focus({preventScroll:true});
  document.getElementById('lessonHost').scrollIntoView({block:'start', behavior:'instant'});
}
