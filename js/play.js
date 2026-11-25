// ===== PLAY =====
// Short games on letters and words. They favour material already studied and
// never change the review schedule: a game is practice, not a memory rating.

const vocabIconSvg = id => vocabIcons[id]
  ? `<svg class="word-picture" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${vocabIcons[id]}</svg>`
  : '';
const shuffled = list => list.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

// ու is one letter of the alphabet, so it gets one tile.
const spellingLetters = word => word.toLowerCase().replace(/եւ/g, 'և').match(/ու|և|./g);

// Tap a tile on the left, then its partner on the right.
// Calls onDone(number of wrong attempts) once every pair is found.
function mountMatch(host, items, onDone) {
  const left = shuffled(items);
  let right = shuffled(items);
  // Partners must not all sit side by side.
  if (right.every((item, i) => item === left[i])) right = [...right.slice(1), right[0]];
  const tile = (item, side) => `<button class="match-tile" data-side="${side}" data-id="${item.id}" aria-pressed="false" ${side === 'arm' ? 'lang="hy"' : ''}>${side === 'arm' ? item.arm : lessonEscape(lessonAnswer(item, false))}</button>`;
  host.innerHTML = `<div class="match-board">
    <div>${left.map(i => tile(i, 'arm')).join('')}</div><div>${right.map(i => tile(i, 'eng')).join('')}</div>
  </div><p class="game-status" role="status"></p>`;
  const status = host.querySelector('[role=status]');
  let picked = null, found = 0, misses = 0;
  const missedItems = new Map();
  host.querySelectorAll('.match-tile').forEach(button => button.onclick = () => {
    host.querySelectorAll('.wrong').forEach(b => b.classList.remove('wrong'));
    const item = items.find(i => i.id === button.dataset.id);
    if (button.dataset.side === 'arm' && item.audio) playLetterAudio(item);
    if (!picked || picked.dataset.side === button.dataset.side) {
      const same = picked === button;
      picked?.setAttribute('aria-pressed', 'false');
      picked = same ? null : button;
      picked?.setAttribute('aria-pressed', 'true');
      return;
    }
    const first = picked;
    picked = null;
    first.setAttribute('aria-pressed', 'false');
    if (first.dataset.id === button.dataset.id) {
      [first, button].forEach(b => { b.classList.add('found'); b.disabled = true; });
      found++;
      status.textContent = `${item.arm} is ${lessonAnswer(item, false)}.`;
      if (found === items.length) onDone(misses, [...missedItems.values()]);
      else host.querySelector(`.match-tile[data-side="${first.dataset.side}"]:not(:disabled)`)?.focus({ preventScroll: true });
    } else {
      misses++;
      [first, button].forEach(b => {
        const missedItem = items.find(i => i.id === b.dataset.id);
        if (missedItem) missedItems.set(missedItem.id, missedItem);
      });
      [first, button].forEach(b => b.classList.add('wrong'));
      const arm = items.find(i => i.id === (first.dataset.side === 'arm' ? first : button).dataset.id);
      status.textContent = `Not a pair. ${arm.arm} has a different partner.`;
    }
  });
}

const GAMES = {
  match:  { title: 'Find the pairs', note: 'Match each Armenian tile with its sound or meaning.', rounds: 3 },
  spell:  { title: 'Build the word', note: 'Tap letters in order. Each one says its name.', rounds: 5 },
  listen: { title: 'Catch the letter', note: 'Hear a letter’s name and find the right shape.', rounds: 6 },
};
let game = null;

// Studied items first, topped up from the start of the course.
function playPool(type, usable, size) {
  const all = (type === 'letter' ? letters : vocabulary).map(i => ({ ...i, type })).filter(usable);
  const srs = loadSrsData();
  const known = shuffled(all.filter(i => srs[srsKey(type, i.id)]));
  const fresh = shuffled(all.filter(i => !srs[srsKey(type, i.id)]).slice(0, Math.max(size, 8)));
  return known.concat(fresh).slice(0, size);
}

function startGame(name) {
  const config = GAMES[name];
  let tasks;
  if (name === 'match') {
    const l = playPool('letter', () => true, 8), w = playPool('word', () => true, 4);
    tasks = [l.slice(0, 4), w, l.slice(4)];
  } else if (name === 'spell') {
    tasks = playPool('word', i => /^[Ա-Ֆա-և]{3,7}$/.test(i.arm), config.rounds);
  } else {
    tasks = playPool('letter', i => i.audio, config.rounds);
  }
  game = { name, tasks, index: 0, clean: 0, skipped: 0, attempted: 0, taskFinished: false, missed: [] };
  renderPlay(true);
}

function renderPlay(force = false) {
  const host = document.getElementById('playHost');
  // Keep an active board and its click handlers when the learner visits another tab.
  if (game && !force && host.querySelector('#gameStage')) return;
  if (!game) {
    host.innerHTML = `<h1 id="playHeading" tabindex="-1">Play</h1><p>Two minutes each. Games use what you’ve studied and don’t change your review dates.</p>
      <div class="game-list">${Object.entries(GAMES).map(([name, g]) => `<button class="game-card game-${name}" onclick="startGame('${name}')">
        <span class="game-sign" aria-hidden="true" lang="hy">${{ match: 'Ա<i>a</i>', spell: 'բ ա ռ', listen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9zM16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/></svg>' }[name]}</span>
        <span class="game-title">${g.title}</span><span>${g.note}</span></button>`).join('')}</div>`;
    return;
  }
  const g = GAMES[game.name];
  const done = game.index >= game.tasks.length;
  host.innerHTML = `<div class="lesson-toolbar"><button class="ctrl-btn" onclick="leaveGame()">Leave game</button><span>${g.title}</span></div>
    <progress class="lesson-progress" max="${game.tasks.length}" value="${game.index}" aria-label="Game progress"></progress>
    <div class="lesson-stage" id="gameStage" tabindex="-1"></div>
    <div class="game-actions"><button class="lesson-primary" id="gameNext" hidden>Continue</button></div>`;
  const stage = document.getElementById('gameStage');
  if (done) {
    const perfect = game.clean === game.tasks.length;
    const missed = [...new Map(game.missed.map(i => [i.id, i])).values()];
    stage.innerHTML = `<h1>${perfect ? 'Շա՜տ լավ! Very good!' : 'Round finished'}</h1>
      <p>${game.clean} of ${game.tasks.length} without a miss.${game.skipped ? ` ${game.skipped} skipped.` : ''}</p>
      ${missed.length ? `<h2>Look at these once more</h2><ul class="missed-list">${missed.map(i => `<li><b lang="hy">${i.arm}</b> ${lessonEscape(i.type === 'letter' ? `${i.name}, ${i.sound}` : i.eng)}</li>`).join('')}</ul>` : ''}
      <div class="lesson-summary-actions"><button class="lesson-primary" onclick="startGame('${game.name}')">Play again</button><button class="ctrl-btn" onclick="leaveGame()">Choose another game</button></div>`;
  } else {
    ({ match: renderMatchGame, spell: renderSpellGame, listen: renderListenGame })[game.name](stage, game.tasks[game.index]);
  }
  stage.focus({ preventScroll: true });
  host.scrollIntoView({ block: 'start', behavior: 'instant' });
}

function leaveGame() { game = null; stopLetterAudio(); renderPlay(); document.getElementById('playHeading').focus(); }

function finishTask(missed, missedItems = [], skipped = false) {
  if (!game || game.taskFinished) return;
  game.taskFinished = true;
  if (skipped) game.skipped++;
  else {
    game.attempted++;
    if (!missed) game.clean++;
  }
  game.missed.push(...missedItems);
  document.querySelectorAll('#gameStage .listen-options button').forEach(button => { button.disabled = true; });
  const skipButton = document.getElementById('listenSkip');
  if (skipButton) skipButton.hidden = true;
  if (game.index === game.tasks.length - 1 && game.attempted > 0) recordActivity();
  const next = document.getElementById('gameNext');
  next.hidden = false;
  next.textContent = game.index === game.tasks.length - 1 ? 'See how you did' : 'Continue';
  next.onclick = () => {
    game.index++;
    game.taskFinished = false;
    renderPlay(true);
  };
  next.focus();
}

function renderMatchGame(stage, items) {
  stage.innerHTML = `<h1>Find the pairs</h1><div id="matchHost"></div>`;
  mountMatch(document.getElementById('matchHost'), items, (misses, missedItems) => finishTask(misses, missedItems));
}

function renderSpellGame(stage, word) {
  const target = spellingLetters(word.arm);
  let tiles = shuffled(target);
  if (tiles.join('') === target.join('')) tiles = tiles.reverse();
  stage.innerHTML = `<h1>${lessonEscape(word.eng)}</h1>${vocabIconSvg(word.id)}
    <p class="lesson-romanization">${lessonEscape(word.romanized)}</p>
    <div class="spell-slots" lang="hy" aria-label="Your word">${target.map(() => '<span></span>').join('')}</div>
    <div class="spell-tiles" lang="hy">${tiles.map(c => `<button class="spell-tile">${c}</button>`).join('')}</div>
    <p class="game-status" role="status"></p>`;
  const slots = stage.querySelectorAll('.spell-slots span');
  const buttons = [...stage.querySelectorAll('.spell-tile')];
  const status = stage.querySelector('[role=status]');
  let at = 0, missed = 0, slotMisses = 0;
  buttons.forEach(button => button.onclick = () => {
    buttons.forEach(b => b.classList.remove('wrong', 'hint'));
    const letter = letters.find(l => l.lower === button.textContent);
    if (button.textContent !== target[at]) {
      missed++; slotMisses++;
      button.classList.add('wrong');
      status.textContent = `${button.textContent} is not next.`;
      if (slotMisses > 1) {
        buttons.find(b => !b.disabled && b.textContent === target[at]).classList.add('hint');
        status.textContent += ` Try ${target[at]}.`;
      }
      return;
    }
    if (letter?.audio) playLetterAudio(letter);
    slots[at++].textContent = button.textContent;
    button.disabled = true;
    slotMisses = 0;
    status.textContent = letter ? `${letter.lower} is ${letter.sound}.` : '';
    if (at === target.length) {
      status.textContent = `${word.arm} means ${word.eng}.`;
      stage.querySelector('.spell-slots').classList.add('complete');
      if (missed) game.missed.push(word);
      finishTask(missed);
    } else buttons.find(b => !b.disabled)?.focus({ preventScroll: true });
  });
}

function renderListenGame(stage, letter) {
  const options = shuffled([letter, ...shuffled(letters.filter(l => l.id !== letter.id)).slice(0, 3)]);
  stage.innerHTML = `<h1>Which letter is this?</h1>
    <button class="ctrl-btn listen-btn letter-audio-btn" data-audio-status="listenAudioStatus" data-audio-error-message="Audio unavailable. Skip this unscored round or try again." data-audio-error-action="listenSkip">Play the name again</button>
    <button class="ctrl-btn" id="listenSkip" hidden>Skip this round</button>
    <div class="lesson-options listen-options" lang="hy">${options.map(o => `<button class="lesson-option">${o.arm} ${o.lower}</button>`).join('')}</div>
    <p class="game-status" id="listenAudioStatus" role="status"></p>
    <p class="game-status" id="listenStatus" role="status"></p>`;
  const audio = stage.querySelector('.listen-btn');
  const skip = stage.querySelector('#listenSkip');
  audio.onclick = () => { skip.hidden = true; playLetterAudio(letter, audio); };
  skip.onclick = skipListenRound;
  playLetterAudio(letter, audio);
  const status = document.getElementById('listenStatus');
  let missed = 0;
  stage.querySelectorAll('.lesson-option').forEach((button, i) => button.onclick = () => {
    if (options[i].id !== letter.id) {
      missed++;
      button.classList.add('incorrect');
      button.disabled = true;
      status.textContent = `That one is ${options[i].name}. Listen again.`;
      playLetterAudio(letter, audio);
      return;
    }
    button.classList.add('correct');
    stage.querySelectorAll('.lesson-option').forEach(b => { b.disabled = true; });
    status.textContent = `Yes, ${letter.name}. It sounds like ${letter.sound}.`;
    if (missed) game.missed.push({ ...letter, type: 'letter' });
    finishTask(missed);
  });
}

function skipListenRound() { finishTask(0, [], true); }
