import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Heart, LogOut, User } from 'lucide-react';

import logo from '../../assets/logo.png';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="bg-primary/10 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
            <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-xl">
                        <img src={logo} alt="Nina Logo" className="h-10 w-auto" />
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-2 text-gray-600">
                                <User size={20} />
                                <span className="text-sm font-medium">{user.email}</span>
                            </div>
                            <Button variant="ghost" onClick={handleLogout} className="text-danger hover:bg-danger/10 hover:text-danger">
                                <LogOut size={20} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Iniciar Sesión</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Registrarse</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
