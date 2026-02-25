import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import logo from '../../assets/logo.png';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { signup, googleLogin, profile } = useAuth();
    const navigate = useNavigate();

    // Si ya tiene perfil (ej: vino por Google y ya completó onboarding), redirigir
    useEffect(() => {
        if (profile?.role) navigate(`/dashboard/${profile.role}`, { replace: true });
        else if (profile && !profile.role) navigate('/select-profile', { replace: true });
    }, [profile, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await signup(email, password);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Error al crear la cuenta.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            await googleLogin();
        } catch (err) {
            setError('Error al registrarse con Google.');
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
                <Card className="w-full max-w-md p-8 border-none shadow-xl text-center">
                    <div className="text-5xl mb-4">📧</div>
                    <h2 className="text-2xl font-bold text-gray-900 font-poppins mb-2">
                        ¡Revisá tu email!
                    </h2>
                    <p className="text-gray-500 font-nunito text-sm mb-6">
                        Te enviamos un link de confirmación a <strong>{email}</strong>.
                        Hacé click en el link para activar tu cuenta.
                    </p>
                    <Link to="/login">
                        <Button variant="outline" className="w-full">
                            Ir al inicio de sesión
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md p-8 border-none shadow-xl">
                <div className="text-center mb-8">
                    <img src={logo} alt="Nina Logo" className="h-12 w-auto mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 font-poppins">Crear Cuenta</h2>
                    <p className="text-gray-500 mt-2 font-nunito">Únete a la comunidad de Nina</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-danger p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
                        {error}
                    </div>
                )}

                {/* Google primero — más fácil */}
                <Button
                    variant="outline"
                    type="button"
                    className="w-full flex items-center justify-center gap-2 mb-6"
                    onClick={handleGoogleRegister}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Registrarse con Google
                </Button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O con email y contraseña</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="Repetí tu contraseña"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full" isLoading={loading}>
                        Crear Cuenta
                    </Button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-500">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Iniciá sesión
                    </Link>
                </p>
            </Card>
        </div>
    );
};
