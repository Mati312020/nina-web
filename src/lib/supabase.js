import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        // false: AuthCallback.jsx maneja el code exchange explícitamente via
        // exchangeCodeForSession(). Si lo dejamos en true, _initialize detecta
        // el ?code= en la URL Y AuthCallback también lo exchangea → doble SIGNED_IN
        // → dos cadenas de fetchProfile corriendo en paralelo.
        detectSessionInUrl: false,
        flowType: 'pkce',
    },
});
