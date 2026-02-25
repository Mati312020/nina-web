import React from 'react';
import { DollarSign } from 'lucide-react';
import logo from '../../assets/logo.png';

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-card border border-gray-100 mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">Apoya a Nina</h3>
                    <p className="text-gray-600 mb-6 font-nunito">Ayúdanos a seguir conectando familias y niñeras de forma segura.</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition shadow-sm">
                            <DollarSign size={20} />
                            Aportar 2 USD
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-sm">
                            Aportar en Pesos (ARS)
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 font-nunito">* Pagos procesados de forma segura.</p>
                </div>

                <div className="flex justify-center items-center gap-2 text-primary font-bold text-xl mb-4">
                    <img src={logo} alt="Nina Logo" className="h-8 w-auto" /> Nina
                </div>
                <p className="text-gray-400 text-sm font-nunito">
                    © {new Date().getFullYear()} Nina App. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};
