import { api } from '../lib/api';

/**
 * Obtiene las facturas del usuario (familia o niñera).
 * @param {number} userId - profile.id
 */
export const getInvoices = (userId) =>
    api.get(`/invoices/user/${userId}`);
