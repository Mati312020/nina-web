import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { EarningsHistoryItem } from './EarningsHistoryItem';

const PAGE_SIZE = 5;

/**
 * Lista paginada del historial de servicios completados.
 */
export const EarningsHistoryList = ({ history = [] }) => {
    const [page, setPage] = useState(1);
    const visible = history.slice(0, page * PAGE_SIZE);
    const hasMore = visible.length < history.length;

    if (history.length === 0) {
        return (
            <Card className="p-5 text-center">
                <p className="text-sm text-gray-400">Aún no tenés servicios completados.</p>
            </Card>
        );
    }

    return (
        <Card className="p-5">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-3">
                Historial
            </p>
            {visible.map((item) => (
                <EarningsHistoryItem key={item.id} item={item} />
            ))}
            {hasMore && (
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="w-full mt-3 text-xs text-primary font-semibold hover:underline">
                    Ver más
                </button>
            )}
        </Card>
    );
};
