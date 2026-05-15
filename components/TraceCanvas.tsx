"use client";

import { useEffect, useRef, useState } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import { VIEW_BOX } from "@/lib/katakana";
import { JudgeResult, judgeTrace } from "@/lib/judge";

type Props = {
  char: string;
  strokes: string[];
  viewBox?: string;
};

const RANK_STYLES: Record<JudgeResult["rank"], string> = {
  hanamaru: "bg-amber-100 text-amber-800 border-amber-300",
  good: "bg-green-100 text-green-800 border-green-300",
  soso: "bg-sky-100 text-sky-800 border-sky-300",
  tryagain: "bg-pink-100 text-pink-800 border-pink-300",
};

const RANK_ICONS: Record<JudgeResult["rank"], string> = {
  hanamaru: "💮",
  good: "⭕",
  soso: "🙂",
  tryagain: "💪",
};

export default function TraceCanvas({
  char,
  strokes,
  viewBox = VIEW_BOX,
}: Props) {
  const canvasHandleRef = useRef<DrawingCanvasHandle | null>(null);
  const [result, setResult] = useState<JudgeResult | null>(null);

  const reset = () => {
    canvasHandleRef.current?.clear();
    setResult(null);
  };

  const judge = () => {
    const canvas = canvasHandleRef.current?.getCanvas();
    if (!canvas) return;
    if (canvasHandleRef.current?.isEmpty()) {
      setResult({
        coverage: 0,
        perStroke: [],
        rank: "tryagain",
        message: "なぞって みよう！",
      });
      return;
    }
    const r = judgeTrace(strokes, viewBox, canvas);
    setResult(r);
  };

  return (
    <div className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-md rounded-2xl border-4 border-dashed border-primary-300 bg-white shadow-sm">
        {/* Template guide */}
        <svg
          viewBox={viewBox}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {strokes.map((d, i) => (
            <path
              key={`tmpl-${i}`}
              d={d}
              stroke="#cbd5e1"
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          <StrokeOrderMarkers strokes={strokes} />
        </svg>

        {/* User drawing canvas */}
        <DrawingCanvas
          ref={(h) => {
            canvasHandleRef.current = h;
          }}
          className="absolute inset-0 h-full w-full rounded-2xl"
          strokeColor="#0f172a"
          strokeWidth={18}
          resolution={640}
          ariaLabel={`${char} を なぞる`}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={judge}
          className="rounded-full bg-primary-500 px-6 py-2 text-base font-bold text-white shadow-md hover:bg-primary-600 active:bg-primary-700"
        >
          できた！ はんてい
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-gray-100 px-6 py-2 text-base font-bold text-gray-700 hover:bg-gray-200 active:bg-gray-300"
        >
          ↻ リセット
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 rounded-2xl border-2 p-4 text-center ${
            RANK_STYLES[result.rank]
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="text-4xl">{RANK_ICONS[result.rank]}</div>
          <div className="mt-1 text-lg font-bold">{result.message}</div>
          <div className="mt-1 text-sm">
            ぴったり ど: {Math.round(result.coverage * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}

function StrokeOrderMarkers({ strokes }: { strokes: string[] }) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const next = strokes.map((_, i) => {
      const p = refs.current[i];
      if (!p) return { x: 0, y: 0 };
      const pt = p.getPointAtLength(0);
      return { x: pt.x, y: pt.y };
    });
    setPositions(next);
  }, [strokes]);

  return (
    <>
      {strokes.map((d, i) => (
        <path
          key={`mark-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          d={d}
          stroke="transparent"
          fill="none"
        />
      ))}
      {positions.map((pos, i) => (
        <g key={`m-num-${i}`}>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={6}
            fill="#c2410c"
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={pos.x}
            y={pos.y + 3}
            textAnchor="middle"
            fontSize={8}
            fontWeight="bold"
            fill="white"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </>
  );
}
