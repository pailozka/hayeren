// ===== PHRASEBOOK =====
const savedPhraseKey = 'hayeren_savedPhrases';
let savedPhrases;
try {
  savedPhrases = new Set(JSON.parse(localStorage.getItem(savedPhraseKey)));
} catch {
  savedPhrases = new Set();
}

function initPhrasebook() {
  const category = document.getElementById('phraseCategory');
  phraseCategories.forEach(({ id, label }) => category.add(new Option(label, id)));
  category.addEventListener('change', renderPhrases);
  document.getElementById('phraseSearch').addEventListener('input', renderPhrases);
  document.getElementById('phraseSaved').addEventListener('click', event => {
    const button = event.currentTarget;
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    renderPhrases();
  });
  document.getElementById('phraseReset').addEventListener('click', () => {
    const search = document.getElementById('phraseSearch');
    search.value = '';
    category.value = 'all';
    document.getElementById('phraseSaved').setAttribute('aria-pressed', 'false');
    renderPhrases();
    search.focus();
  });
  renderPhrases();
}

function normalizePhraseSearch(value) {
  return value.normalize('NFKC').toLowerCase()
    .replace(/[’‘'՞՛՜]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function renderPhrases() {
  const query = document.getElementById('phraseSearch').value;
  const terms = normalizePhraseSearch(query).split(' ').filter(Boolean);
  const category = document.getElementById('phraseCategory').value;
  const savedButton = document.getElementById('phraseSaved');
  const savedOnly = savedButton.getAttribute('aria-pressed') === 'true';
  const list = document.getElementById('phraseList');
  const results = phrases.filter(phrase => {
    if (category !== 'all' && phrase.category !== category) return false;
    if (savedOnly && !savedPhrases.has(phrase.id)) return false;
    const searchable = normalizePhraseSearch([phrase.arm, phrase.romanized, phrase.eng].join(' '));
    return terms.every(term => searchable.includes(term));
  });

  savedButton.textContent = `Saved (${savedPhrases.size})`;
  document.getElementById('phraseCount').textContent =
    `${results.length} ${results.length === 1 ? 'phrase' : 'phrases'}`;
  document.getElementById('phraseReset').hidden = !query && category === 'all' && !savedOnly;
  list.replaceChildren();
  if (!results.length) {
    const message = document.createElement('p');
    message.className = 'phrase-empty';
    message.textContent = savedOnly && !savedPhrases.size
      ? 'Save a phrase to find it here later.'
      : 'Try a shorter search or choose all situations.';
    list.append(message);
    return;
  }

  for (const phrase of results) {
    const card = document.createElement('article');
    card.className = 'phrase-card';
    card.innerHTML = `
      <div class="phrase-arm" lang="hy">${lessonEscape(phrase.arm)}</div>
      <div class="phrase-romanized">${lessonEscape(phrase.romanized)}</div>
      <div class="phrase-eng">${lessonEscape(phrase.eng)}</div>
      <div class="phrase-card-tools">
        <button type="button" class="ctrl-btn phrase-save"></button>
        <details class="phrase-details">
          <summary>Pronunciation &amp; usage</summary>
          <div class="phrase-ipa">${lessonEscape(phrase.ipa)}</div>
          ${phrase.literal ? `<div class="phrase-literal">Literally “${lessonEscape(phrase.literal)}”</div>` : ''}
          ${phrase.usage ? `<div class="phrase-usage">${lessonEscape(phrase.usage)}</div>` : ''}
        </details>
      </div>`;
    const button = card.querySelector('.phrase-save');
    function updateSavedState() {
      const saved = savedPhrases.has(phrase.id);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `Save phrase: ${phrase.eng}`);
      button.textContent = saved ? '★ Saved' : '☆ Save';
    }
    updateSavedState();
    button.onclick = () => {
      if (savedPhrases.has(phrase.id)) savedPhrases.delete(phrase.id);
      else savedPhrases.add(phrase.id);
      localStorage.setItem(savedPhraseKey, JSON.stringify([...savedPhrases]));
      if (savedOnly) {
        const previousIndex = [...list.children].indexOf(card);
        renderPhrases();
        const remaining = list.querySelectorAll('.phrase-save');
        (remaining[Math.min(previousIndex, remaining.length - 1)] || savedButton).focus();
      } else {
        updateSavedState();
        savedButton.textContent = `Saved (${savedPhrases.size})`;
      }
    };
    list.append(card);
  }
}
