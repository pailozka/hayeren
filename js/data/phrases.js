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

  // Introductions & self
  { id: 'ph031', arm: 'Իմ անունը ... է', romanized: 'Im anunə ... e', ipa: '/im ɑˈnunə ɛ/', eng: 'My name is ...', literal: 'My name ... is', category: 'greetings', usage: 'Put your name in the gap. The most useful sentence you will learn.' },
  { id: 'ph032', arm: 'Ես ... -ից եմ', romanized: 'Yes ... -its em', ipa: '/jɛs its ɛm/', eng: 'I am from ...', literal: 'I ...-from am', category: 'greetings', usage: 'The suffix -ից attaches to the place name: Ես Լոնդոնից եմ.' },
  { id: 'ph033', arm: 'Ի՞նչ ես անում', romanized: 'Inch es anum', ipa: '/intʃ ɛs ɑˈnum/', eng: 'What do you do?', literal: 'What are you doing', category: 'conversation', usage: 'Asks about work or about what someone is doing right now — context decides.' },

  // Family
  { id: 'ph034', arm: 'Ամուսնացա՞ծ ես', romanized: "Amusnatsats es", ipa: '/ɑmusnɑˈtsɑts ɛs/', eng: 'Are you married?', literal: 'Married are you', category: 'family', usage: 'A normal, non-intrusive question in Armenian small talk.' },
  { id: 'ph035', arm: 'Երեխաներ ունե՞ս', romanized: 'Yerekhaner unes', ipa: '/jɛɾɛχɑˈnɛɾ uˈnɛs/', eng: 'Do you have children?', literal: 'Children have you', category: 'family', usage: 'Ունեմ = I have. Answer: Այո, ունեմ / Ոչ, չունեմ.' },
  { id: 'ph036', arm: 'Սա իմ ընտանիքն է', romanized: "Sa im əntanik'n e", ipa: '/sɑ im əntɑˈnikʰn ɛ/', eng: 'This is my family', literal: 'This my family is', category: 'family', usage: 'Use when showing a photo or introducing people.' },
  { id: 'ph037', arm: 'Ես երկու քույր ունեմ', romanized: "Yes yerku k'uyr unem", ipa: '/jɛs jɛɾˈku kʰujɾ uˈnɛm/', eng: 'I have two sisters', literal: 'I two sister have', category: 'family', usage: 'Note: the noun stays singular after a number in Armenian.' },

  // Food & restaurant
  { id: 'ph038', arm: 'Ես ուզում եմ ...', romanized: 'Yes uzum em ...', ipa: '/jɛs uˈzum ɛm/', eng: 'I would like ...', literal: 'I wanting am', category: 'food', usage: 'The polite all-purpose way to order. Follow with the dish.' },
  { id: 'ph039', arm: 'Ճաշացանկը, խնդրեմ', romanized: "Chashatsankə, khndrem", ipa: '/tʃɑʃɑˈtsɑŋkə χndˈɾɛm/', eng: 'The menu, please', literal: 'The menu, please', category: 'food', usage: 'Say this on sitting down at a restaurant.' },
  { id: 'ph040', arm: 'Հաշիվը, խնդրեմ', romanized: 'Hashivə, khndrem', ipa: '/hɑˈʃivə χndˈɾɛm/', eng: 'The bill, please', literal: 'The bill, please', category: 'food', usage: 'Ask for the check at the end of a meal.' },
  { id: 'ph041', arm: 'Շատ համեղ է', romanized: 'Shat hamegh e', ipa: '/ʃɑt hɑˈmɛʁ ɛ/', eng: 'It is very delicious', literal: 'Very delicious is', category: 'food', usage: 'Always well received by an Armenian host.' },
  { id: 'ph042', arm: 'Ես բուսակեր եմ', romanized: 'Yes busaker em', ipa: '/jɛs busɑˈkɛɾ ɛm/', eng: 'I am vegetarian', literal: 'I vegetarian am', category: 'food', usage: 'Useful — Armenian cuisine is meat-heavy but has excellent vegetable dishes.' },

  // Shopping
  { id: 'ph043', arm: 'Ինչ արժե՞', romanized: 'Inch arzhe', ipa: '/intʃ ɑɾˈʒɛ/', eng: 'How much does it cost?', literal: 'What costs', category: 'shopping', usage: 'The everyday spoken form. Shorter than Ո՞րն է գինը.' },
  { id: 'ph044', arm: 'Շատ թանկ է', romanized: "Shat t'ank e", ipa: '/ʃɑt tʰɑŋk ɛ/', eng: 'It is too expensive', literal: 'Very expensive is', category: 'shopping', usage: 'Opening move when bargaining at a market like Vernissage.' },
  { id: 'ph045', arm: 'Սա կվերցնեմ', romanized: 'Sa kvertsnem', ipa: '/sɑ kvɛɾtsˈnɛm/', eng: "I'll take this", literal: 'This I will take', category: 'shopping', usage: 'Point at the item as you say it.' },
  { id: 'ph046', arm: 'Քարտով կարելի՞ է', romanized: "K'artov kareli e", ipa: '/kʰɑɾˈtov kɑɾɛˈli ɛ/', eng: 'Can I pay by card?', literal: 'By card possible is', category: 'shopping', usage: 'Many small shops in Armenia are still cash-only.' },

  // Directions & transport
  { id: 'ph047', arm: 'Որտե՞ղ է ...', romanized: 'Vortegh e ...', ipa: '/voɾˈtɛʁ ɛ/', eng: 'Where is ...?', literal: 'Where is', category: 'directions', usage: 'For a fixed location. Ո՞ւր է asks where something is going.' },
  { id: 'ph048', arm: 'Ուղիղ գնացեք', romanized: "Ughigh gnats'ek'", ipa: '/uˈʁiʁ ɡnɑˈtsɛkʰ/', eng: 'Go straight ahead', literal: 'Straight go (formal)', category: 'directions', usage: 'What you will hear in reply when you ask directions.' },
  { id: 'ph049', arm: 'Աջ / ձախ թեքվեք', romanized: "Aj / dzakh t'ek'vek'", ipa: '/ɑdʒ dzɑχ tʰɛkʰˈvɛkʰ/', eng: 'Turn right / left', literal: 'Right / left turn (formal)', category: 'directions', usage: 'Learn both — they come fast in spoken replies.' },
  { id: 'ph050', arm: 'Ինչքա՞ն հեռու է', romanized: "Inchk'an herru e", ipa: '/intʃˈkʰɑn hɛˈru ɛ/', eng: 'How far is it?', literal: 'How much far is', category: 'directions', usage: 'Follow up after asking where something is.' },
  { id: 'ph051', arm: 'Ես կորել եմ', romanized: 'Yes korel em', ipa: '/jɛs koˈɾɛl ɛm/', eng: 'I am lost', literal: 'I lost am', category: 'directions', usage: 'Gets you immediate help almost anywhere in Armenia.' },

  // Time
  { id: 'ph052', arm: 'Ժամը քանի՞սն է', romanized: "Zhamə k'anisn e", ipa: '/ʒɑˈmə kʰɑˈnisn ɛ/', eng: 'What time is it?', literal: 'The hour how-many is', category: 'time', usage: 'The standard way to ask the time.' },
  { id: 'ph053', arm: 'Ժամը երեքն է', romanized: "Zhamə yerek'n e", ipa: '/ʒɑˈmə jɛˈɾɛkʰn ɛ/', eng: 'It is three o\'clock', literal: 'The hour three is', category: 'time', usage: 'Swap in any number to tell the time.' },
  { id: 'ph054', arm: 'Ե՞րբ ես ազատ', romanized: 'Yerb es azat', ipa: '/jɛɾb ɛs ɑˈzɑt/', eng: 'When are you free?', literal: 'When are you free', category: 'time', usage: 'For making plans with a friend.' },
  { id: 'ph055', arm: 'Վաղը կտեսնվենք', romanized: "Vaghə ktesnvenk'", ipa: '/vɑˈʁə ktɛsnˈvɛnkʰ/', eng: 'See you tomorrow', literal: 'Tomorrow we will see each other', category: 'time', usage: 'A warm way to close a conversation.' },

  // Conversation & small talk
  { id: 'ph056', arm: 'Ի՞նչ նոր կա', romanized: 'Inch nor ka', ipa: '/intʃ noɾ kɑ/', eng: "What's new?", literal: 'What new is there', category: 'conversation', usage: 'Casual opener between friends.' },
  { id: 'ph057', arm: 'Համաձայն եմ', romanized: "Hamadzayn em", ipa: '/hɑmɑˈdzɑjn ɛm/', eng: 'I agree', literal: 'Agreeing am', category: 'conversation', usage: 'Useful in any discussion.' },
  { id: 'ph058', arm: 'Չգիտեմ', romanized: "Ch'gitem", ipa: '/tʃʰɡiˈtɛm/', eng: "I don't know", literal: 'Not I know', category: 'conversation', usage: 'The չ- prefix negates the verb — a core pattern in Armenian.' },
  { id: 'ph059', arm: 'Իսկ դու՞', romanized: 'Isk du', ipa: '/isk du/', eng: 'And you?', literal: 'And you', category: 'conversation', usage: 'Turns any answer back into a question. Keeps conversations alive.' },
  { id: 'ph060', arm: 'Շատ հետաքրքիր է', romanized: "Shat hetak'rk'ir e", ipa: '/ʃɑt hɛtɑkʰɾˈkʰiɾ ɛ/', eng: 'That is very interesting', literal: 'Very interesting is', category: 'conversation', usage: 'A safe, friendly response when you follow only part of what was said.' },
];

const phraseCategories = [
  { id: 'greetings',    label: 'Greetings & Farewells' },
  { id: 'courtesy',     label: 'Courtesy Phrases' },
  { id: 'questions',    label: 'Useful Questions' },
  { id: 'feelings',     label: 'Feelings & States' },
  { id: 'practical',    label: 'Practical' },
  { id: 'family',       label: 'Family' },
  { id: 'food',         label: 'Food & Restaurant' },
  { id: 'shopping',     label: 'Shopping' },
  { id: 'directions',   label: 'Directions' },
  { id: 'time',         label: 'Time' },
  { id: 'conversation', label: 'Small Talk' },
];
