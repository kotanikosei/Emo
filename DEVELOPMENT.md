# 開発ガイド

このドキュメントでは、Emo Calendar のフロントエンドと、
オプションの Laravel API バックエンドのローカル開発手順を説明します。

## 必要なもの

- Node.js 18 以上
- npm 9 以上（Node.js に同梱）
- Git 2 以上

任意（Laravel バックエンドを使う場合）:

- PHP 8.2 以上
- Composer
- MySQL 5.7 以上 または MariaDB 10.3 以上（ローカル用途なら SQLite でも可）

## フロントエンドのセットアップ

1. 依存関係のインストール:

   ```bash
   npm install
   ```

2. テンプレートから `.env` を作成:

   ```bash
   cp env.example .env
   ```

3. `.env` で必要な API キーを設定:

   - `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY`
   - `OPENAI_API_KEY` / `VITE_OPENAI_API_KEY`
   - `CLAUDE_API_KEY` / `VITE_CLAUDE_API_KEY`

   Laravel バックエンドを使う場合は以下を設定:

   - `VITE_API_URL=http://localhost:8000/api`

## 開発サーバー

```bash
npm run dev
```

Vite はデフォルトで `http://localhost:3000` で起動します。

## ビルドとプレビュー

```bash
npm run build
npm run preview
```

## よく使う npm scripts

- `npm run dev` - Vite 開発サーバーを起動
- `npm run build` - 本番用ビルド
- `npm run preview` - 本番ビルドのプレビュー
- `npm run setup` - `install.sh` を実行（WSL 向けセットアップ）
- `npm run check-env` - `.env` の存在を確認

## バックエンド（任意）

`api/` ディレクトリに、ログインやユーザー情報のための Laravel API があります。
セットアップ手順とエンドポイントは `api/README.md` を参照してください。

## トラブルシューティング

ポート競合や依存関係不足などのよくある問題は
`TROUBLESHOOTING.md` を参照してください。
