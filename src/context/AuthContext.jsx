import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // useCallback con deps vacías: solo usa setters estables de useState y api (módulo estático).
    const fetchProfile = useCallback(async (auth_id, email, retryCount = 0) => {
        try {
            const data = await api.get(`/users/me?auth_id=${auth_id}&email=${email}`);
            setProfile(data);
            setLoading(false);
        } catch (error) {
            // Reintentar en AbortError: puede ocurrir por cold-start del backend (Render free)
            // o por dobles requests abortados por el browser.
            const isAbortError = error?.name === 'AbortError' || error?.message?.includes('aborted');
            if (isAbortError && retryCount < 3) {
                const delay = (retryCount + 1) * 1500; // 1.5s → 3s → 4.5s
                console.log(`[Auth] Retry fetchProfile ${retryCount + 1}/3 en ${delay}ms...`);
                setTimeout(() => fetchProfile(auth_id, email, retryCount + 1), delay);
                // No setLoading(false) aquí: el spinner sigue mostrando durante los reintentos
            } else {
                console.error("Error fetching profile:", error);
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        // Supabase v2 dispara INITIAL_SESSION de forma SÍNCRONA al registrar el listener.
        // Esto reemplaza al patrón initAuth() + getSession() — que causaba doble llamada
        // a fetchProfile cuando ambos encontraban la misma sesión activa.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // TOKEN_REFRESHED es un refresco silencioso de token en segundo plano.
            // El perfil del usuario no cambió — ignorar para evitar re-fetches innecesarios.
            if (_event === 'TOKEN_REFRESHED') return;

            setUser(session?.user ?? null);

            if (session?.user) {
                setLoading(true); // Spinner mientras carga el perfil post-login
                fetchProfile(session.user.id, session.user.email); // fire-and-forget ✓
            } else {
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
