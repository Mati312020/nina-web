import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { triggerEmergency } from '../../services/serviceFlowService';

/**
 * Botón de emergencia — disponible para familia y niñera durante el servicio.
 * Requiere confirmación antes de disparar el alerta.
 */
export const EmergencyButton = ({ bookingId }) => {
    const [confirm, setConfirm] = useState(false);
    const [sent, setSent]       = useState(false);
    const [loading, setLoad]    = useState(false);

    const handleConfirm = async () => {
        setLoad(true);
        try {
            await triggerEmergency(bookingId);
            setSent(true);
            setConfirm(false);
        } catch {
            setConfirm(false);
        } finally {
            setLoad(false);
        }
    };

    if (sent) {
        return (
            <p className="text-xs text-center text-red-600 font-medium py-2">
                ⚠️ Alerta enviada. Te contactaremos a la brevedad.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {!confirm ? (
                <button onClick={() => setConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                    <AlertTriangle size={16} />
                    Emergencia
                </button>
            ) : (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                    <p className="text-sm text-red-700 font-medium">¿Confirmar alerta de emergencia?</p>
                    <div className="flex gap-2">
                        <button onClick={() => setConfirm(false)}
                            className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button onClick={handleConfirm} disabled={loading}
                            className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                            {loading ? '...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
