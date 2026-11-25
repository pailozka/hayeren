// Original practice situations inspired by Sakayan's dialogue-first approach.
const dialogues = [
  {
    id: 'meet', title: 'Meet someone', setting: 'A new classmate introduces herself.',
    note: 'Armenian has two ways to address someone. Use դու with friends and դուք for polite address or when speaking to more than one person.',
    turns: [
      { arm: 'Բարև ձեզ։ Ես Անին եմ։', rom: 'Barev dzez. Yes Anin em.', eng: 'Hello. I’m Ani.',
        cue: 'Greet Ani politely.', reply: ['Բարև', 'ձեզ'], extra: 'ես', romReply: 'Barev dzez.' },
      { arm: 'Ի՞նչ է ձեր անունը։', rom: 'Inch e dzer anunə?', eng: 'What is your name?',
        cue: 'Say “My name is Aram.”', reply: ['Անունս', 'Արամ', 'է'], extra: 'եք', romReply: 'Anunəs Aram e.' },
    ],
  },
  {
    id: 'cafe', title: 'Order at a café', setting: 'A server comes to your table.',
    note: 'Place խնդրեմ after the thing you want to make a short, polite request.',
    turns: [
      { arm: 'Ի՞նչ եք ուզում։', rom: 'Inch ek’ uzum?', eng: 'What would you like?',
        cue: 'Ask for water politely.', reply: ['Ջուր', 'խնդրեմ'], extra: 'սուրճ', romReply: 'Jur, khndrem.', comma: true },
      { arm: 'Ուրի՞շ բան։', rom: 'Urish ban?', eng: 'Anything else?',
        cue: 'Say “The bill, please.”', reply: ['Հաշիվը', 'խնդրեմ'], extra: 'ջուր', romReply: 'Hashivə, khndrem.', comma: true },
    ],
  },
  {
    id: 'repeat', title: 'Ask someone to repeat', setting: 'You are practicing Armenian with a new acquaintance.',
    note: 'Կարո՞ղ եք is a polite way to start a request, like “Could you …?” in English.',
    turns: [
      { arm: 'Հայերեն խոսո՞ւմ եք։', rom: 'Hayeren khosum ek’?', eng: 'Do you speak Armenian?',
        cue: 'Say “I don’t understand.”', reply: ['Չեմ', 'հասկանում'], extra: 'լավ', romReply: 'Ch’em haskanum.' },
      { arm: 'Հասկանո՞ւմ եք։', rom: 'Haskanum ek’?', eng: 'Do you understand?',
        cue: 'Politely ask “Could you repeat?”', reply: ['Կարո՞ղ', 'եք', 'կրկնել'], extra: 'խոսել', romReply: 'Karogh ek’ krknel?', question: true },
    ],
  },
];

const dialogueProgressKey = 'hayeren_dialogueCompletion';
const dialogueDraftKey = 'hayeren_dialogueDrafts';
let completedDialogues;
try {
  completedDialogues = new Set(JSON.parse(localStorage.getItem(dialogueProgressKey)));
} catch {
  completedDialogues = new Set();
}
let activeDialogue = null;
let dialogueTurn = 0;
let dialogueSelection = [];
let dialogueChecked = false;

function loadDialogueDrafts() {
  try {
    return JSON.parse(localStorage.getItem(dialogueDraftKey)) || {};
  } catch {
    return {};
  }
}

function saveDialogueDraft() {
  const drafts = loadDialogueDrafts();
  if (dialogueTurn >= activeDialogue.turns.length || (dialogueTurn === 0 && !dialogueSelection.length)) {
    delete drafts[activeDialogue.id];
  } else {
    drafts[activeDialogue.id] = { turn: dialogueTurn, selection: dialogueSelection, checked: dialogueChecked };
  }
  localStorage.setItem(dialogueDraftKey, JSON.stringify(drafts));
}

function openDialogue(id, restart = false) {
  activeDialogue = dialogues.find(dialogue => dialogue.id === id) || null;
  const draft = !restart && activeDialogue ? loadDialogueDrafts()[id] : null;
  const turn = Number.isInteger(draft?.turn) && activeDialogue.turns[draft.turn] ? draft.turn : 0;
  dialogueTurn = turn;
  dialogueSelection = Array.isArray(draft?.selection)
    ? [...new Set(draft.selection)].filter(index => Number.isInteger(index) &&
      index >= 0 && index <= activeDialogue.turns[turn].reply.length)
    : [];
  dialogueChecked = draft?.checked === true;
  if (restart && activeDialogue) saveDialogueDraft();
  showPanel('dialogue');
  document.getElementById('dialogueHeading').focus({ preventScroll: true });
  document.getElementById('dialogueHost').scrollIntoView({ block: 'start', behavior: 'instant' });
}

function renderDialogue() {
  const host = document.getElementById('dialogueHost');
  if (!activeDialogue) {
    const drafts = loadDialogueDrafts();
    host.innerHTML = `<h1 id="dialogueHeading" tabindex="-1">Conversation practice</h1>
      <p>Read what the other person says, then build your reply in Armenian.</p>
      <div class="dialogue-list">${dialogues.map(dialogue => `
        <button class="lesson-option" onclick="openDialogue('${dialogue.id}')">
          <strong>${dialogue.title}</strong><span>${drafts[dialogue.id] ? 'Continue where you left off' : completedDialogues.has(dialogue.id) ? '✓ Completed · Practice again' : dialogue.setting}</span>
        </button>`).join('')}</div>`;
    return;
  }

  const turn = activeDialogue.turns[dialogueTurn];
  host.innerHTML = `<div class="dialogue-toolbar">
      <button class="ctrl-btn" onclick="openDialogue()">← All conversations</button>
      ${turn && (dialogueTurn || dialogueSelection.length) ? `<button class="ctrl-btn" onclick="openDialogue('${activeDialogue.id}', true)">Restart</button>` : ''}
    </div>
    <h1 id="dialogueHeading" tabindex="-1">${activeDialogue.title}</h1>
    <p>${activeDialogue.setting}</p>
    <details class="dialogue-note"><summary>Language tip</summary><p>${activeDialogue.note}</p></details>`;

  if (!turn) {
    host.insertAdjacentHTML('beforeend', `<p role="status">✓ Conversation complete.</p>
      <button class="lesson-primary" onclick="openDialogue()">Choose a conversation →</button>`);
    return;
  }

  const tiles = [...turn.reply].reverse();
  tiles.splice(dialogueTurn, 0, turn.extra);
  host.insertAdjacentHTML('beforeend', `<div class="lesson-stage dialogue-stage">
    <p class="lesson-eyebrow">Reply ${dialogueTurn + 1} of ${activeDialogue.turns.length}</p>
    <p class="dialogue-line" lang="hy">${turn.arm}</p>
    <details><summary>Show translation and pronunciation</summary><p>${turn.eng}<br>${turn.rom}</p></details>
    <h2>${turn.cue}</h2>
    <div class="dialogue-tiles" id="dialogueTiles" aria-label="Word choices">
      ${tiles.map((word, index) => `<button type="button" class="ctrl-btn" lang="hy" data-tile="${index}" aria-pressed="false">${word}</button>`).join('')}
    </div>
    <p class="dialogue-selection" id="dialogueSelection" aria-live="polite"></p>
    <div class="dialogue-actions">
      <button class="lesson-primary" id="dialogueCheck">Check reply</button>
      <button class="ctrl-btn" id="dialogueUndo">Undo last word</button>
    </div>
    <p role="status" id="dialogueFeedback"></p>
    <button class="lesson-primary" id="dialogueNext" hidden>Continue →</button>
  </div>`);

  const tileButtons = [...host.querySelectorAll('[data-tile]')];
  const selection = host.querySelector('#dialogueSelection');
  const feedback = host.querySelector('#dialogueFeedback');
  const check = host.querySelector('#dialogueCheck');
  const undo = host.querySelector('#dialogueUndo');
  const next = host.querySelector('#dialogueNext');

  function refresh() {
    tileButtons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(dialogueSelection.includes(index)));
      button.disabled = dialogueChecked || dialogueSelection.includes(index);
    });
    selection.textContent = dialogueSelection.map(index => tiles[index]).join(' ') || 'Choose words in order.';
    selection.lang = dialogueSelection.length ? 'hy' : 'en';
    check.disabled = dialogueChecked || !dialogueSelection.length;
    undo.disabled = dialogueChecked || !dialogueSelection.length;
    next.hidden = !dialogueChecked;
    if (dialogueChecked) {
      const reply = turn.reply.join(turn.comma ? ', ' : ' ') + (turn.question ? '' : '։');
      feedback.innerHTML = `✓ <span lang="hy">${reply}</span> · ${turn.romReply}`;
    }
  }

  tileButtons.forEach((button, index) => {
    button.onclick = () => {
      dialogueSelection.push(index);
      saveDialogueDraft();
      feedback.textContent = '';
      refresh();
      (tileButtons.slice(index + 1).find(tile => !tile.disabled) ||
        tileButtons.find(tile => !tile.disabled) || check).focus();
    };
  });
  undo.onclick = () => {
    const removed = dialogueSelection.pop();
    saveDialogueDraft();
    feedback.textContent = '';
    refresh();
    tileButtons[removed].focus();
  };
  check.onclick = () => {
    const correct = dialogueSelection.length === turn.reply.length &&
      turn.reply.every((word, index) => tiles[dialogueSelection[index]] === word);
    if (!correct) {
      feedback.textContent = 'Try again. Check the meaning and word order, then rebuild your reply.';
      dialogueSelection = [];
      saveDialogueDraft();
      refresh();
      tileButtons[0].focus();
      return;
    }
    dialogueChecked = true;
    saveDialogueDraft();
    refresh();
    next.focus();
  };
  next.onclick = () => {
    dialogueTurn++;
    dialogueSelection = [];
    dialogueChecked = false;
    saveDialogueDraft();
    if (dialogueTurn === activeDialogue.turns.length) {
      completedDialogues.add(activeDialogue.id);
      localStorage.setItem(dialogueProgressKey, JSON.stringify([...completedDialogues]));
      recordActivity();
    }
    renderDialogue();
    document.getElementById('dialogueHeading').focus();
  };
  refresh();
}
