import { api } from '../lib/api';

/**
 * Obtiene el resumen de ganancias, historial y reseñas de la niñera.
 * @param {number} nannyId - profile.id de la niñera
 */
export const getWallet = (nannyId) =>
    api.get(`/reviews/wallet/${nannyId}`);
