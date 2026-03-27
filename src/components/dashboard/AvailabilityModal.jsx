import React, { useState } from 'react';
import { CalendarDays, Briefcase } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { DailyCalendarTab } from '../availability/DailyCalendarTab';
import { LongTermTab } from '../availability/LongTermTab';

const TABS = {
    daily: {
        icon:  <CalendarDays size={15} />,
        label: 'Horarios semanales',
    },
    longterm: {
        icon:  <Briefcase size={15} />,
        label: 'Largo plazo',
    },
};

/**
 * Modal de disponibilidad con dos pestañas:
 *  - "Horarios semanales": grilla día × hora para servicios last-minute
 *  - "Largo plazo": publicar perfil de disponibilidad para trabajos continuos
 *
 * Props: isOpen, onClose, onSuccess
 */
export const AvailabilityModal = ({ isOpen, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('daily');

    const handleSuccess = () => {
        onSuccess?.();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Actualizar Disponibilidad">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-5">
                {Object.entries(TABS).map(([key, cfg]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3
                                    rounded-lg text-sm font-semibold transition-all font-nunito ${
                            activeTab === key
                                ? 'bg-white shadow text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {cfg.icon}
                        {cfg.label}
                    </button>
                ))}
            </div>

            {activeTab === 'daily'
                ? <DailyCalendarTab onSuccess={handleSuccess} />
                : <LongTermTab      onSuccess={handleSuccess} />
            }
        </Modal>
    );
};
