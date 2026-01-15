/**
 * AI API クライアント（複数のAI APIに対応）
 * Gemini API、OpenAI、Claudeなどに対応
 */

export type AIProvider = 'gemini' | 'openai' | 'claude' | 'fallback';

interface AIResponse {
  text: string;
  success: boolean;
}

class AIClient {
  private provider: AIProvider = 'gemini';

  /**
   * プロバイダーを設定
   */
  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  /**
   * 環境変数からプロバイダーを自動検出
   */
  detectProvider(): AIProvider {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
    const claudeKey = import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.CLAUDE_API_KEY;

    if (geminiKey && geminiKey !== 'undefined' && geminiKey !== 'your_api_key_here') {
      return 'gemini';
    } else if (openaiKey && openaiKey !== 'undefined' && openaiKey !== 'your_api_key_here') {
      return 'openai';
    } else if (claudeKey && claudeKey !== 'undefined' && claudeKey !== 'your_api_key_here') {
      return 'claude';
    }
    return 'fallback';
  }

  /**
   * Gemini APIを使用してテキストを生成
   */
  private async generateWithGemini(prompt: string): Promise<AIResponse> {
    // APIキーの事前チェック
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'undefined' || apiKey === 'your_api_key_here' || apiKey.trim() === '') {
      throw new Error('Gemini API key not set');
    }

    try {
      // 動的インポート（パッケージがインストールされていない場合のエラーもキャッチ）
      const { GoogleGenAI } = await import('@google/genai');
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      let text = '貴重なご意見ありがとうございます！大切に読ませていただきます。';
      if (response && response.text) {
        text = response.text;
      } else if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
        text = response.candidates[0].content.parts[0].text || text;
      }

      return { text, success: true };
    } catch (error: any) {
      // パッケージが見つからない場合や、その他のエラー
      if (error?.message?.includes('Cannot find module') || error?.message?.includes('Failed to fetch')) {
        console.warn('Gemini API package not available:', error.message);
      } else {
        console.error('Gemini API Error:', error);
      }
      throw error;
    }
  }

  /**
   * OpenAI APIを使用してテキストを生成
   */
  private async generateWithOpenAI(prompt: string): Promise<AIResponse> {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
      
      if (!apiKey || apiKey === 'undefined' || apiKey === 'your_api_key_here') {
        throw new Error('OpenAI API key not set');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || '貴重なご意見ありがとうございます！大切に読ませていただきます。';

      return { text, success: true };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  /**
   * Claude APIを使用してテキストを生成
   */
  private async generateWithClaude(prompt: string): Promise<AIResponse> {
    try {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.CLAUDE_API_KEY;
      
      if (!apiKey || apiKey === 'undefined' || apiKey === 'your_api_key_here') {
        throw new Error('Claude API key not set');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 150,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.content[0]?.text || '貴重なご意見ありがとうございます！大切に読ませていただきます。';

      return { text, success: true };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  /**
   * フォールバックメッセージを生成（AI APIが利用できない場合）
   */
  private generateFallback(good: string, improve: string): string {
    // フィードバックの内容に応じて適切なメッセージを選択
    if (good.trim() && improve.trim()) {
      // 両方ある場合
      const messages = [
        '良い点と改善点の両方をお伝えいただき、ありがとうございます！励みになる点は大切にし、改善点は真摯に受け止めて今後の開発に反映させていただきます。',
        'ご意見をありがとうございます。良い点は励みになり、改善点は今後の開発の参考にさせていただきます。',
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else if (good.trim()) {
      // 良い点のみ
      const messages = [
        '良い点をお伝えいただき、ありがとうございます！励みになります。今後もより良い体験を提供できるよう努めてまいります。',
        'ありがとうございます！いただいたご意見を励みに、より良いアプリを目指してまいります。',
        'ご意見をありがとうございます。ユーザーの皆様に喜んでいただけるよう、これからも改善を続けてまいります。',
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else if (improve.trim()) {
      // 改善点のみ
      const messages = [
        '改善点をご指摘いただき、ありがとうございます。真摯に受け止め、今後の開発に反映させていただきます。',
        '貴重なご意見をありがとうございます。いただいた改善点を参考に、より良いアプリを目指してまいります。',
        'フィードバックをありがとうございます。今後の開発に活かさせていただきます！',
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }

    // どちらもない場合（通常は発生しないが、念のため）
    return 'フィードバックをありがとうございます。今後の開発に活かさせていただきます！';
  }

  /**
   * AIを使用してテキストを生成（複数のプロバイダーに対応）
   */
  async generateText(prompt: string, good: string = '', improve: string = ''): Promise<AIResponse> {
    // プロバイダーを自動検出
    const provider = this.detectProvider();
    this.provider = provider;

    // フォールバックの場合は即座に返す
    if (provider === 'fallback') {
      return {
        text: this.generateFallback(good, improve),
        success: false,
      };
    }

    // 利用可能なプロバイダーのリスト（優先順位順）
    const providers: AIProvider[] = [provider];
    
    // 検出されたプロバイダー以外も追加（フォールバックは除く）
    if (provider !== 'gemini') providers.push('gemini');
    if (provider !== 'openai') providers.push('openai');
    if (provider !== 'claude') providers.push('claude');
    
    // 各プロバイダーを試す
    for (const p of providers) {
      try {
        switch (p) {
          case 'gemini':
            return await this.generateWithGemini(prompt);
          case 'openai':
            return await this.generateWithOpenAI(prompt);
          case 'claude':
            return await this.generateWithClaude(prompt);
          default:
            continue;
        }
      } catch (error: any) {
        // 次のプロバイダーを試す
        const errorMsg = error?.message || 'Unknown error';
        if (!errorMsg.includes('key not set')) {
          console.warn(`Failed to use ${p}:`, errorMsg);
        }
        continue;
      }
    }

    // すべてのプロバイダーが失敗した場合、フォールバックに戻る
    return {
      text: this.generateFallback(good, improve),
      success: false,
    };
  }
}

export const aiClient = new AIClient();
