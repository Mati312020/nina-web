import React from 'react';
import logo from '../../assets/logo.png';

export const Hero = () => {
    return (
        <section className="relative py-20 px-4 bg-gradient-to-b from-red-50 to-white overflow-hidden">
            <div className="container mx-auto text-center relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="bg-primary p-4 rounded-3xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <img src={logo} alt="Nina Logo" className="h-24 w-auto drop-shadow-md" />
                    </div>
                </div>
                <h1 className="font-semibold text-slate-800 mb-8 tracking-tight font-poppins leading-tight">
                    <span className="text-4xl md:text-6xl block mb-2">Bienvenido a Nina:</span>
                    <span className="text-primary text-2xl md:text-3xl block font-medium">Donde el cuidado y la confianza se encuentran.</span>
                </h1>
                <div className="text-left max-w-3xl mx-auto space-y-6 text-lg text-slate-700 font-nunito leading-relaxed">
                    <p>
                        Sabemos que criar es una aventura maravillosa, pero también un desafío que requiere equipo.
                        En Nina, no solo buscamos a alguien que cuide; buscamos el <span className="font-semibold text-primary">match perfecto</span> que se integre al ritmo de tu hogar.
                        Mientras nuestra App llega para resolver tus imprevistos diarios, esta plataforma es tu espacio para encontrar apoyo constante y de largo plazo.
                    </p>
                    <p>
                        Aquí, fomentamos la claridad desde el primer día: las familias comparten sus rutinas y valores, y las niñeras aportan su talento y calidez.
                        Juntos, creamos un entorno seguro donde cada niño crece bajo sus propios hábitos y cada profesional brilla en su labor.
                        ¡Súmate a la comunidad que entiende que cuidar es un arte que se hace en equipo!
                    </p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </section>
    );
};
