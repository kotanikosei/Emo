#!/bin/bash

# Emoカレ 開発環境セットアップスクリプト
# DEVELOPMENT.mdに記載されている必要なものをすべてインストールします

set -e

echo "🚀 Emoカレ 開発環境セットアップを開始します..."
echo ""

# カラー出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Node.jsの確認とインストール
echo "📦 Node.jsの確認中..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✓ Node.js $(node --version) がインストールされています${NC}"
    else
        echo -e "${YELLOW}⚠ Node.jsのバージョンが18未満です。アップグレードが必要です。${NC}"
        echo "Node.js 18.x をインストールします..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
else
    echo "Node.jsがインストールされていません。インストールします..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 2. npmの確認
echo ""
echo "📦 npmの確認中..."
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ npm $(npm --version) がインストールされています${NC}"
else
    echo -e "${RED}✗ npmが見つかりません${NC}"
    exit 1
fi

# 3. Gitの確認とインストール
echo ""
echo "📦 Gitの確認中..."
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ Git $(git --version | cut -d' ' -f3) がインストールされています${NC}"
else
    echo "Gitがインストールされていません。インストールします..."
    sudo apt-get update
    sudo apt-get install -y git
fi

# 4. 依存関係のインストール
echo ""
echo "📦 プロジェクトの依存関係をインストール中..."
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓ 依存関係のインストールが完了しました${NC}"
else
    echo -e "${RED}✗ package.jsonが見つかりません${NC}"
    exit 1
fi

# 5. .envファイルの確認
echo ""
echo "🔐 環境変数ファイルの確認中..."
if [ ! -f ".env" ]; then
    echo ".envファイルが存在しません。作成します..."
    cat > .env << EOF
# Google Gemini API Key
# Get your API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_api_key_here

# Laravel API URL (オプション)
VITE_API_URL=http://localhost:8000/api
EOF
    echo -e "${YELLOW}⚠ .envファイルを作成しました。GEMINI_API_KEYを設定してください。${NC}"
else
    echo -e "${GREEN}✓ .envファイルが存在します${NC}"
fi

# 6. インストール確認
echo ""
echo "✅ インストール確認中..."
echo ""
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Git: $(git --version | cut -d' ' -f3)"
echo ""

# 7. 完了メッセージ
echo -e "${GREEN}🎉 セットアップが完了しました！${NC}"
echo ""
echo "次のステップ:"
echo "1. .envファイルにGEMINI_API_KEYを設定してください"
echo "2. 開発サーバーを起動: npm run dev"
echo "3. ブラウザで http://localhost:3000 にアクセス"
echo ""
