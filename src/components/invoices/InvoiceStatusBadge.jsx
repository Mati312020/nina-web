import React from 'react';

const CONFIG = {
    issued:  { label: 'Emitida',   className: 'bg-green-100 text-green-700' },
    pending: { label: 'Pendiente', className: 'bg-amber-100 text-amber-700' },
    failed:  { label: 'Error',     className: 'bg-red-100 text-red-700' },
};

/**
 * Badge de estado de una factura: issued / pending / failed.
 */
export const InvoiceStatusBadge = ({ status }) => {
    const { label, className } = CONFIG[status] ?? CONFIG.pending;
    return (
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
            {label}
        </span>
    );
};
