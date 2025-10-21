import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';
import { Bell, Download, Search, X } from 'lucide-react';

interface HeaderProps {
  onOpenProfile: () => void;
  userProfile: UserProfile | null;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onExportCalendar?: () => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  userProfile,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onExportCalendar,
  searchTerm = '',
  onSearchChange
}) => {
  const { user, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-[#141414] border-b border-slate-800 p-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center">
        <h1 className="text-lg md:text-2xl font-bold text-white uppercase tracking-wider">
          <span className="text-red-600">Shein</span> <span className="hidden sm:inline">Event Calendar</span>
        </h1>
      </div>

      {/* Search Bar */}
      {user && isSearchOpen && (
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-[400px] order-3 md:order-none">
          <input
            type="text"
            placeholder="Cerca eventi..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            autoFocus
            className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => {
              setIsSearchOpen(false);
              onSearchChange?.('');
            }}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {user && (
          <>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`px-2 py-1.5 md:px-3 text-xs md:text-sm font-semibold rounded-md transition-colors ${
                isSearchOpen
                  ? 'bg-red-600 text-white border border-red-500'
                  : 'text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title="Cerca eventi"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={onExportCalendar}
              className="px-2 py-1.5 md:px-3 text-xs md:text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white"
              title="Scarica calendario (ICS)"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={onOpenNotifications}
              className="relative px-2 py-1.5 md:px-3 text-xs md:text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white"
              title="Notifiche"
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenProfile}
              className="px-2 py-1.5 md:px-3 text-xs md:text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white whitespace-nowrap"
              title="Profilo"
            >
              {userProfile ? userProfile.nickname : 'Nickname'}
            </button>
            <button
              onClick={signOut}
              className="px-2 py-1.5 md:px-3 text-xs md:text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;