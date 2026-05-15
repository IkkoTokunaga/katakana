"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type DrawingCanvasHandle = {
  clear: () => void;
  getCanvas: () => HTMLCanvasElement | null;
  isEmpty: () => boolean;
};

type Props = {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  // Logical pixel size used as the canvas's drawing buffer.
  // The element itself is rendered responsively via CSS (width 100%).
  resolution?: number;
  ariaLabel?: string;
};

const DrawingCanvas = forwardRef<DrawingCanvasHandle, Props>(function DrawingCanvas(
  {
    className,
    strokeColor = "#1f2937",
    strokeWidth = 10,
    resolution = 600,
    ariaLabel,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasInkRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);

  const getCtx = () =>
    canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInkRef.current = false;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      clear,
      getCanvas: () => canvasRef.current,
      isEmpty: () => !hasInkRef.current,
    }),
    [clear],
  );

  const getPos = useCallback((e: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = resolution;
    canvas.height = resolution;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
    }
  }, [resolution, strokeColor, strokeWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: PointerEvent) => {
      if (activePointerIdRef.current !== null) return;
      activePointerIdRef.current = e.pointerId;
      drawingRef.current = true;
      const pos = getPos(e);
      lastPointRef.current = pos;
      const ctx = getCtx();
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      // Draw a small dot so a tap leaves a mark.
      ctx.arc(pos.x, pos.y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
      hasInkRef.current = true;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Ignore: some browsers throw on synthetic pointer events.
      }
      e.preventDefault();
    };

    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      if (activePointerIdRef.current !== e.pointerId) return;
      const ctx = getCtx();
      if (!ctx) return;
      const pos = getPos(e);
      const last = lastPointRef.current;
      if (!last) return;
      const midX = (last.x + pos.x) / 2;
      const midY = (last.y + pos.y) / 2;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.quadraticCurveTo(last.x, last.y, midX, midY);
      ctx.stroke();
      lastPointRef.current = { x: midX, y: midY };
      e.preventDefault();
    };

    const onUp = (e: PointerEvent) => {
      if (activePointerIdRef.current !== e.pointerId) return;
      drawingRef.current = false;
      activePointerIdRef.current = null;
      const last = lastPointRef.current;
      if (last) {
        const ctx = getCtx();
        if (ctx) {
          ctx.beginPath();
          ctx.arc(last.x, last.y, ctx.lineWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = strokeColor;
          ctx.fill();
        }
      }
      lastPointRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore: pointer might already be released.
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onUp);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, [getPos, strokeColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={ariaLabel}
      role="img"
      style={{ touchAction: "none" }}
    />
  );
});

export default DrawingCanvas;
