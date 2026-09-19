// ===== ALPHABET MODULE =====
// learnedLetters is a Set of letter `id` slugs (e.g. "ayb", "khe") — see the
// migration note in storage.js for why this isn't the array index.

let learnedLetters = loadLearnedLetters();
let _alphaAudio = null; // one shared <audio>, so playback never overlaps

function playLetterAudio(l, btnEl) {
  if (!_alphaAudio) _alphaAudio = new Audio();
  if (btnEl) {
    document.querySelectorAll('.letter-audio-btn.playing').forEach(b => b.classList.remove('playing'));
    btnEl.classList.add('playing');
    _alphaAudio.onended = () => btnEl.classList.remove('playing');
  }
  _alphaAudio.src = l.audio;
  _alphaAudio.play().catch(() => {}); // autoplay-policy or missing file — fail silently
}

function buildAlphabet() {
  const grid = document.getElementById('letterGrid');
  if (!grid) return;
  grid.innerHTML = '';
  letters.forEach(l => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'letter-card' + (learnedLetters.has(l.id) ? ' learned' : '');
    card.setAttribute('aria-pressed', learnedLetters.has(l.id) ? 'true' : 'false');
    card.innerHTML = `
      ${learnedLetters.has(l.id) ? '<div class="learned-dot"></div>' : ''}
      <button type="button" class="letter-audio-btn card-audio-btn" aria-label="Play pronunciation of ${l.name}">🔊</button>
      <img class="letter-card-art" src="${l.img}" alt="Illuminated bird-letter for ${l.arm}" loading="lazy">
      <div class="latin-trans">${l.sound}</div>
      <div class="letter-name">${l.name}</div>
    `;
    card.onclick = () => showLetterDetail(l.id, card);
    card.querySelector('.card-audio-btn').onclick = (e) => {
      e.stopPropagation();
      playLetterAudio(l, e.currentTarget);
    };
    grid.appendChild(card);
  });
}

function showLetterDetail(id, cardEl) {
  document.querySelectorAll('.letter-card').forEach(c => {
    c.classList.remove('active-card');
    c.setAttribute('aria-pressed', c.classList.contains('learned') ? 'true' : 'false');
  });
  if (cardEl) cardEl.classList.add('active-card');
  const l = letters.find(x => x.id === id);
  if (!l) return;
  const detail = document.getElementById('letterDetail');
  detail.className = 'letter-detail visible';
  detail.innerHTML = `
    <div class="detail-glyph">
      <img class="detail-art" src="${l.img}" alt="Illuminated bird-letter for ${l.arm}">
      <div class="detail-char">${l.arm}${l.lower}</div>
      <button type="button" class="letter-audio-btn detail-audio-btn" aria-label="Play pronunciation of ${l.name}">🔊 ${l.armName}</button>
      <div class="detail-ipa">${l.ipa}</div>
      <div class="detail-name">${l.name}</div>
      <button class="mark-btn" onclick="toggleLearned('${l.id}')">${learnedLetters.has(l.id) ? '✓ Learned' : 'Mark as Learned'}</button>
    </div>
    <div class="detail-info">
      <h3>${l.name} — "${l.sound}"</h3>
      <p>${l.desc}</p>
      <h4 class="detail-subhead">Pronunciation</h4>
      <p class="detail-ipa-line">IPA <span>${l.ipa}</span></p>
    </div>
    <div class="detail-words">
      <h4>Example Words</h4>
      ${l.words.map(w => `<div class="word-item"><div class="word-arm">${w.arm}</div><div class="word-eng">${w.eng}</div></div>`).join('')}
    </div>
  `;
  detail.querySelector('.detail-audio-btn').onclick = (e) => playLetterAudio(l, e.currentTarget);
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleLearned(id) {
  if (learnedLetters.has(id)) {
    learnedLetters.delete(id);
  } else {
    learnedLetters.add(id);
    recordActivity();
  }
  saveLearnedLetters(learnedLetters);
  buildAlphabet();
  const cards = document.querySelectorAll('.letter-card');
  const idx = letters.findIndex(l => l.id === id);
  showLetterDetail(id, cards[idx]);
}
