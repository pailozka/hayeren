// ===== FLASHCARDS MODULE =====

let fcDeck     = 'letters'; // 'letters' | 'words'
let fcCategory = 'all';
let fcItems    = [];
let fcIndex    = 0;
let fcFlipped  = false;

function initFlashcards() {
  buildFCCategoryControls();
  loadFCDeck();
}

function setFCDeck(deck) {
  fcDeck = deck;
  document.getElementById('fcDeckLetters').classList.toggle('active', deck === 'letters');
  document.getElementById('fcDeckWords').classList.toggle('active', deck === 'words');

  const catGroup = document.getElementById('fcCategoryGroup');
  if (catGroup) catGroup.style.display = deck === 'words' ? 'flex' : 'none';

  if (deck === 'letters') fcCategory = 'all';
  loadFCDeck();
}

function buildFCCategoryControls() {
  const group = document.getElementById('fcCategoryGroup');
  if (!group) return;
  group.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'ctrl-btn active';
  allBtn.id = 'fcCatAll';
  allBtn.textContent = 'All';
  allBtn.onclick = () => setFCCategory('all');
  group.appendChild(allBtn);

  vocabCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'ctrl-btn';
    btn.id = 'fcCat_' + cat.id;
    btn.textContent = cat.label;
    btn.onclick = () => setFCCategory(cat.id);
    group.appendChild(btn);
  });
}

function setFCCategory(catId) {
  fcCategory = catId;
  document.querySelectorAll('#fcCategoryGroup .ctrl-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(catId === 'all' ? 'fcCatAll' : 'fcCat_' + catId);
  if (activeBtn) activeBtn.classList.add('active');
  loadFCDeck();
}

function loadFCDeck() {
  if (fcDeck === 'letters') {
    fcItems = [...letters].sort(() => Math.random() - 0.5);
  } else {
    const pool = fcCategory === 'all'
      ? vocabulary
      : vocabulary.filter(w => w.category === fcCategory);
    fcItems = [...pool].sort(() => Math.random() - 0.5);
  }
  fcIndex  = 0;
  fcFlipped = false;
  renderFlashcard();
}

function renderFlashcard() {
  const frontEl = document.getElementById('fcFront');
  const backEl  = document.getElementById('fcBack');
  const card    = document.getElementById('flashcard');
  const hint    = document.getElementById('fcHint');
  const rating  = document.getElementById('fcRating');

  if (!frontEl || !backEl) return;

  // Reset flip
  card.classList.remove('flipped');
  fcFlipped = false;
  if (hint) hint.textContent = 'Click the card to reveal';
  if (rating) rating.style.display = 'none';

  // Progress
  const counterEl = document.getElementById('fcCounter');
  const progressEl = document.getElementById('fcProgressBar');
  if (counterEl) counterEl.textContent = `${fcIndex + 1} / ${fcItems.length}`;
  if (progressEl) progressEl.style.width = (fcIndex / fcItems.length * 100) + '%';

  const item = fcItems[fcIndex];

  if (fcDeck === 'letters') {
    frontEl.innerHTML = `
      <div class="fc-label">Armenian Letter</div>
      <div class="fc-arm-char">${item.arm}</div>
      <div class="fc-romanized">${item.lower} · ${item.name}</div>
    `;
    backEl.innerHTML = `
      <div class="fc-label">Sound &amp; Details</div>
      <div class="fc-translation">"${item.sound}"</div>
      <div class="fc-ipa">${item.ipa}</div>
      <div class="fc-desc">${item.desc}</div>
    `;
  } else {
    frontEl.innerHTML = `
      <div class="fc-label">Armenian</div>
      <div class="fc-arm-char" style="font-size:3rem;">${item.arm}</div>
      <div class="fc-romanized">${item.romanized}</div>
    `;
    backEl.innerHTML = `
      <div class="fc-label">English</div>
      <div class="fc-translation">${item.eng}</div>
      <div class="fc-ipa">${item.ipa}</div>
    `;
  }
}

function flipCard() {
  if (fcFlipped) return;
  fcFlipped = true;
  document.getElementById('flashcard').classList.add('flipped');
  const hint = document.getElementById('fcHint');
  if (hint) hint.textContent = 'How well did you know it?';
  const rating = document.getElementById('fcRating');
  if (rating) rating.style.display = 'flex';

  recordActivity();
  updateStreakDisplay();
  buildWeekDots();
}

function rateCard(rating) {
  if (rating === 'hard') {
    // Re-queue at end
    fcItems.push(fcItems[fcIndex]);
  }
  fcIndex++;
  if (fcIndex >= fcItems.length) {
    showFlashcardComplete();
  } else {
    renderFlashcard();
  }
}

function showFlashcardComplete() {
  const container = document.querySelector('.flashcard-container');
  if (!container) return;
  container.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--gold-dim);border-radius:16px;height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;">
      <div class="fc-label">Deck Complete</div>
      <div style="font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--text);margin:0.75rem 0;">All cards reviewed</div>
      <button class="mark-btn" style="margin-top:1rem;" onclick="restartFlashcards()">Shuffle &amp; Repeat</button>
    </div>
  `;
  const rating = document.getElementById('fcRating');
  if (rating) rating.style.display = 'none';
  const hint = document.getElementById('fcHint');
  if (hint) hint.textContent = '';
  const progressEl = document.getElementById('fcProgressBar');
  if (progressEl) progressEl.style.width = '100%';
}

function restartFlashcards() {
  // Restore the original card HTML structure
  const container = document.querySelector('.flashcard-container');
  container.innerHTML = `
    <div class="flashcard" id="flashcard" onclick="flipCard()">
      <div class="flashcard-inner" id="flashcardInner">
        <div class="flashcard-front" id="fcFront"></div>
        <div class="flashcard-back" id="fcBack"></div>
      </div>
    </div>
  `;
  loadFCDeck();
}
