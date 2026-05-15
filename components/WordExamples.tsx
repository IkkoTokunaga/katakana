import type { KatakanaWord } from "@/lib/katakana";

type Props = {
  char: string;
  words: KatakanaWord[];
};

export default function WordExamples({ char, words }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {words.map((w) => (
        <li
          key={w.word}
          className="flex items-center gap-3 rounded-2xl border-2 border-primary-200 bg-primary-50 px-4 py-3 shadow-sm"
        >
          <span className="text-4xl" aria-hidden="true">
            {w.emoji}
          </span>
          <span className="text-xl font-bold text-gray-800">
            {highlight(w.word, char)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function highlight(word: string, char: string) {
  const parts = [...word];
  return parts.map((ch, i) => (
    <span
      key={`${ch}-${i}`}
      className={ch === char ? "text-primary-600" : ""}
    >
      {ch}
    </span>
  ));
}
