import React, { useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Input de 4 dígitos para verificar el PIN de check-in.
 * Auto-avanza entre celdas y soporta backspace.
 */
export const PinInput = ({ onSubmit, loading, error }) => {
    const [digits, setDigits] = useState(['', '', '', '']);
    const refs = [useRef(), useRef(), useRef(), useRef()];

    const handleChange = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...digits];
        next[i] = val;
        setDigits(next);
        if (val && i < 3) refs[i + 1].current?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            refs[i - 1].current?.focus();
        }
    };

    const handleSubmit = () => {
        const pin = digits.join('');
        if (pin.length === 4) onSubmit(pin);
    };

    const complete = digits.every(Boolean);

    return (
        <div className="space-y-4">
            <div className="flex gap-3 justify-center">
                {digits.map((d, i) => (
                    <input key={i} ref={refs[i]} value={d} maxLength={1} inputMode="numeric"
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        className="w-14 h-16 text-center text-2xl font-bold font-mono border-2 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                    />
                ))}
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {error}
                </div>
            )}

            <Button variant="primary" className="w-full" onClick={handleSubmit}
                disabled={!complete || loading} isLoading={loading}>
                Verificar PIN
            </Button>
        </div>
    );
};
