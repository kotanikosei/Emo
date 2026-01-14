
import React, { useState } from 'react';
import { X, Send, CheckCircle2, Heart } from 'lucide-react';
import { UserFeedback } from '../types';
import { aiClient } from '../ai-client';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [good, setGood] = useState('');
  const [improve, setImprove] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [reply, setReply] = useState('');

  const handleSend = async () => {
    if (!good.trim() && !improve.trim()) return;

    setStatus('sending');
    try {
      // 1. ローカルストレージに保存（管理者画面用）
      const newFeedback: UserFeedback = {
        id: Math.random().toString(36).substr(2, 9),
        good: good.trim(),
        improve: improve.trim(),
        createdAt: Date.now()
      };
      
      const savedFeedbacks = JSON.parse(localStorage.getItem('luna_feedbacks') || '[]');
      localStorage.setItem('luna_feedbacks', JSON.stringify([newFeedback, ...savedFeedbacks]));

      // 2. AIによる返信生成（複数のAI APIに対応）
      const prompt = `
アプリ「Emoカレ」へのユーザーフィードバックです。
良い点: ${good || '特になし'}
改善点: ${improve || '特になし'}

開発者として、感謝と今後の展望を込めた短い返信（100文字以内）を生成してください。
親しみやすく、Appleのような洗練された口調で。
      `.trim();

      try {
        const result = await aiClient.generateText(prompt, good, improve);
        setReply(result.text);
        setStatus('success');
      } catch (error: any) {
        console.error('AI API Error:', error);
        // エラーの場合でも、フォールバックメッセージを表示
        setReply('フィードバックをありがとうございます。今後の開発に活かさせていただきます！');
        setStatus('success');
      }
    } catch (e) {
      console.error(e);
      setReply('フィードバックをありがとうございます。今後の開発に活かさせていただきます！');
      setStatus('success');
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStatus('idle');
      setGood('');
      setImprove('');
      setReply('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" 
        onClick={handleClose} 
      />
      <div className={`
        relative w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[28px] shadow-2xl overflow-hidden
        transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        
        <header className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-[16px] font-bold text-[#1C1C1E]">フィードバック</h2>
          <button onClick={handleClose} className="p-1.5 text-gray-400"><X size={20} /></button>
        </header>

        <div className="p-6 space-y-5">
          {status !== 'success' ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#007AFF] uppercase">良かったところ</label>
                <textarea 
                  value={good}
                  onChange={(e) => setGood(e.target.value)}
                  placeholder="デザインがきれい、など"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-[15px] focus:ring-1 focus:ring-blue-100 outline-none resize-none h-20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">改善してほしいところ</label>
                <textarea 
                  value={improve}
                  onChange={(e) => setImprove(e.target.value)}
                  placeholder="こんな機能がほしい、など"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-[15px] focus:ring-1 focus:ring-blue-100 outline-none resize-none h-20"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={status === 'sending' || (!good.trim() && !improve.trim())}
                className={`
                  w-full py-3.5 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all
                  ${(good.trim() || improve.trim()) && status !== 'sending' 
                    ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-100 active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400'}
                `}
              >
                {status === 'sending' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>送信</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 space-y-4 animate-[slideUp_0.4s_ease-out]">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-[#34C759]">
                <CheckCircle2 size={32} />
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-bold text-[17px]">ありがとうございます！</h3>
                <div className="bg-gray-50 rounded-2xl p-4 relative">
                  <div className="absolute -top-2 left-4 px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-full">AI REPLY</div>
                  <p className="text-[14px] text-gray-600 leading-relaxed italic">"{reply}"</p>
                </div>
                <button 
                  onClick={handleClose}
                  className="w-full py-3 bg-[#F2F2F7] text-[#007AFF] rounded-xl font-bold text-[15px] mt-2"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
