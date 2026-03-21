import { useState, useEffect } from 'react';
import { api } from '../lib/api';

// Caché a nivel módulo — solo se fetcha una vez por sesión de pestaña
let _cachedConfig = null;
let _fetchPromise = null;

/**
 * Obtiene la configuración de precios del backend.
 * Cacheado en módulo para evitar múltiples requests en el wizard.
 *
 * Retorna: { config: { standard_hourly_rate, family_fee_percentage, nanny_fee_percentage }, loading }
 *
 * IMPORTANTE: family_fee_percentage NO se usa para calcular el fee real.
 * El backend (fee_service.py) siempre usa 9% hardcodeado.
 * Solo usar standard_hourly_rate para la tarifa sugerida.
 */
export const usePricingConfig = () => {
    const [config, setConfig] = useState(_cachedConfig);
    const [loading, setLoading] = useState(!_cachedConfig);

    useEffect(() => {
        if (_cachedConfig) return;

        if (!_fetchPromise) {
            _fetchPromise = api.get('/pricing/config')
                .then(data => {
                    _cachedConfig = data;
                    return data;
                })
                .catch(err => {
                    _fetchPromise = null; // permitir retry en próximo mount
                    console.error('[usePricingConfig] Error:', err);
                    return null;
                });
        }

        _fetchPromise.then(data => {
            if (data) setConfig(data);
            setLoading(false);
        });
    }, []);

    return { config, loading };
};
