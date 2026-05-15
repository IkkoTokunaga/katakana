// Fetch katakana stroke paths from KanjiVG (https://kanjivg.tagaini.net/, CC-BY-SA 3.0)
// and generate lib/katakana-strokes.json with { "<char>": ["<path d>", ...] }.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const KATAKANA = [
  "ア","イ","ウ","エ","オ",
  "カ","キ","ク","ケ","コ",
  "サ","シ","ス","セ","ソ",
  "タ","チ","ツ","テ","ト",
  "ナ","ニ","ヌ","ネ","ノ",
  "ハ","ヒ","フ","ヘ","ホ",
  "マ","ミ","ム","メ","モ",
  "ヤ","ユ","ヨ",
  "ラ","リ","ル","レ","ロ",
  "ワ","ヲ","ン",
];

const BASE = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji";

function codeOf(ch) {
  return ch.codePointAt(0).toString(16).padStart(5, "0");
}

async function fetchOne(ch) {
  const url = `${BASE}/${codeOf(ch)}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${ch}: HTTP ${res.status}`);
  const xml = await res.text();
  // Pull only the <path ... d="..." /> entries inside StrokePaths group, in order.
  const strokePathsBlock = xml.match(
    /<g id="kvg:StrokePaths_[^"]+"[\s\S]*?<\/g>\s*<g id="kvg:StrokeNumbers_/,
  );
  const block = strokePathsBlock ? strokePathsBlock[0] : xml;
  const paths = [];
  // Match the `d` attribute specifically (preceded by whitespace so it
  // is not confused with the `d` inside `id="..."`).
  const re = /<path\b[^>]*?\sd="([^"]+)"/g;
  let m;
  while ((m = re.exec(block))) {
    paths.push(m[1]);
  }
  if (paths.length === 0) throw new Error(`${ch}: no path data parsed`);
  return paths;
}

async function main() {
  const out = {};
  for (const ch of KATAKANA) {
    process.stdout.write(`${ch} `);
    out[ch] = await fetchOne(ch);
  }
  process.stdout.write("\n");
  const target = path.resolve("lib/katakana-strokes.json");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`Wrote ${target}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
