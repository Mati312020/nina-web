import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Heart, CreditCard, MapPin, Search, CalendarCheck, Star,
         ToggleRight, DollarSign, Clock, UserCheck, FileText, Bell } from 'lucide-react';
import { Hero } from '../components/sections/Hero';
import logo from '../assets/logo.png';

/* ══════════════════════════════════════════════════════════
   DATOS del carrusel — cada slide tiene su propio copy
   ══════════════════════════════════════════════════════════ */
const SLIDES = [
    {
        src:         '/screenshots/screen-splash.jpg',
        alt:         'Pantalla de inicio',
        title:       'Siempre lista para vos',
        description: 'Nina abre en segundos y te conecta con niñeras de confianza en tu barrio. Disponible las 24 hs, los 7 días de la semana.',
    },
    {
        src:         '/screenshots/screen-familia.jpg',
        alt:         'Home familia',
        title:       'Encontrá la niñera ideal',
        description: 'Buscá por barrio, elegí fecha y hora, y explorá perfiles de niñeras cercanas con reseñas reales y tarifa por hora.',
    },
    {
        src:         '/screenshots/screen-oferta.jpg',
        alt:         'Definí la oferta',
        title:       'Vos ponés las condiciones',
        description: 'Elegí la duración del servicio y decidís si usás la tarifa estándar o hacés tu propia oferta. Simple y transparente.',
    },
    {
        src:         '/screenshots/screen-buscando.jpg',
        alt:         'Buscando niñera',
        title:       'Matching en tiempo real',
        description: 'La app contacta niñeras disponibles al instante. Cada candidata tiene 5 minutos para aceptar y te avisamos cuando alguien confirma.',
    },
    {
        src:         '/screenshots/screen-ninera.jpg',
        alt:         'Dashboard niñera',
        title:       'El panel de la niñera',
        description: 'Las niñeras controlan su disponibilidad semanal, siguen sus ganancias y aparecen en búsquedas inmediatas con un solo toque.',
    },
];

/* ══════════════════════════════════════════════════════════
   PHONE MOCKUP con carrusel
   recibe current + setCurrent desde el padre para sincronizar
   ══════════════════════════════════════════════════════════ */
const PhoneMockup = ({ current, setCurrent }) => {
    const [loaded, setLoaded] = useState({});

    return (
        <div className="relative mx-auto max-w-[240px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/20 rounded-full blur-3xl -z-10 scale-110" />

            <div className="relative bg-gray-900 rounded-[3rem] shadow-2xl border-[10px] border-gray-900 overflow-hidden w-[220px] h-[476px]">
                {/* notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-xl z-20" />

                {SLIDES.map((s, i) => (
                    <React.Fragment key={i}>
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
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
                                ${i === current ? 'opacity-100' : 'opacity-0'}
                                ${!loaded[i] ? 'invisible' : ''}`}
                        />
                    </React.Fragment>
                ))}

                {/* dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`Ver screenshot ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300
                                ${i === current ? 'bg-white w-4 shadow-sm' : 'bg-white/50 w-1.5 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   SECCIÓN APP MÓVIL — texto sincronizado con el carrusel
   ══════════════════════════════════════════════════════════ */
const AppMovilSection = () => {
    const [current, setCurrent] = useState(0);

    /* auto-avanza cada 3 s */
    useEffect(() => {
        const t = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 3000);
        return () => clearInterval(t);
    }, []);

    const slide = SLIDES[current];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

                    {/* — texto dinámico — */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 font-poppins">App Móvil</h2>
                            <p className="text-sm text-primary font-semibold font-poppins mt-1">
                                Sin descargas · Instalala directo desde el navegador
                            </p>
                        </div>

                        {/* bloque que cambia con key para disparar fade-in */}
                        <div key={current} className="animate-fadeIn space-y-3">
                            <h3 className="text-xl font-semibold text-primary font-poppins">
                                {slide.title}
                            </h3>
                            <p className="text-lg text-gray-600 font-nunito leading-relaxed">
                                {slide.description}
                            </p>
                        </div>

                        {/* indicadores de slide como chips */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {SLIDES.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200
                                        ${i === current
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                >
                                    {s.alt}
                                </button>
                            ))}
                        </div>

                        {/* card de instalación PWA */}
                        <div className="pt-2 space-y-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Cómo instalarla
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Android */}
                                <div className="inline-flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
                                    <ChromeIcon />
                                    <div className="leading-none">
                                        <div className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wide">Android · Chrome</div>
                                        <div className="text-xs font-semibold text-gray-700">Menú <span className="text-base leading-none">⋮</span> → Agregar a inicio</div>
                                    </div>
                                </div>

                                {/* iPhone */}
                                <div className="inline-flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
                                    <SafariIcon />
                                    <div className="leading-none">
                                        <div className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wide">iPhone · Safari</div>
                                        <div className="text-xs font-semibold text-gray-700">Compartir <span className="text-base leading-none">⬆</span> → Agregar a inicio</div>
                                    </div>
                                </div>
                            </div>

                            {/* pill de beneficios */}
                            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 16 16">
                                    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
                                    <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Sin Play Store · Sin App Store · Se actualiza sola
                            </div>
                        </div>
                    </div>

                    {/* — mockup del teléfono — */}
                    <PhoneMockup current={current} setCurrent={setCurrent} />

                </div>
            </div>
        </section>
    );
};

/* ══════════════════════════════════════════════════════════
   SECCIÓN PLATAFORMA WEB
   ══════════════════════════════════════════════════════════ */
const WebSection = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">

            <div className="text-center mb-14">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase">También desde el navegador</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4 font-poppins">Todo lo que podés hacer en la web</h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* columna Familias */}
                <div className="bg-gray-50 rounded-2xl p-8 space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 font-poppins">Para Familias</h3>
                    </div>
                    <WebFeature icon={<Search className="w-4 h-4"/>}      text="Explorá perfiles de niñeras cercanas con foto, reseñas y experiencia" />
                    <WebFeature icon={<FileText className="w-4 h-4"/>}    text="Publicá vacantes detallando horario, días y requisitos específicos" />
                    <WebFeature icon={<CalendarCheck className="w-4 h-4"/>} text="Gestioná tus reservas activas y revisá el historial de servicios" />
                    <WebFeature icon={<Star className="w-4 h-4"/>}        text="Dejá reseñas y calificaciones para construir una comunidad de confianza" />
                    <WebFeature icon={<CreditCard className="w-4 h-4"/>}  text="Revisá tus pagos y facturas de servicios anteriores vía Mercado Pago" />
                    <WebFeature icon={<Bell className="w-4 h-4"/>}        text="Recibí notificaciones cuando una niñera acepta tu solicitud" />
                </div>

                {/* columna Niñeras */}
                <div className="bg-gray-50 rounded-2xl p-8 space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 font-poppins">Para Niñeras</h3>
                    </div>
                    <WebFeature icon={<ToggleRight className="w-4 h-4"/>} text="Activá tu disponibilidad para aparecer en búsquedas inmediatas de familias" color="secondary" />
                    <WebFeature icon={<FileText className="w-4 h-4"/>}    text="Explorá vacantes publicadas y postulate a trabajos que se adapten a tu agenda" color="secondary" />
                    <WebFeature icon={<DollarSign className="w-4 h-4"/>}  text="Seguí tus ganancias semanales y el historial completo de servicios realizados" color="secondary" />
                    <WebFeature icon={<Clock className="w-4 h-4"/>}       text="Configurá tu disponibilidad semanal por día y franja horaria" color="secondary" />
                    <WebFeature icon={<Star className="w-4 h-4"/>}        text="Acumulá reseñas de familias para destacarte en los resultados de búsqueda" color="secondary" />
                    <WebFeature icon={<MapPin className="w-4 h-4"/>}      text="Definí tu zona de trabajo y aparecé en búsquedas de tu barrio" color="secondary" />
                </div>
            </div>
        </div>
    </section>
);

const WebFeature = ({ icon, text, color = 'primary' }) => (
    <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center
            ${color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
            {icon}
        </div>
        <p className="text-gray-600 font-nunito text-sm leading-relaxed">{text}</p>
    </div>
);

/* ══════════════════════════════════════════════════════════
   Íconos para la card de instalación PWA
   ══════════════════════════════════════════════════════════ */
const ChromeIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="chrome-clip">
                <circle cx="12" cy="12" r="10"/>
            </clipPath>
        </defs>
        {/* 3 sectores de 120° — clip circular para bordes limpios */}
        <g clipPath="url(#chrome-clip)">
            <path fill="#EA4335" d="M12 12L20.66 7A10 10 0 0 0 3.34 7Z"/>
            <path fill="#FBBC05" d="M12 12L3.34 7A10 10 0 0 1 12 22Z"/>
            <path fill="#34A853" d="M12 12L12 22A10 10 0 0 1 20.66 7Z"/>
        </g>
        {/* Separador blanco fino + centro azul */}
        <circle cx="12" cy="12" r="6" fill="white"/>
        <circle cx="12" cy="12" r="5.5" fill="#4285F4"/>
    </svg>
);

const SafariIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="url(#sg)"/>
        <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1C86FA"/>
                <stop offset="100%" stopColor="#47D7FF"/>
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeOpacity=".25" strokeWidth=".5"/>
        <polygon points="12,4.5 14,11 19.5,12 14,13 12,19.5 10,13 4.5,12 10,11" fill="white"/>
        <circle cx="12" cy="12" r="1.2" fill="#1C86FA"/>
    </svg>
);

/* ══════════════════════════════════════════════════════════
   SECCIÓN VIDEO DEMO
   ══════════════════════════════════════════════════════════ */
const VideoSection = () => (
    <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase">En acción</span>
                <h2 className="text-3xl font-bold text-white mt-2 font-poppins">Mirá cómo funciona Nina</h2>
                <p className="text-gray-400 mt-3 font-nunito">Desde buscar una niñera hasta confirmar el servicio — todo en minutos.</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <video
                    className="w-full block"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                >
                    <source src="/videos/nina_demo.mp4" type="video/mp4"/>
                </video>
            </div>
        </div>
    </section>
);

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export const LandingPage = () => (
    <div className="flex flex-col">
        <Hero />

        {/* Video demo */}
        <VideoSection />

        {/* ¿Por qué Nina? */}
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
                        description="Pagá de forma segura y sin complicaciones. Aceptamos tarjetas, transferencias y más."
                    />
                    <FeatureCard
                        icon={<MapPin className="w-8 h-8 text-secondary" />}
                        title="En tu Barrio"
                        description="Encontrá ayuda cerca de casa. Menos tiempo de viaje, más tiempo de calidad."
                    />
                    <FeatureCard
                        icon={<Heart className="w-8 h-8 text-danger" />}
                        title="Confianza Total"
                        description="Leé reseñas reales de otros padres y conocé a la niñera antes de contratar."
                    />
                </div>
            </div>
        </section>

        {/* Plataforma Web */}
        <WebSection />

        {/* App Móvil */}
        <AppMovilSection />

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
