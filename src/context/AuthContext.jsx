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
        let cancelled = false;

        // ── Fase 1: hidratación explícita ──────────────────────────────────────
        // getSession() aguarda la initializePromise de Supabase antes de resolver,
        // garantizando que la sesión se restaura desde localStorage ANTES de
        // decidir si el usuario está autenticado.
        // Esto evita la race condition donde INITIAL_SESSION resuelve con null
        // mientras _initialize() aún está corriendo (ej: al volver de un redirect
        // de pago en MercadoPago con full page reload).
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (cancelled) return;
            setLoggerUser(session?.user?.id ?? null);
            setUser(session?.user ?? null);
            if (session?.user) {
                if (!isFetchingRef.current) {
                    logger.info('auth.getSession', 'sesion_restaurada', {
                        user_id: session.user.id,
                        email:   session.user.email,
                    });
                    isFetchingRef.current = true;
                    fetchProfile(session.user.id, session.user.email);
                }
            } else {
                logger.info('auth.getSession', 'sin_sesion', {});
                setLoading(false);
            }
        });

        // ── Fase 2: cambios POST-inicialización ────────────────────────────────
        // INITIAL_SESSION ya está manejado arriba por getSession().
        // TOKEN_REFRESHED solo renueva el JWT sin cambiar user.id — no necesitamos
        // re-fetchear perfil (el backend usa auth_id, no el JWT).
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (cancelled) return;
            if (_event === 'INITIAL_SESSION' || _event === 'TOKEN_REFRESHED') return;

            // Actualizar el user_id en el logger para todos los eventos siguientes
            setLoggerUser(session?.user?.id ?? null);
            setUser(session?.user ?? null);

            if (session?.user) {
                if (isFetchingRef.current) {
                    logger.debug('auth.onAuthStateChange', 'evento_ignorado_fetch_en_curso', { event: _event });
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

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
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

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/recovery`,
        });
        if (error) {
            logger.error('auth.resetPassword', 'reset_fallido', { error: error.message, email });
            throw error;
        }
        logger.info('auth.resetPassword', 'reset_email_enviado', { email });
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
            resetPassword,
            refreshProfile: () => user && fetchProfile(user.id, user.email)
        }}>
            {children}
        </AuthContext.Provider>
    );
};
