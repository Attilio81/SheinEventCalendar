import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './Icons';

type View = 'month' | 'week' | 'day';

interface BottomNavBarProps {
  currentDate: Date;
  view: View;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddEvent: () => void;
}

const getWeekDateRange = (date: Date): string => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when week starts on Sunday
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };

    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} - ${endOfWeek.toLocaleDateString('it-IT', options)}`;
    } else {
        return `${startOfWeek.toLocaleDateString('it-IT', options)} - ${endOfWeek.toLocaleDateString('it-IT', options)}`;
    }
};


const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentDate, view, onPrev, onNext, onToday, onAddEvent }) => {

    const getLabel = () => {
        switch(view) {
            case 'month':
                return {
                    main: currentDate.toLocaleString('it-IT', { month: 'long' }),
                    sub: currentDate.getFullYear().toString()
                };
            case 'week':
                const range = getWeekDateRange(currentDate);
                const year = currentDate.getFullYear().toString();
                 return {
                    main: range,
                    sub: year
                };
            case 'day':
                return {
                    main: currentDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }),
                    sub: currentDate.getFullYear().toString()
                };
            default:
                 return { main: '', sub: '' };
        }
    };

    const { main: mainLabel, sub: subLabel } = getLabel();

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 h-20 z-10">
            <div className="relative h-full max-w-5xl mx-auto flex items-center justify-between px-4">
                {/* Left Group */}
                <div className="flex items-center space-x-2">
                    <button onClick={onPrev} aria-label="Periodo precedente" className="p-3 rounded-full text-slate-400 hover:bg-slate-700 transition-colors">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={onToday}
                      className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-300 bg-transparent border border-slate-600 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        Oggi
                    </button>
                </div>

                {/* FAB in the middle */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                     <button
                        onClick={onAddEvent}
                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
                        aria-label="Aggiungi Evento"
                    >
                        <PlusIcon className="w-8 h-8" />
                    </button>
                </div>

                {/* Centered Month/Year */}
                 <div className="absolute left-1/2 -translate-x-1/2 bottom-1 text-center pointer-events-none">
                    <h2 className="text-base font-semibold text-white capitalize">{mainLabel}</h2>
                    <p className="text-xs text-slate-400">{subLabel}</p>
                </div>


                {/* Right Group */}
                <div className="flex items-center space-x-2">
                    <button onClick={onNext} aria-label="Periodo successivo" className="p-3 rounded-full text-slate-400 hover:bg-slate-700 transition-colors">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default BottomNavBar;
