"use client";

import { useRef } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";

type Props = {
  char: string;
};

export default function FreeCanvas({ char }: Props) {
  const handleRef = useRef<DrawingCanvasHandle | null>(null);

  const reset = () => handleRef.current?.clear();

  return (
    <div className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-md rounded-2xl border-4 border-dashed border-sky-300 bg-white shadow-sm">
        {/* "ten" shape guide lines (田 ガイド) */}
        <svg
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <line
            x1={50}
            y1={5}
            x2={50}
            y2={95}
            stroke="#bae6fd"
            strokeWidth={0.5}
            strokeDasharray="2 2"
          />
          <line
            x1={5}
            y1={50}
            x2={95}
            y2={50}
            stroke="#bae6fd"
            strokeWidth={0.5}
            strokeDasharray="2 2"
          />
        </svg>

        <DrawingCanvas
          ref={(h) => {
            handleRef.current = h;
          }}
          className="absolute inset-0 h-full w-full rounded-2xl"
          strokeColor="#0f172a"
          strokeWidth={18}
          resolution={640}
          ariaLabel={`${char} を じゆうに かく`}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-gray-100 px-6 py-2 text-base font-bold text-gray-700 hover:bg-gray-200 active:bg-gray-300"
        >
          ↻ リセット
        </button>
      </div>
    </div>
  );
}
