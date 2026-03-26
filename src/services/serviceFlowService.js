import { api } from '../lib/api';

/** Niñera marca que sale en camino. Genera el PIN de check-in. */
export const markOnTheWay = (bookingId) =>
    api.patch(`/service-flow/${bookingId}/on-the-way`);

/** Niñera marca que llegó al domicilio. */
export const markArrived = (bookingId) =>
    api.patch(`/service-flow/${bookingId}/arrived`);

/**
 * Verifica el PIN ingresado por la niñera. Inicia el servicio.
 * @param {number} bookingId
 * @param {string} pin  - 4 dígitos
 */
export const verifyPin = (bookingId, pin) =>
    api.patch(`/service-flow/${bookingId}/verify-pin`, { pin_code: pin });

/**
 * Obtiene el PIN del servicio (solo familia puede llamar esto).
 * @param {number} bookingId
 */
export const getPin = (bookingId) =>
    api.get(`/service-flow/${bookingId}/pin`);

/** Dispara alerta de emergencia. Notifica a la otra parte. */
export const triggerEmergency = (bookingId) =>
    api.post(`/service-flow/${bookingId}/emergency`);

/** Niñera reporta actividad actual. statusType: 'all_good'|'playing'|'sleeping'|'eating' */
export const postStatusUpdate = (bookingId, statusType) =>
    api.post(`/service-flow/${bookingId}/status-update`, { status_type: statusType });

/** Familia solicita extensión de +1 hora. */
export const requestExtension = (bookingId) =>
    api.post(`/service-flow/${bookingId}/request-extension`);

/** Niñera acepta o rechaza extensión. */
export const respondExtension = (bookingId, accepted) =>
    api.patch(`/service-flow/${bookingId}/respond-extension`, { accepted });

/** Niñera finaliza el servicio. */
export const completeService = (bookingId) =>
    api.patch(`/reviews/complete/${bookingId}`);
