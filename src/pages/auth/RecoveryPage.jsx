import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { CheckCircle, XCircle } from 'lucide-react';
import logo from '../../assets/logo.png';

/**
 * Página de recuperación de contraseña.
 *
 * Flujo (Supabase v2 PKCE con detectSessionInUrl:false):
 * 1. Usuario hace click en el link del email → llega aquí con ?code=...
 * 2. exchangeCodeForSession() canjea el code y establece la sesión temporal
 * 3. Usuario escribe la nueva contraseña y confirma
 * 4. supabase.auth.updateUser() actualiza la contraseña
 * 5. signOut() + navigate('/login', { state: { resetSuccess: true } })
 */
export const RecoveryPage = () => {
    const navigate = useNavigate();
    const [stage, setStage] = useState('exchanging'); // 'exchanging' | 'form' | 'success' | 'error'
    const [exchangeError, setExchangeError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    // Canjear el code de recovery
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
            setExchangeError('Link de recuperación inválido o expirado. Solicitá uno nuevo.');
            setStage('error');
            return;
        }

        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
            if (error) {
                console.error('Recovery exchangeCodeForSession error:', error);
                setExchangeError('El link expiró o ya fue utilizado. Solicitá uno nuevo.');
                setStage('error');
            } else {
                setStage('form');
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (newPassword.length < 8) {
            setFormError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setFormError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            // Cerrar la sesión temporal de recovery y redirigir al login
            await supabase.auth.signOut();
            setStage('success');
        } catch (err) {
            setFormError(err.message || 'Error al actualizar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md p-8 border-none shadow-xl">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="bg-primary p-3 rounded-2xl inline-flex mb-4">
                        <img src={logo} alt="Nina Logo" className="h-12 w-auto" />
                    </div>
                </div>

                {/* Cargando / canjeando token */}
                {stage === 'exchanging' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 font-nunito text-sm">Verificando link...</p>
                    </div>
                )}

                {/* Error en el link */}
                {stage === 'error' && (
                    <div className="text-center space-y-4">
                        <XCircle className="mx-auto text-danger" size={48} />
                        <h2 className="text-xl font-bold text-gray-900 font-poppins">Link inválido</h2>
                        <p className="text-sm text-gray-500 font-nunito">{exchangeError}</p>
                        <Button className="w-full" onClick={() => navigate('/login')}>
                            Volver al inicio de sesión
                        </Button>
                    </div>
                )}

                {/* Formulario de nueva contraseña */}
                {stage === 'form' && (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-poppins">Nueva contraseña</h2>
                            <p className="text-gray-500 mt-2 font-nunito text-sm">
                                Elegí una contraseña segura de al menos 8 caracteres.
                            </p>
                        </div>

                        {formError && (
                            <div className="bg-red-50 text-danger p-3 rounded-lg text-sm mb-4 border border-red-100 text-center">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Nueva contraseña"
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Input
                                label="Confirmar contraseña"
                                type="password"
                                placeholder="Repetí la contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Button type="submit" className="w-full" isLoading={loading}>
                                Guardar nueva contraseña
                            </Button>
                        </form>
                    </>
                )}

                {/* Éxito */}
                {stage === 'success' && (
                    <div className="text-center space-y-4">
                        <CheckCircle className="mx-auto text-success" size={48} />
                        <h2 className="text-xl font-bold text-gray-900 font-poppins">¡Contraseña actualizada!</h2>
                        <p className="text-sm text-gray-500 font-nunito">
                            Tu contraseña fue cambiada correctamente. Ya podés iniciar sesión con tus nuevos datos.
                        </p>
                        <Button className="w-full" onClick={() => navigate('/login')}>
                            Iniciar sesión
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};
