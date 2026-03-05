import React from 'react';
import logo from '../assets/logo.png';

/**
 * Error Boundary global — captura errores JavaScript no manejados en el árbol de componentes.
 * Previene pantalla blanca y muestra un fallback amigable.
 *
 * Uso: wrappear <App /> en main.jsx
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * NOTA: Error Boundaries requieren class components — no hay hook equivalente en React 18.
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error?.message ?? 'Error desconocido' };
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary] Error capturado:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, errorMessage: '' });
        window.location.href = '/';
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="bg-primary p-3 rounded-2xl inline-flex">
                            <img src={logo} alt="Nina Logo" className="h-12 w-auto" />
                        </div>
                    </div>

                    {/* Mensaje */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                            Algo salió mal
                        </h1>
                        <p className="text-gray-500 font-nunito text-sm">
                            Ocurrió un error inesperado. Podés intentar volver al inicio o recargar la página.
                        </p>
                    </div>

                    {/* Detalles técnicos (colapsable) */}
                    {this.state.errorMessage && (
                        <details className="text-left bg-gray-100 rounded-xl p-4">
                            <summary className="text-xs text-gray-500 cursor-pointer font-nunito select-none">
                                Detalle técnico
                            </summary>
                            <p className="text-xs text-gray-700 font-mono mt-2 break-all">
                                {this.state.errorMessage}
                            </p>
                        </details>
                    )}

                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={this.handleReset}
                            className="bg-primary text-white px-6 py-3 rounded-xl font-bold font-poppins hover:bg-primary/90 transition"
                        >
                            Volver al inicio
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold font-poppins hover:bg-gray-50 transition"
                        >
                            Recargar página
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
