# ⚡ クイックスタートガイド

DEVELOPMENT.mdに記載されている必要なものをすべてインストールする手順です。

## 📋 必要なもの

- Node.js 18以上
- npm 9以上（Node.jsに同梱）
- Git 2.0以上

## 🚀 インストール手順

### WSL環境で実行

```bash
# 1. プロジェクトディレクトリに移動
cd /home/kosei/emoカレ-by-kosei-kotani

# 2. Node.jsのインストール（未インストールの場合）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Gitのインストール（未インストールの場合）
sudo apt-get update
sudo apt-get install -y git

# 4. 依存関係のインストール
npm install

# 5. .envファイルの作成（存在しない場合）
if [ ! -f ".env" ]; then
  cp .env.template .env
  echo "⚠️  .envファイルを作成しました。GEMINI_API_KEYを設定してください。"
fi
```

### インストール確認

```bash
# バージョン確認
node --version  # v18.x.x以上であることを確認
npm --version   # 9.x.x以上であることを確認
git --version   # 2.x.x以上であることを確認

# 依存関係の確認
npm list --depth=0
```

## 🔐 環境変数の設定

1. `.env`ファイルを開く（存在しない場合は`.env.template`をコピー）
2. `GEMINI_API_KEY`にGoogle AI Studioで取得したAPIキーを設定

```bash
# .envファイルを編集
nano .env
# または
code .env
```

## ▶️ 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

## 📝 次のステップ

詳細な手順は以下を参照してください：
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 詳細な開発環境構築ガイド
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - セットアップ手順
