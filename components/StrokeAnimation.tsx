"use client";

import { useEffect, useRef, useState } from "react";
import { VIEW_BOX } from "@/lib/katakana";

type Props = {
  strokes: string[];
  viewBox?: string;
  durationPerStroke?: number; // ms
  pause?: number; // ms between strokes
  loop?: boolean;
  className?: string;
};

export default function StrokeAnimation({
  strokes,
  viewBox = VIEW_BOX,
  durationPerStroke = 1400,
  pause = 600,
  loop = true,
  className,
}: Props) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);
  const [penPos, setPenPos] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Re-trigger animation when strokes change or replay tick changes.
  useEffect(() => {
    setActiveIndex(0);
    setProgress(0);
    setPenPos(null);
    startRef.current = null;
  }, [strokes, tick]);

  useEffect(() => {
    if (strokes.length === 0) return;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(1, elapsed / durationPerStroke);
      setProgress(t);

      const path = pathRefs.current[activeIndex];
      if (path) {
        const length = path.getTotalLength();
        const pt = path.getPointAtLength(length * t);
        setPenPos({ x: pt.x, y: pt.y });
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        if (activeIndex < strokes.length - 1) {
          window.setTimeout(() => {
            setActiveIndex((idx) => idx + 1);
            setProgress(0);
            startRef.current = null;
          }, pause);
        } else if (loop) {
          window.setTimeout(() => {
            setTick((n) => n + 1);
          }, pause * 2);
        }
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, durationPerStroke, loop, pause, strokes.length]);

  const replay = () => setTick((n) => n + 1);

  return (
    <div className={className}>
      <svg
        viewBox={viewBox}
        className="block w-full h-full"
        aria-label="かきじゅん あにめーしょん"
      >
        {/* Faint guide of all strokes */}
        {strokes.map((d, i) => (
          <path
            key={`guide-${i}`}
            d={d}
            stroke="#e5e7eb"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
        {/* Already completed strokes */}
        {strokes.map((d, i) => {
          if (i >= activeIndex) return null;
          return (
            <path
              key={`done-${i}`}
              d={d}
              stroke="#3b82f6"
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          );
        })}
        {/* Active stroke (partial via dashoffset) */}
        {strokes.map((d, i) => {
          if (i !== activeIndex) return null;
          const pathEl = pathRefs.current[i];
          const length = pathEl?.getTotalLength?.() ?? 200;
          const offset = length * (1 - progress);
          return (
            <path
              key={`active-${i}`}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={d}
              stroke="#3b82f6"
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={length}
              strokeDashoffset={offset}
            />
          );
        })}
        {/* Hidden references for not-yet-active strokes so refs are populated */}
        {strokes.map((d, i) => {
          if (i <= activeIndex) return null;
          return (
            <path
              key={`hidden-${i}`}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={d}
              stroke="transparent"
              fill="none"
            />
          );
        })}
        {/* Stroke order numbers */}
        <StrokeNumbers strokes={strokes} />
        {/* Pen indicator */}
        {penPos && (
          <circle
            cx={penPos.x}
            cy={penPos.y}
            r={5}
            fill="#ef4444"
            stroke="white"
            strokeWidth={2}
          />
        )}
      </svg>
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={replay}
          className="rounded-full bg-primary-100 px-4 py-1 text-sm font-bold text-primary-700 hover:bg-primary-200 active:bg-primary-300"
        >
          ↻ もういちど みる
        </button>
      </div>
    </div>
  );
}

function StrokeNumbers({ strokes }: { strokes: string[] }) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const measureRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const next = strokes.map((_, i) => {
      const p = measureRefs.current[i];
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
          key={`measure-${i}`}
          ref={(el) => {
            measureRefs.current[i] = el;
          }}
          d={d}
          stroke="transparent"
          fill="none"
        />
      ))}
      {positions.map((pos, i) => (
        <g key={`num-${i}`}>
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
