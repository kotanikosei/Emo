# 💾 データベース情報

このプロジェクトで使用しているデータベースとストレージについて説明します。

## 📊 現在のデータ保存方法

### フロントエンド（現在動作中）

**Browser LocalStorage** を使用しています。

#### 保存されているデータ

1. **カレンダーイベント**
   - キー: `luna_events`
   - 場所: `App.tsx`
   - 内容: 予定、メモ、感情（ワクワク度）など

2. **ユーザーフィードバック**
   - キー: `luna_feedbacks`
   - 場所: `components/FeedbackModal.tsx`
   - 内容: ユーザーからのフィードバック

3. **ユーザー管理データ**
   - キー: `emo_cal_users`
   - 場所: `components/UserManagement.tsx`
   - 内容: ユーザー名、メールアドレス、パスワード、ステータス

4. **認証トークン**
   - キー: `auth_token`
   - 場所: `api-client.ts`
   - 内容: Laravel API認証トークン（フォールバック時は使用されない）

### バックエンド（Laravel API - 未セットアップ）

**MySQL 5.7以上**（またはMariaDB 10.3以上）を使用します。

#### データベース設定

```env
# .env ファイル（Laravel）
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=emocal_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

#### テーブル構造

- **users** テーブル
  - id
  - name
  - email
  - password
  - is_admin
  - created_at
  - updated_at

## 🔄 データフロー

### 現在の状態（フロントエンドのみ）

```
ユーザー操作
    ↓
React コンポーネント
    ↓
Browser LocalStorage
    ↓
データの永続化（ブラウザ内）
```

### 将来的な状態（Laravel API使用時）

```
ユーザー操作
    ↓
React コンポーネント
    ↓
Laravel API (REST API)
    ↓
SQLite / MySQL / PostgreSQL
    ↓
データの永続化（サーバー側）
```

## 📝 データの保存場所

### LocalStorage の確認方法

ブラウザの開発者ツール（F12）で確認できます：

```javascript
// コンソールで実行
localStorage.getItem('luna_events')      // カレンダーイベント
localStorage.getItem('luna_feedbacks')   // フィードバック
localStorage.getItem('emo_cal_users')    // ユーザー管理
localStorage.getItem('auth_token')       // 認証トークン
```

## ⚠️ 注意事項

### LocalStorage の制限

- **容量制限**: 約5-10MB（ブラウザによって異なる）
- **ドメイン単位**: ブラウザとドメインごとに独立
- **クリア可能**: ユーザーがブラウザのデータを削除すると消える
- **セキュリティ**: 暗号化されていない（機密情報は保存しない）

### 本番環境での推奨事項

1. **Laravel API + SQLite/MySQL/PostgreSQL** を使用
2. **認証情報はサーバー側で管理**
3. **データのバックアップを定期的に実行**

## 🚀 Laravel API をセットアップする場合

詳細は [LARAVEL_SETUP.md](./LARAVEL_SETUP.md) を参照してください。

### データベースの選択

- **開発環境**: SQLite（簡単、ファイルベース）
- **本番環境**: MySQL または PostgreSQL（推奨）

## 📚 参考

- [Browser LocalStorage API](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)
- [Laravel Database](https://laravel.com/docs/database)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
