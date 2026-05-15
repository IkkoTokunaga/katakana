# カタカナ れんしゅう

小学校低学年向けの カタカナ練習サービスです。
なぞる練習、書き順アニメーション、自由書きスペース、判定機能を提供します。

## 機能

- 五十音グリッドから練習したい文字を選択
- 書き順をアニメーションで表示
- なぞるブロック（テンプレート上をなぞる、書き順番号つき）
- カバレッジ判定（甘め判定: お手本の上を何%なぞれたか）
- 自由書きスペース（田の字ガイドつき）
- 描画リセットボタン
- 該当カタカナを使った例単語＋絵文字表示

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Docker / Docker Compose

## 起動方法

```bash
docker compose up
```

ブラウザで <http://localhost:3001> を開きます。

初回起動時は `npm install` が自動実行されるため、少し時間がかかります。

## 開発

すべての開発は Docker コンテナ内で行います。

```bash
# コンテナ内でコマンド実行
docker compose exec web sh

# Lint
docker compose exec web npm run lint

# ビルド
docker compose exec web npm run build
```

## ディレクトリ構成

```
.
├── app/                     # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx             # 五十音グリッド (ホーム)
│   └── practice/[char]/
│       └── page.tsx         # 練習ページ
├── components/
│   ├── DrawingCanvas.tsx    # 共通: ポインタ入力で描画する canvas
│   ├── StrokeAnimation.tsx  # 書き順アニメーション (SVG)
│   ├── TraceCanvas.tsx      # なぞる枠＋判定
│   ├── FreeCanvas.tsx       # 自由書きスペース
│   └── WordExamples.tsx     # 例単語表示
├── lib/
│   ├── katakana.ts          # 46文字データ＋書き順 SVG path
│   └── judge.ts             # カバレッジ判定ロジック
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 書き順データ

書き順 SVG パスは [KanjiVG](https://kanjivg.tagaini.net/) (Copyright © Ulrich Apel, CC BY-SA 3.0) を利用しています。`scripts/fetch-kanjivg.mjs` で清音46文字分を一括取得し、`lib/katakana-strokes.json` に保存されます。viewBox は KanjiVG 標準の `0 0 109 109` です。

```bash
# データを更新する場合 (コンテナ内で実行)
docker compose exec web node scripts/fetch-kanjivg.mjs
```

ライセンス上、KanjiVG のパスを再配布する場合は同ライセンスで配布する必要があります。

## 判定の仕組み

`lib/judge.ts` の `judgeTrace` は、お手本の各ストロークパスに沿って点をサンプリングし、ユーザーが描いたキャンバスの該当付近にインクがあるかを判定して、カバレッジ % を計算します。

- 85% 以上: はなまる
- 65% 以上: よくできました
- 40% 以上: もうすこし
- 40% 未満: もういちど
