/**
 * Favicon と OGP 画像を生成するスクリプト。
 *
 * - scripts/assets/icon-source.svg (「ア」の KanjiVG パス) を元に
 *   - app/favicon.ico (16, 32, 48 マルチサイズ)
 *   - app/icon.png (512x512)
 *   - app/apple-icon.png (180x180)
 * - scripts/assets/ogp-source.png を元に
 *   - app/opengraph-image.png (1200x630)
 *   - app/twitter-image.png (1200x630, OGP と同一内容)
 *
 * 実行: コンテナ内で `npm run generate:assets`
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const appDir = path.join(root, "app");
const assetsDir = path.join(root, "scripts/assets");

async function generateFavicons() {
  const svg = await readFile(path.join(assetsDir, "icon-source.svg"));

  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(svg, { density: 384 })
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    ),
  );

  const ico = await pngToIco(pngBuffers);
  await writeFile(path.join(appDir, "favicon.ico"), ico);
  console.log(`✓ app/favicon.ico (${sizes.join(", ")}px)`);

  const appleBuffer = await sharp(svg, { density: 720 })
    .resize(180, 180)
    .png()
    .toBuffer();
  await writeFile(path.join(appDir, "apple-icon.png"), appleBuffer);
  console.log("✓ app/apple-icon.png (180x180)");

  const icon512 = await sharp(svg, { density: 1024 })
    .resize(512, 512)
    .png()
    .toBuffer();
  await writeFile(path.join(appDir, "icon.png"), icon512);
  console.log("✓ app/icon.png (512x512)");
}

async function generateOgp() {
  const sourcePath = path.join(assetsDir, "ogp-source.png");
  const source = await readFile(sourcePath);

  const W = 1200;
  const H = 630;

  // 背景: site テーマ色のグラデーション (Tailwind sky/blue 系)。
  const backgroundSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <radialGradient id="bg" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stop-color="#eff6ff"/>
          <stop offset="55%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#bfdbfe"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
    </svg>
  `;

  // 左側カード: 添付画像 (ア の練習カード) を配置。
  const cardSize = 460;
  const cardX = 80;
  const cardY = (H - cardSize) / 2;
  const card = await sharp(source)
    .resize(cardSize, cardSize, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();

  // 右側テキスト領域: タイトル/サブタイトル/URL を SVG パスとして描画。
  // 日本語フォントの依存を避けるためにテキストはタイトル「ア」のみ大きく描き、
  // その他のテキストは英字 + ドメインで構成する。
  // ただし、Tailwind 風に「カタカナ れんしゅう」も SVG <text> として書き、
  // librsvg のフォールバックフォントで描画する (alpine + fonts-noto-cjk 環境)。
  const textSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <style>
        .title { font-family: "Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif; font-weight: 800; fill: #1e3a8a; }
        .subtitle { font-family: "Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif; font-weight: 600; fill: #1f2937; }
        .url { font-family: "Noto Sans", "DejaVu Sans", sans-serif; font-weight: 700; fill: #2563eb; letter-spacing: 0.02em; }
      </style>
      <text x="600" y="240" class="title" font-size="86">カタカナ</text>
      <text x="600" y="340" class="title" font-size="86">れんしゅう</text>
      <text x="600" y="430" class="subtitle" font-size="36">なぞって おぼえる かきじゅん</text>
      <rect x="600" y="475" width="430" height="62" rx="31" fill="#ffffff" stroke="#93c5fd" stroke-width="3"/>
      <text x="623" y="516" class="url" font-size="28">katakana.ikk-dev.jp</text>
    </svg>
  `;

  const out = await sharp(Buffer.from(backgroundSvg))
    .composite([
      { input: card, left: cardX, top: cardY },
      { input: Buffer.from(textSvg), left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  await writeFile(path.join(appDir, "opengraph-image.png"), out);
  console.log("✓ app/opengraph-image.png (1200x630)");

  await writeFile(path.join(appDir, "twitter-image.png"), out);
  console.log("✓ app/twitter-image.png (1200x630)");
}

async function main() {
  try {
    await generateFavicons();
    await generateOgp();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

await main();
