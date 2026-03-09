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
    <div style="text-align:center;">
      <div class="detail-char">${l.arm}</div>
      <div style="font-size:2rem;color:var(--text-muted);margin-top:0.25rem;">${l.lower}</div>
      <div style="font-family:'DM Mono',monospace;font-size:0.8rem;color:var(--gold);margin-top:0.5rem;">${l.ipa}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">${l.name}</div>
      <button class="mark-btn" onclick="toggleLearned(${idx})">${learnedLetters.has(idx) ? '✓ Learned' : 'Mark as Learned'}</button>
    </div>
    <div class="detail-info">
      <h3>${l.name} — "${l.sound}"</h3>
      <p>${l.desc}</p>
      <div style="margin-top:1rem;font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-dim);">Pronunciation</div>
      <p style="margin-top:0.4rem;font-size:0.85rem;color:var(--text-muted);">IPA: <span style="color:var(--text);font-family:'DM Mono',monospace;">${l.ipa}</span></p>
    </div>
    <div class="detail-words">
      <h4>Example Words</h4>
      ${l.words.map(w => `<div class="word-item"><div class="word-arm">${w.arm}</div><div class="word-eng">${w.eng}</div></div>`).join('')}
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
