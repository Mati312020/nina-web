import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, LayoutDashboard } from 'lucide-react';
import logo from '../../assets/logo.png';

export const Navbar = () => {
    const { user, profile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Iniciales del perfil o primera letra del email
    const displayName = profile?.full_name || user?.email?.split('@')[0] || '';
    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <nav className="bg-primary/10 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
            <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-xl">
                        <img src={logo} alt="Nina Logo" className="h-10 w-auto" />
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            {/* Avatar con iniciales — visible en mobile y desktop */}
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center
                                                text-white text-xs font-bold font-poppins flex-shrink-0 select-none">
                                    {initials || '?'}
                                </div>
                                {/* Nombre completo o email solo en desktop */}
                                <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[180px] truncate">
                                    {profile?.full_name || user.email}
                                </span>
                            </div>
                            {profile?.role && (
                                <Button
                                    onClick={() => navigate(`/dashboard/${profile.role}`)}
                                    className="gap-2 text-sm"
                                >
                                    <LayoutDashboard size={16} />
                                    <span className="hidden sm:inline">Mi Dashboard</span>
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="text-danger hover:bg-danger/10 hover:text-danger"
                                title="Cerrar sesión"
                            >
                                <LogOut size={20} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Iniciar Sesión</Button>
                            </Link>
                            <Link to="/disclaimer">
                                <Button>Registrarse</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
