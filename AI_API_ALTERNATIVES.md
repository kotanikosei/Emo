# 🤖 AI API 代替案ガイド

Gemini APIが利用できない場合、または別のAI APIを使用したい場合のガイドです。

## 🔄 現在の実装

現在、**複数のAI APIに対応**しています：

1. **Gemini API**（デフォルト）
2. **OpenAI API**（GPT-3.5/GPT-4）
3. **Claude API**（Anthropic）
4. **フォールバック**（AI APIが利用できない場合）

## 🚀 対応しているAI API

### 1. Google Gemini API（推奨・デフォルト）

**特徴:**
- 無料枠が充実
- 高速
- 日本語対応が優秀

**セットアップ:**
```env
# .env
GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**取得方法:**
- [Google AI Studio](https://aistudio.google.com/apikey)

### 2. OpenAI API（GPT-3.5/GPT-4）

**特徴:**
- 高品質な応答
- 広く使われている
- 有料（使用量に応じて）

**セットアップ:**
```env
# .env
OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

**取得方法:**
- [OpenAI Platform](https://platform.openai.com/api-keys)

**使用モデル:**
- `gpt-3.5-turbo`（デフォルト、コスト効率が良い）
- `gpt-4`（より高品質、コストが高い）

### 3. Claude API（Anthropic）

**特徴:**
- 安全性が高い
- 長文対応が優秀
- 有料（使用量に応じて）

**セットアップ:**
```env
# .env
CLAUDE_API_KEY=your_claude_api_key
VITE_CLAUDE_API_KEY=your_claude_api_key
```

**取得方法:**
- [Anthropic Console](https://console.anthropic.com/)

**使用モデル:**
- `claude-3-haiku-20240307`（デフォルト、高速・低コスト）
- `claude-3-sonnet-20240229`（高品質）
- `claude-3-opus-20240229`（最高品質）

### 4. フォールバック（AI APIなし）✅ **推奨：APIキー不要で完全動作**

**特徴:**
- **APIキーが不要** - セットアップ不要で即座に使用可能
- **常に動作する** - エラーが発生しても確実に動作
- **適切なメッセージを返す** - フィードバック内容に応じた適切な返信
- **完全に機能する** - Gemini APIなしでもアプリは完全に動作します

**動作:**
- すべてのAI APIが利用できない場合、自動的にフォールバックメッセージを表示
- フィードバック内容（良い点/改善点）に応じて、適切なメッセージを自動選択
- フィードバックはLocalStorageに保存され、管理者画面で確認可能

**メッセージ例:**
- 良い点がある場合: 「良い点をお伝えいただき、ありがとうございます！励みになります...」
- 改善点がある場合: 「改善点をご指摘いただき、ありがとうございます。真摯に受け止め...」
- 両方ある場合: 「良い点と改善点の両方をお伝えいただき、ありがとうございます...」

## 🔄 自動切り替え機能

`ai-client.ts` は以下の優先順位で自動的にAI APIを選択します：

1. **環境変数で設定されたプロバイダー**（APIキーが有効な場合）
2. **Gemini API**（利用可能な場合）
3. **OpenAI API**（利用可能な場合）
4. **Claude API**（利用可能な場合）
5. **フォールバック**（すべて利用できない場合、またはAPIキーが設定されていない場合）✅ **常に動作**

**重要**: APIキーが設定されていない場合、最初からフォールバックに進みます。これにより、Gemini APIなしでも完全に動作します。

## 📝 使用方法

### 基本的な使用（自動検出）

```typescript
import { aiClient } from './ai-client';

const prompt = 'ユーザーフィードバック...';
const result = await aiClient.generateText(prompt, good, improve);
console.log(result.text); // AI返信
```

### 特定のプロバイダーを指定

```typescript
import { aiClient } from './ai-client';

// プロバイダーを指定
aiClient.setProvider('openai');
const result = await aiClient.generateText(prompt);
```

## 💰 コスト比較

| API | 無料枠 | 有料プラン |
|-----|--------|-----------|
| **Gemini** | 60リクエスト/分 | 無料枠が充実 |
| **OpenAI** | $5クレジット | $0.002/1Kトークン（GPT-3.5） |
| **Claude** | なし | $0.25/1Mトークン（Haiku） |
| **フォールバック** | 無料 | なし |

## 🔧 トラブルシューティング

### すべてのAI APIが利用できない場合

**問題ありません！** 自動的にフォールバックメッセージが表示されます。アプリは正常に動作し続けます。

- ✅ フィードバック機能は正常に動作します
- ✅ フィードバックはLocalStorageに保存されます
- ✅ 管理者画面でフィードバックを確認できます
- ✅ ユーザーには適切な返信メッセージが表示されます

### Gemini APIキーがない場合

**完全に問題ありません！** フォールバック機能により、アプリは完全に動作します。

- `.env`ファイルに`GEMINI_API_KEY`を設定する必要はありません
- アプリを起動して、そのまま使用できます
- フィードバック機能は正常に動作します

### 特定のAPIを使用したい場合

`.env`ファイルで、使用したいAPIのキーのみを設定してください。

例：OpenAIのみを使用する場合
```env
OPENAI_API_KEY=your_openai_key
# GeminiとClaudeのキーは設定しない
```

## 📚 参考リンク

- [Google Gemini API](https://ai.google.dev/)
- [OpenAI API](https://platform.openai.com/)
- [Claude API](https://docs.anthropic.com/)

## 💡 推奨設定

### 開発環境
- **Gemini API**（無料枠が充実）

### 本番環境
- **Gemini API** または **OpenAI API**（品質とコストのバランス）

### コスト重視
- **Gemini API**（無料枠が充実）

### 品質重視
- **OpenAI GPT-4** または **Claude Opus**
