import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { PinInput } from './PinInput';

/**
 * Vista "Llegué" para la niñera: ingresa el PIN que la familia tiene en pantalla.
 * La familia ve un mensaje de espera.
 */
export const ArrivedView = ({ booking, role, onPinVerified, loading, error }) => {
    const nanny  = booking?.nanny  ?? {};
    const family = booking?.family ?? {};

    if (role === 'family') {
        return (
            <Card className="p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} className="text-primary" />
                </div>
                <p className="font-bold text-gray-900 font-poppins text-lg">
                    {nanny.name || 'Tu niñera'} llegó
                </p>
                <p className="text-sm text-gray-500">
                    Compartile el PIN que ves en la app para que pueda comenzar el servicio.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card className="p-5 space-y-1">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Verificar llegada</p>
                <p className="font-bold text-gray-900 font-poppins">
                    Ingresá el PIN de {family.name || 'la familia'}
                </p>
                <p className="text-sm text-gray-500">Pedíselo a la familia para iniciar el servicio.</p>
            </Card>

            <PinInput onSubmit={onPinVerified} loading={loading} error={error} />
        </div>
    );
};
