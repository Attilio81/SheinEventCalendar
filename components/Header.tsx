import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="flex-shrink-0 bg-[#141414] border-b border-slate-800 p-4 flex items-center justify-between">
      <div className="w-1/3"></div>
      <div className="w-1/3 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
          <span className="text-red-600">Shein</span> Event Calendar
        </h1>
      </div>
      <div className="w-1/3 flex items-center justify-end space-x-4">
        {user && (
          <>
            <span className="text-sm text-slate-300 hidden md:block">{user.email}</span>
            <button
              onClick={signOut}
              className="px-3 py-1.5 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white"
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