import React from 'react';
import { Search } from 'lucide-react';

/**
 * Header de la pantalla de búsqueda activa.
 * Muestra el spinner animado y el contador de candidatas.
 */
export const SearchingHeader = ({ total = 0, currentIndex = 0 }) => (
    <div className="flex flex-col items-center gap-4 py-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-spin border-t-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Search size={20} className="text-primary" />
            </div>
        </div>

        <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-gray-900 font-poppins">
                Buscando tu niñera
            </h2>
            <p className="text-sm text-gray-500">
                Estamos contactando candidata {Math.min(currentIndex + 1, total)} de {total}
            </p>
        </div>

        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2">
            <span className="text-xs text-primary font-medium">
                Te avisaremos por email cuando alguien acepte
            </span>
        </div>
    </div>
);
