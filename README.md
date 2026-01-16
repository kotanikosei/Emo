# 🤩 Emo カレ (Emo Calendar)

Apple の **Human Interface Guidelines (HIG)** に深く着想を得た、ミニマルで直感的な感情追跡型カレンダーアプリです。
日々の予定管理に「ワクワク度（気分）」を掛け合わせることで、単なるツールを超えた、振り返るのが楽しくなる体験を提供します。

---

## 🌟 主な機能

### 1. マルチディメンション表示

- **日表示**: タイムライン形式で詳細なスケジュールと現在の進行状況を確認。
- **週表示**: 1 週間のリズムを俯瞰。
- **月表示**: 感情ドットで彩られたカレンダーで、月全体の心の動きを把握。
- **リスト表示**: アジェンダ形式で効率的に予定をチェック。

### 2. 感情トラッキング (Mood Tracking)

- 予定ごとに「喜び 😊」「楽しみ 🤩」「悲しみ 😢」「怒り 😠」「驚き 😲」を記録。
- 月間統計として、どの感情が多かったかをスマートに表示。

### 3. インテリジェント・フィードバック

- **AI API 連携**: ユーザーからのフィードバックに対し、Gemini / OpenAI / Claude が Apple のような洗練された口調で感謝と展望を返信します。
- **フォールバック**: API キーがない場合でも、定型メッセージで完全に動作します。

### 4. 柔軟なアクセスモード

- **ゲストモード**: ログイン不要ですぐに体験可能。「ログインして保存」へのスムーズな誘導。
- **管理者ダッシュボード**: PC 向けの広々としたデスクトップ型 UI。ユーザー統計や生の声（フィードバックログ）をリアルタイムで分析可能。

---

## 🎨 デザインコンセプト (The Apple Way)

- **階層化されたタイポグラフィ**: Apple のシステムフォント（San Francisco）をベースに、視覚的な重み付けで情報を整理。
- **触覚的なフィードバック**: ボタンの押し込み感や、モーダルのバウンスアニメーションなど、デジタル上の「手触り」を重視。
- **マテリアルと色**: `backdrop-blur` を活用したガラスモーフィズムと、iOS 標準のセマンティックカラーを採用。
- **レスポンシブ・アダプティブ**: モバイルでは親指で操作しやすいカードレイアウト、デスクトップ（管理者）では情報密度の高いウィンドウレイアウトへと動的に変化。

---

## 🛠 技術スタック

### フロントエンド

- **Core**: React 19 (ESM)
- **Styling**: Tailwind CSS (JIT モード)
- **Icons**: Lucide React
- **Build Tool**: Vite 6

### バックエンド

- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum
- **Database**: MySQL 5.7 以上（または MariaDB 10.3 以上）

### その他

- **AI Engine**: Gemini / OpenAI / Claude（いずれか 1 つ以上、**オプショナル**）
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

3. **環境変数の設定（任意）**

   AI 返信を有効にする場合は、`env.example` をコピーして `.env` を作成し、いずれかの API キーを設定します（未設定でもアプリは動作します）。

   ```bash
   cp env.example .env
   ```

   例（Gemini を使う場合）:

   ```bash
   GEMINI_API_KEY=your_api_key_here
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

   取得方法や他プロバイダーの設定例は **[AI_API_ALTERNATIVES.md](./AI_API_ALTERNATIVES.md)** を参照してください。

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

### ☁️ Cloud Run でのデプロイ（Docker）

Docker コンテナでの起動に対応しています。Cloud Run で動かす場合は以下の手順でデプロイできます。

1. **ローカルで動作確認（任意）**

   ```bash
   docker build -t emo-kare .
   docker run --rm -p 8080:8080 emo-kare
   ```

   ブラウザで `http://localhost:8080` にアクセス

2. **Cloud Run へデプロイ**

   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

   gcloud artifacts repositories create emo-kare \
     --repository-format=docker \
     --location=asia-northeast1

   gcloud builds submit \
     --tag asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/emo-kare/emo-kare

   gcloud run deploy emo-kare \
     --image asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/emo-kare/emo-kare \
     --region asia-northeast1 \
     --port 8080 \
     --allow-unauthenticated
   ```

**環境変数について**

- Vite の`VITE_`系環境変数はビルド時に埋め込まれます。
- AI API キーは任意のため、未設定でも動作します。
- 取得方法や他プロバイダーの設定例は **[AI_API_ALTERNATIVES.md](./AI_API_ALTERNATIVES.md)** を参照してください。

### 📖 詳細な開発環境構築

詳細なセットアップ手順、トラブルシューティング、開発ワークフローについては、**[DEVELOPMENT.md](./DEVELOPMENT.md)** を参照してください。

### ⚡ クイックセットアップ

DEVELOPMENT.md に記載されている必要なものをすべてインストールするには：

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

ログイン機能は Laravel バックエンド API を使用しています。セットアップ手順については、**[api/README.md](./api/README.md)** を参照してください。

---

## 📱 クイックスタート（アプリの使い方）

1. **ログイン**: ID: `000` / Pass: `000` でサインイン、または「ログインせずに利用する」を選択。
2. **予定の追加**: 右上の「＋」ボタン、または日表示のタイムスロットをクリック。
3. **ワクワク度の記録**: 予定に合わせた気分アイコンを選択。
4. **管理（管理者向け）**: ログイン画面の「管理者の方はこちら」から専用 UI へアクセス。

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

### AI API が動作しない

- `.env`ファイルが正しく作成されているか確認（未設定でもアプリは動作します）
- API キーが有効か確認（各プロバイダーのコンソールで確認）
- ブラウザのコンソールでエラーメッセージを確認
- API キーに適切な権限があるか確認

### ビルドエラーが発生する

- Node.js のバージョンを確認（18 以上が必要）
- `node_modules`を削除して再インストール:
  ```bash
  rm -rf node_modules
  npm install
  ```

### 開発サーバーが起動しない

- ポート 3000 が使用中でないか確認
- `vite.config.ts`でポート番号を変更可能

---

## 📝 開発者ノート

このアプリは、エンジニアリングの正確さとデザイナーの感性を融合させることを目標に開発されました。コードの背後にあるのは、ユーザーに「心地よさ」を感じてもらうためのこだわりです。

Created with ❤️ by **Kosei Kotani**
