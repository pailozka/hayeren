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

function openDialogue(id) {
  activeDialogue = dialogues.find(dialogue => dialogue.id === id) || null;
  dialogueTurn = 0;
  dialogueSelection = [];
  dialogueChecked = false;
  showPanel('dialogue');
  document.getElementById('dialogueHeading').focus({ preventScroll: true });
  document.getElementById('dialogueHost').scrollIntoView({ block: 'start', behavior: 'instant' });
}

function renderDialogue() {
  const host = document.getElementById('dialogueHost');
  if (!activeDialogue) {
    host.innerHTML = `<h1 id="dialogueHeading" tabindex="-1">Conversation practice</h1>
      <p>Read what the other person says, then build your reply in Armenian.</p>
      <div class="dialogue-list">${dialogues.map(dialogue => `
        <button class="lesson-option" onclick="openDialogue('${dialogue.id}')">
          <strong>${dialogue.title}</strong><span>${completedDialogues.has(dialogue.id) ? '✓ Completed · Practice again' : dialogue.setting}</span>
        </button>`).join('')}</div>`;
    return;
  }

  const turn = activeDialogue.turns[dialogueTurn];
  host.innerHTML = `<button class="ctrl-btn" onclick="openDialogue()">← All conversations</button>
    <h1 id="dialogueHeading" tabindex="-1">${activeDialogue.title}</h1>
    <p>${activeDialogue.setting}</p>
    <p class="dialogue-note">${activeDialogue.note}</p>`;

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
      feedback.textContent = '';
      refresh();
      (tileButtons.slice(index + 1).find(tile => !tile.disabled) ||
        tileButtons.find(tile => !tile.disabled) || check).focus();
    };
  });
  undo.onclick = () => {
    const removed = dialogueSelection.pop();
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
      refresh();
      tileButtons[0].focus();
      return;
    }
    dialogueChecked = true;
    refresh();
    next.focus();
  };
  next.onclick = () => {
    dialogueTurn++;
    dialogueSelection = [];
    dialogueChecked = false;
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
