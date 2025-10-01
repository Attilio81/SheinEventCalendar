import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Le variabili d'ambiente di Supabase non sono state impostate correttamente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);