export type MediaType = 'quotes' | 'books' // | 'movie' | 'game' | 'song'
export type MediaState = 'done' | 'doing' | 'todo'

export interface MediaRecord {
  name: string
  creator?: string
  state?: MediaState
  date?: string
  note?: string
  lang?: string
}

export const quotes: MediaRecord[] = [
  {
    name: 'Life shrinks or expands in proportion to one\'s courage.',
    creator: 'Anias Nin',
  },
  {
    name: 'The most difficult thing is the decision to act. The rest is merely tenacity.',
    creator: 'Amelia Earhart',
  },
  {
    name: 'Sing like no one is listening, love like you never been hurt, dance like no one is watching and live like it is heaven on earth.',
    creator: 'Mark Twain',
  },
  {
    name: 'People often say that motivation doesn\'t last. Well, neither does bathing. That\'s why we recommend it daily. ',
    creator: 'Zig Ziglar',
  },
  {
    name: 'If you hear a voice within you say \“you cannot paint,\” then by all means paint and that voice will be silenced.',
    creator: 'Vincent Van Gogh',
  },
  {
    name: 'I am not a product of my circumstances. I am a product of my decisions.',
    creator: 'Stephen Covey',
  },
  {
    name: 'Strive not to be a success, but rather to be of value.',
    creator: 'Albert Einstein',
  },
]

export const books: MediaRecord[] = [
  {
    name: 'How to Fail at Almost Everything and Still Win Big',
    creator: 'Scotts Adams',
  },
  {
    name: 'Zen and the Art of Motorcycle Maintenance',
    creator: 'Robert M. Pirsig',
  },
  {
    name: '被讨厌的勇气',
    creator: '岸见一郎',
  },
  {
    name: 'Die with Zero',
    creator: 'Bill Perkins',
  },
  {
    name: 'Clear Thinking',
    creator: 'Shane Parrish',
  },
  {
    name: 'The Pathless Path',
    creator: 'Paul Millerd',
  },
  {
    name: 'Outliers',
    creator: 'Malcolm Gladwel',
  },
  {
    name: 'Working in Public',
    creator: 'Nadia Eghbal',
  },
  {
    name: 'The Psychology of Money',
    creator: 'Morgan Housel',
  },
  {
    name: '10x Is Easier Than 2x',
    creator: 'Benjamin Hardy and Dan Sullivan',
  },
  {
    name: '三体',
    creator: '刘慈欣',
    lang: 'zh-cn',
  },
  {
    name: '独唱团',
    creator: '韩寒',
    lang: 'zh-cn',
  },
  {
    name: '白夜行',
    creator: '东野圭吾',
  },
  {
    name: 'ナミヤ雑貨店の奇蹟',
    creator: '东野圭吾',
  },
  {
    name: '容疑者Xの献身',
    creator: '东野圭吾',
  },
  {
    name: 'The Difference Engine',
    creator: 'William Gibson and Bruce Sterling',
  },
  {
    name: 'Neuromancer',
    creator: 'William Gibson',
  },
]

export const movie: MediaRecord[] = [
  {
    name: 'Avatar',
    creator: 'James Cameron',
  },
  {
    name: '君の名は。',
    creator: '新海誠',
  },
  {
    name: 'The Dark Knight',
    creator: 'Christopher Nolan',
  },
  {
    name: 'Inception',
    creator: 'Christopher Nolan',
  },
  {
    name: 'Spider-Man: Across the Spider-Verse',
    creator: 'Joaquim Santos, Kemp Powers, Justin Thompson',
  },
  {
    name: 'Interstellar',
    creator: 'Christopher Nolan',
  },
  {
    name: 'Tenet',
    creator: 'Christopher Nolan',
  },
  {
    name: '知らないカノジョ',
    creator: '三木孝浩',
  },
  {
    name: 'Dune',
    creator: 'Denis Villeneuve',
  },
  {
    name: 'No Time to Die',
    creator: 'Cary Joji Fukunaga',
  },
  {
    name: 'Everything Everywhere All at Once',
    creator: 'The Daniels',
  },
  {
    name: 'The Imitation Game',
    creator: 'Morten Tyldum',
  },
  {
    name: 'HER',
    creator: 'Spike Jonze',
  },
  {
    name: 'The King\'s Speech',
    creator: 'Tom Hooper',
  },
  {
    name: 'The Truman Show',
    creator: 'Peter Weir',
  },
  {
    name: 'The Martain',
    creator: 'Ridley Scott',
  },
  {
    name: 'PERFECT DAYS',
    creator: 'Wim Wenders',
  },
  {
    name: 'Joker',
    creator: 'Todd Phillips',
  },
  {
    name: 'One Day',
    creator: 'Lenny Abrahamson',
  },
  {
    name: 'Anonymous',
    creator: 'Akan Satayev',
  },
  {
    name: '好东西',
    creator: '邵艺辉',
  },
]

export const game: MediaRecord[] = [
  {
    name: 'Factorio',
    creator: 'Wube Software',
  },
  {
    name: 'Bloodborne',
    creator: 'FromSoftware',
  },
  {
    name: 'ELDEN RING',
    creator: 'FromSoftware',
  },
  {
    name: 'Dark Souls 3',
    creator: 'FromSoftware',
  },
  {
    name: 'Baldur\'s Gate 3',
    creator: 'Larian Studios',
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    creator: 'CD Projekt Red',
  },
  {
    name: 'FEZ',
    creator: 'Polytron',
  },
  {
    name: 'Frostpunk',
    creator: '11 bit studios',
  },
  {
    name: 'Besiege',
    creator: 'Landfall',
  },
  {
    name: 'Portal 2',
    creator: 'Valve',
  },
  {
    name: 'Terraria',
    creator: 'Re-Logic',
  },
  {
    name: 'Balatro',
    creator: 'LocalThunk',
  },
  {
    name: 'Slay the Spire',
    creator: 'Mega Crit Games',
  },
  {
    name: 'Satisfactory',
    creator: 'Coffee Stain Studios',
  },
  {
    name: 'There is no Game',
    creator: 'Kazuma Kondou',
  },
  {
    name: 'Papers, Please',
    creator: 'Lucas Pope',
  },
  {
    name: 'Undertale',
    creator: 'Toby Fox',
  },
  {
    name: 'Inscryption',
    creator: 'Daniel Mullins Games',
  },
  {
    name: 'Sekiro: Shadows Die Twice',
    creator: 'FromSoftware',
  },
  {
    name: 'Gorogoa',
    creator: 'Jason Roberts',
  },
  {
    name: 'It Takes Two',
    creator: 'Hazelight Studios',
  },
  {
    name: 'Desperados III',
    creator: 'Mimimi Games',
  },
  {
    name: 'What Remains of Edith Finch',
    creator: 'The Finch Team',
  },
  {
    name: 'Bastion',
    creator: 'Supergiant Games',
  },
  {
    name: 'Antichamber',
    creator: 'Alexander Bruce',
  },
  {
    name: 'Super Meat Boy',
    creator: 'Team Meat',
  },
  {
    name: 'The Stanley Parable',
    creator: 'The Stanley Parable Team',
  },
  {
    name: 'FAR: Lone Sails',
    creator: 'Okomotive',
  },
  {
    name: 'Machinarium',
    creator: 'Amanita Design',
  },
  {
    name: 'Die in the Dungeon',
    creator: 'ATICO',
  },
  {
    name: 'Risk of Rain',
    creator: 'Hopoo Games',
  },
  {
    name: 'Into the Breach',
    creator: 'Subset Games',
  },
  {
    name: 'Shogun Showdown',
    creator: 'Roboatino',
  },
  {
    name: 'Boomerang Fu',
    creator: 'Cranky Watermelon',
  },
  {
    name: 'SHENZHEN I/O',
    creator: 'Zachtronics',
  },
  {
    name: 'Opus Magnum',
    creator: 'Zachtronics',
  },
  {
    name: 'Last Call BBS',
    creator: 'Zachtronics',
  },
  {
    name: 'Hitman: Absolution',
    creator: 'IO Interactive',
  },
  {
    name: 'DmC: Devil May Cry',
    creator: 'Ninja Theory',
  },
  {
    name: 'dotAGE',
    creator: 'Michele Pirovano',
  },
  {
    name: 'Unrailed!',
    creator: 'Indoor Astronaut',
  },
  {
    name: 'World of Goo',
    creator: '2D Boy',
  },
  {
    name: 'Overcooked! 2',
    creator: 'Team17',
  },
  {
    name: '7 Billion Humans',
    creator: 'Tomorrow Corporation',
  },
  {
    name: 'UnEpic',
    creator: 'Unepic Games',
  },
  {
    name: 'Assassin\'s Creed 2',
    creator: 'Ubisoft',
  },
  {
    name: 'Aces & Adventures',
    creator: 'Triple.B.Titles',
  },
  {
    name: 'Storyteller',
    creator: 'Daniel Benmergui',
  },
  {
    name: 'Tom Clancy\'s Splinter Cell Blacklist',
    creator: 'Ubisoft',
  },
]

export const song = [
  {
    name: '陀飛輪',
    creator: '陳奕迅',
    lang: 'zh-Hant',
  },
  {
    name: '不用去猜',
    creator: 'Jony J',
    lang: 'zh-Hans',
  },
  {
    name: '知道',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: '山脚',
    creator: 'Jony J',
    lang: 'zh-Hans',
  },
  {
    name: '晚餐歌',
    creator: 'tuki.',
  },
  {
    name: '群青',
    creator: 'YOASOBI',
  },
  {
    name: 'たぶん',
    creator: 'YOASOBI',
  },
  {
    name: '博物館',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: 'Lemon',
    creator: '米津玄師',
  },
  {
    name: '說得簡單',
    creator: '脆樂團',
    lang: 'zh-Hant',
  },
  {
    name: '十年一刻',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '帶你飛',
    creator: '告五人',
    lang: 'zh-Hant',
  },
  {
    name: '唯一',
    creator: '告五人',
    lang: 'zh-Hant',
  },
  {
    name: '致姍姍來遲的你',
    creator: 'Asi & 林宥嘉',
    lang: 'zh-Hant',
  },
  {
    name: '藍眼睛',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: 'Ordinary Days',
    creator: 'milet',
  },
  {
    name: '空港曲',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: '梦遗少年',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: 'Mightnight Talk',
    creator: '幾田りら',
  },
  {
    name: '體面',
    creator: '于文文',
    lang: 'zh-Hant',
  },
  {
    name: 'Instagram',
    creator: 'DEAN',
  },
  {
    name: 'No Time to Die',
    creator: 'Billie Eilish',
  },
  {
    name: '想自由',
    creator: '林宥嘉',
    lang: 'zh-Hant',
  },
  {
    name: '耳朵',
    creator: '李荣浩',
    lang: 'zh-Hans',
  },
  {
    name: '大雨',
    creator: 'deca joins',
    lang: 'zh-Hant',
  },
  {
    name: 'idontwannabeyouanymore',
    creator: 'Billie Eilish',
  },
  {
    name: '烂俗的歌',
    creator: '汉堡黄',
    lang: 'zh-Hans',
  },
  {
    name: '乌鸦',
    creator: '汉堡黄',
    lang: 'zh-Hans',
  },
  {
    name: '頻率',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '喜歡寂寞',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '這天',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '被雨困住的城市',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '刚刚好',
    creator: '薛之谦',
    lang: 'zh-Hans',
  },
  {
    name: 'My Man',
    creator: 'Jony J',
    lang: 'zh-Hans',
  },
  {
    name: '前前前世',
    creator: 'RADWIMPS',
  },
  {
    name: 'Creep',
    creator: '蘇打綠',
  },
  {
    name: '有心論',
    creator: 'RADWIMPS',
  },
  {
    name: 'すずめ',
    creator: 'RADWIMPS',
  },
  {
    name: 'SPECIALZ',
    creator: 'King Gnu',
  },
  {
    name: '都是 Weather 你',
    creator: 'JOYCE 就以斯 & CAsPER',
    lang: 'zh-Hant',
  },
  {
    name: '百視達',
    creator: '黃玠瑋',
    lang: 'zh-Hant',
  },
  {
    name: '崇拜',
    creator: '薛之谦',
    lang: 'zh-Hans',
  },
  {
    name: 'Inside You',
    creator: 'milet',
  },
  {
    name: '打上花火',
    creator: 'DAOKO & 米津玄師',
  },
  {
    name: '易燃易爆炸',
    creator: '陈粒',
    lang: 'zh-Hans',
  },
  {
    name: '奇妙能力歌',
    creator: '陈粒',
    lang: 'zh-Hans',
  },
  {
    name: '路过人间',
    creator: '郁可唯',
    lang: 'zh-Hant',
  },
  {
    name: 'Encore un soir',
    creator: 'Céline Dion',
  },
  {
    name: 'masshiro',
    creator: '藤井風',
  },
  {
    name: 'I still',
    creator: 'milet',
  },
  {
    name: 'Les Champs-Élysées',
    creator: 'Joe Dassin',
  },
  {
    name: '黑暗的盡頭',
    creator: '脆樂團',
    lang: 'zh-Hant',
  },
  {
    name: '披星戴月的想你',
    creator: '告五人',
    lang: 'zh-Hant',
  },
  {
    name: '暧昧',
    creator: '薛之谦',
    lang: 'zh-Hans',
  },
  {
    name: 'Hello',
    creator: 'Adele',
  },
  {
    name: '走马',
    creator: '陈粒',
    lang: 'zh-Hans',
  },
  {
    name: '斑马,斑马',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: '遲到千年',
    creator: 'sodagreen',
    lang: 'zh-Hant',
  },
  {
    name: 'Normal',
    creator: 'Rouquine',
  },
]

export const media: Record<MediaType, MediaRecord[]> = {
  quotes,
  // movie,
  books,
  // game,
  // song,
}
