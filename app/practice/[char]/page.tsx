import Link from "next/link";
import { notFound } from "next/navigation";
import StrokeAnimation from "@/components/StrokeAnimation";
import TraceCanvas from "@/components/TraceCanvas";
import FreeCanvas from "@/components/FreeCanvas";
import WordExamples from "@/components/WordExamples";
import { KATAKANA_LIST, KATAKANA_MAP } from "@/lib/katakana";

export const dynamicParams = true;

export default function PracticePage({
  params,
}: {
  params: { char: string };
}) {
  const char = decodeURIComponent(params.char);
  const item = KATAKANA_MAP[char];
  if (!item) notFound();

  const hasStrokes = !!item.strokes && item.strokes.length > 0;

  // 前後の文字を循環ナビゲーション (先頭で前を押すと末尾へ、末尾で次を押すと先頭へ)
  const currentIndex = KATAKANA_LIST.findIndex((k) => k.char === item.char);
  const total = KATAKANA_LIST.length;
  const prevItem = KATAKANA_LIST[(currentIndex - 1 + total) % total];
  const nextItem = KATAKANA_LIST[(currentIndex + 1) % total];

  return (
    <div className="space-y-8">
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-primary-700 shadow-sm hover:bg-primary-50"
        >
          ← もどる
        </Link>
        <span className="text-xs text-gray-500">{item.romaji.toUpperCase()}</span>
      </nav>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary-100 text-6xl font-bold text-primary-700">
            {item.char}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              「{item.char}」を れんしゅう しよう
            </h1>
            <p className="text-sm text-gray-600">よみかた: {item.reading}</p>
          </div>
        </div>
      </section>

      {hasStrokes ? (
        <>
          <section>
            <h2 className="mb-3 text-lg font-bold text-primary-700">
              ① かきじゅんを みてみよう
            </h2>
            <div className="mx-auto aspect-square w-full max-w-xs rounded-2xl border-2 border-primary-200 bg-white p-3 shadow-sm">
              <StrokeAnimation strokes={item.strokes!} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-primary-700">
              ② なぞって かいてみよう
            </h2>
            <TraceCanvas char={item.char} strokes={item.strokes!} />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-primary-700">
              ③ じゆうに かいてみよう
            </h2>
            <FreeCanvas char={item.char} />
          </section>
        </>
      ) : (
        <section className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center">
          <div className="text-5xl">🛠️</div>
          <p className="mt-2 text-lg font-bold text-amber-800">
            この もじの かきじゅんデータは じゅんびちゅうです
          </p>
          <p className="mt-1 text-sm text-amber-700">
            じゆうに かく スペースで れんしゅう できます。
          </p>
          <div className="mt-4">
            <FreeCanvas char={item.char} />
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold text-primary-700">
          「{item.char}」で はじまる ことば
        </h2>
        <WordExamples char={item.char} words={item.words} />
      </section>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href={`/practice/${encodeURIComponent(prevItem.char)}`}
          aria-label={`まえの もじ ${prevItem.char} へ`}
          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-base font-bold text-primary-700 shadow-md ring-2 ring-primary-200 hover:bg-primary-50 active:bg-primary-100"
        >
          <span aria-hidden="true">←</span>
          <span className="text-xl">{prevItem.char}</span>
        </Link>
        <Link
          href="/"
          className="inline-block rounded-full bg-primary-500 px-6 py-2 text-base font-bold text-white shadow-md hover:bg-primary-600 active:bg-primary-700"
        >
          ほかの もじを えらぶ
        </Link>
        <Link
          href={`/practice/${encodeURIComponent(nextItem.char)}`}
          aria-label={`つぎの もじ ${nextItem.char} へ`}
          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-base font-bold text-primary-700 shadow-md ring-2 ring-primary-200 hover:bg-primary-50 active:bg-primary-100"
        >
          <span className="text-xl">{nextItem.char}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
