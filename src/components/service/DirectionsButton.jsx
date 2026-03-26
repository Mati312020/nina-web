import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * Botón que abre Google Maps con la dirección del domicilio.
 * @param {{ address: string }}
 */
export const DirectionsButton = ({ address }) => {
    if (!address) return null;

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
        >
            <MapPin size={16} />
            Cómo llegar
        </a>
    );
};
