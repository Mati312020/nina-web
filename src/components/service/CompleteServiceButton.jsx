import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCompleteService } from '../../hooks/useCompleteService';

/**
 * Botón "Finalizar servicio" con modal de confirmación.
 * @param {{ bookingId: number, onComplete: () => void }}
 */
export const CompleteServiceButton = ({ bookingId, onComplete }) => {
    const [confirm, setConfirm] = useState(false);
    const { loading, error, complete } = useCompleteService(bookingId);

    const handleConfirm = () => complete(onComplete);

    if (!confirm) {
        return (
            <Button variant="primary" className="w-full flex items-center gap-2"
                onClick={() => setConfirm(true)}>
                <CheckCircle2 size={16} />
                Finalizar servicio
            </Button>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-800">¿Finalizar el servicio ahora?</p>
            <p className="text-xs text-gray-500">
                Esto marcará el servicio como completado y habilitará las reseñas.
            </p>
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={14} />{error}
                </div>
            )}
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1"
                    onClick={() => setConfirm(false)} disabled={loading}>
                    Volver
                </Button>
                <Button variant="primary" className="flex-1"
                    onClick={handleConfirm} disabled={loading} isLoading={loading}>
                    Confirmar
                </Button>
            </div>
        </div>
    );
};
