import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { MapPin } from 'lucide-react';

// Provincias de Argentina — permite filtrar por región al escalar a otras localidades
const PROVINCIAS_AR = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
    'Tierra del Fuego', 'Tucumán',
];

export const CreateProfilePage = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'family';
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        province: '',
        locality: '',
        neighborhood: '',
        address: '',
        bio: '',
        experience_years: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.province || !formData.locality) {
            setError('La provincia y la localidad son obligatorias.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const profileData = {
                full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                phone: formData.phone,
                province: formData.province,
                locality: formData.locality,
                neighborhood: formData.neighborhood || null,
                address: formData.address || null,
                bio: formData.bio || null,
                role: type,
                ...(type === 'nanny' && formData.experience_years !== '' && {
                    experience_years: parseInt(formData.experience_years, 10),
                }),
            };

            // Recuperar términos aceptados de sessionStorage (guardados en DisclaimerPage)
            const termsAcceptedAt = sessionStorage.getItem('nina_terms_accepted_at');
            if (termsAcceptedAt) {
                profileData.terms_accepted_at = termsAcceptedAt;
            }

            await api.put(`/users/me?auth_id=${user.id}`, profileData);
            await refreshProfile();
            navigate(`/dashboard/${type}`, { replace: true });
        } catch (err) {
            console.error('Error actualizando perfil:', err);
            setError('Error al guardar el perfil. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const isNanny = type === 'nanny';

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50 py-12">
            <Card className="max-w-2xl w-full p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                        Completá tu perfil de {isNanny ? 'Niñera' : 'Familia'}
                    </h2>
                    <p className="text-gray-500 font-nunito">
                        Estos datos nos permiten conectarte con {isNanny ? 'familias' : 'niñeras'} de tu zona.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-danger p-3 rounded-lg text-sm mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre y Apellido */}
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
                        label="Teléfono / WhatsApp"
                        name="phone"
                        type="tel"
                        placeholder="+54 9 11 1234-5678"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    {/* Ubicación — sección destacada */}
                    <div className="bg-blue-50 rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold font-poppins text-sm">
                            <MapPin size={16} />
                            Zona de residencia
                        </div>
                        <p className="text-xs text-gray-500 font-nunito -mt-2">
                            Tu ubicación nos permite mostrarte {isNanny ? 'familias' : 'niñeras'} cercanas. Solo se muestra la localidad (nunca la dirección exacta).
                        </p>

                        {/* Provincia */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                Provincia <span className="text-danger">*</span>
                            </label>
                            <select
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-nunito text-sm"
                            >
                                <option value="">Seleccioná tu provincia...</option>
                                {PROVINCIAS_AR.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Localidad / Ciudad *"
                                name="locality"
                                placeholder="Ej: Palermo, Quilmes..."
                                value={formData.locality}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Barrio (opcional)"
                                name="neighborhood"
                                placeholder="Ej: Villa Crespo, San Telmo..."
                                value={formData.neighborhood}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            label="Dirección (opcional)"
                            name="address"
                            placeholder="Calle y número — solo visible para vos"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Datos específicos de niñera */}
                    {isNanny && (
                        <Input
                            label="Años de experiencia"
                            name="experience_years"
                            type="number"
                            min="0"
                            max="50"
                            placeholder="Ej: 3"
                            value={formData.experience_years}
                            onChange={handleChange}
                            required
                        />
                    )}

                    {/* Bio / descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                            {isNanny ? 'Sobre vos y tu experiencia' : 'Sobre tu familia'}
                        </label>
                        <textarea
                            name="bio"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-nunito text-sm"
                            placeholder={
                                isNanny
                                    ? 'Contanos tu experiencia, referencias, disponibilidad horaria...'
                                    : 'Contanos sobre tu familia, edades de los chicos, horarios que necesitás...'
                            }
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={loading} className="w-full md:w-auto min-w-[180px]">
                            Guardar y Continuar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
