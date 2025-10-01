import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert('Registrazione completata! Controlla la tua email per la verifica.');
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
            <h1 className="text-3xl md:text-4xl text-center mb-8 font-bold text-white uppercase tracking-wider">
                <span className="text-red-600">Shein</span> Event Calendar
            </h1>
            <div className="bg-black/50 p-8 rounded-lg shadow-2xl shadow-red-900/10 border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-6">Accedi</h2>
                <form>
                    <div className="space-y-4">
                        <input
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                    <div className="mt-6 space-y-4">
                         <button onClick={handleLogin} disabled={loading} className="w-full py-3 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed">
                            {loading ? 'Caricamento...' : 'Login'}
                        </button>
                         <button onClick={handleSignUp} disabled={loading} className="w-full py-3 font-semibold text-white bg-transparent border border-slate-600 rounded-md hover:bg-slate-800 disabled:bg-slate-900 disabled:cursor-not-allowed">
                            {loading ? 'Caricamento...' : 'Registrati'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Auth;
