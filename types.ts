
export enum Mood {
  JOY = 'joy',           // 😊 喜び (Yellow)
  FUN = 'fun',           // 🤩 楽しみ (Orange)
  SAD = 'sad',           // 😢 悲しみ (Blue)
  ANGRY = 'angry',       // 😠 怒り (Red)
  SURPRISE = 'surprise', // 😲 驚き (Purple)
  NONE = 'none'
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  memo: string;
  mood: Mood;
  type: 'event' | 'memo';
  isAllDay: boolean; // 終日フラグ
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  createdAt: number;
}

export interface UserFeedback {
  id: string;
  good: string;
  improve: string;
  createdAt: number;
}

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export type ViewMode = 'day' | 'week' | 'month' | 'list';
