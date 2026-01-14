
import React, { useState, useEffect } from 'react';
import { CalendarEvent, Mood } from '../types';
import { formatYMD, JapaneseMonths } from '../utils';
import { X, Trash2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  initialEvent?: CalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, 
  date, 
  onClose, 
  onSave, 
  onDelete,
  initialEvent
}) => {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.NONE);
  const [isAllDay, setIsAllDay] = useState(false); // ユーザーの要望により初期値はOFF
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const dStr = formatYMD(date);
  const displayDate = `${date.getFullYear()}年${JapaneseMonths[date.getMonth()]}${date.getDate()}日`;

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setMemo(initialEvent.memo);
      setMood(initialEvent.mood);
      setIsAllDay(initialEvent.isAllDay);
      setStartTime(initialEvent.startTime || '');
      setEndTime(initialEvent.endTime || '');
    } else {
      reset();
    }
  }, [initialEvent, isOpen]);

  const reset = () => {
    setTitle('');
    setMemo('');
    setMood(Mood.NONE);
    setIsAllDay(false); // 新規作成時は常にOFF
    setStartTime('');
    setEndTime('');
  };

  const handleMoodToggle = (selectedMood: Mood) => {
    setMood(prev => prev === selectedMood ? Mood.NONE : selectedMood);
  };

  const handleSave = () => {
    if (!title && !memo) return;
    
    // 時間が入力されていない場合は、トグルがOFFでも自動的に終日として扱う
    const effectiveIsAllDay = isAllDay || (!startTime && !endTime);

    const newEvent: CalendarEvent = {
      id: initialEvent?.id || Math.random().toString(36).substr(2, 9),
      date: dStr,
      title: title || (effectiveIsAllDay ? '終日の予定' : '新しい予定'),
      memo,
      mood,
      isAllDay: effectiveIsAllDay,
      startTime: effectiveIsAllDay ? undefined : (startTime || undefined),
      endTime: effectiveIsAllDay ? undefined : (endTime || undefined),
      type: 'event',
      createdAt: Date.now()
    };
    onSave(newEvent);
    reset();
  };

  const moodOptions = [
    { m: Mood.JOY, emoji: '😊', label: '喜び', color: 'bg-yellow-400 text-white border-yellow-500 shadow-[0_4px_14px_rgba(250,204,21,0.5)]' },
    { m: Mood.FUN, emoji: '🤩', label: '楽しみ', color: 'bg-orange-500 text-white border-orange-600 shadow-[0_4px_14px_rgba(249,115,22,0.5)]' },
    { m: Mood.SAD, emoji: '😢', label: '悲しみ', color: 'bg-blue-500 text-white border-blue-600 shadow-[0_4px_14px_rgba(59,130,246,0.5)]' },
    { m: Mood.ANGRY, emoji: '😠', label: '怒り', color: 'bg-red-500 text-white border-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.5)]' },
    { m: Mood.SURPRISE, emoji: '😲', label: '驚き', color: 'bg-purple-500 text-white border-purple-600 shadow-[0_4px_14px_rgba(168,85,247,0.5)]' }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl transition-all duration-300 ease-out overflow-hidden ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <header className="flex justify-between items-center px-6 pt-5 pb-3">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-gray-600"><X size={22} /></button>
          <h2 className="text-[17px] font-bold text-[#1C1C1E]">{initialEvent ? '予定の編集' : displayDate}</h2>
          <button onClick={handleSave} disabled={!title && !memo} className={`p-2 -mr-2 text-[#007AFF] text-[17px] font-bold transition-opacity ${(!title && !memo) ? 'opacity-30' : 'opacity-100'}`}>完了</button>
        </header>

        <div className="px-6 pb-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <section className="space-y-4">
            <input 
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="新しい予定"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:bg-gray-100 text-[16px] font-medium transition-all"
            />
            
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
              <span className="text-[15px] font-medium text-[#1C1C1E]">終日</span>
              <button 
                onClick={() => setIsAllDay(!isAllDay)}
                className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${isAllDay ? 'bg-[#34C759]' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isAllDay ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-3 animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-gray-50 rounded-xl px-4 py-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">開始</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-transparent focus:outline-none text-[15px] font-medium" />
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">終了</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-transparent focus:outline-none text-[15px] font-medium" />
                </div>
              </div>
            )}

            <textarea 
              value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="メモを残す..." rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:bg-gray-100 text-[15px] transition-all resize-none"
            />

            <div className="pt-2">
              {/* 気分選択セクション: 余分なラベルを削除し、選択時のみ情報をリッチ化 */}
              <div className="flex gap-2 justify-between bg-gray-50 p-2 rounded-3xl items-center min-h-[96px]">
                {moodOptions.map(({ m, emoji, label, color }) => (
                  <button
                    key={m}
                    onClick={() => handleMoodToggle(m)}
                    className={`
                      flex-1 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 relative py-2
                      ${mood === m 
                        ? `${color} scale-110 z-10` 
                        : 'bg-transparent grayscale opacity-20 hover:opacity-40'}
                    `}
                  >
                    <span className={`transition-transform duration-300 ${mood === m ? 'text-3xl mb-1' : 'text-2xl'}`}>{emoji}</span>
                    {mood === m && (
                      <span className="text-[10px] font-bold animate-[slideUp_0.2s_ease-out] tracking-tight">
                        {label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {initialEvent && (
              <button onClick={() => onDelete(initialEvent.id)} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 bg-red-50/30 rounded-xl active:bg-red-50 transition-all text-sm mt-2">
                <Trash2 size={16} /> 削除する
              </button>
            )}
          </section>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EventModal;
