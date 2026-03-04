/**
 * Cliente HTTP con timeout, logging automático de timing y manejo de errores.
 *
 * Cada request loguea:
 *  - 'info'  cuando responde exitosamente (con ms de duración)
 *  - 'warn'  cuando responde con HTTP error (4xx/5xx)
 *  - 'error' cuando falla por red/abort (con ms antes del fallo)
 */
import { logger } from './logger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const t0 = Date.now();

    // Extraer solo el path para el log (sin auth_id/email en la key del log)
    const path = url.replace(API_URL, '').split('?')[0];

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        const ms = Date.now() - t0;

        if (!response.ok) {
            const errorBody = await response.text();
            logger.warn('api', path, { status: response.status, ms, method: options.method ?? 'GET' });
            throw new Error(`Error HTTP ${response.status}: ${errorBody}`);
        }

        logger.info('api', path, { status: response.status, ms, method: options.method ?? 'GET' });
        return response;
    } catch (error) {
        clearTimeout(id);
        const ms = Date.now() - t0;

        // Solo loguear si no es un AbortError ya manejado por fetchProfile (evitar duplicados)
        if (error.name !== 'AbortError' || ms < timeout - 500) {
            logger.error('api', path, {
                method: options.method ?? 'GET',
                ms,
                type:   error.name,
                error:  error.message,
            });
        }

        console.error("[API] Fetch Error:", error);
        throw error;
    }
};

export const api = {
    get: async (endpoint) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    post: async (endpoint, body) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    put: async (endpoint, body) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    patch: async (endpoint, body) => {
        try {
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },
};
