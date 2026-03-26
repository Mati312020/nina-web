import React from 'react';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

/**
 * Banner de instalación PWA.
 * Solo aparece cuando el browser dispara `beforeinstallprompt` (Chrome, Edge, Samsung).
 * Se oculta si el usuario lo descarta o instala la app.
 */
export const InstallBanner = () => {
    const { canInstall, prompt } = useInstallPrompt();
    const [dismissed, setDismissed] = React.useState(
        () => localStorage.getItem('pwa_install_dismissed') === '1'
    );

    const handleDismiss = () => {
        localStorage.setItem('pwa_install_dismissed', '1');
        setDismissed(true);
    };

    const handleInstall = async () => {
        await prompt();
        setDismissed(true);
    };

    if (!canInstall || dismissed) return null;

    return (
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Download size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">Instalá Nina en tu dispositivo</p>
                <p className="text-xs text-gray-500 mt-0.5">Acceso rápido desde tu pantalla de inicio, sin abrir el navegador.</p>
                <button onClick={handleInstall}
                    className="mt-2 text-xs font-semibold text-primary hover:underline">
                    Instalar ahora
                </button>
            </div>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X size={16} />
            </button>
        </div>
    );
};
