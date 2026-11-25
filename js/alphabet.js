// ===== ALPHABET MODULE =====
// learnedLetters is a Set of letter `id` slugs (e.g. "ayb", "khe") — see the
// migration note in storage.js for why this isn't the array index.

let learnedLetters = loadLearnedLetters();
let _alphaAudio = null; // one shared <audio>, so playback never overlaps

const AUDIO_ERROR_NAMES = { 1: 'MEDIA_ERR_ABORTED', 2: 'MEDIA_ERR_NETWORK', 3: 'MEDIA_ERR_DECODE', 4: 'MEDIA_ERR_SRC_NOT_SUPPORTED' };

function flagAudioError(btnEl, label) {
  if (!btnEl?.isConnected) return;
  if (btnEl.closest('#gameStage') && typeof game !== 'undefined' && game?.taskFinished) return;
  btnEl.classList.remove('playing');
  btnEl.classList.add('audio-error');
  btnEl.title = label;
  const status = document.getElementById(btnEl.dataset.audioStatus);
  if (status) status.textContent = btnEl.dataset.audioErrorMessage || 'Audio unavailable. You can still rate this card.';
  const recoveryAction = document.getElementById(btnEl.dataset.audioErrorAction);
  if (recoveryAction) recoveryAction.hidden = false;
}

function stopLetterAudio() {
  if (!_alphaAudio) return;
  _alphaAudio.pause();
  _alphaAudio.onended = null;
  _alphaAudio.onerror = null;
  document.querySelectorAll('.letter-audio-btn.playing').forEach(
    button => button.classList.remove('playing'));
}

function playLetterAudio(l, btnEl) {
  if (!_alphaAudio) _alphaAudio = new Audio();
  // Calls from spelling/matching don't have a button; they must not inherit
  // an error handler that still points at a previous Review or Alphabet card.
  if (!btnEl) {
    _alphaAudio.onended = null;
    _alphaAudio.onerror = null;
  }
  if (btnEl) {
    document.querySelectorAll('.letter-audio-btn.playing, .letter-audio-btn.audio-error').forEach(b => {
      b.classList.remove('playing', 'audio-error');
    });
    btnEl.classList.add('playing');
    btnEl.title = '';
    const status = document.getElementById(btnEl.dataset.audioStatus);
    if (status) status.textContent = '';
    _alphaAudio.onended = () => btnEl.classList.remove('playing');

    // A 404 or unsupported file doesn't always reject play()'s promise —
    // Chromium can resolve it immediately and only report the real failure
    // later via the element's own error event. Catching only the promise
    // rejection below left exactly this case (a broken path, e.g. after a
    // deploy that lost the audio files) silently indistinguishable from
    // "no sound" — nothing to click, nothing in the console.
    _alphaAudio.onerror = () => {
      const code = _alphaAudio.error && _alphaAudio.error.code;
      const name = AUDIO_ERROR_NAMES[code] || 'unknown error';
      console.warn(`Audio failed for "${l.name}" (${l.audio}): ${name}`);
      flagAudioError(btnEl, `Couldn't load audio (${name})`);
    };
  }
  _alphaAudio.src = l.audio;
  _alphaAudio.play().catch(err => {
    // Autoplay-policy rejections (NotAllowedError) do come through here,
    // reliably and immediately — unlike the load-failure case above.
    if (err.name === 'AbortError') return;
    console.warn(`Audio failed for "${l.name}" (${l.audio}):`, err.name, err.message);
    flagAudioError(btnEl, err.name === 'NotAllowedError'
      ? 'Blocked by the browser — click again'
      : `Couldn't play audio (${err.name})`);
  });
}

function updateLetterCard(card, letter) {
  const learned = learnedLetters.has(letter.id);
  card.classList.toggle('learned', learned);
  card.querySelector('.letter-open').setAttribute('aria-label',
    `Study ${letter.name}${learned ? ', learned' : ''}`);
}

function buildAlphabet() {
  const grid = document.getElementById('letterGrid');
  const dialog = document.getElementById('letterDialog');
  dialog.onclose = stopLetterAudio;
  grid.replaceChildren();
  for (const letter of letters) {
    const card = document.createElement('div');
    card.className = 'letter-card';
    card.innerHTML = `
      <button type="button" class="letter-open" aria-haspopup="dialog">
        <img class="letter-card-art" src="${letter.img}" alt="" loading="lazy">
        <span class="card-glyph" lang="hy">${letter.arm} ${letter.lower}</span>
        <span class="latin-trans">${letter.sound}</span>
        <span class="letter-name">${letter.name}</span>
        <span class="learned-dot" aria-hidden="true">✓</span>
      </button>
      <button type="button" class="letter-audio-btn card-audio-btn" aria-label="Hear the letter name ${letter.name}">🔊</button>`;
    updateLetterCard(card, letter);
    card.querySelector('.letter-open').onclick = () => showLetterDetail(letter, card);
    card.querySelector('.card-audio-btn').onclick = event => playLetterAudio(letter, event.currentTarget);
    grid.append(card);
  }
}

function showLetterDetail(letter, card) {
  const dialog = document.getElementById('letterDialog');
  const detail = document.getElementById('letterDetail');
  document.getElementById('letterDialogTitle').textContent = letter.name;
  detail.innerHTML = `
    <div class="detail-glyph">
      <img class="detail-art" src="${letter.img}" alt="Illuminated bird-letter">
      <div class="detail-char" lang="hy">${letter.arm} ${letter.lower}</div>
      <button type="button" class="letter-audio-btn detail-audio-btn" aria-label="Hear the letter name ${letter.name}">🔊 <span lang="hy">${letter.armName}</span></button>
      <button type="button" class="mark-btn detail-learned" aria-label="Mark ${letter.name} as learned"></button>
    </div>
    <div class="detail-info">
      <h3>Sound: ${letter.sound}</h3>
      <p>${letter.desc}</p>
      <p class="detail-ipa-line">IPA <span>${letter.ipa}</span></p>
    </div>
    <div class="detail-words">
      <h3>Example words</h3>
      ${letter.words.map(word => `<div class="word-item"><div class="word-arm" lang="hy">${word.arm}</div><div class="word-eng">${word.eng}</div></div>`).join('')}
    </div>`;
  detail.querySelector('.detail-audio-btn').onclick = event => playLetterAudio(letter, event.currentTarget);
  const mark = detail.querySelector('.detail-learned');
  function updateMark() {
    const learned = learnedLetters.has(letter.id);
    mark.setAttribute('aria-pressed', String(learned));
    mark.textContent = learned ? '✓ Learned' : 'Mark as learned';
    updateLetterCard(card, letter);
  }
  updateMark();
  mark.onclick = () => {
    if (learnedLetters.has(letter.id)) {
      learnedLetters.delete(letter.id);
    } else {
      learnedLetters.add(letter.id);
      recordActivity();
    }
    saveLearnedLetters(learnedLetters);
    updateMark();
  };
  dialog.showModal();
}
