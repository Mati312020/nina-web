import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { formatARS } from '../../helpers/currencyHelpers';

/**
 * Fila de una factura con concepto, monto, estado y link al PDF.
 */
export const InvoiceItem = ({ invoice }) => {
    const date = invoice.issued_at
        ? new Date(invoice.issued_at).toLocaleDateString('es-AR', {
            day: 'numeric', month: 'short', year: 'numeric',
          })
        : '—';

    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                    {invoice.concept || `Factura #${invoice.id}`}
                </p>
                <p className="text-xs text-gray-400">{date}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-800">{formatARS(invoice.amount)}</p>
                <InvoiceStatusBadge status={invoice.status} />
            </div>
            {invoice.pdf_url && (
                <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer"
                    className="ml-1 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors">
                    <ExternalLink size={14} />
                </a>
            )}
        </div>
    );
};
