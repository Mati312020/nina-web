/**
 * Calcula los segundos restantes del servicio.
 * Usa Date.now() en cada llamada para evitar drift.
 */
export function calcRemaining(startedAt, durationHours) {
    if (!startedAt) return 0;
    const endMs = new Date(startedAt).getTime() + (durationHours ?? 1) * 3600000;
    return Math.max(0, Math.floor((endMs - Date.now()) / 1000));
}

/**
 * Formatea segundos como HH:MM:SS.
 */
export function formatHMS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}
