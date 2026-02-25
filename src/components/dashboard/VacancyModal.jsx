import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Modal para que una familia publique una vacante de largo plazo.
 * Props: isOpen, onClose, onSuccess (callback post-creación)
 */
export const VacancyModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        description: '',
        children_count: 1,
        period_months: 3,
        hours_per_week: 20,
        schedule_description: '',
        location: '',
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
        if (!form.title.trim()) {
            setError('El título es obligatorio.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/long-term/vacancies', { ...form, auth_id: user.id });
            setForm({
                title: '',
                description: '',
                children_count: 1,
                period_months: 3,
                hours_per_week: 20,
                schedule_description: '',
                location: '',
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Error publicando vacante:', err);
            setError('Error al publicar la vacante. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Publicar Vacante">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Título de la búsqueda"
                    name="title"
                    placeholder="Ej: Buscamos niñera para 2 niños en Palermo"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                        Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200
                                   focus:border-primary focus:ring-2 focus:ring-primary/20
                                   outline-none transition-all text-sm"
                        placeholder="Contanos más sobre la búsqueda: edades de los niños, tareas, etc."
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Fila de números */}
                <div className="grid grid-cols-3 gap-3">
                    <Input
                        label="Niños"
                        name="children_count"
                        type="number"
                        min={1}
                        max={10}
                        value={form.children_count}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Meses"
                        name="period_months"
                        type="number"
                        min={1}
                        max={60}
                        value={form.period_months}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Hs/semana"
                        name="hours_per_week"
                        type="number"
                        min={1}
                        max={60}
                        value={form.hours_per_week}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Input
                    label="Horarios / Días"
                    name="schedule_description"
                    placeholder="Ej: Lunes a viernes 8–17 hs"
                    value={form.schedule_description}
                    onChange={handleChange}
                />

                <Input
                    label="Zona / Barrio"
                    name="location"
                    placeholder="Ej: Palermo, CABA"
                    value={form.location}
                    onChange={handleChange}
                />

                {error && (
                    <p className="text-sm text-danger text-center bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                    </p>
                )}

                <Button type="submit" className="w-full" isLoading={loading}>
                    Publicar Vacante
                </Button>
            </form>
        </Modal>
    );
};
