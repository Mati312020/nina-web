import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Modal para que una niñera se publique como disponible para trabajo de largo plazo.
 * Props: isOpen, onClose, onSuccess (callback post-creación)
 */
export const AvailabilityModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        availability_description: '',
        preferred_hours_per_week: 20,
        schedule_description: '',
        min_months: 1,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/long-term/nanny-availability', { ...form, auth_id: user.id });
            setForm({
                availability_description: '',
                preferred_hours_per_week: 20,
                schedule_description: '',
                min_months: 1,
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Error publicando disponibilidad:', err);
            setError('Error al publicar disponibilidad. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Publicarme como Disponible">
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
                                   outline-none transition-all text-sm"
                        placeholder="Ej: Disponible para trabajo largo plazo, experiencia con bebés y niños hasta 8 años..."
                        value={form.availability_description}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Hs/semana preferidas"
                        name="preferred_hours_per_week"
                        type="number"
                        min={1}
                        max={60}
                        value={form.preferred_hours_per_week}
                        onChange={handleChange}
                    />
                    <Input
                        label="Meses mínimos"
                        name="min_months"
                        type="number"
                        min={1}
                        max={24}
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
                    <p className="text-sm text-danger text-center bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                    </p>
                )}

                <Button type="submit" className="w-full" isLoading={loading}>
                    Publicar Disponibilidad
                </Button>
            </form>
        </Modal>
    );
};
