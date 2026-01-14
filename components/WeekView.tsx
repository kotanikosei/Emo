
import React, { useRef, useEffect, useState } from 'react';
import { CalendarEvent, Mood } from '../types';
import { getWeekDays, formatYMD, JapaneseDays } from '../utils';

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onSelectDate: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ date, events, onEditEvent, onSelectDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const weekDays = getWeekDays(date);
  const HOUR_HEIGHT = 60;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const todayStr = formatYMD(new Date());

  const timeToMinutes = (timeStr?: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 480; // Default scroll to 8:00 AM
    }
  }, [date]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Week Day Header */}
      <div className="grid grid-cols-8 border-b border-gray-100 pb-2 bg-gray-50/50">
        <div className="w-12" />
        {weekDays.map((d, i) => {
          const isSelected = formatYMD(d) === formatYMD(date);
          const isToday = formatYMD(d) === todayStr;
          const dStr = formatYMD(d);
          const dayAllDayEvents = events.filter(e => e.date === dStr && e.isAllDay);

          return (
            <div key={i} className="flex flex-col items-center">
              <button 
                onClick={() => onSelectDate(d)}
                className="flex flex-col items-center py-2 w-full"
              >
                <span className="text-[10px] font-bold text-gray-400 mb-1">{JapaneseDays[i]}</span>
                <span className={`text-[15px] font-semibold w-8 h-8 flex items-center justify-center rounded-full ${
                  isSelected ? 'bg-[#FF3B30] text-white shadow-sm' : 
                  isToday ? 'text-[#FF3B30]' : 'text-[#1C1C1E]'
                }`}>
                  {d.getDate()}
                </span>
              </button>
              {/* 週表示の各日の終日予定ラベル */}
              <div className="w-full px-0.5 flex flex-col gap-0.5 pb-1">
                {dayAllDayEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEditEvent(event)}
                    className={`
                      w-full text-[8px] font-bold px-1 py-0.5 rounded truncate shadow-sm
                      ${event.type === 'memo' ? 'bg-green-100 text-green-800' : 'bg-[#E5F1FF] text-[#007AFF]'}
                    `}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="grid grid-cols-8" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
          {/* Time Labels */}
          <div className="col-span-1 border-r border-gray-50 bg-gray-50/20">
            {hours.map(h => (
              <div key={h} className="h-[60px] text-right pr-2">
                <span className="text-[10px] font-bold text-gray-300 relative top-[-6px]">
                  {h > 0 ? `${h}:00` : ''}
                </span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((d, dayIdx) => {
            const dStr = formatYMD(d);
            const dayTimedEvents = events.filter(e => e.date === dStr && !e.isAllDay && e.startTime);
            return (
              <div key={dayIdx} className="relative border-r border-gray-50 h-full">
                {hours.map(h => (
                  <div key={h} className="h-[60px] border-b border-gray-50/50" />
                ))}
                
                {/* Events in this day */}
                {dayTimedEvents.map(event => {
                  const start = timeToMinutes(event.startTime);
                  const end = event.endTime ? timeToMinutes(event.endTime) : start + 60;
                  const duration = Math.max(end - start, 30);
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEditEvent(event)}
                      className={`
                        absolute left-0.5 right-0.5 p-1 rounded border-l-2 text-left shadow-sm overflow-hidden z-10 transition-transform active:scale-95
                        ${event.type === 'memo' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-[#E5F1FF] border-[#007AFF] text-[#007AFF]'}
                      `}
                      style={{ top: `${start}px`, height: `${duration}px` }}
                    >
                      <p className="text-[9px] font-bold leading-tight truncate">{event.title}</p>
                      {event.mood !== Mood.NONE && <span className="absolute bottom-0.5 right-0.5 text-[10px]">{getMoodEmoji(event.mood)}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
