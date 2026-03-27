import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

const DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const HOURS = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'];

const toSet = (slots) =>
    new Set((slots ?? []).map(s => `${s.day_name}|${s.hour}`));

/**
 * Grilla semanal de disponibilidad horaria (bloques de 2h).
 * Carga el estado actual desde profile.availability y guarda via
 * PUT /users/me/availability.
 */
export const DailyCalendarTab = ({ onSuccess }) => {
    const { user, profile, refreshProfile } = useAuth();
    const [selected, setSelected] = useState(() => toSet(profile?.availability));
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    const toggle = (day, hour) => {
        const key = `${day}|${hour}`;
        setSelected(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const toggleDay = (day) => {
        const dayKeys = HOURS.map(h => `${day}|${h}`);
        const allOn   = dayKeys.every(k => selected.has(k));
        setSelected(prev => {
            const next = new Set(prev);
            dayKeys.forEach(k => allOn ? next.delete(k) : next.add(k));
            return next;
        });
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            const slots = [...selected].map(key => {
                const [day_name, hour] = key.split('|');
                return { day_name, hour };
            });
            await api.put(`/users/me/availability?auth_id=${user.id}`, slots);
            await refreshProfile();
            onSuccess?.();
        } catch {
            setError('Error al guardar. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-gray-500">
                Tocá los bloques para marcar tu disponibilidad. Cada bloque = 2 hs.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-xs border-separate" style={{ borderSpacing: '2px' }}>
                    <thead>
                        <tr>
                            <th className="w-10" />
                            {DAYS.map(d => (
                                <th key={d} className="pb-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleDay(d)}
                                        className="w-full text-gray-500 font-semibold hover:text-primary transition-colors"
                                    >
                                        {d}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {HOURS.map(hour => (
                            <tr key={hour}>
                                <td className="text-gray-400 text-right pr-2 py-0.5 text-[10px] whitespace-nowrap">
                                    {hour}
                                </td>
                                {DAYS.map(day => {
                                    const active = selected.has(`${day}|${hour}`);
                                    return (
                                        <td key={day} className="p-0">
                                            <button
                                                type="button"
                                                onClick={() => toggle(day, hour)}
                                                className={`w-full h-7 rounded transition-colors ${
                                                    active
                                                        ? 'bg-primary'
                                                        : 'bg-gray-100 hover:bg-primary/25'
                                                }`}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                    {error}
                </p>
            )}

            <Button className="w-full" onClick={handleSave} isLoading={loading}>
                Guardar horarios
            </Button>
        </div>
    );
};
