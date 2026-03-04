import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { logger, setLoggerUser } from '../lib/logger';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ref para deduplicar: evita que dos eventos de Supabase (ej. INITIAL_SESSION +
    // SIGNED_IN por el mismo código OAuth) lancen dos cadenas de fetchProfile en paralelo.
    const isFetchingRef = useRef(false);

    const fetchProfile = useCallback(async (auth_id, email, retryCount = 0) => {
        const RETRY_DELAYS = [2000, 5000, 10000, 20000, 35000];
        const t0 = Date.now();
        try {
            const data = await api.get(`/users/me?auth_id=${auth_id}&email=${email}`);
            const ms = Date.now() - t0;
            logger.info('auth.fetchProfile', 'profile_cargado', { ms, retry: retryCount, auth_id });
            setProfile(data);
            setLoading(false);
            isFetchingRef.current = false;
        } catch (error) {
            const ms = Date.now() - t0;
            const isAbortError = error?.name === 'AbortError' || error?.message?.includes('aborted');

            if (isAbortError && retryCount < RETRY_DELAYS.length) {
                const delay = RETRY_DELAYS[retryCount];
                logger.warn('auth.fetchProfile', 'retry_programado', {
                    retry:    retryCount + 1,
                    maxRetry: RETRY_DELAYS.length,
                    delay_ms: delay,
                    ms,
                    auth_id,
                });
                console.log(`[Auth] Retry fetchProfile ${retryCount + 1}/${RETRY_DELAYS.length} en ${delay / 1000}s...`);
                setTimeout(() => fetchProfile(auth_id, email, retryCount + 1), delay);
            } else {
                logger.error('auth.fetchProfile', 'fallo_definitivo', {
                    error:    error.message,
                    type:     error.name,
                    retry:    retryCount,
                    ms,
                    auth_id,
                });
                console.error("Error fetching profile:", error);
                setLoading(false);
                isFetchingRef.current = false;
            }
        }
    }, []);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (_event === 'TOKEN_REFRESHED') return;

            // Actualizar el user_id en el logger para todos los eventos siguientes
            setLoggerUser(session?.user?.id ?? null);
            setUser(session?.user ?? null);

            if (session?.user) {
                if (isFetchingRef.current) {
                    logger.debug('auth.onAuthStateChange', 'evento_ignorado_fetch_en_curso', { event: _event });
                    console.log(`[Auth] ${_event} ignorado — fetchProfile ya en curso`);
                    return;
                }
                logger.info('auth.onAuthStateChange', 'sesion_iniciada', {
                    event:   _event,
                    user_id: session.user.id,
                    email:   session.user.email,
                });
                isFetchingRef.current = true;
                setLoading(true);
                fetchProfile(session.user.id, session.user.email);
            } else {
                logger.info('auth.onAuthStateChange', 'sesion_cerrada', { event: _event });
                isFetchingRef.current = false;
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            logger.error('auth.login', 'login_fallido', { error: error.message, email });
            throw error;
        }
    };

    const signup = async (email, password) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: email.split('@')[0] } }
        });
        if (error) {
            logger.error('auth.signup', 'signup_fallido', { error: error.message, email });
            throw error;
        }
    };

    const logout = async () => {
        logger.info('auth.logout', 'logout_iniciado', {});
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setProfile(null);
    };

    const googleLogin = async () => {
        logger.info('auth.googleLogin', 'oauth_iniciado', {});
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
        if (error) {
            logger.error('auth.googleLogin', 'oauth_fallido', { error: error.message });
            throw error;
        }
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
