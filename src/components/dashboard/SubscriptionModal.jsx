import React, { useState } from 'react';
import { Phone, Star, Shield, CheckCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

/**
 * Modal de suscripción: muestra el valor de la suscripción y procesa el pago vía MP.
 * Props:
 *   isOpen      — controla visibilidad
 *   onClose     — cierra el modal
 *   onSubscribe — async fn que crea el checkout y abre la URL (desde useSubscription)
 */
export const SubscriptionModal = ({ isOpen, onClose, onSubscribe }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubscribe = async () => {
        setLoading(true);
        setError('');
        try {
            await onSubscribe();
            onClose();
        } catch (err) {
            console.error('Error en suscripción:', err);
            setError('Hubo un error al procesar el pago. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: Phone, text: 'Contacto directo con niñeras verificadas' },
        { icon: Shield, text: 'Acceso a vacantes publicadas por familias' },
        { icon: CheckCircle, text: 'Pago seguro vía MercadoPago — 30 días de acceso' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Desbloqueá los contactos">
            <div className="flex flex-col gap-6">
                {/* Ícono central */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Phone size={30} className="text-primary" />
                    </div>
                    <p className="text-gray-600 font-nunito text-sm leading-relaxed">
                        Para ver el teléfono y email de niñeras y familias,
                        necesitás una suscripción activa.
                    </p>
                </div>

                {/* Precio */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                    <p className="text-4xl font-bold text-primary font-poppins">$2 USD</p>
                    <p className="text-gray-500 text-sm mt-1">≈ 2.000 ARS · 30 días de acceso completo</p>
                </div>

                {/* Beneficios */}
                <ul className="space-y-3">
                    {benefits.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-start gap-3 text-sm text-gray-700">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon size={13} className="text-primary" />
                            </div>
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-danger text-sm p-3 rounded-lg border border-red-100 text-center">
                        {error}
                    </div>
                )}

                {/* CTA */}
                <Button className="w-full" onClick={handleSubscribe} isLoading={loading}>
                    Suscribirme · Pagar con MercadoPago
                </Button>

                <p className="text-xs text-gray-400 text-center">
                    Se abrirá MercadoPago en una nueva pestaña. Volvé aquí después de pagar.
                </p>
            </div>
        </Modal>
    );
};
