import React from 'react';
import { Users, Calendar, Clock, MapPin, Lock, Phone, Mail } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

/**
 * Card de vacante publicada por una familia.
 * - Muestra: título, niños, período, hs/semana, zona, horario
 * - Si isSubscribed: muestra nombre + phone + email de la familia
 * - Si no: botón "Ver Contacto"
 */
export const FamilyVacancyCard = ({ vacancy, isSubscribed, onContactClick }) => {
    return (
        <Card className="snap-start flex-shrink-0 w-72 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
            {/* Título */}
            <h4 className="font-bold text-gray-900 font-poppins line-clamp-2 leading-snug">
                {vacancy.title}
            </h4>

            {/* Detalles */}
            <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-primary flex-shrink-0" />
                    <span>
                        {vacancy.children_count} {vacancy.children_count === 1 ? 'niño' : 'niños'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary flex-shrink-0" />
                    <span>
                        {vacancy.period_months} {vacancy.period_months === 1 ? 'mes' : 'meses'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary flex-shrink-0" />
                    <span>{vacancy.hours_per_week} hs/semana</span>
                </div>
                {vacancy.location && (
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-secondary flex-shrink-0" />
                        <span className="truncate">{vacancy.location}</span>
                    </div>
                )}
            </div>

            {/* Horario */}
            {vacancy.schedule_description && (
                <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
                    {vacancy.schedule_description}
                </p>
            )}

            {/* Contacto */}
            <div className="mt-auto pt-2 border-t border-gray-100">
                {isSubscribed ? (
                    <div className="space-y-1 text-sm text-gray-700 bg-green-50 rounded-xl p-3">
                        {vacancy.family_name && (
                            <p className="font-semibold text-gray-900">{vacancy.family_name}</p>
                        )}
                        {vacancy.family_phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={13} className="text-success flex-shrink-0" />
                                <span>{vacancy.family_phone}</span>
                            </div>
                        )}
                        {vacancy.family_email && (
                            <div className="flex items-center gap-2">
                                <Mail size={13} className="text-success flex-shrink-0" />
                                <span className="truncate">{vacancy.family_email}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full text-sm gap-2"
                        onClick={onContactClick}
                    >
                        <Lock size={14} />
                        Ver Contacto
                    </Button>
                )}
            </div>
        </Card>
    );
};
