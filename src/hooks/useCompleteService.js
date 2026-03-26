import { useState } from 'react';
import { completeService } from '../services/serviceFlowService';

/**
 * Hook para finalizar el servicio desde el lado de la niñera.
 * Llama PATCH /reviews/complete/{bookingId}.
 */
export function useCompleteService(bookingId) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const complete = async (onSuccess) => {
        setLoading(true);
        setError(null);
        try {
            await completeService(bookingId);
            onSuccess?.();
        } catch (e) {
            setError(e?.response?.data?.detail || 'No se pudo finalizar el servicio.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, complete };
}
