import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Heart, Users } from 'lucide-react';

export const ProfileSelectionPage = () => {
    const navigate = useNavigate();

    const handleSelect = (type) => {
        navigate(`/create-profile?type=${type}`);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-4">¿Cómo quieres usar Nina?</h2>
                    <p className="text-gray-600 font-nunito">Selecciona tu perfil para continuar</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Family Card */}
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary group" onClick={() => handleSelect('family')}>
                        <div className="text-center p-8">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Soy Familia</h3>
                            <p className="text-gray-600 mb-8 font-nunito">
                                Busco una niñera de confianza para el cuidado de mis hijos.
                            </p>
                            <Button className="w-full">Elegir Familia</Button>
                        </div>
                    </Card>

                    {/* Nanny Card */}
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-secondary group" onClick={() => handleSelect('nanny')}>
                        <div className="text-center p-8">
                            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Heart className="w-12 h-12 text-secondary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Soy Niñera</h3>
                            <p className="text-gray-600 mb-8 font-nunito">
                                Quiero ofrecer mis servicios de cuidado y conectar con familias.
                            </p>
                            <Button variant="secondary" className="w-full">Elegir Niñera</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
