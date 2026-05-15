export type JudgeResult = {
  coverage: number; // 0 to 1
  perStroke: number[];
  rank: "hanamaru" | "good" | "soso" | "tryagain";
  message: string;
};

export type JudgeOptions = {
  // Sample density per stroke (proportional to stroke length).
  samplesPerUnitLength?: number;
  // Pixel radius around each sample point to consider "covered".
  radius?: number;
  // Minimum samples per stroke regardless of length.
  minSamples?: number;
};

const DEFAULTS = {
  samplesPerUnitLength: 1,
  radius: 14,
  minSamples: 24,
};

/**
 * Judge how well a user has traced the template strokes.
 *
 * @param templatePaths SVG path d-attributes for each template stroke.
 * @param svgViewBox e.g., "0 0 100 100" — used to map SVG coords to canvas pixels.
 * @param userCanvas The canvas the user drew on.
 */
export function judgeTrace(
  templatePaths: string[],
  svgViewBox: string,
  userCanvas: HTMLCanvasElement,
  options: JudgeOptions = {},
): JudgeResult {
  const opts = { ...DEFAULTS, ...options };
  const ctx = userCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return makeResult(0, []);
  }

  const w = userCanvas.width;
  const h = userCanvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const px = imageData.data;

  const [vbX, vbY, vbW, vbH] = svgViewBox.split(/\s+/).map(Number);
  const scaleX = w / vbW;
  const scaleY = h / vbH;

  // Build hidden SVG path elements to leverage getPointAtLength.
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", svgViewBox);
  // Off-DOM is fine; Firefox/Chromium both compute path geometry without layout.
  svg.style.position = "absolute";
  svg.style.left = "-9999px";
  svg.style.width = `${vbW}px`;
  svg.style.height = `${vbH}px`;
  document.body.appendChild(svg);

  try {
    const perStroke: number[] = [];
    let totalSamples = 0;
    let totalCovered = 0;

    for (const d of templatePaths) {
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);

      const length = path.getTotalLength();
      const n = Math.max(
        opts.minSamples,
        Math.ceil(length * opts.samplesPerUnitLength),
      );

      let covered = 0;
      for (let i = 0; i <= n; i++) {
        const t = (length * i) / n;
        const pt = path.getPointAtLength(t);
        const cx = (pt.x - vbX) * scaleX;
        const cy = (pt.y - vbY) * scaleY;
        if (hasInkNear(px, w, h, cx, cy, opts.radius)) {
          covered++;
        }
      }

      const ratio = (n + 1 === 0 ? 0 : covered / (n + 1));
      perStroke.push(ratio);
      totalCovered += covered;
      totalSamples += n + 1;
    }

    const coverage = totalSamples === 0 ? 0 : totalCovered / totalSamples;
    return makeResult(coverage, perStroke);
  } finally {
    svg.remove();
  }
}

function hasInkNear(
  pixels: Uint8ClampedArray,
  w: number,
  h: number,
  cx: number,
  cy: number,
  radius: number,
): boolean {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(w - 1, Math.ceil(cx + radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const y1 = Math.min(h - 1, Math.ceil(cy + radius));
  const r2 = radius * radius;
  // Step by 2 px for speed; we don't need every pixel.
  const step = 2;
  for (let y = y0; y <= y1; y += step) {
    for (let x = x0; x <= x1; x += step) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > r2) continue;
      const idx = (y * w + x) * 4 + 3; // alpha
      if (pixels[idx] > 30) {
        return true;
      }
    }
  }
  return false;
}

function makeResult(coverage: number, perStroke: number[]): JudgeResult {
  let rank: JudgeResult["rank"];
  let message: string;
  if (coverage >= 0.85) {
    rank = "hanamaru";
    message = "はなまる！とてもじょうずです！";
  } else if (coverage >= 0.65) {
    rank = "good";
    message = "よくできました！";
  } else if (coverage >= 0.4) {
    rank = "soso";
    message = "もうすこし！がんばろう！";
  } else {
    rank = "tryagain";
    message = "もういちど ちょうせん してみよう！";
  }
  return { coverage, perStroke, rank, message };
}
