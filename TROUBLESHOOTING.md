# 🐛 トラブルシューティングガイド

## ERR_CONNECTION_REFUSED エラーの解決

### 原因

開発サーバーが起動していない、または依存関係がインストールされていない。

### 解決手順

1. **依存関係のインストール確認**
   ```bash
   ls -la node_modules
   ```
   `node_modules`が存在しない場合：
   ```bash
   npm install
   ```

2. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

3. **サーバーが起動しているか確認**
   - ターミナルに「VITE v6.x.x ready」と表示される
   - 「Local: http://localhost:3000/」と表示される

4. **ブラウザでアクセス**
   - http://localhost:3000

## その他のよくある問題

### ポート3000が使用中

```bash
# 使用中のプロセスを確認
lsof -ti:3000

# プロセスを終了
lsof -ti:3000 | xargs kill -9

# または、別のポートを使用（vite.config.tsを編集）
```

### WSL環境からWindowsブラウザでアクセスできない

```bash
# WSLのIPアドレスを確認
hostname -I

# ブラウザで http://[WSLのIPアドレス]:3000 にアクセス
```

### 依存関係のインストールエラー

```bash
# クリーンインストール
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```
