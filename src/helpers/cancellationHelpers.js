/**
 * Devuelve true si la cancelación ocurre con menos de 1 hora de anticipación.
 * @param {string} scheduledDate  'YYYY-MM-DD'
 * @param {string} scheduledTime  'HH:MM' o 'HH:MM:SS'
 */
export function isLastMinute(scheduledDate, scheduledTime) {
    if (!scheduledDate) return false;
    const time  = (scheduledTime ?? '00:00').slice(0, 5);
    const start = new Date(`${scheduledDate}T${time}:00`);
    return (start - Date.now()) < 3600000; // < 1 hora
}

/**
 * Calcula los montos de reembolso según el escenario.
 * @param {'last_minute'|'advance'} scenario
 * @param {number} offeredPrice
 * @returns {{ familyRefund: number, nannyPenalty: number, description: string }}
 */
export function calcPenalty(scenario, offeredPrice = 0) {
    if (scenario === 'last_minute') {
        return {
            familyRefund:  Math.round(offeredPrice * 0.5),
            nannyPenalty:  0,
            description:   'Cancelación con menos de 1h de anticipación.',
        };
    }
    // Más de 1h de anticipación → reembolso completo
    return {
        familyRefund:  offeredPrice,
        nannyPenalty:  0,
        description:   'Cancelación con suficiente anticipación.',
    };
}
