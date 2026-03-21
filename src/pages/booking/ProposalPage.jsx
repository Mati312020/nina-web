import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Minus, Plus, Info } from 'lucide-react';
import { usePricingConfig } from '../../hooks/usePricingConfig';
import { CostBreakdown, calcBookingFees } from '../../components/booking/CostBreakdown';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const PROBABILITY_LABELS = {
    high:   { label: 'Alta probabilidad',   color: 'text-green-700 bg-green-50 border-green-200' },
    medium: { label: 'Probabilidad media',  color: 'text-yellow-700 bg-amber-50 border-amber-200' },
    low:    { label: 'Baja probabilidad',   color: 'text-red-700 bg-red-50 border-red-200' },
};

const getProbability = (count) => {
    if (count >= 6) return 'high';
    if (count >= 3) return 'medium';
    return 'low';
};

/**
 * Paso 2 del wizard — definir la oferta: duración, tarifa, desglose de costos.
 * Espejo del ProposalScreen de la app móvil.
 */
export const ProposalPage = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const state     = location.state;

    // Guard: si no hay state, redirigir al inicio
    if (!state?.selectedNannies) {
        navigate('/booking/search', { replace: true });
        return null;
    }

    const { selectedNannies, scheduledDate, scheduledTime } = state;
    const { config, loading: configLoading } = usePricingConfig();

    const standardRate = config?.standard_hourly_rate ?? 3500;

    const [durationHours, setDurationHours] = useState(4);
    const [pricingMode,   setPricingMode]   = useState('standard'); // 'standard' | 'pacted'
    const [customRate,    setCustomRate]     = useState('');

    const hourlyRate  = pricingMode === 'standard' ? standardRate : (parseFloat(customRate) || 0);
    const probability = getProbability(selectedNannies.length);
    const probLabel   = PROBABILITY_LABELS[probability];

    const handleContinue = () => {
        const { offeredPrice, appFee, totalAmount } = calcBookingFees(hourlyRate, durationHours);
        navigate('/booking/confirmation', {
            state: {
                selectedNannies,
                scheduledDate,
                scheduledTime,
                durationHours,
                hourlyRate,
                offeredPrice,
                appFee,
                totalAmount,
                pricingMode,
            },
        });
    };

    const canContinue = hourlyRate > 0 && durationHours > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/booking/search', { state: { restored: state } })}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 font-poppins">Definir Oferta</h1>
                        <p className="text-xs text-gray-500">
                            {selectedNannies.length} niñera{selectedNannies.length !== 1 ? 's' : ''} seleccionada{selectedNannies.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 space-y-5 pb-28">
                {/* Preview de niñeras seleccionadas */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Candidatas</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedNannies.map(n => (
                            <span key={n.id} className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium">
                                {n.name.split(' ')[0]}
                            </span>
                        ))}
                    </div>
                    {scheduledDate && (
                        <p className="text-xs text-gray-500 mt-2">
                            {new Date(scheduledDate + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            {scheduledTime && ` a las ${scheduledTime}`}
                        </p>
                    )}
                </div>

                {/* Duración */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-3 font-poppins">Duración del servicio</p>
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setDurationHours(h => Math.max(1, h - 1))}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center
                                       hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                            disabled={durationHours <= 1}
                        >
                            <Minus size={16} />
                        </button>
                        <div className="text-center">
                            <span className="text-3xl font-bold text-primary font-poppins">{durationHours}</span>
                            <span className="text-sm text-gray-500 ml-1">hora{durationHours !== 1 ? 's' : ''}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDurationHours(h => Math.min(12, h + 1))}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center
                                       hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                            disabled={durationHours >= 12}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* Tipo de tarifa */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-3 font-poppins">Tipo de tarifa</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {(['standard', 'pacted']).map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setPricingMode(mode)}
                                className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                                    pricingMode === mode
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-200 text-gray-600 hover:border-primary/40'
                                }`}
                            >
                                {mode === 'standard' ? 'Tarifa Estándar' : 'Precio Personalizado'}
                            </button>
                        ))}
                    </div>

                    {pricingMode === 'standard' ? (
                        configLoading ? (
                            <div className="h-8 bg-gray-100 rounded animate-pulse" />
                        ) : (
                            <p className="text-sm text-center text-gray-600">
                                <span className="font-bold text-primary text-lg">
                                    ${standardRate.toLocaleString('es-AR')}
                                </span>
                                {' '}/hr (tarifa sugerida)
                            </p>
                        )
                    ) : (
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <Input
                                type="number"
                                placeholder="Ej: 4000"
                                value={customRate}
                                onChange={e => setCustomRate(e.target.value)}
                                className="pl-7"
                                min="1"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/hr</span>
                        </div>
                    )}
                </div>

                {/* Badge de probabilidad */}
                <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 ${probLabel.color}`}>
                    <span className="text-sm font-medium">{probLabel.label}</span>
                    <span className="text-xs ml-auto opacity-70">
                        {selectedNannies.length} candidata{selectedNannies.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Desglose de costos */}
                {hourlyRate > 0 && (
                    <CostBreakdown
                        durationHours={durationHours}
                        hourlyRate={hourlyRate}
                        showNote={false}
                    />
                )}

                {/* Info MercadoPago */}
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                        El pago se procesa a través de <strong>MercadoPago</strong> de forma segura.
                        La comisión del 9% financia la plataforma Nina.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
                <div className="max-w-lg mx-auto">
                    <Button
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleContinue}
                        disabled={!canContinue}
                    >
                        Confirmar y Continuar
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
