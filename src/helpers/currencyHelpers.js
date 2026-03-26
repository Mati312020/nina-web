/**
 * Formatea un número como moneda ARS sin decimales.
 */
export const formatARS = (amount) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
    }).format(amount ?? 0);
