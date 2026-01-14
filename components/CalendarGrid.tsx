
import React from 'react';
import { CalendarEvent, Mood } from '../types';
import { getCalendarDays, JapaneseDays, formatYMD } from '../utils';

interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ year, month, events, onSelectDate }) => {
  const calendarDays = getCalendarDays(year, month);
  const todayStr = formatYMD(new Date());

  const getEventsForDate = (date: Date) => {
    const dStr = formatYMD(date);
    return events.filter(e => e.date === dStr);
  };

  const MoodDot: React.FC<{ mood: Mood }> = ({ mood }) => {
    if (mood === Mood.NONE) return null;
    const colors = {
      [Mood.JOY]: 'bg-yellow-400',
      [Mood.FUN]: 'bg-orange-500',
      [Mood.SAD]: 'bg-blue-400',
      [Mood.ANGRY]: 'bg-red-500',
      [Mood.SURPRISE]: 'bg-purple-400',
      [Mood.NONE]: 'transparent'
    };
    return <div className={`w-1.5 h-1.5 rounded-full ${colors[mood]} mt-0.5 mx-0.5 shadow-sm`} />;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 mb-4">
        {JapaneseDays.map(day => (
          <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {calendarDays.map((day, idx) => {
          const dStr = formatYMD(day.date);
          const isToday = dStr === todayStr;
          const dayEvents = getEventsForDate(day.date);
          const moods = Array.from(new Set(dayEvents.map(e => e.mood))).filter(m => m !== Mood.NONE);

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day.date)}
              className={`
                relative flex flex-col items-center py-3 rounded-2xl transition-all duration-200
                ${day.isCurrentMonth ? 'text-[#1C1C1E]' : 'text-gray-300'}
                ${isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}
                active:scale-95
              `}
            >
              <span className={`text-base font-medium ${isToday ? 'text-[#007AFF] font-bold' : ''}`}>
                {day.date.getDate()}
              </span>
              <div className="flex justify-center h-2 mt-1">
                {moods.slice(0, 3).map((m, i) => <MoodDot key={i} mood={m} />)}
                {dayEvents.length > 0 && moods.length === 0 && <div className="w-1 h-1 rounded-full bg-gray-300 mt-0.5" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
