// ===== FLASHCARDS MODULE =====

let fcDeck      = 'letters'; // 'letters' | 'words'
let fcCategory  = 'all';
let fcImageMode = false; // words only: picture + Armenian on the front, no English
let fcItems     = [];
let fcIndex     = 0;
let fcFlipped   = false;

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
  const imgToggle = document.getElementById('fcImageToggle');
  if (imgToggle) imgToggle.style.display = deck === 'words' ? 'inline-flex' : 'none';

  if (deck === 'letters') fcCategory = 'all';
  loadFCDeck();
}

function setFCImageMode(on) {
  fcImageMode = on;
  const btn = document.getElementById('fcImageToggle');
  if (btn) btn.classList.toggle('active', on);
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

// Deck-complete and empty-deck states replace the flashcard markup with a
// message panel; rebuild it before rendering a card into ids that no longer exist.
function ensureFlashcardDom() {
  if (document.getElementById('flashcard')) return;
  const container = document.querySelector('.flashcard-container');
  if (!container) return;
  container.innerHTML = `
    <div class="flashcard" id="flashcard" onclick="flipCard()">
      <div class="flashcard-inner" id="flashcardInner">
        <div class="flashcard-front" id="fcFront"></div>
        <div class="flashcard-back" id="fcBack"></div>
      </div>
    </div>
  `;
}

function loadFCDeck() {
  ensureFlashcardDom();
  if (fcDeck === 'letters') {
    fcItems = [...letters].sort(() => Math.random() - 0.5);
  } else {
    let pool = fcCategory === 'all'
      ? vocabulary
      : vocabulary.filter(w => w.category === fcCategory);
    // Picture mode only makes sense with a picture — no English fallback,
    // or it stops being "guess from the image" for every card in the deck.
    if (fcImageMode) pool = pool.filter(w => vocabIcons[w.id]);
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

  if (!fcItems.length) {
    showFlashcardEmpty();
    return;
  }

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
  } else if (fcImageMode && vocabIcons[item.id]) {
    // Drops-style: picture and the Armenian word only, no English, no
    // romanization — the picture has to do the work of translation.
    frontEl.innerHTML = `
      <svg class="fc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${vocabIcons[item.id]}</svg>
      <div class="fc-arm-char word">${item.arm}</div>
    `;
    backEl.innerHTML = `
      <div class="fc-label">English</div>
      <div class="fc-translation">${item.eng}</div>
      <div class="fc-romanized">${item.romanized}</div>
      <div class="fc-ipa">${item.ipa}</div>
    `;
  } else {
    frontEl.innerHTML = `
      <div class="fc-label">Armenian</div>
      <div class="fc-arm-char word">${item.arm}</div>
      <div class="fc-romanized">${item.romanized}</div>
    `;
    backEl.innerHTML = `
      <div class="fc-label">English</div>
      <div class="fc-translation">${item.eng}</div>
      <div class="fc-ipa">${item.ipa}</div>
    `;
  }
}

function showFlashcardEmpty() {
  const container = document.querySelector('.flashcard-container');
  if (!container) return;
  container.innerHTML = `
    <div class="fc-complete">
      <div class="fc-label">No Picture Cards Here</div>
      <div class="fc-complete-title">This category has no picture words yet</div>
      <button class="mark-btn" onclick="setFCImageMode(false)">Switch to Word Mode</button>
    </div>
  `;
  const rating = document.getElementById('fcRating');
  if (rating) rating.style.display = 'none';
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
  const item = fcItems[fcIndex];
  if (item) {
    const type = fcDeck === 'letters' ? 'letter' : 'word';
    const id = fcDeck === 'letters' ? letters.indexOf(item) : item.id;
    const rec = reviewItem(type, id, rating);
    bumpReviewCount(1);
    showNextReviewHint(rec);
  }

  // A lapse still comes back later in this session, on top of being
  // rescheduled for tomorrow.
  if (rating === 'hard') fcItems.push(item);

  fcIndex++;
  if (fcIndex >= fcItems.length) {
    showFlashcardComplete();
  } else {
    renderFlashcard();
  }
}

function showNextReviewHint(rec) {
  const hint = document.getElementById('fcNextDue');
  if (!hint || !rec) return;
  const days = rec.interval;
  hint.textContent = days <= 1 ? 'Back tomorrow' : `Next review in ${days} days`;
  hint.classList.add('visible');
  setTimeout(() => hint.classList.remove('visible'), 1600);
}

function showFlashcardComplete() {
  const container = document.querySelector('.flashcard-container');
  if (!container) return;
  container.innerHTML = `
    <div class="fc-complete">
      <div class="fc-label">Deck Complete</div>
      <div class="fc-complete-title">All cards reviewed</div>
      <button class="mark-btn" onclick="restartFlashcards()">Shuffle &amp; Repeat</button>
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
  loadFCDeck(); // ensureFlashcardDom() inside rebuilds the card markup
}
