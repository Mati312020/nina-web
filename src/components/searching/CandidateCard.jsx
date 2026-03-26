import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const INITIALS = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

const isValidImg = (url) =>
    typeof url === 'string' && url.startsWith('https://') && url.includes('supabase.co');

/**
 * Tarjeta de candidata en la cascada de búsqueda.
 *
 * @param {{ nanny: object, candidateStatus: 'contacting'|'waiting'|'rejected'|'accepted' }}
 */
export const CandidateCard = ({ nanny, candidateStatus }) => {
    const isContacting = candidateStatus === 'contacting';
    const isAccepted   = candidateStatus === 'accepted';
    const isRejected   = candidateStatus === 'rejected';

    return (
        <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all
            ${isContacting ? 'border-primary bg-primary/5 shadow-md scale-105' : ''}
            ${isAccepted  ? 'border-green-500 bg-green-50' : ''}
            ${isRejected  ? 'border-gray-200 bg-gray-50 opacity-50' : ''}
            ${candidateStatus === 'waiting' ? 'border-gray-200 bg-white opacity-70' : ''}
        `}>
            {/* Avatar */}
            <div className={`relative w-14 h-14 rounded-full flex-shrink-0
                ${isContacting ? 'ring-4 ring-primary/40 animate-pulse' : ''}
            `}>
                {isValidImg(nanny.profileImage) ? (
                    <img src={nanny.profileImage} alt={nanny.name}
                        className="w-14 h-14 rounded-full object-cover" />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-poppins">
                        {INITIALS(nanny.name)}
                    </div>
                )}
                {isAccepted && (
                    <CheckCircle2 size={18} className="absolute -bottom-1 -right-1 text-green-600 bg-white rounded-full" />
                )}
                {isRejected && (
                    <XCircle size={18} className="absolute -bottom-1 -right-1 text-gray-400 bg-white rounded-full" />
                )}
            </div>

            {/* Nombre */}
            <p className="text-xs font-medium text-gray-700 text-center line-clamp-1 w-full">{nanny.name}</p>

            {/* Estado */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                ${isContacting ? 'bg-primary text-white' : ''}
                ${isAccepted  ? 'bg-green-100 text-green-700' : ''}
                ${isRejected  ? 'bg-gray-100 text-gray-400' : ''}
                ${candidateStatus === 'waiting' ? 'bg-gray-100 text-gray-400' : ''}
            `}>
                {isContacting ? 'Notificando…' : ''}
                {isAccepted   ? '¡Aceptó!' : ''}
                {isRejected   ? 'No disponible' : ''}
                {candidateStatus === 'waiting' ? 'En espera' : ''}
            </span>
        </div>
    );
};
