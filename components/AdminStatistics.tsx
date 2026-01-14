
import React, { useState, useMemo, useEffect } from 'react';
import { Heart, ClipboardList, TrendingUp, TrendingDown, Minus, ArrowRight, X, Search as SearchIcon, MessageCircle } from 'lucide-react';
import { UserFeedback } from '../types';

interface AdminStatisticsProps {
  searchQuery?: string;
}

const AdminStatistics: React.FC<AdminStatisticsProps> = ({ searchQuery = '' }) => {
  const [activeTab, setActiveTab] = useState<'rating' | 'priority'>('rating');
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);

  useEffect(() => {
    const loadFeedbacks = () => {
      const saved = JSON.parse(localStorage.getItem('luna_feedbacks') || '[]');
      setFeedbacks(saved);
    };

    loadFeedbacks();
    // 擬似的なリッスン: フォーカスが戻った時などに更新
    window.addEventListener('focus', loadFeedbacks);
    return () => window.removeEventListener('focus', loadFeedbacks);
  }, []);

  const ratings = useMemo(() => [
    { id: 1, title: '直感的なUIデザイン', tag: 'DESIGN', points: 48, trend: 'up', color: 'bg-red-500' },
    { id: 2, title: 'セキュリティの堅牢性', tag: 'STABILITY', points: 42, trend: 'none', color: 'bg-red-400' },
    { id: 3, title: '迅速なカスタマーサポート', tag: 'UX', points: 35, trend: 'up', color: 'bg-red-400' },
    { id: 4, title: 'マルチデバイス対応', tag: 'UI', points: 28, trend: 'down', color: 'bg-red-300' },
  ], []);

  const priorities = useMemo(() => [
    { id: 1, title: 'システム処理の高速化', tag: 'PERFORMANCE', points: 45, trend: 'up', color: 'bg-blue-500' },
    { id: 2, title: 'ダークモードの実装', tag: 'UI', points: 38, trend: 'up', color: 'bg-blue-400' },
    { id: 3, title: '一括エクスポート機能', tag: 'FEATURE', points: 22, trend: 'none', color: 'bg-blue-300' },
    { id: 4, title: 'APIドキュメントの更新', tag: 'STABILITY', points: 18, trend: 'down', color: 'bg-blue-300' },
  ], []);

  const filteredData = useMemo(() => {
    const baseData = activeTab === 'rating' ? ratings : priorities;
    const query = searchQuery.toLowerCase();
    if (!query) return baseData;
    return baseData.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.tag.toLowerCase().includes(query)
    );
  }, [activeTab, ratings, priorities, searchQuery]);

  const filteredFeedbacks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return feedbacks;
    return feedbacks.filter(f => 
      f.good.toLowerCase().includes(query) || 
      f.improve.toLowerCase().includes(query)
    );
  }, [feedbacks, searchQuery]);

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '今すぐ';
    if (mins < 60) return `${mins}分前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}時間前`;
    return `${Math.floor(hours / 24)}日前`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <p className="text-[#FF3B30] text-[13px] font-bold uppercase tracking-wider mb-2">● Emoカレ・インテリジェンス</p>
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">統計ダッシュボード</h1>
        <p className="text-[17px] text-gray-500 font-medium">Emoカレの利用統計とユーザーからのフィードバックを一元管理します。</p>
      </div>

      {/* Analysis Card */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <header className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
              <ClipboardList size={22} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold">分析ダッシュボード</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase">指標とトレンド</p>
            </div>
          </div>
          <button className="text-gray-300 hover:text-gray-600"><X size={20} /></button>
        </header>

        <div className="p-2 bg-gray-50 flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('rating')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[14px] font-bold transition-all ${activeTab === 'rating' ? 'bg-white shadow-sm text-[#1C1C1E]' : 'text-gray-400'}`}
          >
            <Heart size={16} fill={activeTab === 'rating' ? '#FF3B30' : 'none'} className={activeTab === 'rating' ? 'text-[#FF3B30]' : 'text-gray-300'} />
            <span>高評価</span>
          </button>
          <button 
            onClick={() => setActiveTab('priority')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[14px] font-bold transition-all ${activeTab === 'priority' ? 'bg-white shadow-sm text-[#1C1C1E]' : 'text-gray-400'}`}
          >
            <ClipboardList size={16} className={activeTab === 'priority' ? 'text-blue-500' : 'text-gray-300'} />
            <span>優先事項</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-8 group animate-[fadeIn_0.3s_ease-out]">
                <span className="text-2xl font-black text-gray-100 group-hover:text-gray-200 transition-colors w-8">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-bold">{item.title}</h4>
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-black text-gray-400 uppercase">{item.tag}</span>
                    </div>
                    {item.trend === 'up' && <TrendingUp size={16} className="text-green-500" />}
                    {item.trend === 'down' && <TrendingDown size={16} className="text-red-500" />}
                    {item.trend === 'none' && <Minus size={16} className="text-gray-200" />}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${item.points * 1.5}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-gray-400 w-16">{item.points} pt</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center flex flex-col items-center">
              <SearchIcon size={32} className="text-gray-100 mb-2" />
              <p className="text-gray-300 font-bold">項目が見つかりません</p>
            </div>
          )}
        </div>
      </div>

      {/* Raw Feedbacks Card */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <header className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF3B30] rounded-xl flex items-center justify-center text-white">
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold">ユーザーからの生の声</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase">最新のフィードバックログ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black text-gray-400 uppercase">
              {filteredFeedbacks.length} 件
            </span>
          </div>
        </header>

        <div className="divide-y divide-gray-50">
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((f) => (
              <div key={f.id} className="p-6 hover:bg-gray-50 transition-colors animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1C1C1E] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      USER
                    </div>
                    <div>
                      <p className="text-[13px] font-bold">匿名ユーザー</p>
                      <p className="text-[10px] text-gray-400 font-medium">{getTimeAgo(f.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {f.good && (
                    <div className="flex gap-3">
                      <span className="shrink-0 bg-green-100 text-green-600 text-[9px] font-black px-1.5 py-0.5 h-fit rounded uppercase">Good</span>
                      <p className="text-[14px] text-gray-700 leading-relaxed">{f.good}</p>
                    </div>
                  )}
                  {f.improve && (
                    <div className="flex gap-3">
                      <span className="shrink-0 bg-red-100 text-red-600 text-[9px] font-black px-1.5 py-0.5 h-fit rounded uppercase">Improve</span>
                      <p className="text-[14px] text-gray-700 leading-relaxed">{f.improve}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center text-gray-300">
              <MessageCircle size={48} className="opacity-10 mb-2" />
              <p className="font-bold">フィードバックはまだありません</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={() => { localStorage.removeItem('luna_feedbacks'); setFeedbacks([]); }}
            className="w-full text-gray-400 hover:text-red-500 text-[11px] font-bold uppercase tracking-widest py-2 transition-colors"
          >
            ログを全消去する
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
