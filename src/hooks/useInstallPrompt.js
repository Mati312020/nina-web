import { useState, useEffect } from 'react';

/**
 * Captura el evento `beforeinstallprompt` del browser.
 * Devuelve una función `prompt()` para mostrar el diálogo nativo de instalación.
 *
 * @returns {{ canInstall: boolean, prompt: () => void }}
 */
export function useInstallPrompt() {
    const [deferredPrompt, setDeferred] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferred(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const prompt = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferred(null);
    };

    return { canInstall: !!deferredPrompt, prompt };
}
