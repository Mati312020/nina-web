/**
 * Logger centralizado — escribe eventos directo a Supabase (no al backend).
 *
 * Ventajas sobre un logger vía backend:
 *  - No sufre cold start de Render: captura errores INCLUSO cuando el backend está caído
 *  - Fire-and-forget: nunca bloquea el flujo principal de la app
 *  - sessionStorage: el SESSION_ID agrupa todos los eventos de una misma pestaña del browser
 *
 * Uso:
 *   import { logger } from '../lib/logger';
 *   logger.info('auth.fetchProfile', 'profile_cargado', { ms: 320, retry: 0 });
 *   logger.error('api.get', 'request_fallido', { endpoint: '/users/me', type: 'AbortError' });
 *   const data = await logger.timed('api', '/users/me', () => api.get('/users/me?...'));
 */

import { supabase } from './supabase';

// ─── Session ID ───────────────────────────────────────────────────────────────
// Persiste durante la sesión del browser (misma pestaña, sobrevive F5).
// Se genera uno nuevo por pestaña/ventana → permite rastrear sesiones independientes.
const SESSION_ID = (() => {
    const KEY = 'nina_session_id';
    const existing = sessionStorage.getItem(KEY);
    if (existing) return existing;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(KEY, id);
    return id;
})();

// ─── Estado interno ───────────────────────────────────────────────────────────
let currentUserId = null; // se actualiza con setLoggerUser() tras login/logout

/**
 * Actualizar el user_id para todos los logs siguientes.
 * Llamar en onAuthStateChange con el uid del usuario, o null al logout.
 */
export const setLoggerUser = (userId) => {
    currentUserId = userId ?? null;
};

export const getSessionId = () => SESSION_ID;

// ─── Escritura a Supabase ─────────────────────────────────────────────────────
const write = (level, context, message, data) => {
    // Fire-and-forget: si falla el log, NO lanzamos error (evitar loops infinitos)
    supabase.from('app_logs').insert({
        session_id: SESSION_ID,
        user_id:    currentUserId,
        level,
        context,
        message,
        data:    data ?? null,
        url:     typeof window !== 'undefined' ? window.location.pathname : null,
    }).then(({ error }) => {
        if (error) {
            // Solo imprimir en consola, nunca relanzar
            console.warn('[Logger] no se pudo escribir el log:', error.message);
        }
    });
};

// ─── API pública ──────────────────────────────────────────────────────────────
export const logger = {
    debug: (ctx, msg, data) => write('debug', ctx, msg, data),
    info:  (ctx, msg, data) => write('info',  ctx, msg, data),
    warn:  (ctx, msg, data) => write('warn',  ctx, msg, data),
    error: (ctx, msg, data) => write('error', ctx, msg, data),

    /**
     * Envuelve una función async, mide su duración y loguea el resultado.
     * Relanza el error original para que el caller lo maneje.
     *
     * Ejemplo:
     *   const data = await logger.timed('auth', 'fetchProfile', () =>
     *       api.get(`/users/me?auth_id=${id}`)
     *   );
     */
    timed: async (ctx, label, fn) => {
        const t0 = Date.now();
        try {
            const result = await fn();
            write('info', ctx, label, { ok: true, ms: Date.now() - t0 });
            return result;
        } catch (err) {
            write('error', ctx, label, {
                ok:    false,
                ms:    Date.now() - t0,
                error: err.message,
                type:  err.name,
            });
            throw err; // re-lanzar para que el caller lo maneje normalmente
        }
    },
};

// ─── Captura global de errores ────────────────────────────────────────────────
// Captura promesas sin catch (ej. fire-and-forget que lanzan inesperadamente)
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        write('error', 'global.unhandledRejection', event.reason?.message ?? String(event.reason), {
            type:  event.reason?.name,
            stack: event.reason?.stack?.slice(0, 500), // truncar stack para no superar límites
        });
    });
}
