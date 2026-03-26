import { useState } from 'react';
import { markOnTheWay, markArrived, verifyPin } from '../services/serviceFlowService';

/**
 * Hook para las transiciones de estado del flujo de servicio.
 * Cada acción devuelve { loading, error } y llama onSuccess(newStatus).
 */
export function useServiceFlow(bookingId) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const dispatch = async (action) => {
        setLoading(true);
        setError(null);
        try {
            const result = await action();
            return result;
        } catch (e) {
            const msg = e?.response?.data?.detail || 'Error al actualizar el estado. Intentá de nuevo.';
            setError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const onTheWay = (onSuccess) =>
        dispatch(() => markOnTheWay(bookingId)).then(() => onSuccess?.('on_the_way')).catch(() => {});

    const arrived = (onSuccess) =>
        dispatch(() => markArrived(bookingId)).then(() => onSuccess?.('arrived')).catch(() => {});

    const checkPin = (pin, onSuccess) =>
        dispatch(() => verifyPin(bookingId, pin)).then(() => onSuccess?.('in_progress')).catch(() => {});

    return { loading, error, onTheWay, arrived, checkPin };
}
