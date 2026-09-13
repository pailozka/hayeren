// ===== AUDIO / PRONUNCIATION MODULE =====
// Uses the browser's built-in speech synthesis. Armenian voice availability
// varies by platform; we fall back to the default voice rather than going silent.

const speechSupported = 'speechSynthesis' in window;
let armenianVoice = null;

function pickArmenianVoice() {
  if (!speechSupported) return;
  const voices = speechSynthesis.getVoices();
  armenianVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('hy')) || null;
}

if (speechSupported) {
  pickArmenianVoice();
  speechSynthesis.addEventListener('voiceschanged', pickArmenianVoice);
}

function speakArmenian(text) {
  if (!speechSupported || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hy-AM';
  if (armenianVoice) utterance.voice = armenianVoice;
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
}

// `event` lets a speak button live inside a clickable card without triggering it.
function speak(text, event) {
  if (event) event.stopPropagation();
  speakArmenian(text);
}

function speakButton(text, label) {
  if (!speechSupported) return '';
  const safe = String(text).replace(/'/g, "\\'");
  return `<button class="speak-btn" title="${label || 'Hear pronunciation'}"
    onclick="speak('${safe}', event)" aria-label="${label || 'Hear pronunciation'}">🔊</button>`;
}
