"use client";

import { useEffect, useState } from "react";

type Props = {
  traceId: string;
  freeId: string;
  hideWhenVisibleId?: string;
};

export default function ScrollSectionButtons({
  traceId,
  freeId,
  hideWhenVisibleId,
}: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!hideWhenVisibleId) return;
    const target = document.getElementById(hideWhenVisibleId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -40px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideWhenVisibleId]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-30 flex flex-col gap-2 transition-opacity duration-200 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="navigation"
      aria-label="れんしゅう セクションへ ジャンプ"
      aria-hidden={hidden}
    >
      <button
        type="button"
        onClick={() => scrollTo(traceId)}
        className="flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg ring-2 ring-white hover:bg-primary-600 active:bg-primary-700"
        aria-label="なぞる ブロックへ"
      >
        <span aria-hidden="true">✏️</span>
        <span>② なぞる</span>
      </button>
      <button
        type="button"
        onClick={() => scrollTo(freeId)}
        className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg ring-2 ring-white hover:bg-amber-600 active:bg-amber-700"
        aria-label="じゆうに かく ブロックへ"
      >
        <span aria-hidden="true">🎨</span>
        <span>③ じゆうに</span>
      </button>
    </div>
  );
}
