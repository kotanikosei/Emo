
import React, { useEffect, useRef, useState } from 'react';
import { CalendarEvent, Mood } from '../types';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onTimeSlotClick: (time: string) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, events, onEditEvent, onTimeSlotClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 60;

  const timeToMinutes = (timeStr?: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const getEventStyle = (event: CalendarEvent) => {
    const start = timeToMinutes(event.startTime);
    const end = event.endTime ? timeToMinutes(event.endTime) : start + 60;
    const duration = Math.max(end - start, 30);
    return { top: `${start}px`, height: `${duration}px` };
  };

  const isToday = new Date().toDateString() === date.toDateString();
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

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

  const allDayEvents = events.filter(e => e.isAllDay);
  const timedEvents = events.filter(e => !e.isAllDay && e.startTime);

  useEffect(() => {
    if (containerRef.current) {
      const firstEventTime = timedEvents[0]?.startTime ? timeToMinutes(timedEvents[0].startTime) : 480;
      const scrollPos = isToday ? currentMinutes - 150 : firstEventTime - 100;
      containerRef.current.scrollTop = Math.max(0, scrollPos);
    }
  }, [date, timedEvents.length, isToday]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* 終日予定セクション */}
      {allDayEvents.length > 0 && (
        <div className="border-b border-gray-100 bg-gray-50/30 px-4 py-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase w-10">終日</span>
            <div className="flex-1 flex flex-col gap-1">
              {allDayEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => onEditEvent(event)}
                  className={`
                    w-full text-left px-3 py-1.5 rounded-md text-[13px] font-bold flex justify-between items-center shadow-sm
                    ${event.type === 'memo' ? 'bg-green-50 text-green-800' : 'bg-[#E5F1FF] text-[#007AFF]'}
                  `}
                >
                  <span className="truncate">{event.title}</span>
                  {event.mood !== Mood.NONE && <span className="text-sm ml-1">{getMoodEmoji(event.mood)}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="flex-1 overflow-y-auto relative custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
        <div className="relative w-full" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
          {hours.map(hour => (
            <div key={hour} className="absolute left-0 w-full flex items-start group cursor-pointer" style={{ top: `${hour * HOUR_HEIGHT}px` }} onClick={() => onTimeSlotClick(`${String(hour).padStart(2, '0')}:00`)}>
              <div className="w-14 pr-2 text-right"><span className="text-[11px] font-bold text-gray-300">{hour > 0 ? `${hour}:00` : ''}</span></div>
              <div className="flex-1 h-[0.5px] bg-gray-100 mt-[6px]" />
            </div>
          ))}

          {isToday && (
            <div className="absolute left-[54px] right-0 z-30 flex items-center pointer-events-none" style={{ top: `${currentMinutes}px` }}>
              <div className="w-2.5 h-2.5 bg-[#FF3B30] rounded-full -ml-1.25 shadow-sm" />
              <div className="flex-1 h-[1px] bg-[#FF3B30]" />
            </div>
          )}

          <div className="absolute left-[60px] right-2 top-0 h-full pointer-events-none">
            {timedEvents.map(event => (
              <button
                key={event.id}
                onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
                className={`
                  absolute left-0 right-0 p-2 rounded-lg border-l-[3px] text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all pointer-events-auto active:scale-[0.98]
                  ${event.type === 'memo' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-[#E5F1FF] border-[#007AFF] text-[#007AFF]'}
                `}
                style={getEventStyle(event)}
              >
                <div className="flex justify-between items-start h-full">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold truncate leading-tight mb-0.5">{event.title}</p>
                    <p className="text-[10px] opacity-70 truncate font-medium">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</p>
                  </div>
                  {event.mood !== Mood.NONE && <span className="text-base ml-1 drop-shadow-sm">{getMoodEmoji(event.mood)}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
