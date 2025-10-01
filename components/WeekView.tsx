import React from 'react';
import { CalendarEvent } from '../types';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

const colorMap: { [key: string]: string } = {
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  indigo: '#6366f1'
};

const getWeekDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    // Adjust to Monday as start of week. getDay() is 0 for Sun, 1 for Mon, etc.
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const weekDay = new Date(startOfWeek);
        weekDay.setDate(startOfWeek.getDate() + i);
        weekDays.push(weekDay);
    }
    return weekDays;
};

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onDateClick, onEventClick }) => {
  const weekDays = getWeekDays(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => {
      const startDate = new Date(e.startDate);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(e.endDate);
      endDate.setUTCHours(0, 0, 0, 0);
      const currentDate = new Date(dateStr);
      currentDate.setUTCHours(0, 0, 0, 0);
      return currentDate >= startDate && currentDate <= endDate;
    }).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

  return (
    <div className="bg-transparent h-full flex flex-col">
      <div className="grid grid-cols-7 border-b border-t border-slate-700">
        {WEEK_DAYS.map((day, index) => (
          <div key={day} className="text-center p-3 text-xs font-bold uppercase text-red-600 tracking-wider">
            {day} <span className={`ml-1 font-bold ${weekDays[index].getTime() === today.getTime() ? 'text-red-500' : 'text-slate-300'}`}>{weekDays[index].getDate()}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-1 flex-1">
        {weekDays.map((date, index) => {
          const fullDateStr = date.toISOString().split('T')[0];
          const dayEvents = getEventsForDay(date);
          const isToday = date.getTime() === today.getTime();

          return (
            <div
              key={index}
              className={`border-r border-b border-slate-800 p-2 flex flex-col relative group cursor-pointer hover:bg-slate-800/60 transition-colors duration-300`}
              onClick={() => onDateClick(fullDateStr)}
            >
              {isToday && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>}
              <div className="mt-1 space-y-1 overflow-y-auto">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                    className="p-1.5 rounded-r-md text-white text-xs font-semibold truncate cursor-pointer transition-transform hover:scale-105 hover:z-10 bg-slate-800 hover:bg-slate-700 border-l-4"
                    style={{ borderLeftColor: colorMap[event.color] || '#64748b' }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
