import React, { useState, useRef } from 'react';
import { Bug, Lightbulb, Paperclip, Send, X, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { api } from '../../lib/api';

/**
 * Modal de contacto para reportar errores o enviar sugerencias.
 * Llama a POST /contact del backend, que reenvía el email a sebastian@bytecraft.com.ar.
 *
 * Props:
 *   isOpen: bool
 *   onClose: () => void
 *   defaultTab: 'error' | 'suggestion'  (opcional)
 */
export const ContactFormModal = ({ isOpen, onClose, defaultTab = 'error' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [message, setMessage] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const reset = () => {
        setMessage('');
        setSenderEmail('');
        setFile(null);
        setError('');
        setSent(false);
        setActiveTab(defaultTab);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFile(null); // limpiar adjunto al cambiar de tab
        setError('');
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.size > 5 * 1024 * 1024) {
            setError('La imagen no puede superar los 5 MB.');
            return;
        }
        setFile(selected);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Por favor escribí tu mensaje.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let attachment_base64 = null;
            let attachment_name = null;

            // Convertir imagen a base64 si hay adjunto
            if (file) {
                attachment_base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        // readAsDataURL devuelve "data:image/png;base64,XXXX"
                        // enviamos solo la parte base64
                        resolve(ev.target.result.split(',')[1]);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                attachment_name = file.name;
            }

            await api.post('/contact', {
                type: activeTab,
                message: message.trim(),
                sender_email: senderEmail.trim() || null,
                platform: 'nina-web',
                attachment_base64,
                attachment_name,
            });

            setSent(true);
        } catch (err) {
            setError('Error al enviar el mensaje. Intentá de nuevo.');
            console.error('Contact form error:', err);
        } finally {
            setLoading(false);
        }
    };

    const tabConfig = {
        error: {
            icon: <Bug size={16} />,
            label: 'Reportar Error',
            placeholder: 'Describí el error que encontraste: ¿qué estabas haciendo, qué pasó, qué esperabas que pasara?',
        },
        suggestion: {
            icon: <Lightbulb size={16} />,
            label: 'Sugerencia',
            placeholder: 'Contanos tu idea o sugerencia para mejorar Nina Web...',
        },
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Contacto">
            {sent ? (
                <div className="text-center py-8 space-y-3">
                    <CheckCircle size={48} className="text-success mx-auto" />
                    <h3 className="text-lg font-bold text-gray-900 font-poppins">¡Mensaje enviado!</h3>
                    <p className="text-gray-500 font-nunito text-sm">
                        Gracias por escribirnos. Lo revisaremos a la brevedad.
                    </p>
                    <Button onClick={handleClose} className="mt-4">Cerrar</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {Object.entries(tabConfig).map(([key, cfg]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleTabChange(key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all font-nunito ${
                                    activeTab === key
                                        ? 'bg-white shadow text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {cfg.icon}
                                {cfg.label}
                            </button>
                        ))}
                    </div>

                    {/* Mensaje */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-nunito">
                            Mensaje <span className="text-danger">*</span>
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder={tabConfig[activeTab].placeholder}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-nunito text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                        />
                    </div>

                    {/* Email del remitente (opcional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-nunito">
                            Tu email <span className="text-gray-400 font-normal">(opcional, para que podamos responderte)</span>
                        </label>
                        <input
                            type="email"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-nunito text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                    </div>

                    {/* Adjunto (solo para errores) */}
                    {activeTab === 'error' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-nunito">
                                Captura de pantalla <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {file ? (
                                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm">
                                    <Paperclip size={14} className="text-primary flex-shrink-0" />
                                    <span className="text-gray-700 font-nunito flex-1 truncate">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => { setFile(null); fileInputRef.current.value = ''; }}
                                        className="text-gray-400 hover:text-danger transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 text-sm text-primary font-semibold font-nunito hover:underline"
                                >
                                    <Paperclip size={14} />
                                    Adjuntar imagen
                                </button>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-danger text-sm font-nunito bg-red-50 p-2.5 rounded-lg border border-red-100">
                            {error}
                        </p>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-1">
                        <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" isLoading={loading} className="flex-1 gap-2">
                            <Send size={15} />
                            Enviar
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
