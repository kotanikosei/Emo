/**
 * Laravel API クライアント
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  };
  token: string;
}

interface UserResponse {
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  };
}

class ApiClient {
  private token: string | null = null;

  /**
   * トークンを設定
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * 保存されたトークンを取得
   */
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }


  /**
   * APIリクエストを送信
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // タイムアウト処理
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒でタイムアウト

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'エラーが発生しました' }));
        throw new Error(error.message || 'リクエストに失敗しました');
      }

      return response.json();
    } catch (error: any) {
      // ネットワークエラーの場合、APIが利用できないことを示す
      if (error.name === 'AbortError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('API_UNAVAILABLE');
      }
      throw error;
    }
  }

  /**
   * ログイン（APIが利用できない場合はフォールバック認証を使用）
   */
  async login(email: string, password: string, isAdmin: boolean = false): Promise<LoginResponse> {
    try {
      // まずAPIを試す
      const response = await this.request<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          is_admin: isAdmin,
        }),
      });

      this.setToken(response.token);
      return response;
    } catch (error: any) {
      // APIが利用できない場合、フォールバック認証を使用
      if (error.message === 'API_UNAVAILABLE') {
        // 簡易認証（開発用）
        if (email === '000' && password === '000') {
          const fallbackResponse: LoginResponse = {
            user: {
              id: 1,
              name: 'デモユーザー',
              email: 'demo@emocal.com',
              is_admin: isAdmin,
            },
            token: 'fallback-token',
          };
          this.setToken('fallback-token');
          return fallbackResponse;
        } else {
          throw new Error('IDまたはパスワードが正しくありません。');
        }
      }
      throw error;
    }
  }

  /**
   * ログアウト
   */
  async logout(): Promise<void> {
    try {
      await this.request('/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  /**
   * 現在のユーザー情報を取得
   */
  async getUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/user');
  }
}

export const apiClient = new ApiClient();
