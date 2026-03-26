import { useState, useEffect } from 'react';
import { getInvoices } from '../services/invoiceService';

/**
 * Hook para cargar las facturas del usuario autenticado.
 * @param {number|null} profileId
 * @returns {{ invoices: Array, loading: boolean, error: string|null }}
 */
export function useInvoices(profileId) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        if (!profileId) return;
        setLoading(true);
        getInvoices(profileId)
            .then((data) => setInvoices(Array.isArray(data) ? data : []))
            .catch(() => setError('No se pudieron cargar las facturas.'))
            .finally(() => setLoading(false));
    }, [profileId]);

    return { invoices, loading, error };
}
