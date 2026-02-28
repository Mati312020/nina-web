import { useEffect, useState } from 'react';

/**
 * Relay de OAuth para la app mobile (nina-app).
 *
 * Flujo PKCE (principal):
 * 1. GoTrue redirige aquí con ?code=PKCE_CODE después del Google OAuth
 * 2. Lee app_redirect de localStorage (guardado por MobileAuthStart)
 * 3. Redirige al deep link: exp://IP:PORT/--/auth/callback?code=PKCE_CODE
 * 4. Chrome Custom Tab detecta exp:// → intent → Expo Go intercepta
 * 5. openAuthSessionAsync retorna → el app intercambia code por sesión
 *
 * Flujo Implícito (fallback):
 * 1. GoTrue redirige aquí con #access_token=...&refresh_token=...
 * 2. Lee app_redirect de localStorage
 * 3. Redirige al deep link con los tokens como query params
 *
 * IMPORTANTE: app_redirect se guarda en localStorage porque GoTrue puede
 * descartar/double-encodear query params extra en el redirect_to.
 * localStorage persiste en el mismo origin (nina-web.onrender.com) a través
 * de todas las navegaciones dentro del Chrome Custom Tab.
 */
const MobileAuthCallback = () => {
    const [status, setStatus] = useState('processing');

    useEffect(() => {
        // Leer el deep link de retorno guardado por MobileAuthStart
        const appRedirect = localStorage.getItem('nina_app_redirect');
        localStorage.removeItem('nina_app_redirect'); // Limpiar después de leer

        if (!appRedirect) {
            console.error('[MobileAuthCallback] No se encontró app_redirect en localStorage');
            // Fallback: intentar leer de query params (compatibilidad legacy)
            const fallback = new URLSearchParams(window.location.search).get('app_redirect');
            if (!fallback) {
                setStatus('error');
                return;
            }
            handleRedirect(fallback);
            return;
        }

        handleRedirect(appRedirect);
    }, []);

    function handleRedirect(appRedirect) {
        const queryParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // PKCE: code en query params
        const code = queryParams.get('code');
        // Implicit: tokens en hash
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');

        let mobileUrl = null;

        if (code) {
            // PKCE: agregar code como query param al deep link
            const separator = appRedirect.includes('?') ? '&' : '?';
            mobileUrl = `${appRedirect}${separator}code=${encodeURIComponent(code)}`;
        } else if (access_token) {
            // Implicit: agregar tokens como query params
            const separator = appRedirect.includes('?') ? '&' : '?';
            const params = new URLSearchParams();
            params.set('access_token', access_token);
            if (refresh_token) params.set('refresh_token', refresh_token);
            mobileUrl = `${appRedirect}${separator}${params.toString()}`;
        }

        if (mobileUrl) {
            console.log('[MobileAuthCallback] Redirigiendo al app:', mobileUrl.slice(0, 100));
            setStatus('redirecting');
            window.location.href = mobileUrl;
        } else {
            console.error('[MobileAuthCallback] No code ni tokens en URL');
            console.error('[MobileAuthCallback] search:', window.location.search);
            console.error('[MobileAuthCallback] hash:', window.location.hash);
            setStatus('error');
        }
    }

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
