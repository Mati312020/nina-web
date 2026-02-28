import { useEffect, useState } from 'react';

/**
 * Relay de OAuth para la app mobile (nina-app).
 *
 * Flujo:
 * 1. La app abre Google OAuth con redirectTo = esta página + ?app_redirect=exp://...
 * 2. Supabase redirige aquí con ?code=PKCE_CODE&app_redirect=exp://...
 * 3. Esta página simplemente reenvía el code al app via deep link:
 *    exp://IP:PORT/--/auth/callback?code=PKCE_CODE
 * 4. ASWebAuthenticationSession (iOS) / Chrome Custom Tab (Android) intercepta el exp://
 * 5. La app llama exchangeCodeForSession(code) con su propio code_verifier
 *
 * La app mobile hace el exchange (no este componente) porque el code_verifier
 * está en AsyncStorage del app, no en localStorage del browser.
 */
const MobileAuthCallback = () => {
    const [status, setStatus] = useState('processing'); // 'processing' | 'redirecting' | 'error'

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const appRedirect = params.get('app_redirect'); // URL decodificada automáticamente por URLSearchParams

        if (!code) {
            console.error('[MobileAuthCallback] No se recibió code de Supabase');
            setStatus('error');
            return;
        }

        if (!appRedirect) {
            console.error('[MobileAuthCallback] No se recibió app_redirect');
            setStatus('error');
            return;
        }

        // Reenviar el code al app mobile via deep link
        // El app hará el exchangeCodeForSession con su propio code_verifier
        const mobileUrl = `${appRedirect}?code=${encodeURIComponent(code)}`;
        console.log('[MobileAuthCallback] Redirigiendo al app:', mobileUrl);
        setStatus('redirecting');
        window.location.href = mobileUrl;
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                {status === 'processing' || status === 'redirecting' ? (
                    <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-4" />
                        <p className="text-gray-600 font-nunito text-sm">
                            {status === 'redirecting' ? 'Volviendo a la app...' : 'Procesando...'}
                        </p>
                    </>
                ) : (
                    <p className="text-red-500 font-nunito text-sm">
                        Error al procesar el inicio de sesión. Cerrá esta ventana e intentá de nuevo.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MobileAuthCallback;
