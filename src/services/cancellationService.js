import { api } from '../lib/api';

/**
 * Cancela un booking.
 * @param {number} bookingId
 * @param {number} userId        - profile.id del usuario que cancela
 * @param {string} reasonCategory
 */
export const cancelBooking = (bookingId, userId, reasonCategory = 'cambio_de_planes') =>
    api.post('/services/cancel', {
        booking_id:      bookingId,
        user_id:         userId,
        reason_category: reasonCategory,
    });
