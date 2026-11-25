// ===== THE RUG =====
// Progress drawn as weaving: one knot for each letter or word that has a
// review record (39 letters + 178 words = 31 x 7). Opening the app weaves
// nothing. A knot is bright while its review is up to date and loosens when due.

const RUG_COLS = 31;

function rugColor(col, row, rows) {
  if (!row || row === rows - 1 || !col || col === RUG_COLS - 1) {
    return (col + row) % 2 ? 'var(--ochre)' : 'var(--indigo)';
  }
  const center = [5, 15, 25].reduce((a, b) => Math.abs(b - col) < Math.abs(a - col) ? b : a);
  const d = Math.abs(col - center) + Math.abs(row - (rows - 1) / 2);
  return ['var(--ochre)', 'var(--apricot-deep)', 'var(--ochre)', 'var(--viridian)', 'var(--indigo)'][d] || 'var(--apricot)';
}

function rugKnots() {
  return Object.entries(loadSrsData())
    .filter(([key]) => /^(letter|word):/.test(key) && resolveSrsItem(...key.split(':')))
    .map(([, record]) => ({ due: record.due <= isoToday() }));
}

// The newest `fresh` knots animate into place.
function rugMarkup(fresh = 0) {
  const total = letters.length + vocabulary.length;
  const rows = Math.ceil(total / RUG_COLS);
  const knots = rugKnots();
  let cells = '';
  for (let i = 0; i < total; i++) {
    const col = i % RUG_COLS;
    const row = rows - 1 - Math.floor(i / RUG_COLS);
    const x = col * 10, y = row * 10;
    const knot = knots[i];
    cells += knot
      ? `<rect class="knot${knot.due ? ' due' : ''}${i >= knots.length - fresh ? ' fresh' : ''}" style="animation-delay:${Math.max(0, i - knots.length + fresh) * 110}ms" x="${x + .6}" y="${y + .6}" width="8.8" height="8.8" rx="1.6" fill="${rugColor(col, row, rows)}"/>`
      : `<path class="warp" d="M${x + 3} ${y}v10M${x + 7} ${y}v10"/>`;
  }
  let fringe = '';
  for (let x = 3; x < RUG_COLS * 10; x += 5) fringe += `M${x} -7V-1M${x} ${rows * 10 + 1}v6`;
  const due = knots.filter(k => k.due).length;
  const caption = !knots.length
    ? 'Finish a lesson to tie your first knots.'
    : `${knots.length} of ${total} knots tied.${due ? ` ${due} ${due === 1 ? 'is' : 'are'} loose and ready for review.` : ''}`;
  return `<svg class="rug" viewBox="0 -8 ${RUG_COLS * 10} ${rows * 10 + 16}" role="img" aria-label="Your rug: ${caption}"><path class="fringe" d="${fringe}"/>${cells}</svg>
    <p class="rug-caption">${caption}</p>`;
}

function renderRug() {
  const host = document.getElementById('dashRug');
  if (host) host.innerHTML = `<h2>Your rug</h2>${rugMarkup()}`;
}
