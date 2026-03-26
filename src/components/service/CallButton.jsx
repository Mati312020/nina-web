import React from 'react';
import { Phone } from 'lucide-react';

/**
 * Botón de llamada telefónica. Usa el protocolo tel: del browser/dispositivo.
 * @param {{ phone: string, label?: string }}
 */
export const CallButton = ({ phone, label = 'Llamar' }) => {
    if (!phone) return null;

    const cleaned = phone.replace(/\s/g, '');

    return (
        <a
            href={`tel:${cleaned}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
        >
            <Phone size={16} />
            {label}
        </a>
    );
};
