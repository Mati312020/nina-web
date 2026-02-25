import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import logo from '../../assets/logo.png';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(email, password);
            navigate('/login'); // Or maybe to a "Confirm Email" page
            alert('Cuenta creada. Por favor verifica tu email.');
        } catch (err) {
            setError(err.message || 'Error al crear la cuenta.');
        } finally {
            setLoading(false);
        }
    };

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

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Registrarse
                    </Button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            </Card>
        </div>
    );
};
