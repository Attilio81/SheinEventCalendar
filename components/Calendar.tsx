import React from 'react';
import { CalendarEvent } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dateUtils';

interface CalendarProps {
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

const Calendar: React.FC<CalendarProps> = ({ currentDate, events, onDateClick, onEventClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    days.push({ day: prevMonthLastDay - startDayOfWeek + i + 1, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
  }
  
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
  }
  
  const today = new Date();
  const isToday = (day: number, isCurrentMonth: boolean) => {
    return isCurrentMonth && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const getEventsForDay = (date: Date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    return events.filter(e => {
      return dateStr >= e.startDate && dateStr <= e.endDate;
    }).sort((a,b) => a.startDate.localeCompare(b.startDate));
  };


  return (
    <div className="bg-transparent h-full flex flex-col">
      <div className="grid grid-cols-7 border-b border-slate-700">
        {WEEK_DAYS.map(day => (
          <div key={day} className="text-center p-3 text-xs font-bold uppercase text-red-600 tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 flex-1">
        {days.map((d, index) => {
          const fullDateStr = d.date ? formatDateToYYYYMMDD(d.date) : '';
          const dayEvents = d.date ? getEventsForDay(d.date) : [];
          return (
            <div
              key={index}
              className={`border-r border-b border-slate-800 p-2 flex flex-col relative group transition-colors duration-300 ${!d.isCurrentMonth ? 'bg-black/50' : 'cursor-pointer hover:bg-slate-800/60'}`}
              onClick={() => d.isCurrentMonth && onDateClick(fullDateStr)}
            >
              <span className={`text-sm font-semibold self-end ${isToday(d.day, d.isCurrentMonth) ? 'text-red-500 font-bold' : 'text-slate-300'} ${!d.isCurrentMonth ? 'text-slate-600' : ''}`}>
                {d.day}
              </span>
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

export default Calendar;