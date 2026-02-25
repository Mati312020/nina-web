import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Carrusel horizontal con scroll suave y flechas de navegación.
 * Las flechas aparecen al hacer hover sobre el carrusel.
 * Props: children, title (opcional)
 */
export const Carousel = ({ children, title }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({
            left: direction * 300,
            behavior: 'smooth',
        });
    };

    return (
        <div>
            {title && (
                <h2 className="text-xl font-bold text-gray-900 font-poppins mb-4">{title}</h2>
            )}
            <div className="relative group">
                {/* Flecha izquierda */}
                <button
                    onClick={() => scroll(-1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2
                               opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4
                               hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Anterior"
                >
                    <ChevronLeft size={20} className="text-primary" />
                </button>

                {/* Contenedor scrolleable */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {children}
                </div>

                {/* Flecha derecha */}
                <button
                    onClick={() => scroll(1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2
                               opacity-0 group-hover:opacity-100 transition-opacity translate-x-4
                               hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Siguiente"
                >
                    <ChevronRight size={20} className="text-primary" />
                </button>
            </div>
        </div>
    );
};
