import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const INITIAL = {
    availability_description: '',
    preferred_hours_per_week: 20,
    schedule_description: '',
    min_months: 1,
};

/**
 * Formulario para publicar disponibilidad de largo plazo.
 * Extrae la lógica del AvailabilityModal original.
 */
export const LongTermTab = ({ onSuccess }) => {
    const { user } = useAuth();
    const [form, setForm]     = useState(INITIAL);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/long-term/nanny-availability', { ...form, auth_id: user.id });
            setForm(INITIAL);
            onSuccess?.();
        } catch {
            setError('Error al publicar disponibilidad. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Sobre tu disponibilidad
                </label>
                <textarea
                    name="availability_description"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                               focus:border-primary focus:ring-2 focus:ring-primary/20
                               outline-none transition-all text-sm resize-none"
                    placeholder="Ej: Disponible para trabajo de largo plazo, experiencia con bebés y niños hasta 8 años..."
                    value={form.availability_description}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                    label="Hs/semana preferidas"
                    name="preferred_hours_per_week"
                    type="number"
                    min={1} max={60}
                    value={form.preferred_hours_per_week}
                    onChange={handleChange}
                />
                <Input
                    label="Meses mínimos"
                    name="min_months"
                    type="number"
                    min={1} max={24}
                    value={form.min_months}
                    onChange={handleChange}
                />
            </div>

            <Input
                label="Horarios / Días disponibles"
                name="schedule_description"
                placeholder="Ej: Lunes a viernes, jornada completa"
                value={form.schedule_description}
                onChange={handleChange}
            />

            {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                    {error}
                </p>
            )}

            <Button type="submit" className="w-full" isLoading={loading}>
                Publicar disponibilidad
            </Button>
        </form>
    );
};
