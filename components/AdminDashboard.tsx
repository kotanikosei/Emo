
import React, { useState } from 'react';
import { Users, BarChart3, Search, Bell, Settings, LogOut, ChevronRight, Plus, X } from 'lucide-react';
import UserManagement from './UserManagement';
import AdminStatistics from './AdminStatistics';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');
  const [createUserRequestId, setCreateUserRequestId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#1C1C1E] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF3B30] rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
            <span className="text-2xl">🤩</span>
          </div>
          <div>
            <h2 className="text-[17px] font-bold leading-none">Emoカレ</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Studio</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <button 
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'users' ? 'bg-[#1C1C1E] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} className={activeTab === 'users' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
              <span className="text-[15px] font-bold">ユーザー名簿</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'users' ? 'opacity-40' : 'opacity-0'} />
          </button>

          <button 
            onClick={() => { setActiveTab('stats'); setSearchQuery(''); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'stats' ? 'bg-[#FF3B30] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className={activeTab === 'stats' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
              <span className="text-[15px] font-bold">分析と統計</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'stats' ? 'opacity-40' : 'opacity-0'} />
          </button>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="bg-[#F2F2F7] p-3 rounded-2xl flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#1C1C1E] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">管</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold truncate">管理者 ユーザー</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold truncate">Emoカレ Master</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-red-500 transition-colors text-[12px] font-bold"
          >
            <LogOut size={14} />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {activeTab === 'users' ? 'ユーザー名簿' : '分析とフィードバック'}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Online Service Status</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#7676801f] h-9 px-4 rounded-full flex items-center gap-2 min-w-[240px]">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="キーワードで検索..." 
                className="bg-transparent border-none text-[13px] outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={12} className="text-gray-400" />
                </button>
              )}
            </div>
            <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full transition-colors"><Bell size={20} /></button>
            <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full transition-colors"><Settings size={20} /></button>
            <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-[11px] font-bold">AD</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {activeTab === 'users' ? (
            <UserManagement searchQuery={searchQuery} createUserRequestId={createUserRequestId} />
          ) : (
            <AdminStatistics searchQuery={searchQuery} />
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            if (activeTab === 'users') {
              setCreateUserRequestId(Date.now());
            }
          }}
          className={`fixed bottom-10 right-10 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all group ${
            activeTab === 'users'
              ? 'bg-[#1C1C1E] text-white hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </main>
    </div>
  );
};

export default AdminDashboard;
