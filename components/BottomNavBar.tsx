import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './Icons';

type View = 'month' | 'week' | 'day' | 'agenda' | 'techno';

interface BottomNavBarProps {
  currentDate: Date;
  view: View;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddEvent: () => void;
  onViewChange?: (view: View) => void;
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


const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentDate, view, onPrev, onNext, onToday, onAddEvent, onViewChange }) => {

    const navItems: { view: View; label: string; icon: string }[] = [
        { view: 'month', label: 'Mese', icon: '📅' },
        { view: 'week', label: 'Settimana', icon: '📊' },
        { view: 'day', label: 'Giorno', icon: '☀️' },
        { view: 'agenda', label: 'Agenda', icon: '📋' },
        { view: 'techno', label: 'Techno', icon: '🎵' },
    ];

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
            case 'techno':
                return {
                    main: 'Techno Events',
                    sub: 'Prossimi 12 mesi'
                };
            case 'agenda':
                return {
                    main: 'Agenda',
                    sub: 'Tutti gli eventi'
                };
            default:
                 return { main: '', sub: '' };
        }
    };

    const { main: mainLabel, sub: subLabel } = getLabel();

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 z-40">
            {/* Navigation Bar (Netflix-like) */}
            <div className="w-full px-4 py-3 border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left: Navigation Items */}
                    <div className="flex items-center space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => onViewChange?.(item.view)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    view === item.view
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                                aria-current={view === item.view ? 'page' : undefined}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="hidden sm:inline">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Center: Current View Info */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 text-center">
                        <div>
                            <h2 className="text-sm font-semibold text-white capitalize">{mainLabel}</h2>
                            <p className="text-xs text-slate-400">{subLabel}</p>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center space-x-2">
                        {view !== 'techno' && view !== 'agenda' && (
                            <>
                                <button
                                    onClick={onPrev}
                                    aria-label="Periodo precedente"
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onToday}
                                    className="hidden sm:block px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                                >
                                    Oggi
                                </button>
                                <button
                                    onClick={onNext}
                                    aria-label="Periodo successivo"
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        <button
                            onClick={onAddEvent}
                            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                            aria-label="Aggiungi Evento"
                            title="Aggiungi nuovo evento"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile view info bar */}
            <div className="md:hidden px-4 py-2 text-center border-t border-slate-800">
                <h2 className="text-xs font-semibold text-white capitalize">{mainLabel}</h2>
                <p className="text-xs text-slate-400">{subLabel}</p>
            </div>
        </footer>
    );
};

export default BottomNavBar;
