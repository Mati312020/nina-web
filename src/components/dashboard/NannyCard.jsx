import React from 'react';
import { Star, Clock, Lock, Phone, Mail } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

/**
 * Card de niñera disponible para largo plazo.
 * - Si isSubscribed: muestra phone y email de la niñera
 * - Si no: botón "Ver Contacto" que dispara onContactClick para abrir SubscriptionModal
 */
export const NannyCard = ({ nanny, isSubscribed, onContactClick }) => {
    const initials = nanny.nanny_name
        ? nanny.nanny_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <Card className="snap-start flex-shrink-0 w-72 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
            {/* Avatar + nombre */}
            <div className="flex items-center gap-3">
                {nanny.profile_image_url ? (
                    <img
                        src={nanny.profile_image_url}
                        alt={nanny.nanny_name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center
                                    text-primary font-bold text-lg font-poppins flex-shrink-0">
                        {initials}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="font-bold text-gray-900 font-poppins truncate">
                        {nanny.nanny_name || 'Niñera'}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
                        <Star size={13} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <span>{nanny.rating_avg?.toFixed(1) ?? '5.0'}</span>
                        {nanny.experience_years > 0 && (
                            <span className="text-gray-400">
                                · {nanny.experience_years} {nanny.experience_years === 1 ? 'año' : 'años'} exp.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio */}
            {nanny.nanny_bio && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {nanny.nanny_bio}
                </p>
            )}

            {/* Disponibilidad */}
            {nanny.schedule_description && (
                <div className="flex items-start gap-1.5 text-sm text-gray-500">
                    <Clock size={14} className="flex-shrink-0 mt-0.5 text-primary" />
                    <span className="line-clamp-1">{nanny.schedule_description}</span>
                </div>
            )}

            {nanny.min_months && (
                <p className="text-xs text-gray-400 font-medium">
                    Mínimo {nanny.min_months} {nanny.min_months === 1 ? 'mes' : 'meses'}
                </p>
            )}

            {/* Contacto */}
            <div className="mt-auto pt-2 border-t border-gray-100">
                {isSubscribed ? (
                    <div className="space-y-1 text-sm text-gray-700 bg-green-50 rounded-xl p-3">
                        {nanny.nanny_phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={13} className="text-success flex-shrink-0" />
                                <span>{nanny.nanny_phone}</span>
                            </div>
                        )}
                        {nanny.nanny_email && (
                            <div className="flex items-center gap-2">
                                <Mail size={13} className="text-success flex-shrink-0" />
                                <span className="truncate">{nanny.nanny_email}</span>
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
