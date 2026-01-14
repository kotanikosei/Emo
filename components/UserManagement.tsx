
import React, { useState, useMemo, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, MoreHorizontal, Edit3, Trash2, Search as SearchIcon, X, Save, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  initial: string;
  email: string;
  password: string;
  status: '有効' | '無効';
}

interface UserManagementProps {
  searchQuery?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ searchQuery = '' }) => {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [localSearch, setLocalSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', status: '有効' as '有効' | '無効' });

  // 初期データの読み込み
  useEffect(() => {
    const savedUsers = localStorage.getItem('emo_cal_users');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error('Failed to load users', e);
        // デフォルトユーザーを設定
        initializeDefaultUsers();
      }
    } else {
      initializeDefaultUsers();
    }
  }, []);

  const initializeDefaultUsers = () => {
    const defaultUsers: User[] = [
      { id: '1', name: '小谷 光政', initial: '小', email: 'mitsumasa.k@example.com', password: 'AdminPass123', status: '有効' },
      { id: '2', name: '林 浩平', initial: '林', email: 'kohei.h@example.jp', password: 'AdminPass123', status: '有効' },
      { id: '3', name: '日比野 千恵子', initial: '日', email: 'chieko.h@example.net', password: 'AdminPass123', status: '無効' },
    ];
    setUsers(defaultUsers);
    localStorage.setItem('emo_cal_users', JSON.stringify(defaultUsers));
  };

  // ユーザーデータの保存
  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('emo_cal_users', JSON.stringify(updatedUsers));
  };

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: user.password,
      status: user.status,
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    const updatedUsers = users.map(user => {
      if (user.id === editingUser.id) {
        const initial = editForm.name.charAt(0);
        return {
          ...user,
          name: editForm.name,
          email: editForm.email,
          password: editForm.password,
          status: editForm.status as '有効' | '無効',
          initial: initial,
        };
      }
      return user;
    });

    saveUsers(updatedUsers);
    setEditingUser(null);
    setEditForm({ name: '', email: '', password: '', status: '有効' });
  };

  const handleDelete = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    saveUsers(updatedUsers);
    setDeleteConfirm(null);
  };

  const openDeleteConfirm = (id: string) => {
    setDeleteConfirm(id);
  };

  const filteredUsers = useMemo(() => {
    const query = (searchQuery || localSearch).toLowerCase();
    if (!query) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery, localSearch]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <p className="text-[#FF3B30] text-[13px] font-bold uppercase tracking-wider mb-2">● Emoカレ・インテリジェンス</p>
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">ユーザー名簿</h1>
        <p className="text-[17px] text-gray-500 font-medium">Emoカレを利用しているユーザーのアクセス権限とステータスを管理します。</p>
      </div>

      <div className="relative max-w-lg">
        <div className="bg-white border border-gray-100 rounded-2xl h-12 flex items-center px-4 gap-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <SearchIcon size={18} className="text-gray-300" />
          <input 
            type="text" 
            placeholder="名前やメールアドレスで検索..." 
            className="flex-1 bg-transparent border-none text-[15px] outline-none"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">登録アカウント</span>
        <div className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-black text-gray-500">{filteredUsers.length}</div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">担当者名</th>
                  <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">メールアドレス</th>
                  <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider bg-yellow-50">パスワード</th>
                  <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider bg-blue-50">ステータス</th>
                  <th className="px-6 py-4 text-center text-[12px] font-bold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50 transition-colors animate-[fadeInUp_0.4s_ease-out]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                          {user.initial}
                        </div>
                        <span className="text-[15px] font-bold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-[14px] text-gray-700">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-yellow-50/30">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-gray-400" />
                        <span className="text-[14px] font-mono text-gray-700">
                          {showPasswords[user.id] ? user.password : '••••••••'}
                        </span>
                        <button 
                          onClick={() => togglePassword(user.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-blue-50/30">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                        user.status === '有効' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors text-[13px] font-bold text-gray-700"
                        >
                          <Edit3 size={14} />
                          編集
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(user.id)}
                          className="px-3 py-2 border border-red-100 hover:bg-red-50 rounded-lg flex items-center justify-center text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* 合計行 */}
                <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                  <td className="px-6 py-4 text-[15px] text-gray-900">合計</td>
                  <td className="px-6 py-4 text-[14px] text-gray-600">{filteredUsers.length}件</td>
                  <td className="px-6 py-4 bg-yellow-50/50 text-[14px] text-gray-600">-</td>
                  <td className="px-6 py-4 bg-blue-50/50">
                    <span className="text-[14px] text-gray-600">
                      有効: {filteredUsers.filter(u => u.status === '有効').length} / 無効: {filteredUsers.filter(u => u.status === '無効').length}
                    </span>
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
          <SearchIcon size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">検索結果が見つかりません</p>
          <button onClick={() => setLocalSearch('')} className="mt-4 text-blue-500 font-bold text-sm hover:underline">クリアする</button>
        </div>
      )}

      {/* 編集モーダル */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full mx-4 shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">ユーザーを編集</h2>
              <button 
                onClick={() => {
                  setEditingUser(null);
                  setEditForm({ name: '', email: '', password: '', status: '有効' });
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-gray-400 uppercase mb-1.5 block">名前</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-[15px]"
                  placeholder="ユーザー名"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-400 uppercase mb-1.5 block">メールアドレス</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-[15px]"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-400 uppercase mb-1.5 block">パスワード</label>
                <input
                  type="text"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-[15px]"
                  placeholder="パスワード"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-400 uppercase mb-1.5 block">ステータス</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as '有効' | '無効' })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-[15px]"
                >
                  <option value="有効">有効</option>
                  <option value="無効">無効</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setEditingUser(null);
                  setEditForm({ name: '', email: '', password: '', status: '有効' });
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full mx-4 shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">ユーザーを削除</h2>
                <p className="text-gray-500 text-sm mt-1">この操作は取り消せません</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              ユーザー「{users.find(u => u.id === deleteConfirm)?.name}」を削除してもよろしいですか？
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                削除
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
