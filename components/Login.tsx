
import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, ArrowRight, Laptop, Monitor, Globe, Activity } from 'lucide-react';
import { apiClient } from '../api-client';

interface LoginProps {
  onLogin: (isAdmin: boolean, isGuest: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(email, password, isAdminMode);
      
      // 管理者モードでログインした場合、ユーザーが管理者か確認
      if (isAdminMode && !response.user.is_admin) {
        setError('管理者権限がありません。');
        setLoading(false);
        return;
      }

      // ログイン成功
      onLogin(response.user.is_admin, false);
    } catch (err: any) {
      // エラーメッセージをユーザーフレンドリーに
      const errorMessage = err.message === 'Failed to fetch' || err.message === 'API_UNAVAILABLE'
        ? 'APIサーバーに接続できません。簡易認証モードでログインします。'
        : err.message || 'IDまたはパスワードが正しくありません。';
      
      // APIが利用できない場合でも、簡易認証でログインを試みる
      if (err.message === 'API_UNAVAILABLE' || err.message === 'Failed to fetch') {
        if (email === '000' && password === '000') {
          // 簡易認証でログイン
          onLogin(isAdminMode, false);
          return;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin(false, true);
    }, 400);
  };

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setError('');
    setEmail('');
    setPassword('');
  };

  // 管理者モード：PC画面用レイアウト
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-8 overflow-hidden relative">
        {/* 背景のアニメーションメッシュグラデーション */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5856D6] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#AF52DE] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 w-full max-w-4xl bg-white/70 backdrop-blur-3xl rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white/50 flex overflow-hidden animate-[zoomIn_0.6s_ease-out]">
          {/* 左側：サイドバーエリア */}
          <div className="w-1/3 bg-gray-900/5 p-12 flex flex-col justify-between border-r border-white/20">
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
                <ShieldCheck size={32} className="text-[#5856D6]" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#1C1C1E] mb-2 leading-tight">Admin<br />Studio</h1>
              <p className="text-[14px] text-gray-500 font-medium">Emoカレ Central Management System</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Server: Operational</span>
              </div>
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Latency: 24ms</span>
              </div>
            </div>
          </div>

          {/* 右側：フォームエリア */}
          <div className="flex-1 p-16 flex flex-col justify-center bg-white/40">
            <div className="max-w-sm mx-auto w-full">
              <header className="mb-10">
                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">管理者サインイン</h2>
                <p className="text-[15px] text-gray-500">システム管理用のアカウント情報を入力してください。</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-400 uppercase ml-1">管理者ID</label>
                    <input 
                      type="text" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="000"
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5856D6] focus:border-transparent transition-all text-[16px] outline-none shadow-sm"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-400 uppercase ml-1">パスワード</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="000"
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5856D6] focus:border-transparent transition-all text-[16px] outline-none shadow-sm"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-[#FF3B30] text-[13px] font-semibold animate-[shake_0.4s_ease-in-out]">
                    {error}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full py-4 bg-[#1C1C1E] text-white rounded-2xl font-bold text-[17px] shadow-xl hover:shadow-[#00000020] active:scale-[0.98] transition-all
                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>認証中...</span>
                    </div>
                  ) : (
                    'サインイン'
                  )}
                </button>
              </form>

              <div className="mt-12 flex flex-col items-center">
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="text-gray-400 hover:text-gray-900 text-[14px] font-semibold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={16} />
                  一般・ゲスト用ログインに戻る
                </button>
                <div className="w-full h-[1px] bg-gray-100 my-6" />
                <p className="text-[12px] text-gray-400 font-medium">ヒント: 管理者ID/パスワード共に 000</p>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
        `}</style>
      </div>
    );
  }

  // 一般ユーザーモード：モバイルカードレイアウト（既存）
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-6 sm:py-10">
      <div className="w-full max-w-sm flex flex-col items-center animate-[fadeInUp_0.6s_ease-out]">
        
        <div className="flex items-center gap-1.5 mb-6 bg-white/50 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm transition-all">
          <Lock size={12} className="text-gray-400" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">現在ログアウト中</span>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF3B30] to-[#FF9500] rounded-[22px] shadow-lg flex items-center justify-center mb-4 transform transition-all duration-500 hover:scale-105">
            <span className="text-4xl">🤩</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight mb-1">Emoカレ</h1>
          <p className="text-[15px] text-gray-500 font-medium">ログインして始めましょう</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-gray-400 uppercase ml-1">ID</label>
              <input 
                type="text" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="000"
                className="w-full px-4 py-3 bg-[#F2F2F7] border-none rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:bg-white transition-all text-[16px] outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-gray-400 uppercase ml-1">パスワード</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="000"
                className="w-full px-4 py-3 bg-[#F2F2F7] border-none rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:bg-white transition-all text-[16px] outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-[#FF3B30] text-[13px] font-semibold text-center animate-[shake_0.4s_ease-in-out]">
              {error}
            </p>
          )}

          <div className="space-y-3">
            <button 
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 bg-[#007AFF] text-white rounded-2xl font-bold text-[17px] shadow-lg shadow-blue-200 hover:bg-[#0062CC] active:scale-[0.98] transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>サインイン中...</span>
                </div>
              ) : (
                'サインイン'
              )}
            </button>

            <button 
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-3.5 bg-gray-50 text-gray-600 rounded-2xl font-bold text-[15px] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
            >
              <span>ログインせずに利用する</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-[#007AFF] text-[14px] font-semibold hover:underline flex items-center gap-1"
            >
              管理者の方はこちら
            </button>
            <div className="w-full h-[1px] bg-gray-100 my-2" />
            <div className="text-[14px] text-gray-400">ヒント: ID/パスワード共に 000</div>
          </div>
        </form>

        <p className="mt-10 text-[12px] text-gray-400 text-center max-w-[240px]">
          Emoカレをご利用いただくことで、弊社の<span className="text-[#007AFF] cursor-pointer">利用規約</span>および<span className="text-[#007AFF] cursor-pointer">プライバシーポリシー</span>に同意したものとみなされます。
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
