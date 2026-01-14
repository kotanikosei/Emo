#!/bin/bash

# Laravel API 作成スクリプト
# このスクリプトはLaravel APIプロジェクトを完全にセットアップします

set -e

echo "🚀 Laravel API セットアップを開始します..."
echo ""

# カラー出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 現在のディレクトリを確認
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
API_DIR="$PROJECT_ROOT/api"

echo "プロジェクトルート: $PROJECT_ROOT"
echo "APIディレクトリ: $API_DIR"
echo ""

# 1. Composerの確認
echo "📦 Composerの確認中..."
if ! command -v composer &> /dev/null; then
    echo -e "${YELLOW}⚠ Composerがインストールされていません。${NC}"
    echo "Composerをインストールします..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
else
    echo -e "${GREEN}✓ Composer $(composer --version | cut -d' ' -f3) がインストールされています${NC}"
fi

# 2. PHPの確認
echo ""
echo "📦 PHPの確認中..."
if ! command -v php &> /dev/null; then
    echo -e "${RED}✗ PHPがインストールされていません${NC}"
    echo "PHPをインストールしてください: sudo apt-get install php php-mysql php-mbstring php-xml"
    exit 1
else
    PHP_VERSION=$(php -r 'echo PHP_VERSION;' | cut -d'.' -f1,2)
    echo -e "${GREEN}✓ PHP $PHP_VERSION がインストールされています${NC}"
    
    # PHP 8.1以上が必要
    if (( $(echo "$PHP_VERSION < 8.1" | bc -l) )); then
        echo -e "${YELLOW}⚠ PHP 8.1以上が必要です。現在のバージョン: $PHP_VERSION${NC}"
    fi
fi

# 3. Laravelプロジェクトの作成
echo ""
echo "📦 Laravelプロジェクトの作成中..."
if [ -d "$API_DIR" ] && [ -f "$API_DIR/composer.json" ]; then
    echo -e "${YELLOW}⚠ Laravelプロジェクトが既に存在します${NC}"
    read -p "既存のプロジェクトを上書きしますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "既存のプロジェクトを削除します..."
        rm -rf "$API_DIR"
    else
        echo "セットアップをスキップします。"
        exit 0
    fi
fi

cd "$PROJECT_ROOT"
composer create-project laravel/laravel api --prefer-dist

# 4. 必要なパッケージのインストール
echo ""
echo "📦 Laravel Sanctumのインストール中..."
cd "$API_DIR"
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 5. 既存のファイルをコピー
echo ""
echo "📦 カスタムファイルをコピー中..."

# コントローラーをコピー
if [ -f "$PROJECT_ROOT/api/app/Http/Controllers/AuthController.php" ]; then
    cp "$PROJECT_ROOT/api/app/Http/Controllers/AuthController.php" "$API_DIR/app/Http/Controllers/AuthController.php"
    echo -e "${GREEN}✓ AuthController.php をコピーしました${NC}"
fi

# モデルをコピー
if [ -f "$PROJECT_ROOT/api/app/Models/User.php" ]; then
    cp "$PROJECT_ROOT/api/app/Models/User.php" "$API_DIR/app/Models/User.php"
    echo -e "${GREEN}✓ User.php をコピーしました${NC}"
fi

# ルートをコピー
if [ -f "$PROJECT_ROOT/api/routes/api.php" ]; then
    cp "$PROJECT_ROOT/api/routes/api.php" "$API_DIR/routes/api.php"
    echo -e "${GREEN}✓ api.php をコピーしました${NC}"
fi

# マイグレーションをコピー
if [ -f "$PROJECT_ROOT/api/database/migrations/2024_01_01_000001_create_users_table.php" ]; then
    cp "$PROJECT_ROOT/api/database/migrations/2024_01_01_000001_create_users_table.php" "$API_DIR/database/migrations/2024_01_01_000001_create_users_table.php"
    echo -e "${GREEN}✓ マイグレーションファイルをコピーしました${NC}"
fi

# CORS設定をコピー
if [ -f "$PROJECT_ROOT/api/config/cors.php" ]; then
    cp "$PROJECT_ROOT/api/config/cors.php" "$API_DIR/config/cors.php"
    echo -e "${GREEN}✓ cors.php をコピーしました${NC}"
fi

# 6. 環境変数の設定
echo ""
echo "🔐 環境変数の設定中..."
if [ ! -f "$API_DIR/.env" ]; then
    cp "$API_DIR/.env.example" "$API_DIR/.env"
fi

# .envファイルを編集（MySQL設定）
cat >> "$API_DIR/.env" << 'EOF'

# MySQL Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=emocal_db
DB_USERNAME=root
DB_PASSWORD=

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
EOF

echo -e "${GREEN}✓ .envファイルを設定しました${NC}"
echo -e "${YELLOW}⚠ DB_PASSWORDを設定してください${NC}"

# 7. アプリケーションキーの生成
echo ""
echo "🔑 アプリケーションキーの生成中..."
php artisan key:generate

# 8. 完了メッセージ
echo ""
echo -e "${GREEN}🎉 Laravel APIのセットアップが完了しました！${NC}"
echo ""
echo "次のステップ:"
echo "1. MySQLデータベースを作成: CREATE DATABASE emocal_db;"
echo "2. $API_DIR/.env ファイルでDB_PASSWORDを設定"
echo "3. マイグレーションを実行: cd api && php artisan migrate"
echo "4. サーバーを起動: php artisan serve"
echo ""
