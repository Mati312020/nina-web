import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Muestra el PIN de check-in con botón para revelar/ocultar.
 * @param {{ pin: string|null }}
 */
export const PinDisplay = ({ pin }) => {
    const [visible, setVisible] = useState(false);

    if (!pin) return null;

    return (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">PIN de verificación</p>
            <div className="flex items-center justify-between">
                <span className={`font-mono font-bold text-3xl tracking-widest text-primary ${!visible ? 'blur-sm select-none' : ''}`}>
                    {pin}
                </span>
                <button
                    onClick={() => setVisible(v => !v)}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-primary transition-colors"
                    aria-label={visible ? 'Ocultar PIN' : 'Mostrar PIN'}
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
                Dáselo a la niñera cuando llegue a tu puerta.
            </p>
        </div>
    );
};
