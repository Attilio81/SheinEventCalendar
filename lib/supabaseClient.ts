import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Le variabili d'ambiente di Supabase non sono state impostate correttamente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);