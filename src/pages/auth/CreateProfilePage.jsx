import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const CreateProfilePage = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'family';
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        bio: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mapear campos del formulario a los campos que espera el backend
            const profileData = {
                full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                phone: formData.phone,
                address: formData.address,
                locality: formData.city,
                bio: formData.bio,
                role: type,
            };

            await api.put(`/users/me?auth_id=${user.id}`, profileData);
            await refreshProfile();
            navigate(`/dashboard/${type}`, { replace: true });
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            alert("Error al guardar el perfil. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50 py-12">
            <Card className="max-w-2xl w-full p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                        Completa tu perfil de {type === 'family' ? 'Familia' : 'Niñera'}
                    </h2>
                    <p className="text-gray-500 font-nunito">
                        Necesitamos algunos datos para personalizar tu experiencia.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Nombre"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Apellido"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Dirección"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Ciudad"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Sobre ti</label>
                        <textarea
                            name="bio"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder={type === 'family' ? "Describe tu familia, edades de los niños..." : "Cuéntanos sobre tu experiencia..."}
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="submit" isLoading={loading} className="w-full md:w-auto">
                            Guardar y Continuar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
