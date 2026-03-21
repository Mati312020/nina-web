import React from 'react';

// El backend (fee_service.py) hardcodea 9% — no usamos family_fee_percentage de pricing_config.
const FAMILY_FEE_RATE = 0.09;

const fmt = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

/**
 * Desglose de costos para la reserva last-minute.
 * Componente puramente presentacional — no hace fetch.
 *
 * Props:
 *   durationHours — number
 *   hourlyRate    — number (tarifa por hora)
 *   showNote      — bool (mostrar nota de MP, default true)
 */
export const CostBreakdown = ({ durationHours, hourlyRate, showNote = true }) => {
    const base     = (hourlyRate || 0) * (durationHours || 0);
    const fee      = Math.round(base * FAMILY_FEE_RATE);
    const total    = base + fee;

    return (
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
                <span>
                    Servicio ({durationHours}h × {fmt(hourlyRate || 0)}/hr)
                </span>
                <span className="font-medium">{fmt(base)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
                <span>Comisión Nina (9%)</span>
                <span className="font-medium">{fmt(fee)}</span>
            </div>

            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total a pagar</span>
                <span className="text-primary">{fmt(total)}</span>
            </div>

            {showNote && (
                <p className="text-xs text-gray-400 pt-1">
                    El pago se procesa de forma segura a través de MercadoPago.
                </p>
            )}
        </div>
    );
};

/**
 * Calcula los valores del breakdown (para pasarlos al backend).
 */
export const calcBookingFees = (hourlyRate, durationHours) => {
    const offeredPrice = (hourlyRate || 0) * (durationHours || 0);
    const appFee       = Math.round(offeredPrice * FAMILY_FEE_RATE);
    const totalAmount  = offeredPrice + appFee;
    return { offeredPrice, appFee, totalAmount };
};
