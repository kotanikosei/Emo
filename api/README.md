# Laravel API バックエンド

このディレクトリにはLaravelバックエンドAPIが含まれます。

## セットアップ

```bash
# Laravelプロジェクトを作成（まだ作成していない場合）
composer create-project laravel/laravel api

cd api

# 認証パッケージのインストール
composer require laravel/sanctum

# 環境変数の設定
cp .env.example .env
php artisan key:generate

# データベースの設定
# .envファイルでデータベース接続情報を設定

# マイグレーションの実行
php artisan migrate

# サーバーの起動
php artisan serve
```

## APIエンドポイント

- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト
- `GET /api/user` - 現在のユーザー情報取得
