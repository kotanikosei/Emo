
import React from 'react';
import { CalendarEvent, Mood } from '../types';
import { formatYMD, JapaneseMonths } from '../utils';

interface ListViewProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
}

const ListView: React.FC<ListViewProps> = ({ year, month, events, onEditEvent }) => {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  const monthlyEvents = events
    .filter(e => e.date.startsWith(monthPrefix))
    .sort((a, b) => {
      // 日付でソート、同じ日付なら終日予定を先頭、次に時間でソート
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      return (a.startTime || '').localeCompare(b.startTime || '');
    });

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

  const groupEventsByDate = () => {
    const groups: { [date: string]: CalendarEvent[] } = {};
    monthlyEvents.forEach(event => {
      if (!groups[event.date]) groups[event.date] = [];
      groups[event.date].push(event);
    });
    return groups;
  };

  const grouped = groupEventsByDate();
  const sortedDates = Object.keys(grouped).sort();

  if (monthlyEvents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
        <div className="bg-gray-50 p-6 rounded-full mb-4">
          <span className="text-4xl opacity-20">📅</span>
        </div>
        <p className="text-[17px] font-semibold">この月の予定はありません</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F2F2F7] custom-scrollbar">
      <div className="divide-y divide-gray-200">
        {sortedDates.map(dateStr => {
          const dateObj = new Date(dateStr);
          const day = dateObj.getDate();
          const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()];
          const isToday = formatYMD(new Date()) === dateStr;

          return (
            <div key={dateStr} className="bg-white mb-2 last:mb-0">
              <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                <span className={`text-[13px] font-bold ${isToday ? 'text-[#FF3B30]' : 'text-gray-500'}`}>
                  {day}日 ({dayOfWeek})
                </span>
                {isToday && <span className="bg-[#FF3B30] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">TODAY</span>}
              </div>
              <div className="divide-y divide-gray-50">
                {grouped[dateStr].map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEditEvent(event)}
                    className="w-full text-left px-4 py-3 active:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <div className={`w-12 text-[12px] font-bold ${event.isAllDay ? 'text-[#FF3B30]' : 'text-gray-400'}`}>
                      {event.isAllDay ? '終日' : (event.startTime || '--:--')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-semibold text-[#1C1C1E] truncate">{event.title}</span>
                        {event.mood !== Mood.NONE && <span className="text-sm shrink-0">{getMoodEmoji(event.mood)}</span>}
                      </div>
                      {event.memo && <p className="text-[13px] text-gray-500 truncate">{event.memo}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-20" /> {/* Bottom spacing */}
    </div>
  );
};

export default ListView;
