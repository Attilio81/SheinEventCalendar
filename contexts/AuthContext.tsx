import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The onAuthStateChange listener returns the initial session (or null)
    // right away, and then listens for subsequent changes.
    // This is the most reliable way to get the session and avoid race conditions.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // The first time this runs, it will be with the initial session data.
      // We can now safely say we are done loading.
      setLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  // While checking for the session, render nothing. Once done, render children.
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
