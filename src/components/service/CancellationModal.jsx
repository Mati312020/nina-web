import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

const fmt = (v) => new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(v);

/**
 * Modal de cancelación con tabla de reembolso.
 * @param {{ penalty, scenario, onConfirm, onClose, loading, error }}
 */
export const CancellationModal = ({ penalty, scenario, onConfirm, onClose, loading, error }) => (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <p className="font-bold text-gray-900 font-poppins">Cancelar servicio</p>
                </div>
                <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            <p className="text-sm text-gray-600">{penalty.description}</p>

            <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
                <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-gray-600">Reembolso a vos</span>
                    <span className="font-semibold text-green-600">{fmt(penalty.familyRefund)}</span>
                </div>
                {scenario === 'last_minute' && (
                    <div className="px-4 py-3 text-xs text-amber-600">
                        ⚠️ Cancelación con menos de 1h de anticipación — reembolso parcial del 50%.
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
                    Volver
                </Button>
                <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={onConfirm} disabled={loading} isLoading={loading}>
                    Confirmar
                </Button>
            </div>
        </div>
    </div>
);
