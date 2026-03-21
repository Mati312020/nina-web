import { useState, useCallback } from 'react';
import { api } from '../lib/api';

/**
 * Hook para buscar niñeras disponibles.
 *
 * Retorna:
 *   nannies  — array de niñeras formateadas
 *   loading  — true mientras hay un fetch en curso
 *   error    — mensaje de error si falló
 *   search({ query, date, time }) — dispara la búsqueda
 *
 * El `date` debe ser "YYYY-MM-DD" o null.
 * El `time` debe ser "HH:MM" o null.
 */
export const useNannySearch = () => {
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = useCallback(async ({ query = '', date = null, time = null } = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (query) params.set('query', query);

            // Calcular day_of_week desde la fecha si está disponible
            if (date) {
                const d = new Date(date + 'T12:00:00'); // mediodía para evitar TZ issues
                params.set('day_of_week', d.getDay() === 0 ? 6 : d.getDay() - 1); // Lun=0 ... Dom=6
            }
            if (time) {
                params.set('search_time', time);
            }

            const data = await api.get(`/nannies/search?${params.toString()}`);

            // Normalizar array (la API puede devolver null o array vacío)
            const list = Array.isArray(data) ? data : (data?.nannies ?? []);

            setNannies(list.map(n => ({
                id:           n.id,
                name:         n.full_name || n.name || 'Sin nombre',
                neighborhood: n.neighborhood || '',
                hourlyRate:   n.hourly_rate ?? null,
                rating:       n.rating_avg ?? n.rating ?? null,
                imageUrl:     n.profile_image_url || null,
                // Calcular edad desde birth_date si está disponible
                age: n.birth_date
                    ? Math.floor((Date.now() - new Date(n.birth_date)) / (365.25 * 24 * 60 * 60 * 1000))
                    : null,
            })));
        } catch (err) {
            console.error('[useNannySearch] Error:', err);
            setError('No se pudieron cargar las niñeras. Intentá de nuevo.');
            setNannies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { nannies, loading, error, search };
};
