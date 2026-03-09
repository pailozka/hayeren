const vocabulary = [
  // Greetings
  { id: 'w001', arm: 'Բարև', romanized: 'Barev', ipa: '/bɑˈɾɛv/', eng: 'Hello', category: 'greetings', difficulty: 1 },
  { id: 'w002', arm: 'Ցտեսություն', romanized: "Ts'tesut'yun", ipa: '/tsʰtɛsuˈtʲun/', eng: 'Goodbye', category: 'greetings', difficulty: 1 },
  { id: 'w003', arm: 'Այո', romanized: 'Ayo', ipa: '/ɑˈjo/', eng: 'Yes', category: 'greetings', difficulty: 1 },
  { id: 'w004', arm: 'Ոչ', romanized: 'Voch', ipa: '/votʃ/', eng: 'No', category: 'greetings', difficulty: 1 },
  { id: 'w005', arm: 'Շնորհակալություն', romanized: "Shnorhakalu't'yun", ipa: '/ʃnoɾhɑkɑluˈtʲun/', eng: 'Thank you', category: 'greetings', difficulty: 1 },
  { id: 'w006', arm: 'Խնդրեմ', romanized: 'Khndrem', ipa: '/χndˈɾɛm/', eng: 'Please / You\'re welcome', category: 'greetings', difficulty: 1 },

  // Family
  { id: 'w007', arm: 'Մայր', romanized: 'Mayr', ipa: '/mɑjɾ/', eng: 'Mother', category: 'family', difficulty: 1 },
  { id: 'w008', arm: 'Հայր', romanized: 'Hayr', ipa: '/hɑjɾ/', eng: 'Father', category: 'family', difficulty: 1 },
  { id: 'w009', arm: 'Եղբայր', romanized: 'Yeghbayr', ipa: '/jɛɣˈbɑjɾ/', eng: 'Brother', category: 'family', difficulty: 1 },
  { id: 'w010', arm: 'Քույր', romanized: "K'uyr", ipa: '/kʰujɾ/', eng: 'Sister', category: 'family', difficulty: 1 },
  { id: 'w011', arm: 'Ընտանիք', romanized: 'Əntanik', ipa: '/əntɑˈnik/', eng: 'Family', category: 'family', difficulty: 1 },

  // Food & Drink
  { id: 'w012', arm: 'Հաց', romanized: 'Hats', ipa: '/hɑts/', eng: 'Bread', category: 'food', difficulty: 1 },
  { id: 'w013', arm: 'Ջուր', romanized: 'Jur', ipa: '/dʒuɾ/', eng: 'Water', category: 'food', difficulty: 1 },
  { id: 'w014', arm: 'Սուրճ', romanized: 'Surj', ipa: '/suɾdʒ/', eng: 'Coffee', category: 'food', difficulty: 1 },
  { id: 'w015', arm: 'Կաթ', romanized: 'Kat', ipa: '/kɑtʰ/', eng: 'Milk', category: 'food', difficulty: 1 },
  { id: 'w016', arm: 'Պանիր', romanized: 'Panir', ipa: '/pɑˈniɾ/', eng: 'Cheese', category: 'food', difficulty: 1 },
  { id: 'w017', arm: 'Միս', romanized: 'Mis', ipa: '/mis/', eng: 'Meat', category: 'food', difficulty: 1 },

  // Numbers
  { id: 'w018', arm: 'Մեկ', romanized: 'Mek', ipa: '/mɛk/', eng: 'One', category: 'numbers', difficulty: 1 },
  { id: 'w019', arm: 'Երկու', romanized: 'Yerku', ipa: '/jɛɾˈku/', eng: 'Two', category: 'numbers', difficulty: 1 },
  { id: 'w020', arm: 'Երեք', romanized: 'Yerek', ipa: '/jɛˈɾɛkʰ/', eng: 'Three', category: 'numbers', difficulty: 1 },
  { id: 'w021', arm: 'Չորս', romanized: "Ch'ors", ipa: '/tʃʰoɾs/', eng: 'Four', category: 'numbers', difficulty: 1 },
  { id: 'w022', arm: 'Հինգ', romanized: 'Hing', ipa: '/hiŋɡ/', eng: 'Five', category: 'numbers', difficulty: 1 },
  { id: 'w023', arm: 'Վեց', romanized: 'Vets', ipa: '/vɛts/', eng: 'Six', category: 'numbers', difficulty: 1 },

  // Nature
  { id: 'w024', arm: 'Արև', romanized: 'Arev', ipa: '/ɑˈɾɛv/', eng: 'Sun', category: 'nature', difficulty: 1 },
  { id: 'w025', arm: 'Լուսին', romanized: 'Lusin', ipa: '/luˈsin/', eng: 'Moon', category: 'nature', difficulty: 1 },
  { id: 'w026', arm: 'Ծով', romanized: 'Tsov', ipa: '/tsov/', eng: 'Sea', category: 'nature', difficulty: 1 },
  { id: 'w027', arm: 'Լեռ', romanized: 'Lerr', ipa: '/lɛr/', eng: 'Mountain', category: 'nature', difficulty: 1 },
  { id: 'w028', arm: 'Ծառ', romanized: 'Tsar', ipa: '/tsɑr/', eng: 'Tree', category: 'nature', difficulty: 1 },

  // Common Verbs
  { id: 'w029', arm: 'Ուտել', romanized: 'Utel', ipa: '/uˈtɛl/', eng: 'To eat', category: 'verbs', difficulty: 1 },
  { id: 'w030', arm: 'Խմել', romanized: 'Khmel', ipa: '/χˈmɛl/', eng: 'To drink', category: 'verbs', difficulty: 1 },
  { id: 'w031', arm: 'Գնալ', romanized: 'Gnal', ipa: '/ɡˈnɑl/', eng: 'To go', category: 'verbs', difficulty: 1 },
  { id: 'w032', arm: 'Կարդալ', romanized: 'Kardal', ipa: '/kɑɾˈdɑl/', eng: 'To read', category: 'verbs', difficulty: 1 },
  { id: 'w033', arm: 'Սիրել', romanized: 'Sirel', ipa: '/siˈɾɛl/', eng: 'To love', category: 'verbs', difficulty: 1 },
  { id: 'w034', arm: 'Խոսել', romanized: 'Khosel', ipa: '/χoˈsɛl/', eng: 'To speak', category: 'verbs', difficulty: 1 },
];

const vocabCategories = [
  { id: 'greetings', label: 'Greetings' },
  { id: 'family',    label: 'Family' },
  { id: 'food',      label: 'Food & Drink' },
  { id: 'numbers',   label: 'Numbers' },
  { id: 'nature',    label: 'Nature' },
  { id: 'verbs',     label: 'Verbs' },
];
