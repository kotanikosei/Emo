
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Search, MessageSquareQuote, LogOut, User, LogIn } from 'lucide-react';
import { CalendarEvent, Mood, ViewMode } from './types';
import { getCalendarDays, getWeekDays, JapaneseDays, JapaneseMonths, formatYMD } from './utils';
import CalendarGrid from './components/CalendarGrid';
import EventModal from './components/EventModal';
import DayView from './components/DayView';
import WeekView from './components/WeekView';
import ListView from './components/ListView';
import FeedbackModal from './components/FeedbackModal';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('luna_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load events", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luna_events', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const displayContext = useMemo(() => {
    if (viewMode === 'day' || viewMode === 'week') {
      return { year: selectedDate.getFullYear(), month: selectedDate.getMonth() };
    }
    return { year, month };
  }, [viewMode, selectedDate, year, month]);

  const moodStats = useMemo(() => {
    const monthPrefix = `${displayContext.year}-${String(displayContext.month + 1).padStart(2, '0')}`;
    const monthlyEvents = events.filter(e => e.date.startsWith(monthPrefix));
    
    return {
      [Mood.JOY]: monthlyEvents.filter(e => e.mood === Mood.JOY).length,
      [Mood.FUN]: monthlyEvents.filter(e => e.mood === Mood.FUN).length,
      [Mood.SAD]: monthlyEvents.filter(e => e.mood === Mood.SAD).length,
      [Mood.ANGRY]: monthlyEvents.filter(e => e.mood === Mood.ANGRY).length,
      [Mood.SURPRISE]: monthlyEvents.filter(e => e.mood === Mood.SURPRISE).length,
    };
  }, [events, displayContext]);

  const handlePrev = () => {
    if (viewMode === 'month' || viewMode === 'list') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      setSelectedDate(d);
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 1);
      setSelectedDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month' || viewMode === 'list') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      setSelectedDate(d);
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 1);
      setSelectedDate(d);
    }
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
    setIsSearching(false);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex > -1) {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } else {
      setEvents(prev => [...prev, event]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const { apiClient } = await import('./api-client');
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsGuest(false);
    }
  };

  const handleLogin = (isAdminRole: boolean, isGuestMode: boolean = false) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdminRole);
    setIsGuest(isGuestMode);
  };

  const dayEvents = useMemo(() => 
    events.filter(e => e.date === formatYMD(selectedDate)),
    [events, selectedDate]
  );

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return events.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.memo.toLowerCase().includes(q)
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [events, searchQuery]);

  const getMoodEmoji = (mood: Mood) => {
    switch(mood) {
      case Mood.JOY: return '😊';
      case Mood.FUN: return '🤩';
      case Mood.SAD: return '😢';
      case Mood.ANGRY: return '😠';
      case Mood.SURPRISE: return '😲';
      default: return '';
    }
  };

  const handleSearchResultClick = (event: CalendarEvent) => {
    const targetDate = new Date(event.date);
    setSelectedDate(targetDate);
    setCurrentDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    setViewMode('day');
    setIsSearching(false);
    setSearchQuery('');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // 管理者画面のレンダリング
  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // 一般ユーザー画面
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center sm:py-10">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[800px] sm:rounded-[40px] shadow-xl flex flex-col overflow-hidden relative">
        
        {isSearching ? (
          <div className="flex flex-col h-full flex-1">
            <header className="px-4 pt-10 pb-4 border-b border-gray-100 flex items-center gap-3">
              <div className="flex-1 bg-[#7676801f] rounded-xl flex items-center px-3 py-1.5">
                <Search size={16} className="text-gray-400 mr-2" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="予定、場所、メモを検索"
                  className="bg-transparent border-none focus:outline-none text-[17px] w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="bg-gray-300 rounded-full p-0.5">
                    <X size={12} className="text-white" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => { setIsSearching(false); setSearchQuery(''); }}
                className="text-[#FF3B30] text-[17px] font-medium"
              >
                キャンセル
              </button>
            </header>

            <main className="flex-1 overflow-y-auto bg-white custom-scrollbar">
              {searchQuery.trim() === '' ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 px-10 text-center">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="text-[17px] font-semibold">カレンダーを検索</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                  <p className="text-[17px] font-semibold">結果が見つかりません</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredEvents.map(event => (
                    <button 
                      key={event.id}
                      onClick={() => handleSearchResultClick(event)}
                      className="w-full text-left px-5 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[17px] font-semibold text-[#1C1C1E]">{event.title}</span>
                          <span className="text-sm">{getMoodEmoji(event.mood)}</span>
                        </div>
                        <span className="text-[12px] text-gray-400 font-medium">
                          {event.date.replace(/-/g, '/')}
                        </span>
                      </div>
                      {event.memo && <p className="text-[13px] text-gray-500 line-clamp-1">{event.memo}</p>}
                    </button>
                  ))}
                </div>
              )}
            </main>
          </div>
        ) : (
          <div className="flex flex-col h-full flex-1">
            {/* Top Status Bar (Dynamic based on login status) */}
            <div className="px-5 pt-10 pb-1 flex justify-between items-center bg-white">
               {isGuest ? (
                 <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full animate-[fadeIn_0.5s_ease-out] border border-orange-100">
                   <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                   <span className="text-[11px] font-bold text-orange-600">ゲストモード</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full animate-[fadeIn_0.5s_ease-out]">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <User size={12} className="text-gray-500" />
                   <span className="text-[11px] font-bold text-gray-600">ログイン中: 小谷</span>
                 </div>
               )}

               {isGuest ? (
                 <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-[#007AFF] text-white px-3 py-1 rounded-full transition-all hover:bg-[#0062CC] active:scale-95 shadow-sm shadow-blue-100"
                 >
                   <LogIn size={11} className="stroke-[3px]" />
                   <span className="text-[11px] font-black uppercase tracking-tight">ログインして保存</span>
                 </button>
               ) : (
                 <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-[11px] font-bold uppercase tracking-wider px-2 py-1"
                 >
                   <LogOut size={12} />
                   <span>ログアウト</span>
                 </button>
               )}
            </div>

            <header className="px-4 pt-2 pb-4 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded-full text-[#FF3B30]"><ChevronLeft size={24} /></button>
                  <div className="flex flex-col items-center min-w-[120px]">
                    <h1 className="text-[18px] font-bold text-[#1C1C1E]">
                      {displayContext.year}年{JapaneseMonths[displayContext.month]}
                    </h1>
                  </div>
                  <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded-full text-[#FF3B30]"><ChevronRight size={24} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsSearching(true)} className="text-gray-400 hover:text-[#FF3B30] p-1 transition-colors"><Search size={22} /></button>
                  <button onClick={() => setIsFeedbackOpen(true)} className="text-gray-400 hover:text-[#FF3B30] p-1 transition-colors"><MessageSquareQuote size={22} /></button>
                  <button onClick={() => handleAddEvent()} className="text-[#FF3B30] p-1"><Plus size={24} /></button>
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
                {[Mood.JOY, Mood.FUN, Mood.SAD, Mood.ANGRY, Mood.SURPRISE].map(m => {
                  const count = moodStats[m];
                  if (count === 0) return null;
                  return (
                    <div key={m} className="flex items-center bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 shadow-sm animate-[fadeIn_0.3s_ease-out]">
                      <span className="text-sm mr-1">{getMoodEmoji(m)}</span>
                      <span className="text-[11px] font-bold text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#7676801f] p-1 rounded-lg flex items-center justify-between mb-2">
                {[
                  { id: 'day', label: '日' },
                  { id: 'week', label: '週' },
                  { id: 'month', label: '月' },
                  { id: 'list', label: 'リスト' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as ViewMode)}
                    className={`flex-1 py-1.5 text-[13px] font-semibold rounded-md transition-all ${
                      viewMode === mode.id 
                      ? 'bg-white shadow-sm text-[#1C1C1E]' 
                      : 'text-gray-500'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col">
              {viewMode === 'month' && (
                <div className="px-4 py-4">
                  <CalendarGrid year={year} month={month} events={events} onSelectDate={handleSelectDate} />
                </div>
              )}
              {viewMode === 'day' && (
                <DayView date={selectedDate} events={dayEvents} onEditEvent={handleEditEvent} onTimeSlotClick={() => handleAddEvent()} />
              )}
              {viewMode === 'week' && (
                <WeekView date={selectedDate} events={events} onEditEvent={handleEditEvent} onSelectDate={setSelectedDate} />
              )}
              {viewMode === 'list' && (
                <ListView year={year} month={month} events={events} onEditEvent={handleEditEvent} />
              )}
            </main>
          </div>
        )}
      </div>
      <EventModal isOpen={isModalOpen} date={selectedDate} onClose={() => setIsModalOpen(false)} onSave={handleSaveEvent} onDelete={handleDeleteEvent} events={dayEvents} initialEvent={editingEvent} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
