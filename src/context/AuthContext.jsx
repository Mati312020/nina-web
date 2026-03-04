import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ref para deduplicar: evita que dos eventos de Supabase (ej. INITIAL_SESSION +
    // SIGNED_IN por el mismo código OAuth) lancen dos cadenas de fetchProfile en paralelo.
    // Problema observado: con detectSessionInUrl:true, _initialize y _emitInitialSession
    // disparaban fetchProfile simultáneamente → ambas cadenas agotaban sus retries.
    const isFetchingRef = useRef(false);

    // useCallback con deps vacías: solo usa setters estables (useState) y refs (useRef).
    const fetchProfile = useCallback(async (auth_id, email, retryCount = 0) => {
        // Delays escalonados para cubrir el cold-start de Render free tier (puede tardar ~10–50s).
        // Si el backend cierra la conexión (NS_BINDING_ABORTED), reintentamos con backoff.
        const RETRY_DELAYS = [2000, 5000, 10000, 20000, 35000]; // 2s, 5s, 10s, 20s, 35s
        try {
            const data = await api.get(`/users/me?auth_id=${auth_id}&email=${email}`);
            setProfile(data);
            setLoading(false);
            isFetchingRef.current = false; // liberar lock: fetch completado con éxito
        } catch (error) {
            const isAbortError = error?.name === 'AbortError' || error?.message?.includes('aborted');
            if (isAbortError && retryCount < RETRY_DELAYS.length) {
                const delay = RETRY_DELAYS[retryCount];
                console.log(`[Auth] Retry fetchProfile ${retryCount + 1}/${RETRY_DELAYS.length} en ${delay / 1000}s...`);
                setTimeout(() => fetchProfile(auth_id, email, retryCount + 1), delay);
                // isFetchingRef sigue en true: el retry está pendiente
            } else {
                console.error("Error fetching profile:", error);
                setLoading(false);
                isFetchingRef.current = false; // liberar lock: sin más reintentos
            }
        }
    }, []); // isFetchingRef es estable (useRef), no necesita ir en deps

    useEffect(() => {
        // Con detectSessionInUrl: false en supabase.js, Supabase NO procesa el ?code= de la URL
        // automáticamente. AuthCallback.jsx lo hace explícitamente via exchangeCodeForSession().
        // Esto garantiza un único SIGNED_IN por login OAuth.
        //
        // La ref isFetchingRef protege contra el caso residual donde INITIAL_SESSION (sesión
        // previa en localStorage) y SIGNED_IN (nuevo código OAuth) lleguen casi simultáneamente.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // TOKEN_REFRESHED: refresco silencioso en background, el perfil no cambió.
            if (_event === 'TOKEN_REFRESHED') return;

            setUser(session?.user ?? null);

            if (session?.user) {
                if (isFetchingRef.current) {
                    // Otra cadena de fetchProfile ya está corriendo — ignorar este evento.
                    console.log(`[Auth] ${_event} ignorado — fetchProfile ya en curso`);
                    return;
                }
                isFetchingRef.current = true;
                setLoading(true);
                fetchProfile(session.user.id, session.user.email); // fire-and-forget ✓
            } else {
                // SIGNED_OUT u otro evento sin sesión: resetear todo
                isFetchingRef.current = false;
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signup = async (email, password) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: email.split('@')[0],
                }
            }
        });
        if (error) throw error;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setProfile(null);
    };

    const googleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            login,
            signup,
            logout,
            googleLogin,
            refreshProfile: () => user && fetchProfile(user.id, user.email)
        }}>
            {children}
        </AuthContext.Provider>
    );
};
