import { api } from '../lib/api';

/**
 * Obtiene el detalle de un booking en estado searching:
 * candidatas con sus estados (contacting/waiting/rejected/accepted).
 *
 * @param {number} bookingId
 * @returns {Promise<object>} { id, status, candidates, current_candidate_index, cascade_timeout_seconds, ... }
 */
export async function getSearchingDetail(bookingId) {
    return api.get(`/bookings/${bookingId}/searching-detail`);
}

/**
 * Cancela una búsqueda activa.
 * @param {number} bookingId
 * @param {number} userId
 */
export async function cancelSearch(bookingId, userId) {
    return api.post('/services/cancel', {
        booking_id: bookingId,
        user_id: userId,
        reason_category: 'cambio_de_planes',
    });
}
