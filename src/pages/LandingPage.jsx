import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Heart, CreditCard, MapPin, Star, UserCheck, Clock } from 'lucide-react';
import { Hero } from '../components/sections/Hero';
import logo from '../assets/logo.png';

export const LandingPage = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">¿Por qué elegir Nina?</h2>
                        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
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

            {/* How it works */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-gray-900 font-poppins">Descarga la App</h2>
                            <p className="text-lg text-gray-600 font-nunito">
                                Lleva a Nina contigo. Gestiona reservas, recibe notificaciones al instante y mantén el contacto directo con tu niñera desde nuestra aplicación móvil.
                            </p>
                            <div className="flex gap-4">
                                <Button variant="primary" className="bg-black text-white hover:bg-gray-800">
                                    App Store
                                </Button>
                                <Button variant="primary" className="bg-black text-white hover:bg-gray-800">
                                    Google Play
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full filter blur-3xl transform rotate-12"></div>
                            {/* Placeholder for App Screenshot */}
                            <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border-8 border-gray-900 max-w-xs mx-auto aspect-[9/19] flex flex-col justify-center items-center overflow-hidden">
                                <div className="absolute top-0 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>
                                <div className="text-center p-6">
                                    <div className="bg-primary p-3 rounded-2xl inline-flex mb-4 animate-pulse">
                                        <img src={logo} alt="Nina Logo" className="h-16 w-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Nina</h3>
                                    <p className="text-sm text-gray-500">Tu niñera de confianza</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-none bg-gray-50/50">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform -rotate-3 transition-transform hover:rotate-3">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{title}</h3>
        <p className="text-gray-600 font-nunito leading-relaxed">{description}</p>
    </Card>
);
