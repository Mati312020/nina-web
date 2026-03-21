import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, AlertCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNannySearch } from '../../hooks/useNannySearch';
import { NannySearchCard } from '../../components/booking/NannySearchCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const MAX_SELECTION = 8;

/**
 * Paso 1 del wizard de reserva last-minute.
 * Familia busca y selecciona niñeras disponibles.
 */
export const SearchNanniesPage = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const [query, setQuery]   = useState('');
    const [date, setDate]     = useState('');
    const [time, setTime]     = useState('');
    const [selected, setSelected] = useState([]); // array de nanny objects

    const { nannies, loading, error, search } = useNannySearch();

    // Guard: solo familias
    useEffect(() => {
        if (profile && profile.role !== 'family') {
            navigate('/dashboard/nanny');
        }
    }, [profile, navigate]);

    // Pre-llenar el query con el barrio del perfil y lanzar búsqueda inicial
    useEffect(() => {
        if (profile?.neighborhood) {
            setQuery(profile.neighborhood);
            search({ query: profile.neighborhood });
        } else {
            search({});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.neighborhood]);

    const handleSearch = (e) => {
        e.preventDefault();
        search({ query, date: date || null, time: time || null });
    };

    const toggleNanny = (nannyId) => {
        const nanny = nannies.find(n => n.id === nannyId);
        if (!nanny) return;

        setSelected(prev => {
            const isSelected = prev.some(n => n.id === nannyId);
            if (isSelected) return prev.filter(n => n.id !== nannyId);
            if (prev.length >= MAX_SELECTION) return prev; // límite alcanzado
            return [...prev, nanny];
        });
    };

    const handleContinue = () => {
        if (selected.length === 0) return;
        navigate('/booking/proposal', {
            state: {
                selectedNannies: selected,
                scheduledDate:   date || null,
                scheduledTime:   time || null,
            },
        });
    };

    const noChildren = profile && (!profile.children || profile.children.length === 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard/family')}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 font-poppins">Buscar Niñera</h1>
                        <p className="text-xs text-gray-500">Seleccioná hasta {MAX_SELECTION} candidatas</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 pb-32">
                {/* Aviso de hijos faltantes */}
                {noChildren && (
                    <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">
                                Agregá tus hijos al perfil antes de hacer una reserva
                            </p>
                            <button
                                className="text-xs text-amber-700 underline mt-0.5"
                                onClick={() => navigate('/dashboard/family')}
                            >
                                Ir al perfil
                            </button>
                        </div>
                    </div>
                )}

                {/* Filtros de búsqueda */}
                <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 space-y-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Barrio o nombre..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                           bg-white text-gray-700"
                            />
                        </div>
                        <div className="relative">
                            <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                           bg-white text-gray-700"
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                        Buscar
                    </Button>
                </form>

                {/* Resultados */}
                {error && (
                    <div className="text-center py-8 text-sm text-red-500">{error}</div>
                )}

                {!loading && !error && nannies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No hay niñeras disponibles para estos filtros.</p>
                        <p className="text-gray-400 text-xs mt-1">Intentá con otro barrio o sin filtro de horario.</p>
                    </div>
                )}

                {nannies.length > 0 && (
                    <>
                        <p className="text-xs text-gray-400 mb-3">
                            {nannies.length} niñera{nannies.length !== 1 ? 's' : ''} disponible{nannies.length !== 1 ? 's' : ''}
                            {selected.length > 0 && ` · ${selected.length} seleccionada${selected.length !== 1 ? 's' : ''}`}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {nannies.map(nanny => (
                                <NannySearchCard
                                    key={nanny.id}
                                    nanny={nanny}
                                    selected={selected.some(n => n.id === nanny.id)}
                                    onToggle={toggleNanny}
                                />
                            ))}
                        </div>

                        {selected.length >= MAX_SELECTION && (
                            <p className="text-xs text-amber-600 text-center mt-4">
                                Máximo {MAX_SELECTION} candidatas seleccionadas
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Footer fijo con contador y botón continuar */}
            {selected.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 font-medium">
                            <span className="text-primary font-bold">{selected.length}</span>
                            {' '}de {MAX_SELECTION} seleccionadas
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleContinue}
                            className="flex items-center gap-2"
                        >
                            Continuar
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
