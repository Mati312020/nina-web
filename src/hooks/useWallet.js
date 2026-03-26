import { useState, useEffect } from 'react';
import { getWallet } from '../services/walletService';

/**
 * Hook para cargar los datos de la billetera de la niñera.
 * @param {number|null} nannyId
 * @returns {{ data, loading, error }}
 *   data: { total_earnings, average_rating, completed_services, history, reviews }
 */
export function useWallet(nannyId) {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        if (!nannyId) return;
        setLoading(true);
        getWallet(nannyId)
            .then(setData)
            .catch(() => setError('No se pudo cargar la billetera.'))
            .finally(() => setLoading(false));
    }, [nannyId]);

    return { data, loading, error };
}
