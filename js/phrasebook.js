// ===== PHRASEBOOK MODULE =====

let activePhraseCategory = 'all';

function initPhrasebook() {
  buildPhraseCats();
  renderPhrases('all', null);
}

function buildPhraseCats() {
  const container = document.getElementById('phraseCats');
  if (!container) return;
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'phrase-cat-btn active';
  allBtn.textContent = 'All';
  allBtn.onclick = () => renderPhrases('all', allBtn);
  container.appendChild(allBtn);

  phraseCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'phrase-cat-btn';
    btn.textContent = cat.label;
    btn.onclick = () => renderPhrases(cat.id, btn);
    container.appendChild(btn);
  });
}

function renderPhrases(catId, clickedBtn) {
  activePhraseCategory = catId;

  document.querySelectorAll('.phrase-cat-btn').forEach(b => b.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  } else {
    // Activate 'All' on initial render
    const firstBtn = document.querySelector('.phrase-cat-btn');
    if (firstBtn) firstBtn.classList.add('active');
  }

  const filtered = catId === 'all'
    ? phrases
    : phrases.filter(p => p.category === catId);

  const list = document.getElementById('phraseList');
  if (!list) return;
  list.innerHTML = '';

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'phrase-card';

    const literalHtml = p.literal
      ? `<div class="phrase-literal">Literal: "${p.literal}"</div>`
      : '';
    const usageHtml = p.usage
      ? `<div class="phrase-usage">${p.usage}</div>`
      : '';

    card.innerHTML = `
      <div class="phrase-arm">${p.arm}</div>
      <div class="phrase-romanized">${p.romanized}</div>
      <div class="phrase-eng">${p.eng}</div>
      <div class="phrase-details">
        <div class="phrase-ipa">${p.ipa}</div>
        ${literalHtml}
        ${usageHtml}
      </div>
    `;
    card.onclick = () => card.classList.toggle('expanded');
    list.appendChild(card);
  });
}
