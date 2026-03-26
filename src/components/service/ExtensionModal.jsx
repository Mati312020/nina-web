import React from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Modal para responder a una solicitud de extensión (+1h).
 * La niñera acepta o rechaza la extensión propuesta por la familia.
 */
export const ExtensionModal = ({ onAccept, onReject, loading, error }) => (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Clock size={20} className="text-primary" />
                    <p className="font-bold text-gray-900 font-poppins">Extensión de servicio</p>
                </div>
                <button onClick={onReject} className="p-1 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            <p className="text-sm text-gray-600">
                La familia solicita extender el servicio <strong>1 hora adicional</strong>.
                ¿Podés quedarte?
            </p>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onReject} disabled={loading}>
                    No puedo
                </Button>
                <Button variant="primary" className="flex-1" onClick={onAccept}
                    disabled={loading} isLoading={loading}>
                    Acepto
                </Button>
            </div>
        </div>
    </div>
);
