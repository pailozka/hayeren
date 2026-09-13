// ===== GRAMMAR NOTES =====
// Eastern Armenian. Each note is one focused idea with a table of forms and
// example sentences, sized to fit a single ~10-minute study session.
// Referenced from curriculum.js by `grammarId`.

const grammarNotes = [
  {
    id: 'g-to-be',
    title: 'To Be — եմ',
    summary: 'Armenian has no word for "a" or "the" before the verb, and "to be" is a short unstressed word that follows what it describes.',
    body: 'In English the verb comes before the description: "I am tired." In Armenian the order flips — the description comes first, then the verb: Հոգնած եմ (tired am). The verb եմ is never stressed and leans on the word before it.',
    table: {
      head: ['Person', 'Armenian', 'Romanized', 'English'],
      rows: [
        ['1sg', 'եմ', 'em', 'I am'],
        ['2sg', 'ես', 'es', 'you are'],
        ['3sg', 'է', 'e', 'he/she/it is'],
        ['1pl', 'ենք', "enk'", 'we are'],
        ['2pl', 'եք', "ek'", 'you are (pl/formal)'],
        ['3pl', 'են', 'en', 'they are'],
      ],
    },
    examples: [
      { arm: 'Ես ուսանող եմ։', rom: 'Yes usanogh em.', eng: 'I am a student.' },
      { arm: 'Նա բժիշկ է։', rom: 'Na bzhishk e.', eng: 'He/She is a doctor.' },
      { arm: 'Մենք Երևանում ենք։', rom: "Menk' Yerevanum enk'.", eng: 'We are in Yerevan.' },
    ],
    tip: 'To negate, use չեմ, չես, չէ, չենք, չեք, չեն — the չ- prefix does the work: Ես ուսանող չեմ (I am not a student).',
  },
  {
    id: 'g-plurals',
    title: 'Making Plurals',
    summary: 'Add -եր to one-syllable words and -ներ to longer ones. That single rule covers most nouns.',
    body: 'Armenian plurals are refreshingly regular. Count the syllables of the singular noun: one syllable takes -եր, two or more take -ներ. Unlike English there are very few irregulars to memorize.',
    table: {
      head: ['Singular', 'Syllables', 'Plural', 'English'],
      rows: [
        ['գիրք (girk\')', '1', "գրքեր (grk'er)", 'book → books'],
        ['տուն (tun)', '1', 'տներ (tner)', 'house → houses'],
        ['սեղան (seghan)', '2', 'սեղաններ (seghanner)', 'table → tables'],
        ['ուսանող (usanogh)', '3', 'ուսանողներ (usanoghner)', 'student → students'],
      ],
    },
    examples: [
      { arm: 'Սեղանին գրքեր կան։', rom: "Seghanin grk'er kan.", eng: 'There are books on the table.' },
      { arm: 'Ես երեք քույր ունեմ։', rom: "Yes yerek' k'uyr unem.", eng: 'I have three sisters.' },
    ],
    tip: 'After a number, the noun stays SINGULAR: երեք գիրք (three book), never երեք գրքեր. This trips up English speakers constantly.',
  },
  {
    id: 'g-present-tense',
    title: 'Present Tense',
    summary: 'Take the verb stem, add -ում, then follow it with the matching form of եմ. Two pieces, always.',
    body: 'The Armenian present is a compound: a participle ending in -ում plus the "to be" verb. Drop the infinitive ending (-ել or -ալ) to get the stem, add -ում, then add եմ / ես / է and so on. The two words can swap order for emphasis.',
    table: {
      head: ['Infinitive', 'Stem + ում', 'With եմ', 'English'],
      rows: [
        ['կարդալ (to read)', 'կարդում', 'կարդում եմ', 'I read / am reading'],
        ['խոսել (to speak)', 'խոսում', 'խոսում ես', 'you speak'],
        ['ուտել (to eat)', 'ուտում', 'ուտում է', 'he/she eats'],
        ['սովորել (to learn)', 'սովորում', "սովորում ենք", 'we learn'],
      ],
    },
    examples: [
      { arm: 'Ես հայերեն եմ սովորում։', rom: "Yes hayeren em sovorum.", eng: 'I am learning Armenian.' },
      { arm: 'Նա գիրք է կարդում։', rom: "Na girk' e kardum.", eng: 'He/She is reading a book.' },
      { arm: 'Չեմ հասկանում։', rom: "Ch'em haskanum.", eng: 'I do not understand.' },
    ],
    tip: 'Armenian makes no distinction between "I read" and "I am reading" — one form covers both. Negate by putting չ- on the եմ part: չեմ կարդում.',
  },
  {
    id: 'g-demonstratives',
    title: 'This & That',
    summary: 'Armenian has a three-way distance system: near me, near you, and over there.',
    body: 'Where English has only "this" and "that", Armenian distinguishes three degrees of distance — and the same s / d / n pattern reappears across pronouns, adverbs, and the definite article.',
    table: {
      head: ['Armenian', 'Romanized', 'Meaning', 'Distance'],
      rows: [
        ['սա / այս', 'sa / ays', 'this', 'near the speaker'],
        ['դա / այդ', 'da / ayd', 'that', 'near the listener'],
        ['նա / այն', 'na / ayn', 'that over there', 'away from both'],
        ['այստեղ', 'aystegh', 'here', 'near the speaker'],
        ['այդտեղ', 'aydtegh', 'there', 'near the listener'],
        ['այնտեղ', 'ayntegh', 'over there', 'away from both'],
      ],
    },
    examples: [
      { arm: 'Սա իմ գիրքն է։', rom: "Sa im girk'n e.", eng: 'This is my book.' },
      { arm: 'Այն տունը մեծ է։', rom: 'Ayn tunə mets e.', eng: 'That house (over there) is big.' },
    ],
    tip: 'սա/դա/նա stand alone ("this is..."); այս/այդ/այն come before a noun ("this book"). Same meaning, different slot.',
  },
  {
    id: 'g-numbers',
    title: 'Counting Above Ten',
    summary: 'Armenian numbers are built by stacking: twenty-one is literally "twenty one".',
    body: 'Once you know 1–10 plus the multiples of ten, you can build every number up to 99 by simple concatenation — no irregular teens like English "eleven" or "twelve".',
    table: {
      head: ['Number', 'Armenian', 'Romanized', 'Literally'],
      rows: [
        ['11', 'տասնմեկ', 'tasnmek', 'ten-one'],
        ['12', 'տասներկու', 'tasnerku', 'ten-two'],
        ['20', 'քսան', "k'san", '—'],
        ['21', 'քսանմեկ', "k'sanmek", 'twenty-one'],
        ['30', 'երեսուն', 'yeresun', '—'],
        ['50', 'հիսուն', 'hisun', '—'],
        ['100', 'հարյուր', 'haryur', '—'],
        ['1000', 'հազար', 'hazar', '—'],
      ],
    },
    examples: [
      { arm: 'Ես քսաներեք տարեկան եմ։', rom: "Yes k'sanerek' tarekan em.", eng: 'I am twenty-three years old.' },
      { arm: 'Հարյուր դրամ։', rom: 'Haryur dram.', eng: 'One hundred dram.' },
    ],
    tip: 'Armenian also has classical letter-numerals, where Ա=1, Բ=2, Գ=3. You will see them on monuments and in old books.',
  },
  {
    id: 'g-questions',
    title: 'Questions & the ՞ Mark',
    summary: 'Armenian marks questions with a symbol placed inside the stressed word, not at the end of the sentence.',
    body: 'There is no question mark at the end of an Armenian sentence. Instead the հարցական նշան (՞) sits directly above the stressed vowel of the word being asked about — which means the same words can ask different questions depending on where the mark goes. Word order does not need to change.',
    table: {
      head: ['Armenian', 'Romanized', 'English'],
      rows: [
        ['Ի՞նչ', 'Inch', 'What?'],
        ['Ո՞վ', 'Ov', 'Who?'],
        ['Որտե՞ղ', 'Vortegh', 'Where (at)?'],
        ['Ո՞ւր', 'Ur', 'Where (to)?'],
        ['Ե՞րբ', 'Yerb', 'When?'],
        ['Ինչու՞', 'Inchu', 'Why?'],
        ['Ինչպե՞ս', 'Inchpes', 'How?'],
        ['Քանի՞', "K'ani", 'How many?'],
      ],
    },
    examples: [
      { arm: 'Դու՞ ես գնում։', rom: 'Du es gnum?', eng: 'Are YOU going? (emphasis on you)' },
      { arm: 'Դու գնու՞մ ես։', rom: 'Du gnum es?', eng: 'Are you GOING? (emphasis on the action)' },
    ],
    tip: 'Sentence-final punctuation in Armenian is the վերջակետ (։), which looks like a colon but works like a full stop.',
  },
  {
    id: 'g-want',
    title: 'I Want / I Would Like',
    summary: 'ուզում եմ plus an infinitive covers requests, wishes, and polite ordering.',
    body: 'The verb ուզել (to want) follows the standard present-tense pattern: ուզում եմ. To want to DO something, follow it with the plain infinitive. To want a THING, just name the thing.',
    table: {
      head: ['Armenian', 'Romanized', 'English'],
      rows: [
        ['ուզում եմ', 'uzum em', 'I want'],
        ['ուզում ես', 'uzum es', 'you want'],
        ['ուզում է', 'uzum e', 'he/she wants'],
        ['չեմ ուզում', "ch'em uzum", 'I do not want'],
      ],
    },
    examples: [
      { arm: 'Ես սուրճ եմ ուզում։', rom: 'Yes surj em uzum.', eng: 'I want coffee.' },
      { arm: 'Ուզում եմ ջուր խմել։', rom: 'Uzum em jur khmel.', eng: 'I want to drink water.' },
      { arm: 'Ի՞նչ ես ուզում։', rom: 'Inch es uzum?', eng: 'What do you want?' },
    ],
    tip: 'For extra politeness, use կուզենայի (kuzenayi, "I would like") instead — the conditional softens a request the same way it does in English.',
  },
  {
    id: 'g-locative',
    title: 'Where? The Locative',
    summary: 'Add -ում to a place to say "in" or "at" it. No separate preposition needed.',
    body: 'Armenian is a case language: the role a noun plays is shown by an ending rather than by a preposition. For location, the locative case ending -ում attaches directly to the noun — so "in Yerevan" is a single word.',
    table: {
      head: ['Base', 'Locative', 'Romanized', 'English'],
      rows: [
        ['Երևան', 'Երևանում', 'Yerevanum', 'in Yerevan'],
        ['տուն', 'տանը', 'tanə', 'at home (irregular)'],
        ['քաղաք', "քաղաքում", "k'aghak'um", 'in the city'],
        ['դպրոց', 'դպրոցում', 'dprotsum', 'at school'],
      ],
    },
    examples: [
      { arm: 'Ես Երևանում եմ ապրում։', rom: 'Yes Yerevanum em aprum.', eng: 'I live in Yerevan.' },
      { arm: 'Նա դպրոցում է։', rom: 'Na dprotsum e.', eng: 'He/She is at school.' },
    ],
    tip: 'The locative works for places, not people. For people use մոտ: ես ընկերոջս մոտ եմ (I am at my friend\'s place).',
  },
  {
    id: 'g-time',
    title: 'Telling Time',
    summary: 'Ժամը plus a number gives the hour. The word ժամ means both "hour" and "clock".',
    body: 'To ask the time: Ժամը քանի՞սն է. To answer, say Ժամը plus the number plus է. Times of day are expressed with dedicated adverbs rather than "in the...".',
    table: {
      head: ['Armenian', 'Romanized', 'English'],
      rows: [
        ['Ժամը քանի՞սն է', "Zhamə k'anisn e", 'What time is it?'],
        ['Ժամը հինգն է', 'Zhamə hingn e', 'It is five o\'clock'],
        ['առավոտյան', 'aravotyan', 'in the morning'],
        ['ցերեկը', "ts'erekə", 'during the day'],
        ['երեկոյան', 'yerekoyan', 'in the evening'],
        ['գիշերը', 'gisherə', 'at night'],
      ],
    },
    examples: [
      { arm: 'Ժամը ութն է։', rom: "Zhamə ut'n e.", eng: 'It is eight o\'clock.' },
      { arm: 'Առավոտյան սուրճ եմ խմում։', rom: 'Aravotyan surj em khmum.', eng: 'In the morning I drink coffee.' },
    ],
    tip: 'For half past, use կես (kes, half): ժամը հինգն անց կես — half past five.',
  },
  {
    id: 'g-comparison',
    title: 'Comparison',
    summary: 'Use ավելի for "more" and ամենա- for "most". The thing compared against takes -ից.',
    body: 'Armenian does not change the adjective itself the way English does ("big → bigger"). Instead it puts ավելի in front, and attaches -ից ("than") to whatever is being compared against. Superlatives use the prefix ամենա-.',
    table: {
      head: ['Form', 'Armenian', 'Romanized', 'English'],
      rows: [
        ['base', 'մեծ', 'mets', 'big'],
        ['comparative', 'ավելի մեծ', 'aveli mets', 'bigger'],
        ['superlative', 'ամենամեծ', 'amenamets', 'biggest'],
        ['than', '-ից', '-its', 'than'],
      ],
    },
    examples: [
      { arm: 'Այս տունը ավելի մեծ է։', rom: 'Ays tunə aveli mets e.', eng: 'This house is bigger.' },
      { arm: 'Արարատը Հայաստանի ամենաբարձր լեռն է։', rom: "Araratə Hayastani amenabardzr lerrn e.", eng: 'Ararat is the highest mountain of Armenia.' },
      { arm: 'Ես քեզնից բարձր եմ։', rom: "Yes k'eznits bardzr em.", eng: 'I am taller than you.' },
    ],
    tip: 'ավելի լավ (better) and ամենալավ (best) are the two you will use most — learn them as fixed pairs.',
  },
];

function getGrammarNote(id) {
  return grammarNotes.find(g => g.id === id) || null;
}
