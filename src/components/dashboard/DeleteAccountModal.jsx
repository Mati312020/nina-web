import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';

/**
 * Modal de confirmación para eliminar cuenta.
 *
 * Implementa el derecho de supresión (ARCO) de la Ley 25.326.
 *
 * Props:
 *   isOpen   — boolean
 *   onClose  — fn para cerrar sin eliminar
 *   authId   — UUID del usuario (user.id desde AuthContext)
 *   onSuccess— fn llamada tras eliminar exitosamente (navega a home)
 */
export const DeleteAccountModal = ({ isOpen, onClose, authId, onSuccess }) => {
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleDelete = async () => {
        if (!confirmed) return;
        setLoading(true);
        setError('');
        try {
            await api.delete(`/users/me?auth_id=${authId}`);
            // Cerrar sesión en Supabase antes de redirigir
            await supabase.auth.signOut();
            onSuccess();
        } catch (err) {
            setError('Ocurrió un error al eliminar tu cuenta. Intentá de nuevo.');
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setConfirmed(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} className="text-danger" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 font-poppins">Eliminar mi cuenta</h3>
                            <p className="text-xs text-gray-500 font-nunito mt-0.5">
                                Art. ARCO · Ley 25.326 — Derecho de supresión
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-nunito space-y-2">
                        <p className="font-semibold">Esta acción es permanente e irreversible:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Se eliminarán tus datos personales de nuestra base de datos.</li>
                            <li>Se cancelarán tus vacantes o disponibilidades activas.</li>
                            <li>No podrás recuperar tu historial ni reseñas.</li>
                            <li>Tu cuenta de acceso quedará desactivada.</li>
                        </ul>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 text-danger rounded border-gray-300 flex-shrink-0"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                        />
                        <span className="text-sm text-gray-700 font-nunito leading-snug">
                            Entiendo que esta acción es <strong>irreversible</strong> y quiero eliminar permanentemente mi cuenta y todos mis datos.
                        </span>
                    </label>

                    {error && (
                        <p className="text-sm text-danger font-nunito text-center">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button variant="ghost" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-danger hover:bg-red-700 text-white gap-2"
                        onClick={handleDelete}
                        disabled={!confirmed || loading}
                        isLoading={loading}
                    >
                        <Trash2 size={16} />
                        Eliminar mi cuenta
                    </Button>
                </div>
            </div>
        </div>
    );
};
