# 🤩 Emoカレ (Emo Calendar)

Appleの **Human Interface Guidelines (HIG)** に深く着想を得た、ミニマルで直感的な感情追跡型カレンダーアプリです。
日々の予定管理に「ワクワク度（気分）」を掛け合わせることで、単なるツールを超えた、振り返るのが楽しくなる体験を提供します。

---

## 🌟 主な機能

### 1. マルチディメンション表示
- **日表示**: タイムライン形式で詳細なスケジュールと現在の進行状況を確認。
- **週表示**: 1週間のリズムを俯瞰。
- **月表示**: 感情ドットで彩られたカレンダーで、月全体の心の動きを把握。
- **リスト表示**: アジェンダ形式で効率的に予定をチェック。

### 2. 感情トラッキング (Mood Tracking)
- 予定ごとに「喜び 😊」「楽しみ 🤩」「悲しみ 😢」「怒り 😠」「驚き 😲」を記録。
- 月間統計として、どの感情が多かったかをスマートに表示。

### 3. インテリジェント・フィードバック
- **Gemini API 連携**: ユーザーからのフィードバックに対し、AI（Gemini 3 Flash）がAppleのような洗練された口調で感謝と展望を返信します。

### 4. 柔軟なアクセスモード
- **ゲストモード**: ログイン不要ですぐに体験可能。「ログインして保存」へのスムーズな誘導。
- **管理者ダッシュボード**: PC向けの広々としたデスクトップ型UI。ユーザー統計や生の声（フィードバックログ）をリアルタイムで分析可能。

---

## 🎨 デザインコンセプト (The Apple Way)

- **階層化されたタイポグラフィ**: Appleのシステムフォント（San Francisco）をベースに、視覚的な重み付けで情報を整理。
- **触覚的なフィードバック**: ボタンの押し込み感や、モーダルのバウンスアニメーションなど、デジタル上の「手触り」を重視。
- **マテリアルと色**: `backdrop-blur` を活用したガラスモーフィズムと、iOS標準のセマンティックカラーを採用。
- **レスポンシブ・アダプティブ**: モバイルでは親指で操作しやすいカードレイアウト、デスクトップ（管理者）では情報密度の高いウィンドウレイアウトへと動的に変化。

---

## 🛠 技術スタック

### フロントエンド
- **Core**: React 19 (ESM)
- **Styling**: Tailwind CSS (JITモード)
- **Icons**: Lucide React
- **Build Tool**: Vite 6

### バックエンド
- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum
- **Database**: MySQL 5.7以上（またはMariaDB 10.3以上）

### その他
- **AI Engine**: Google Gemini API (Google GenAI SDK) - **オプショナル**（APIキーがない場合でも動作します）
- **Storage**: Browser LocalStorage (フロントエンド)
- **Design System**: Apple Human Interface Guidelines

---

## 🚀 クイックスタート

### 基本的なセットアップ

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd emoカレ-by-kosei-kotani
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   
   `.env`ファイルをプロジェクトルートに作成し、Google Gemini APIキーを設定します：
   ```bash
   # .env
   GEMINI_API_KEY=your_api_key_here
   ```
   
   APIキーの取得方法:
   - [Google AI Studio](https://aistudio.google.com/apikey) にアクセス
   - 新しいAPIキーを作成
   - `.env`ファイルに設定

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   
   ブラウザで `http://localhost:3000` にアクセス

5. **ビルド（本番用）**
   ```bash
   npm run build
   npm run preview
   ```

### 📖 詳細な開発環境構築

詳細なセットアップ手順、トラブルシューティング、開発ワークフローについては、**[DEVELOPMENT.md](./DEVELOPMENT.md)** を参照してください。

### ⚡ クイックセットアップ

DEVELOPMENT.mdに記載されている必要なものをすべてインストールするには：

```bash
# 自動セットアップスクリプトを実行（WSL環境）
chmod +x install.sh
./install.sh

# または手動で依存関係をインストール
npm install
```

**📚 セットアップガイド:**
- **[AUTO_INSTALL.md](./AUTO_INSTALL.md)** - 自動インストール手順（推奨）
- **[QUICK_START.md](./QUICK_START.md)** - クイックスタートガイド
- **[INSTALL_CHECK.md](./INSTALL_CHECK.md)** - インストール確認チェックリスト

### 🔐 Laravel API バックエンド

ログイン機能はLaravelバックエンドAPIを使用しています。セットアップ手順については、**[LARAVEL_SETUP.md](./LARAVEL_SETUP.md)** を参照してください。

**クイックセットアップ:**
```bash
# Laravelプロジェクトを作成
composer create-project laravel/laravel api
cd api

# 必要なパッケージをインストール
composer require laravel/sanctum

# 環境変数を設定
cp .env.example .env
php artisan key:generate

# データベースを準備（SQLite）
touch database/database.sqlite

# マイグレーションを実行
php artisan migrate

# サーバーを起動
php artisan serve
```

---

## 📱 クイックスタート（アプリの使い方）

1. **ログイン**: ID: `000` / Pass: `000` でサインイン、または「ログインせずに利用する」を選択。
2. **予定の追加**: 右上の「＋」ボタン、または日表示のタイムスロットをクリック。
3. **ワクワク度の記録**: 予定に合わせた気分アイコンを選択。
4. **管理（管理者向け）**: ログイン画面の「管理者の方はこちら」から専用UIへアクセス。

---

## 📁 プロジェクト構造

```
emoカレ-by-kosei-kotani/
├── components/          # Reactコンポーネント
│   ├── AdminDashboard.tsx
│   ├── CalendarGrid.tsx
│   ├── DayView.tsx
│   ├── EventModal.tsx
│   ├── FeedbackModal.tsx
│   ├── Login.tsx
│   └── ...
├── App.tsx              # メインアプリケーション
├── index.tsx            # エントリーポイント
├── types.ts             # TypeScript型定義
├── utils.ts             # ユーティリティ関数
├── vite.config.ts       # Vite設定
├── tsconfig.json        # TypeScript設定
├── package.json         # 依存関係
└── .env                 # 環境変数（要作成）
```

## 🔧 トラブルシューティング

### Gemini APIが動作しない
- `.env`ファイルが正しく作成されているか確認
- `GEMINI_API_KEY`が正しく設定されているか確認
- APIキーが有効か確認（[Google AI Studio](https://aistudio.google.com/apikey)で確認）
- ブラウザのコンソールでエラーメッセージを確認
- APIキーに適切な権限があるか確認（Gemini APIへのアクセス権限が必要）

### ビルドエラーが発生する
- Node.jsのバージョンを確認（18以上が必要）
- `node_modules`を削除して再インストール:
  ```bash
  rm -rf node_modules
  npm install
  ```

### 開発サーバーが起動しない
- ポート3000が使用中でないか確認
- `vite.config.ts`でポート番号を変更可能

---

## 📝 開発者ノート

このアプリは、エンジニアリングの正確さとデザイナーの感性を融合させることを目標に開発されました。コードの背後にあるのは、ユーザーに「心地よさ」を感じてもらうためのこだわりです。

Created with ❤️ by **Kosei Kotani**
