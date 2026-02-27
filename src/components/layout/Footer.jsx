import React, { useState } from 'react';
import { DollarSign, Bug, Lightbulb } from 'lucide-react';
import logo from '../../assets/logo.png';
import { ContactFormModal } from '../ui/ContactFormModal';

export const Footer = () => {
    const [contactModal, setContactModal] = useState(null); // null | 'error' | 'suggestion'

    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="container mx-auto px-4 text-center">
                {/* Apoya a Nina */}
                <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-card border border-gray-100 mb-8">
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

                {/* Contacto: reportar errores y sugerencias */}
                <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-card border border-gray-100 mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 font-poppins">Contacto</h3>
                    <p className="text-gray-500 text-sm mb-5 font-nunito">
                        ¿Encontraste un error o tenés una idea? Escribinos.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <button
                            onClick={() => setContactModal('error')}
                            className="flex items-center justify-center gap-2 bg-white border-2 border-danger/30 text-danger px-5 py-2.5 rounded-xl font-bold hover:bg-red-50 transition shadow-sm text-sm font-nunito"
                        >
                            <Bug size={16} />
                            Reportar un Error
                        </button>
                        <button
                            onClick={() => setContactModal('suggestion')}
                            className="flex items-center justify-center gap-2 bg-white border-2 border-secondary/40 text-secondary px-5 py-2.5 rounded-xl font-bold hover:bg-orange-50 transition shadow-sm text-sm font-nunito"
                        >
                            <Lightbulb size={16} />
                            Enviar Sugerencia
                        </button>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-2 text-primary font-bold text-xl mb-4">
                    <div className="bg-primary p-1 rounded-lg inline-flex">
                        <img src={logo} alt="Nina Logo" className="h-7 w-auto" />
                    </div>
                    Nina
                </div>
                <p className="text-gray-400 text-sm font-nunito">
                    © {new Date().getFullYear()} Nina App. Todos los derechos reservados.
                </p>
            </div>

            {/* Modal de contacto */}
            <ContactFormModal
                isOpen={contactModal !== null}
                onClose={() => setContactModal(null)}
                defaultTab={contactModal || 'error'}
            />
        </footer>
    );
};
