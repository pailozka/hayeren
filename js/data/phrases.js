const phrases = [
  // Greetings & Farewells
  { id: 'ph001', arm: 'Բարի՛ լույս', romanized: "Bari' luys", ipa: '/bɑˈɾi ˈlujs/', eng: 'Good morning', literal: 'Good light', category: 'greetings', usage: 'The standard morning greeting. Can be said any time before noon.' },
  { id: 'ph002', arm: 'Բարի՛ երեկո', romanized: "Bari' yereko", ipa: '/bɑˈɾi jɛˈɾɛko/', eng: 'Good evening', literal: 'Good evening', category: 'greetings', usage: 'Used from late afternoon onward.' },
  { id: 'ph003', arm: 'Բարի՛ գիշեր', romanized: "Bari' gisher", ipa: '/bɑˈɾi ɡiˈʃɛɾ/', eng: 'Good night', literal: 'Good night', category: 'greetings', usage: 'Said when parting before sleep.' },
  { id: 'ph004', arm: 'Ցտեսություն', romanized: "Ts'tesut'yun", ipa: '/tsʰtɛsuˈtʲun/', eng: 'Goodbye', literal: 'Until seeing', category: 'greetings', usage: 'The standard farewell, used in all contexts.' },
  { id: 'ph005', arm: 'Կհանդիպենք', romanized: 'Khandipenkh', ipa: '/khɑndiˈpɛŋkʰ/', eng: 'See you later', literal: 'We will meet', category: 'greetings', usage: 'Casual farewell implying you\'ll see each other again.' },
  { id: 'ph006', arm: 'Բարև ձեզ', romanized: 'Barev dzez', ipa: '/bɑˈɾɛv dzɛz/', eng: 'Hello (formal)', literal: 'Hello to you (formal)', category: 'greetings', usage: 'Formal greeting — use with strangers, elders, or in professional settings.' },

  // Courtesy Phrases
  { id: 'ph007', arm: 'Շնորհակալություն', romanized: "Shnorhakalu't'yun", ipa: '/ʃnoɾhɑkɑluˈtʲun/', eng: 'Thank you', literal: null, category: 'courtesy', usage: 'Universally used. Often shortened to "Շնորհակալ եմ" (Shnorhakał yem) in speech.' },
  { id: 'ph008', arm: 'Խնդրեմ', romanized: 'Khndrem', ipa: '/χndˈɾɛm/', eng: 'Please / You\'re welcome', literal: 'I beg/request', category: 'courtesy', usage: 'Works as both "please" (before a request) and "you\'re welcome" (after thanks).' },
  { id: 'ph009', arm: 'Կներեք', romanized: 'Knereq', ipa: '/knɛˈɾɛkʰ/', eng: 'Excuse me / I\'m sorry (formal)', literal: 'Forgive (plural)', category: 'courtesy', usage: 'Used to get someone\'s attention or to apologize. Formal/polite form.' },
  { id: 'ph010', arm: 'Ներողություն', romanized: "Neroghut'yun", ipa: '/nɛɾoɣuˈtʲun/', eng: 'Sorry / Apology', literal: 'Forgiveness', category: 'courtesy', usage: 'A sincere apology, stronger than Կներեք.' },
  { id: 'ph011', arm: 'Ոչինչ', romanized: 'Vochinch', ipa: '/votʃˈiɲtʃ/', eng: 'It\'s nothing / No problem', literal: 'Nothing', category: 'courtesy', usage: 'Said in response to an apology or thank-you to dismiss it.' },
  { id: 'ph012', arm: 'Կենաց', romanized: 'Kenats', ipa: '/kɛˈnɑts/', eng: 'Cheers! / Toast!', literal: 'To life', category: 'courtesy', usage: 'The Armenian toast, said before drinking. Equivalent to "Cheers!".' },

  // Questions
  { id: 'ph013', arm: 'Ինչպե՞ս եք', romanized: "Inchpe՞s yeq", ipa: '/intʃˈpɛs jɛkʰ/', eng: 'How are you? (formal)', literal: 'How are you (plural)', category: 'questions', usage: 'Formal address. Use with strangers, elders, or in professional settings.' },
  { id: 'ph014', arm: 'Ինչպե՞ս ես', romanized: "Inchpe՞s yes", ipa: '/intʃˈpɛs jɛs/', eng: 'How are you? (informal)', literal: 'How are you', category: 'questions', usage: 'Informal version for friends and family.' },
  { id: 'ph015', arm: 'Ի՞նչ է ձեր անունը', romanized: "I՞nch ye dzer anunə", ipa: '/intʃ ɛ dzɛɾ ɑˈnunə/', eng: 'What is your name? (formal)', literal: 'What is your name', category: 'questions', usage: 'Formal way to ask someone\'s name.' },
  { id: 'ph016', arm: 'Ո՞ւր է ...', romanized: "Vo՞ur ye ...", ipa: '/vuɾ ɛ/', eng: 'Where is ...?', literal: 'Where is', category: 'questions', usage: 'Point to something or say the place name after this phrase.' },
  { id: 'ph017', arm: 'Ո՞րն է գինը', romanized: "Vo՞rn ye gine", ipa: '/voɾn ɛ ɡiˈnə/', eng: 'What is the price?', literal: 'Which is the price', category: 'questions', usage: 'Essential for shopping.' },
  { id: 'ph018', arm: 'Ե՞րբ', romanized: "Ye՞rb", ipa: '/jɛɾb/', eng: 'When?', literal: 'When', category: 'questions', usage: 'A simple question word. Follow with context.' },

  // Feelings & States
  { id: 'ph019', arm: 'Ես լավ եմ', romanized: 'Yes lav yem', ipa: '/jɛs lɑv jɛm/', eng: 'I am fine', literal: 'I good am', category: 'feelings', usage: 'The standard response to "How are you?".' },
  { id: 'ph020', arm: 'Ուրախ եմ', romanized: 'Urakh yem', ipa: '/uˈɾɑχ jɛm/', eng: 'I am happy', literal: 'Happy am', category: 'feelings', usage: 'Express happiness or gladness.' },
  { id: 'ph021', arm: 'Հոգնած եմ', romanized: 'Hognats yem', ipa: '/hoɡˈnɑts jɛm/', eng: 'I am tired', literal: 'Tired am', category: 'feelings', usage: 'A common, useful phrase for everyday conversation.' },
  { id: 'ph022', arm: 'Քաղցած եմ', romanized: "K'aghtsats yem", ipa: '/kʰɑɣˈtsɑts jɛm/', eng: 'I am hungry', literal: 'Hungry am', category: 'feelings', usage: 'Use this at a restaurant or to let someone know you\'re hungry.' },
  { id: 'ph023', arm: 'Ծարավ եմ', romanized: 'Tsarav yem', ipa: '/tsɑˈɾɑv jɛm/', eng: 'I am thirsty', literal: 'Thirsty am', category: 'feelings', usage: 'Ask for water or a drink after saying this.' },

  // Practical
  { id: 'ph024', arm: 'Չեմ հասկանում', romanized: "Ch'em haskanum", ipa: '/tʃʰɛm hɑskɑˈnum/', eng: 'I don\'t understand', literal: 'I don\'t understand', category: 'practical', usage: 'Essential for learners. Say this whenever you\'re lost in a conversation.' },
  { id: 'ph025', arm: 'Կարո՞ղ եք կրկնել', romanized: "Karo՞gh yeq krknell", ipa: '/kɑˈɾoɣ jɛkʰ kɾkˈnɛl/', eng: 'Can you repeat?', literal: 'Can you repeat (formal)', category: 'practical', usage: 'Politely ask someone to repeat what they said.' },
  { id: 'ph026', arm: 'Դանդաղ խոսեք', romanized: 'Dandagh khoseq', ipa: '/dɑnˈdɑɣ χoˈsɛkʰ/', eng: 'Speak slowly, please', literal: 'Slowly speak (plural)', category: 'practical', usage: 'Ask a native speaker to slow down.' },
  { id: 'ph027', arm: 'Հայերեն եմ սովորում', romanized: 'Hayeren yem sovoroom', ipa: '/hɑjɛˈɾɛn jɛm sovoˈɾum/', eng: 'I am learning Armenian', literal: 'Armenian am learning', category: 'practical', usage: 'Tell people you\'re a learner — they\'ll usually be delighted and patient.' },
  { id: 'ph028', arm: 'Անգլերեն գիտե՞ք', romanized: "Angleeren gite՞q", ipa: '/ɑŋɡlɛˈɾɛn ɡiˈtɛkʰ/', eng: 'Do you know English?', literal: 'English know (formal)', category: 'practical', usage: 'Useful when you get stuck and need a language bridge.' },
  { id: 'ph029', arm: 'Օգնեք ինձ', romanized: 'Ogneq indz', ipa: '/oɡˈnɛkʰ indz/', eng: 'Help me!', literal: 'Help me (formal)', category: 'practical', usage: 'Emergency request for help. Also works in non-emergency situations.' },
  { id: 'ph030', arm: 'Ուրախ եմ ծանոթանալու', romanized: 'Urakh yem tsanothanalu', ipa: '/uˈɾɑχ jɛm tsɑnoθɑˈnɑlu/', eng: 'Nice to meet you', literal: 'Happy am to meet', category: 'greetings', usage: 'Used when meeting someone for the first time.' },
];

const phraseCategories = [
  { id: 'greetings',  label: 'Greetings & Farewells' },
  { id: 'courtesy',   label: 'Courtesy Phrases' },
  { id: 'questions',  label: 'Useful Questions' },
  { id: 'feelings',   label: 'Feelings & States' },
  { id: 'practical',  label: 'Practical' },
];
