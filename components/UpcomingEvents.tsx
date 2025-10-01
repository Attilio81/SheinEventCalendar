import React, { useMemo, useRef, useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { LocationMarkerIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const colorMap: { [key: string]: string } = {
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  indigo: '#6366f1'
};

const formatDateRange = (startDateStr: string, endDateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Adjust for timezone offset to prevent date shifting
    startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
    endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());

    const start = startDate.toLocaleDateString('it-IT', options);
    
    if (startDateStr === endDateStr) {
        return start;
    }
    
    const end = endDate.toLocaleDateString('it-IT', options);
    return `${start} - ${end}`;
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onEventClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter(event => {
        const endDate = new Date(event.endDate);
        endDate.setHours(0,0,0,0);
        return endDate >= today;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events]);
  
  const checkArrows = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth;
      setShowLeftArrow(isScrollable && el.scrollLeft > 0);
      setShowRightArrow(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };
  
  useEffect(() => {
    // A small delay to ensure the layout is stable before checking arrows
    const timer = setTimeout(checkArrows, 100);
    window.addEventListener('resize', checkArrows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkArrows);
    }
  }, [upcomingEvents]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
        const scrollAmount = el.clientWidth * 0.8;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative">
      <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">Prossimi Eventi</h2>
      {upcomingEvents.length > 0 ? (
        <div className="relative">
          {showLeftArrow && (
            <button 
              onClick={() => handleScroll('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-opacity hidden md:flex items-center justify-center -translate-x-1/2"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          )}
          <div 
            ref={scrollContainerRef}
            onScroll={checkArrows}
            className="flex space-x-4 overflow-x-auto pb-4 -mb-4 scroll-smooth hide-scrollbar touch-pan-x"
          >
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="flex-shrink-0 w-72 bg-slate-800 rounded-lg p-4 cursor-pointer transition-transform transform hover:scale-105 hover:z-10 border-b-4"
                style={{ borderBottomColor: colorMap[event.color] || '#64748b' }}
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-bold text-white truncate">{event.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{formatDateRange(event.startDate, event.endDate)}</p>
                  <div className="flex items-center mt-3 text-sm text-slate-400">
                    <LocationMarkerIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
           {showRightArrow && (
            <button 
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-opacity hidden md:flex items-center justify-center translate-x-1/2"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-24 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400">Nessun evento in programma.</p>
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;