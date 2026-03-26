import { useState } from 'react';
import { requestExtension, respondExtension } from '../services/serviceFlowService';

/**
 * Hook para solicitar y responder extensiones de servicio.
 * La familia puede solicitar +1h; la niñera acepta o rechaza.
 */
export function useServiceExtension(bookingId) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const wrap = async (fn) => {
        setLoading(true);
        setError(null);
        try {
            await fn();
        } catch (e) {
            setError(e?.response?.data?.detail || 'Error al procesar la extensión.');
        } finally {
            setLoading(false);
        }
    };

    const request = () => wrap(() => requestExtension(bookingId));
    const accept  = () => wrap(() => respondExtension(bookingId, true));
    const reject  = () => wrap(() => respondExtension(bookingId, false));

    return { loading, error, request, accept, reject };
}
