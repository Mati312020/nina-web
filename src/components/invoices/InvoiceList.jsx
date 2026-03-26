import React from 'react';
import { FileX } from 'lucide-react';
import { Card } from '../ui/Card';
import { InvoiceItem } from './InvoiceItem';

/**
 * Lista de facturas con empty state.
 */
export const InvoiceList = ({ invoices = [] }) => {
    if (invoices.length === 0) {
        return (
            <Card className="p-8 flex flex-col items-center text-center gap-3">
                <FileX size={32} className="text-gray-300" />
                <p className="text-sm text-gray-400">No tenés facturas todavía.</p>
                <p className="text-xs text-gray-300">
                    Las facturas se generan automáticamente al completar un servicio.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-5">
            {invoices.map((inv) => (
                <InvoiceItem key={inv.id} invoice={inv} />
            ))}
        </Card>
    );
};
