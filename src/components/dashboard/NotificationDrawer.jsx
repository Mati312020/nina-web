import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, Info, CheckCircle, AlertTriangle, Calendar, Megaphone } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const TYPE_CONFIG = {
    info:    { icon: Info,          color: 'text-blue-500',  bg: 'bg-blue-50'  },
    success: { icon: CheckCircle,   color: 'text-green-500', bg: 'bg-green-50' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    booking: { icon: Calendar,      color: 'text-primary',   bg: 'bg-primary/10' },
};

const fmtRelative = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'ahora';
    if (mins < 60) return `hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `hace ${days}d`;
};

/**
 * Campana de notificaciones con drawer lateral.
 * Se coloca en el header de cualquier dashboard.
 *
 * Combina notificaciones personales (booking events, mensajes admin)
 * y broadcasts del sistema (anuncios para todos o por rol).
 */
export const NotificationDrawer = () => {
    const { items, unreadCount, loading, markAllRead, dismiss } = useNotifications();
    const [open, setOpen] = useState(false);
    const drawerRef = useRef(null);

    // Marcar como leídas al abrir
    useEffect(() => {
        if (open && unreadCount > 0) {
            const timer = setTimeout(markAllRead, 800);
            return () => clearTimeout(timer);
        }
    }, [open, unreadCount, markAllRead]);

    // Cerrar con Escape o clic fuera
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        const handleClick = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
        };
        if (open) {
            document.addEventListener('keydown', handleKey);
            document.addEventListener('mousedown', handleClick);
        }
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [open]);

    return (
        <div className="relative" ref={drawerRef}>
            {/* Campana */}
            <button
                onClick={() => setOpen(o => !o)}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/40 transition-colors"
                aria-label="Notificaciones"
            >
                <Bell size={17} className={unreadCount > 0 ? 'text-primary' : 'text-gray-400'} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Drawer */}
            {open && (
                <>
                    {/* Overlay semi-transparente en mobile */}
                    <div className="fixed inset-0 bg-black/10 z-40 sm:hidden" onClick={() => setOpen(false)} />

                    <div className="absolute right-0 top-11 z-50 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col max-h-[70vh]">
                        {/* Header del drawer */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Megaphone size={15} className="text-primary" />
                                <h3 className="font-bold text-gray-900 font-poppins text-sm">Notificaciones</h3>
                                {unreadCount > 0 && (
                                    <span className="text-xs text-gray-400">{unreadCount} nueva{unreadCount > 1 ? 's' : ''}</span>
                                )}
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Lista */}
                        <div className="overflow-y-auto flex-1">
                            {loading && items.length === 0 ? (
                                <div className="p-4 space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <div className="py-12 flex flex-col items-center gap-2 text-center px-4">
                                    <Bell size={28} className="text-gray-200" />
                                    <p className="text-sm text-gray-400 font-nunito">No tenés notificaciones</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {items.map(item => {
                                        const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
                                        const Icon = cfg.icon;
                                        const isBroadcast = item._source === 'broadcast';
                                        const isUnread = !item.is_read;

                                        return (
                                            <li
                                                key={item.id}
                                                className={`flex gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors ${isUnread ? 'bg-primary/[0.03]' : ''}`}
                                            >
                                                {/* Ícono de tipo */}
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                                                    <Icon size={14} className={cfg.color} />
                                                </div>

                                                {/* Contenido */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-1">
                                                        <p className={`text-sm font-semibold font-poppins leading-snug ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                                                            {item.title}
                                                        </p>
                                                        {isBroadcast && (
                                                            <button
                                                                onClick={() => dismiss(item.id)}
                                                                className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5"
                                                                title="Descartar"
                                                            >
                                                                <X size={13} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {item.body && (
                                                        <p className="text-xs text-gray-500 font-nunito mt-0.5 leading-relaxed">
                                                            {item.body}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] text-gray-400">{fmtRelative(item.created_at)}</span>
                                                        {isBroadcast && (
                                                            <span className="text-[10px] text-gray-300 uppercase tracking-wide">Sistema</span>
                                                        )}
                                                        {isUnread && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Footer: marcar todas como leídas */}
                        {items.some(n => !n.is_read && n._source === 'personal') && (
                            <div className="border-t border-gray-100 px-4 py-2.5">
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors"
                                >
                                    <CheckCheck size={13} />
                                    Marcar todas como leídas
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
