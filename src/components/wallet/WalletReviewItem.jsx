import React from 'react';
import { Star } from 'lucide-react';

/**
 * Reseña recibida por la niñera.
 */
export const WalletReviewItem = ({ review }) => {
    const date = review.created_at
        ? new Date(review.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    return (
        <div className="py-3 border-b border-gray-100 last:border-0 space-y-1">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">
                    {review.reviewer?.name || 'Familia'}
                </p>
                <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(n => (
                        <Star key={n} size={12}
                            className={n <= review.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                </div>
            </div>
            {review.comment && <p className="text-xs text-gray-500 leading-relaxed">{review.comment}</p>}
            {date && <p className="text-xs text-gray-300">{date}</p>}
        </div>
    );
};
