import { useState } from 'react';
import { cancelBooking } from '../services/cancellationService';
import { isLastMinute, calcPenalty } from '../helpers/cancellationHelpers';

/**
 * Hook para cancelar un booking.
 * Calcula el escenario de penalidad y ejecuta la cancelación.
 */
export function useCancellation(booking) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const scenario = isLastMinute(booking?.scheduled_date, booking?.scheduled_time)
        ? 'last_minute'
        : 'advance';

    const penalty = calcPenalty(scenario, booking?.offered_price ?? 0);

    const cancel = async (userId, onSuccess) => {
        setLoading(true);
        setError(null);
        try {
            await cancelBooking(booking.id, userId);
            onSuccess?.();
        } catch (e) {
            setError(e?.response?.data?.detail || 'No se pudo cancelar. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, scenario, penalty, cancel };
}
