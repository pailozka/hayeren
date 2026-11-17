// ===== DAILY PANEL =====
// Renders the guided program from curriculum.js. Nothing here is per-day
// hardcoded: adding a day to the curriculum data is the whole change.

let activeDay = 1;

// ---- Day selector ----

function buildDaySelector() {
  const nav = document.getElementById('daySelector');
  if (!nav) return;
  nav.innerHTML = '';

  curriculumBlocks.forEach(block => {
    const group = document.createElement('div');
    group.className = 'day-block';

    const label = document.createElement('div');
    label.className = 'day-block-label';
    label.textContent = block.label;
    group.appendChild(label);

    const row = document.createElement('div');
    row.className = 'day-block-row';
    block.days.forEach(n => {
      const { done, total } = getDayCompletion(n);
      const btn = document.createElement('button');
      btn.className = 'day-switch-btn'
        + (n === activeDay ? ' active' : '')
        + (done === total ? ' complete' : '')
        + (done > 0 && done < total ? ' partial' : '');
      btn.textContent = n;
      btn.title = `Day ${n} — ${getDay(n).title} (${done}/${total} sessions)`;
      btn.onclick = () => switchDay(n);
      row.appendChild(btn);
    });
    group.appendChild(row);
    nav.appendChild(group);
  });
}

function switchDay(n) {
  const day = getDay(n);
  if (!day) return;
  activeDay = n;

  const heading = document.getElementById('dayHeading');
  if (heading) heading.textContent = `Day ${day.day} — ${day.title}`;
  const sub = document.getElementById('day-subtitle');
  if (sub) sub.textContent = day.subtitle;
  const meta = document.getElementById('dayMeta');
  if (meta) {
    const { done, total } = getDayCompletion(day.day);
    meta.textContent = `${day.minutes} minutes · ${done} of ${total} sessions complete`;
  }

  renderDaySessions(day);
  buildDaySelector();
  if (document.getElementById('panel-daily').classList.contains('active')) {
    document.getElementById('dayHeading').scrollIntoView({block: 'start', behavior: 'instant'});
  }
}

function renderDaySessions(day) {
  const host = document.getElementById('dayContent');
  if (!host) return;
  host.innerHTML = '';

  day.sessions.forEach((session, i) => {
    const key = 's' + (i + 1);
    const done = isSessionComplete(day.day, key);
    const block = document.createElement('div');
    block.className = 'session-block' + (done ? ' completed' : '');
    block.id = `sb-${day.day}-${key}`;

    block.innerHTML = `
      <button type="button" class="session-header" aria-expanded="${i === 0}" aria-controls="body-${day.day}-${key}">
        <span class="session-header-left">
          <span class="session-tag">${session.tag}</span>
          <span class="session-meta">${session.when} · ${session.min} min</span>
          <span class="session-title-main">${session.title}</span>
        </span>
        <span class="session-header-right">
          <span class="session-done-badge${done ? ' visible' : ''}">✓ Done</span>
          <span class="session-chevron${i === 0 ? ' open' : ''}">▼</span>
        </span>
      </button>
      <div id="body-${day.day}-${key}" class="session-body${i === 0 ? ' open' : ''}">
        <div class="session-body-inner">
          ${renderSessionContent(session)}
          <button class="complete-btn" ${done ? 'disabled' : ''}>
            ${done ? '✓ Completed' : 'Mark Session Complete'}
          </button>
        </div>
      </div>
    `;

    block.querySelector('.session-header').onclick = () => {
      toggleSessionBody(block.querySelector('.session-body'));
      const open = block.querySelector('.session-body').classList.contains('open');
      block.querySelector('.session-header').setAttribute('aria-expanded', String(open));
      block.querySelector('.session-body').inert = !open;
      block.querySelector('.session-chevron').classList.toggle('open', open);
    };

    const btn = block.querySelector('.complete-btn');
    if (!done) btn.onclick = () => completeSession(day.day, key, btn, session);

    host.appendChild(block);

    // The panel open by default on load needs no animation, so release its
    // max-height straight to 'none' rather than a measured pixel value that
    // would clip any later in-panel expansion (a revealed recall answer, etc).
    const body = block.querySelector('.session-body');
    body.inert = !body.classList.contains('open');
    if (body.classList.contains('open')) body.style.maxHeight = 'none';
  });
}

// Keep expanded sections at natural height, including with reduced motion.
function toggleSessionBody(body) {
  const opening = !body.classList.contains('open');
  body.classList.toggle('open', opening);
  // Natural height stays correct when answers expand, fonts load or the
  // viewport changes. No delayed callbacks can race rapid toggles.
  body.style.maxHeight = opening ? 'none' : '0px';
}

function completeSession(dayNum, key, btn, session) {
  markSessionComplete(dayNum, key);
  btn.textContent = '✓ Completed';
  btn.disabled = true;
  const block = document.getElementById(`sb-${dayNum}-${key}`);
  if (block) {
    block.classList.add('completed');
    block.querySelector('.session-done-badge').classList.add('visible');
  }

  // Completing a phrase session is the only way phrases enter the SRS queue —
  // there's no separate phrase quiz/flashcard deck to seed them otherwise.
  if (session && session.kind === 'phrases') {
    phrases.filter(p => p.category === session.phraseCategory).slice(0, 6)
      .forEach(p => reviewItem('phrase', p.id, 'good'));
  }

  recordActivity();
  buildDaySelector();

  const meta = document.getElementById('dayMeta');
  if (meta) {
    const day = getDay(dayNum);
    const { done, total } = getDayCompletion(dayNum);
    meta.textContent = `${day.minutes} minutes · ${done} of ${total} sessions complete`;
  }
  if (typeof renderCalendar === 'function') renderCalendar();
}

// ---- Session content renderers, by `kind` ----

function renderSessionContent(s) {
  switch (s.kind) {
    case 'letters': return renderLettersSession(s);
    case 'trace':   return renderTraceSession(s);
    case 'recall':  return renderRecallSession(s);
    case 'words':   return renderWordsSession(s);
    case 'phrases': return renderPhrasesSession(s);
    case 'grammar': return renderGrammarSession(s);
    case 'drill':   return renderDrillSession(s);
    case 'reading': return renderReadingSession(s);
    default:        return '';
  }
}

function renderLettersSession(s) {
  return `<div class="study-grid">` + s.letterIdx.map(i => {
    const l = letters[i];
    return `
      <div class="study-letter">
        <div class="study-letter-char">${l.arm} <span>${l.lower}</span></div>
        <div class="study-letter-name">${l.name} — "${l.sound}"</div>
        <div class="study-letter-ipa">${l.ipa}</div>
        <p class="study-letter-desc">${l.desc}</p>
        <div class="study-letter-words">
          ${l.words.map(w => `<span>${w.arm} <em>${w.eng}</em></span>`).join('')}
        </div>
      </div>`;
  }).join('') + `</div>`;
}

function renderTraceSession(s) {
  return `
    <p class="session-intro">Write each letter ten times — upper and lower case. Say the sound aloud as you write it; the motor memory and the sound need to bind together.</p>
    <div class="trace-row">
      ${s.letterIdx.map(i => `
        <div class="trace-cell">
          <div class="trace-glyph">${letters[i].arm}</div>
          <div class="trace-glyph lower">${letters[i].lower}</div>
          <div class="trace-name">${letters[i].name}</div>
        </div>`).join('')}
    </div>`;
}

function renderRecallSession(s) {
  return `
    <p class="session-intro">Cover the answers. Work through each prompt out loud before revealing.</p>
    <div class="recall-list">
      ${s.items.map(it => `
        <div class="recall-item" role="button" tabindex="0" aria-expanded="false" onclick="toggleStudyAnswer(this)" onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.click(); }">
          <div class="recall-q">${it.q}</div>
          <div class="recall-ans">${it.a}</div>
        </div>`).join('')}
    </div>
    <p class="session-hint">Tap any row to reveal.</p>`;
}

function renderWordsSession(s) {
  return `
    <p class="session-intro">Read each word aloud, letter by letter, then at normal speed.</p>
    <div class="word-practice">
      ${s.wordIds.map(id => {
        const w = getWord(id);
        if (!w) return '';
        return `
          <div class="word-practice-item">
            <div class="wp-arm">${w.arm}</div>
            <div class="wp-rom">${w.romanized}</div>
            <div class="wp-eng">${w.eng}</div>
          </div>`;
      }).join('')}
    </div>`;
}

function renderPhrasesSession(s) {
  const list = phrases.filter(p => p.category === s.phraseCategory).slice(0, 6);
  return `
    <p class="session-intro">Say each phrase aloud three times. Aim for rhythm, not perfection.</p>
    <div class="phrase-practice">
      ${list.map(p => `
        <div class="phrase-practice-item">
          <div class="pp-arm">${p.arm}</div>
          <div class="pp-rom">${p.romanized}</div>
          <div class="pp-eng">${p.eng}</div>
          ${p.usage ? `<div class="pp-usage">${p.usage}</div>` : ''}
        </div>`).join('')}
    </div>`;
}

function renderGrammarSession(s) {
  const g = getGrammarNote(s.grammarId);
  if (!g) return '';
  return `
    <div class="grammar-note">
      <div class="grammar-summary">${g.summary}</div>
      <p class="grammar-body">${g.body}</p>
      <div class="table-scroll">
        <table class="grammar-table">
          <thead><tr>${g.table.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${g.table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="grammar-examples">
        ${g.examples.map(e => `
          <div class="grammar-example">
            <div class="ge-arm">${e.arm}</div>
            <div class="ge-rom">${e.rom}</div>
            <div class="ge-eng">${e.eng}</div>
          </div>`).join('')}
      </div>
      ${g.tip ? `<div class="grammar-tip"><strong>Note</strong> ${g.tip}</div>` : ''}
    </div>`;
}

function renderReadingSession(s) {
  return `
    <p class="session-intro">Read each line aloud twice: once slowly, decoding each letter, then once at speaking pace. Only check the English after you have attempted it.</p>
    <div class="reading-lines">
      ${s.lines.map(l => `
        <div class="reading-line" role="button" tabindex="0" aria-expanded="false" onclick="toggleStudyAnswer(this)" onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.click(); }">
          <div class="rl-arm">${l.arm}</div>
          <div class="rl-rom">${l.rom}</div>
          <div class="rl-eng">${l.eng}</div>
        </div>`).join('')}
    </div>
    <p class="session-hint">Tap a line to reveal the translation.</p>`;
}

function renderDrillSession(s) {
  const d = s.drill;
  const isLetters = d.mode === 'letters';
  const label = isLetters
    ? `letters 1–${d.upTo}`
    : (d.category === 'all' ? 'all vocabulary' : `the ${d.category} set`);

  return `
    <p class="session-intro">Drill ${label} until you can answer without hesitating. Use the Quiz for recognition and Flashcards for recall.</p>
    <div class="drill-actions">
      <button class="mark-btn" onclick="startDrillQuiz('${d.mode}', '${d.category || ''}', '${d.direction || 'toSound'}', ${d.upTo || 'null'})">
        Open Quiz
      </button>
      <button class="mark-btn secondary" onclick="startDrillFlashcards('${d.mode}', '${d.category || ''}', ${d.upTo || 'null'})">
        Open Flashcards
      </button>
    </div>`;
}

// Hand-off from a Daily drill into the Quiz / Flashcards tabs. `upTo` scopes
// a letters drill to the letters taught by this point in the curriculum —
// without it, Day 1's "drill letters 1-4" would quietly quiz all 39.
function startDrillQuiz(mode, category, direction, upTo) {
  showPanel('quiz', document.querySelector('.tab-btn[data-panel="quiz"]'));
  if (mode === 'letters') {
    setQuizMode('letters', upTo);
    if (direction) setQuizDirection(direction);
  } else {
    setQuizMode('words');
    if (category && category !== 'all') {
      wordQuizCategory = category;
      initWordQuiz(category);
      buildWordQuizCats();
    }
  }
}

function startDrillFlashcards(mode, category, upTo) {
  showPanel('flashcards', document.querySelector('.tab-btn[data-panel="flashcards"]'));
  if (!_flashcardsInited) { _flashcardsInited = true; initFlashcards(); }
  setFCDeck(mode === 'letters' ? 'letters' : 'words');
  if (mode === 'letters') setFCLetterScope(upTo);
  if (mode !== 'letters' && category && category !== 'all') setFCCategory(category);
}

function initDaily() {
  activeDay = getCurrentDay();
  buildDaySelector();
  switchDay(activeDay);
}

function toggleStudyAnswer(el) {
  el.setAttribute('aria-expanded', String(el.classList.toggle('revealed')));
}
