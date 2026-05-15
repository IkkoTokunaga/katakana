import strokesJson from "./katakana-strokes.json";

export type KatakanaWord = {
  word: string;
  emoji: string;
};

export type KatakanaItem = {
  char: string;
  reading: string;
  romaji: string;
  strokes?: string[];
  words: KatakanaWord[];
};

// KanjiVG SVGs are authored on a 109x109 grid.
export const VIEW_BOX = "0 0 109 109";

const STROKES = strokesJson as Record<string, string[]>;

type BaseEntry = Omit<KatakanaItem, "strokes">;

const BASE: BaseEntry[] = [
  {
    char: "ア",
    reading: "ア",
    romaji: "a",
    words: [
      { word: "アイス", emoji: "🍦" },
      { word: "アリ", emoji: "🐜" },
      { word: "アサ", emoji: "🌅" },
    ],
  },
  {
    char: "イ",
    reading: "イ",
    romaji: "i",
    words: [
      { word: "イス", emoji: "🪑" },
      { word: "イカ", emoji: "🦑" },
      { word: "イルカ", emoji: "🐬" },
    ],
  },
  {
    char: "ウ",
    reading: "ウ",
    romaji: "u",
    words: [
      { word: "ウサギ", emoji: "🐰" },
      { word: "ウマ", emoji: "🐴" },
      { word: "ウミ", emoji: "🌊" },
    ],
  },
  {
    char: "エ",
    reading: "エ",
    romaji: "e",
    words: [
      { word: "エビ", emoji: "🦐" },
      { word: "エガオ", emoji: "😊" },
      { word: "エンピツ", emoji: "✏️" },
    ],
  },
  {
    char: "オ",
    reading: "オ",
    romaji: "o",
    words: [
      { word: "オニ", emoji: "👹" },
      { word: "オバケ", emoji: "👻" },
      { word: "オリガミ", emoji: "📄" },
    ],
  },
  {
    char: "カ",
    reading: "カ",
    romaji: "ka",
    words: [
      { word: "カバ", emoji: "🦛" },
      { word: "カメ", emoji: "🐢" },
      { word: "カサ", emoji: "☂️" },
    ],
  },
  {
    char: "キ",
    reading: "キ",
    romaji: "ki",
    words: [
      { word: "キリン", emoji: "🦒" },
      { word: "キノコ", emoji: "🍄" },
      { word: "キツネ", emoji: "🦊" },
    ],
  },
  {
    char: "ク",
    reading: "ク",
    romaji: "ku",
    words: [
      { word: "クマ", emoji: "🐻" },
      { word: "クリ", emoji: "🌰" },
      { word: "クルマ", emoji: "🚗" },
    ],
  },
  {
    char: "ケ",
    reading: "ケ",
    romaji: "ke",
    words: [
      { word: "ケーキ", emoji: "🍰" },
      { word: "ケムリ", emoji: "💨" },
      { word: "ケイト", emoji: "🧶" },
    ],
  },
  {
    char: "コ",
    reading: "コ",
    romaji: "ko",
    words: [
      { word: "コアラ", emoji: "🐨" },
      { word: "コップ", emoji: "🥛" },
      { word: "コマ", emoji: "🌀" },
    ],
  },
  {
    char: "サ",
    reading: "サ",
    romaji: "sa",
    words: [
      { word: "サクラ", emoji: "🌸" },
      { word: "サル", emoji: "🐵" },
      { word: "サメ", emoji: "🦈" },
    ],
  },
  {
    char: "シ",
    reading: "シ",
    romaji: "shi",
    words: [
      { word: "シマウマ", emoji: "🦓" },
      { word: "シカ", emoji: "🦌" },
      { word: "シール", emoji: "🏷️" },
    ],
  },
  {
    char: "ス",
    reading: "ス",
    romaji: "su",
    words: [
      { word: "スイカ", emoji: "🍉" },
      { word: "スプーン", emoji: "🥄" },
      { word: "スズメ", emoji: "🐦" },
    ],
  },
  {
    char: "セ",
    reading: "セ",
    romaji: "se",
    words: [
      { word: "セミ", emoji: "🦗" },
      { word: "センセイ", emoji: "👨\u200d🏫" },
      { word: "セカイ", emoji: "🌍" },
    ],
  },
  {
    char: "ソ",
    reading: "ソ",
    romaji: "so",
    words: [
      { word: "ソフト", emoji: "🍦" },
      { word: "ソラ", emoji: "☁️" },
      { word: "ソリ", emoji: "🛷" },
    ],
  },
  {
    char: "タ",
    reading: "タ",
    romaji: "ta",
    words: [
      { word: "タコ", emoji: "🐙" },
      { word: "タイ", emoji: "🐟" },
      { word: "タマゴ", emoji: "🥚" },
    ],
  },
  {
    char: "チ",
    reading: "チ",
    romaji: "chi",
    words: [
      { word: "チーズ", emoji: "🧀" },
      { word: "チョウ", emoji: "🦋" },
    ],
  },
  {
    char: "ツ",
    reading: "ツ",
    romaji: "tsu",
    words: [
      { word: "ツキ", emoji: "🌙" },
      { word: "ツミキ", emoji: "🧱" },
    ],
  },
  {
    char: "テ",
    reading: "テ",
    romaji: "te",
    words: [
      { word: "テレビ", emoji: "📺" },
      { word: "テガミ", emoji: "✉️" },
      { word: "テント", emoji: "⛺" },
    ],
  },
  {
    char: "ト",
    reading: "ト",
    romaji: "to",
    words: [
      { word: "トラ", emoji: "🐅" },
      { word: "トリ", emoji: "🐦" },
      { word: "トマト", emoji: "🍅" },
    ],
  },
  {
    char: "ナ",
    reading: "ナ",
    romaji: "na",
    words: [
      { word: "ナス", emoji: "🍆" },
      { word: "ナシ", emoji: "🍐" },
      { word: "ナイフ", emoji: "🔪" },
    ],
  },
  {
    char: "ニ",
    reading: "ニ",
    romaji: "ni",
    words: [
      { word: "ニワトリ", emoji: "🐔" },
      { word: "ニク", emoji: "🍖" },
      { word: "ニジ", emoji: "🌈" },
    ],
  },
  {
    char: "ヌ",
    reading: "ヌ",
    romaji: "nu",
    words: [
      { word: "ヌイグルミ", emoji: "🧸" },
      { word: "ヌノ", emoji: "🧵" },
    ],
  },
  {
    char: "ネ",
    reading: "ネ",
    romaji: "ne",
    words: [
      { word: "ネコ", emoji: "🐱" },
      { word: "ネズミ", emoji: "🐭" },
    ],
  },
  {
    char: "ノ",
    reading: "ノ",
    romaji: "no",
    words: [
      { word: "ノート", emoji: "📓" },
      { word: "ノリ", emoji: "🍙" },
    ],
  },
  {
    char: "ハ",
    reading: "ハ",
    romaji: "ha",
    words: [
      { word: "ハサミ", emoji: "✂️" },
      { word: "ハナ", emoji: "🌷" },
      { word: "ハト", emoji: "🕊️" },
    ],
  },
  {
    char: "ヒ",
    reading: "ヒ",
    romaji: "hi",
    words: [
      { word: "ヒコウキ", emoji: "✈️" },
      { word: "ヒツジ", emoji: "🐑" },
      { word: "ヒマワリ", emoji: "🌻" },
    ],
  },
  {
    char: "フ",
    reading: "フ",
    romaji: "fu",
    words: [
      { word: "フネ", emoji: "⛵" },
      { word: "フウセン", emoji: "🎈" },
      { word: "フエ", emoji: "🎺" },
    ],
  },
  {
    char: "ヘ",
    reading: "ヘ",
    romaji: "he",
    words: [
      { word: "ヘビ", emoji: "🐍" },
      { word: "ヘリ", emoji: "🚁" },
      { word: "ヘヤ", emoji: "🛏️" },
    ],
  },
  {
    char: "ホ",
    reading: "ホ",
    romaji: "ho",
    words: [
      { word: "ホシ", emoji: "⭐" },
      { word: "ホン", emoji: "📚" },
    ],
  },
  {
    char: "マ",
    reading: "マ",
    romaji: "ma",
    words: [
      { word: "マスク", emoji: "😷" },
      { word: "マド", emoji: "🪟" },
      { word: "マメ", emoji: "🫘" },
    ],
  },
  {
    char: "ミ",
    reading: "ミ",
    romaji: "mi",
    words: [
      { word: "ミカン", emoji: "🍊" },
      { word: "ミルク", emoji: "🥛" },
      { word: "ミズ", emoji: "💧" },
    ],
  },
  {
    char: "ム",
    reading: "ム",
    romaji: "mu",
    words: [
      { word: "ムシ", emoji: "🐛" },
      { word: "ムギ", emoji: "🌾" },
    ],
  },
  {
    char: "メ",
    reading: "メ",
    romaji: "me",
    words: [
      { word: "メガネ", emoji: "👓" },
      { word: "メロン", emoji: "🍈" },
      { word: "メダル", emoji: "🥇" },
    ],
  },
  {
    char: "モ",
    reading: "モ",
    romaji: "mo",
    words: [
      { word: "モモ", emoji: "🍑" },
      { word: "モリ", emoji: "🌲" },
    ],
  },
  {
    char: "ヤ",
    reading: "ヤ",
    romaji: "ya",
    words: [
      { word: "ヤマ", emoji: "⛰️" },
      { word: "ヤサイ", emoji: "🥬" },
      { word: "ヤギ", emoji: "🐐" },
    ],
  },
  {
    char: "ユ",
    reading: "ユ",
    romaji: "yu",
    words: [
      { word: "ユキ", emoji: "❄️" },
      { word: "ユメ", emoji: "💭" },
      { word: "ユビ", emoji: "👆" },
    ],
  },
  {
    char: "ヨ",
    reading: "ヨ",
    romaji: "yo",
    words: [
      { word: "ヨル", emoji: "🌃" },
      { word: "ヨット", emoji: "⛵" },
    ],
  },
  {
    char: "ラ",
    reading: "ラ",
    romaji: "ra",
    words: [
      { word: "ライオン", emoji: "🦁" },
      { word: "ラクダ", emoji: "🐫" },
      { word: "ラッパ", emoji: "🎺" },
    ],
  },
  {
    char: "リ",
    reading: "リ",
    romaji: "ri",
    words: [
      { word: "リンゴ", emoji: "🍎" },
      { word: "リス", emoji: "🐿️" },
      { word: "リボン", emoji: "🎀" },
    ],
  },
  {
    char: "ル",
    reading: "ル",
    romaji: "ru",
    words: [
      { word: "ルビー", emoji: "💎" },
      { word: "ボール", emoji: "⚽" },
    ],
  },
  {
    char: "レ",
    reading: "レ",
    romaji: "re",
    words: [
      { word: "レモン", emoji: "🍋" },
      { word: "レンコン", emoji: "🪷" },
    ],
  },
  {
    char: "ロ",
    reading: "ロ",
    romaji: "ro",
    words: [
      { word: "ロケット", emoji: "🚀" },
      { word: "ロボット", emoji: "🤖" },
      { word: "ロウソク", emoji: "🕯️" },
    ],
  },
  {
    char: "ワ",
    reading: "ワ",
    romaji: "wa",
    words: [
      { word: "ワニ", emoji: "🐊" },
      { word: "ワタアメ", emoji: "🍬" },
    ],
  },
  {
    char: "ヲ",
    reading: "ヲ",
    romaji: "wo",
    words: [
      { word: "ホンヲヨム", emoji: "📖" },
      { word: "ミズヲノム", emoji: "💧" },
    ],
  },
  {
    char: "ン",
    reading: "ン",
    romaji: "n",
    words: [
      { word: "パン", emoji: "🍞" },
      { word: "ペンギン", emoji: "🐧" },
      { word: "ミカン", emoji: "🍊" },
    ],
  },
];

const data: KatakanaItem[] = BASE.map((b) => ({
  ...b,
  strokes: STROKES[b.char],
}));

export const KATAKANA_LIST: KatakanaItem[] = data;

export const KATAKANA_MAP: Record<string, KatakanaItem> = Object.fromEntries(
  data.map((k) => [k.char, k]),
);

// Standard 50-sounds chart layout (gyou × dan). Empty strings = blank cell.
export const GOJUON_GRID: string[][] = [
  ["ア", "イ", "ウ", "エ", "オ"],
  ["カ", "キ", "ク", "ケ", "コ"],
  ["サ", "シ", "ス", "セ", "ソ"],
  ["タ", "チ", "ツ", "テ", "ト"],
  ["ナ", "ニ", "ヌ", "ネ", "ノ"],
  ["ハ", "ヒ", "フ", "ヘ", "ホ"],
  ["マ", "ミ", "ム", "メ", "モ"],
  ["ヤ", "", "ユ", "", "ヨ"],
  ["ラ", "リ", "ル", "レ", "ロ"],
  ["ワ", "", "ヲ", "", "ン"],
];

export function getKatakana(char: string): KatakanaItem | undefined {
  return KATAKANA_MAP[char];
}
