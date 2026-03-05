import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Heart, CreditCard, MapPin } from 'lucide-react';
import { Hero } from '../components/sections/Hero';
import logo from '../assets/logo.png';

/* ── screenshots que van en public/screenshots/ ── */
const SCREENSHOTS = [
    { src: '/screenshots/screen-splash.jpg',   alt: 'Pantalla de inicio'    },
    { src: '/screenshots/screen-familia.jpg',  alt: 'Home familia'          },
    { src: '/screenshots/screen-oferta.jpg',   alt: 'Definí la oferta'      },
    { src: '/screenshots/screen-buscando.jpg', alt: 'Buscando niñera'       },
    { src: '/screenshots/screen-ninera.jpg',   alt: 'Dashboard niñera'      },
];

/* ── Carrusel dentro del frame del teléfono ── */
const PhoneMockup = () => {
    const [current, setCurrent] = useState(0);
    const [loaded, setLoaded]   = useState({});

    /* auto-avanza cada 3 s */
    useEffect(() => {
        const timer = setInterval(() =>
            setCurrent(prev => (prev + 1) % SCREENSHOTS.length),
        3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative mx-auto max-w-[240px]">
            {/* glow decorativo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/20 rounded-full blur-3xl -z-10 scale-110" />

            {/* cuerpo del teléfono — dimensiones explícitas más confiables que aspect-ratio arbitrario */}
            <div className="relative bg-gray-900 rounded-[3rem] shadow-2xl border-[10px] border-gray-900 overflow-hidden w-[220px] h-[476px]">

                {/* notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-xl z-20" />

                {/* slides */}
                {SCREENSHOTS.map((s, i) => (
                    <React.Fragment key={i}>
                        {/* fallback visible mientras carga la imagen */}
                        {!loaded[i] && (
                            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-[#1c2333] transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="bg-primary p-3 rounded-2xl mb-3">
                                    <img src={logo} alt="Nina" className="h-12 w-auto" />
                                </div>
                                <p className="text-xs text-gray-400 px-4 text-center">{s.alt}</p>
                            </div>
                        )}
                        <img
                            src={s.src}
                            alt={s.alt}
                            onLoad={() => setLoaded(prev => ({ ...prev, [i]: true }))}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'} ${!loaded[i] ? 'invisible' : ''}`}
                        />
                    </React.Fragment>
                ))}

                {/* indicadores */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {SCREENSHOTS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`Ver screenshot ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === current
                                    ? 'bg-white w-4 shadow-sm'
                                    : 'bg-white/50 w-1.5 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ── SVG logos inline (sin dependencia de paquetes) ── */
const PlayStoreLogo = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
        <path fill="#34A853" d="M1.22 0a1.4 1.4 0 0 0-.96 1.36v21.27a1.4 1.4 0 0 0 .96 1.36l.09.05L13.1 12.3v-.28L1.31-.05z"/>
        <path fill="#4285F4" d="M17.05 16.17l-3.95-3.87v-.28l3.95-3.87.09.05 4.68 2.66c1.34.76 1.34 2 0 2.76l-4.68 2.66z"/>
        <path fill="#FBBC05" d="M17.14 16.06L13.1 12 1.22 23.98c.44.47 1.17.53 1.98.06z"/>
        <path fill="#EA4335" d="M17.14 7.94L3.2.02C2.39-.46 1.66-.39 1.22.08L13.1 12z"/>
    </svg>
);

/* ── Página ── */
export const LandingPage = () => (
    <div className="flex flex-col">

        {/* Hero */}
        <Hero />

        {/* Features */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">¿Por qué elegir Nina?</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={<CreditCard className="w-8 h-8 text-primary" />}
                        title="Pago Seguro con Mercado Pago"
                        description="Pagá de forma segura y sin complicaciones a través de Mercado Pago. Aceptamos tarjetas, transferencias y más."
                    />
                    <FeatureCard
                        icon={<MapPin className="w-8 h-8 text-secondary" />}
                        title="En tu Barrio"
                        description="Encuentra ayuda cerca de casa. Menos tiempo de viaje, más tiempo de calidad."
                    />
                    <FeatureCard
                        icon={<Heart className="w-8 h-8 text-danger" />}
                        title="Confianza Total"
                        description="Lee reseñas reales de otros padres y conoce a la niñera antes de contratar."
                    />
                </div>
            </div>
        </section>

        {/* App Móvil */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

                    {/* texto + badges */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-gray-900 font-poppins">App Móvil</h2>
                        <p className="text-lg text-gray-600 font-nunito leading-relaxed">
                            Llevá a Nina con vos. Gestioná reservas, recibí notificaciones al instante y mantené el contacto directo con tu niñera desde nuestra aplicación móvil.
                        </p>

                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Google Play — Próximamente */}
                            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-xl shadow-sm cursor-default select-none opacity-80">
                                <PlayStoreLogo />
                                <div className="leading-none">
                                    <div className="text-[10px] text-amber-500 font-semibold mb-0.5">Próximamente</div>
                                    <div className="text-sm font-bold font-poppins text-gray-600">Google Play</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* mockup del teléfono */}
                    <PhoneMockup />

                </div>
            </div>
        </section>

    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-none bg-gray-50/50">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform -rotate-3 transition-transform hover:rotate-3">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{title}</h3>
        <p className="text-gray-600 font-nunito leading-relaxed">{description}</p>
    </Card>
);
