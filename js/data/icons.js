// ===== VOCABULARY ICONS =====
// Minimal single-color line marks (24x24, currentColor) for concrete nouns —
// the Drops mechanic: a flashcard front shows the picture and the Armenian
// word, no English, forcing direct association instead of mental translation.
//
// Kept deliberately plain (a handful of strokes) rather than photographic,
// so they read as one family with the rest of the app's ink-line ornament
// and carry no external licensing question. Coverage is intentionally
// partial — only words that reduce to one clear, unambiguous shape.

const vocabIcons = {
  w012: '<path d="M4 10c0-3 3-6 8-6s8 3 8 6-3 4-8 4-8-1-8-4z"/><path d="M4 10v4c0 3 3 5 8 5s8-2 8-5v-4"/>', // Հաց bread
  w013: '<path d="M12 3c3 4 6 8 6 12a6 6 0 0 1-12 0c0-4 3-8 6-12z"/>', // Ջուր water
  w014: '<path d="M5 9h11v5a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4V9z"/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M8 4c0 1-1 1-1 2M12 4c0 1-1 1-1 2"/>', // Սուրճ coffee
  w015: '<path d="M8 3h8l1 3-2 2v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8L7 6z"/><path d="M7 12h10"/>', // Կաթ milk
  w016: '<path d="M4 14c0-5 3-9 8-9s8 4 8 9-3 6-8 6-8-1-8-6z"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="15" r="1"/>', // Պանիր cheese
  w083: '<path d="M12 5c-3 0-5 3-5 7a5 5 0 0 0 10 0c0-4-2-7-5-7z"/><path d="M12 5c0-1 1-2 2-2"/>', // Խնձոր apple
  w084: '<path d="M3 12c4-5 10-6 14-3-1 2-1 4 0 6-4 3-10 2-14-3z"/><circle cx="15" cy="10.5" r=".8"/>', // Ձուկ fish
  w085: '<path d="M12 3c3 4 5 8 5 11a5 5 0 0 1-10 0c0-3 2-7 5-11z"/>', // Ձու egg
  w024: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>', // Արև sun
  w025: '<path d="M16 4a8.5 8.5 0 1 0 4 15.4A8.5 8.5 0 0 1 16 4z"/>', // Լուսին moon
  w026: '<path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M12 4v9"/>', // Ծով sea
  w027: '<path d="M3 19 9 8l3 5 2-3 7 9z"/>', // Լեռ mountain
  w028: '<path d="M12 3 6 12h3l-4 6h5v3h4v-3h5l-4-6h3z"/>', // Ծառ tree
  w037: '<circle cx="12" cy="12" r="1.2"/><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>', // Ձյուն snow
  w136: '<path d="M6 10a5 5 0 0 1 9.6-2A4.5 4.5 0 0 1 17 17H7a4 4 0 0 1-1-7.9z"/><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2"/>', // Անձրև rain
  w138: '<circle cx="12" cy="7" r="2.4"/><circle cx="17" cy="12" r="2.4"/><circle cx="12" cy="17" r="2.4"/><circle cx="7" cy="12" r="2.4"/><circle cx="12" cy="12" r="1.6"/>', // Ծաղիկ flower
  w142: '<path d="M4 16c0-4 3-7 8-7s8 3 8 7-2 4-4 4H8c-2 0-4 0-4-4z"/><path d="M8 9 6 5M16 9l2-4"/><circle cx="9.5" cy="13" r=".8"/><circle cx="14.5" cy="13" r=".8"/>', // Շուն dog
  w143: '<path d="M5 15c0-4 3-6 7-6s7 2 7 6-2 5-7 5-7-1-7-5z"/><path d="M8 9 5 4M16 9l3-5"/><path d="M4 15h1M19 15h1"/><circle cx="10" cy="13" r=".8"/><circle cx="14" cy="13" r=".8"/>', // Կատու cat
  w144: '<path d="M5 19V9c0-3 2-6 6-6 3 0 5 2 5 4l4 2-3 2 1 8"/><path d="M8 19v-4M11 19v-3"/>', // Ձի horse
  w145: '<path d="M4 13c2-5 6-7 10-6 3 1 5 3 6 6-2 1-4 1-6 0 1 2 0 4-2 5-1-2-1-4-2-5-2 1-4 1-6 0z"/>', // Թռչուն bird
  w146: '<path d="M4 12c0-3 2-5 5-5h6c3 0 5 2 5 5s-2 6-8 6-8-3-8-6z"/><path d="M8 7 6 4M14 7l2-3"/><path d="M12 18v2"/>', // Կով cow
  w147: '<circle cx="9" cy="12" r="4"/><circle cx="15" cy="12" r="4"/><circle cx="12" cy="9" r="3"/><path d="M6 15v3M18 15v3"/>', // Ոչխար sheep
  w148: '<path d="M4 4h9v16H4z"/><path d="M13 4h7v16h-7"/><path d="M4 4c3 1 3 15 0 16M20 4c-3 1-3 15 0 16"/>', // Գիրք book
  w149: '<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="14.5" cy="12" r=".9"/>', // Դուռ door
  w150: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M12 5v14M4 12h16"/>', // Պատուհան window
  w151: '<path d="M3 9h18M6 9v10M18 9v10"/>', // Սեղան table
  w152: '<path d="M6 4h9v9H6z"/><path d="M6 13v7M15 13v7M6 9H4M15 9h2"/>', // Աթոռ chair
  w155: '<circle cx="7" cy="8" r="3.5"/><path d="M9.8 10.5 19 20M15 15l2-2M18 18l2-2"/>', // Բանալի key
  w158: '<circle cx="12" cy="12" r="8"/>', // Գլուխ head
  w159: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>', // Աչք eye
  w160: '<path d="M6 21V9a2 2 0 0 1 4 0v6M10 15V6a2 2 0 0 1 4 0v9M14 15V7a2 2 0 0 1 4 0v9c0 4-2 6-6 6H9c-2 0-3-1-4-2l-2-4 1-2c1-1 2 0 2 1"/>', // Ձեռք hand
};
