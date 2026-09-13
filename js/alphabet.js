// ===== ALPHABET MODULE =====

let learnedLetters = loadLearnedLetters();

function buildAlphabet() {
  const grid = document.getElementById('letterGrid');
  if (!grid) return;
  grid.innerHTML = '';
  letters.forEach((l, i) => {
    const card = document.createElement('div');
    card.className = 'letter-card' + (learnedLetters.has(i) ? ' learned' : '');
    card.innerHTML = `
      ${learnedLetters.has(i) ? '<div class="learned-dot"></div>' : ''}
      <div class="armenian-char">${l.arm}</div>
      <div class="latin-trans">${l.sound}</div>
      <div class="letter-name">${l.name}</div>
    `;
    card.onclick = () => showLetterDetail(i, card);
    grid.appendChild(card);
  });
}

function showLetterDetail(idx, cardEl) {
  document.querySelectorAll('.letter-card').forEach(c => c.classList.remove('active-card'));
  cardEl.classList.add('active-card');
  const l = letters[idx];
  const detail = document.getElementById('letterDetail');
  detail.className = 'letter-detail visible';
  detail.innerHTML = `
    <div class="detail-glyph">
      <div class="detail-char">${l.arm}</div>
      <div class="detail-lower">${l.lower}</div>
      <div class="detail-ipa">${l.ipa}</div>
      <div class="detail-name">${l.name}</div>
      <div class="detail-speak">${speakButton(l.lower, 'Hear ' + l.name)}</div>
      <button class="mark-btn" onclick="toggleLearned(${idx})">${learnedLetters.has(idx) ? '✓ Learned' : 'Mark as Learned'}</button>
    </div>
    <div class="detail-info">
      <h3>${l.name} — "${l.sound}"</h3>
      <p>${l.desc}</p>
      <h4 class="detail-subhead">Pronunciation</h4>
      <p class="detail-ipa-line">IPA <span>${l.ipa}</span></p>
    </div>
    <div class="detail-words">
      <h4>Example Words</h4>
      ${l.words.map(w => `<div class="word-item"><div class="word-arm">${w.arm} ${speakButton(w.arm, 'Hear ' + w.eng)}</div><div class="word-eng">${w.eng}</div></div>`).join('')}
    </div>
  `;
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleLearned(idx) {
  if (learnedLetters.has(idx)) {
    learnedLetters.delete(idx);
  } else {
    learnedLetters.add(idx);
    recordActivity();
    updateStreakDisplay();
    buildWeekDots();
  }
  saveLearnedLetters(learnedLetters);
  buildAlphabet();
  const cards = document.querySelectorAll('.letter-card');
  showLetterDetail(idx, cards[idx]);
}
