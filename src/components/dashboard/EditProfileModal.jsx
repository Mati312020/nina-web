import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, User, MapPin, FileText, Trash2, ChevronDown, ChevronUp, Camera, Shield, Plus, Baby, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DeleteAccountModal } from './DeleteAccountModal';
import { useMpConnect } from '../../hooks/useMpConnect';

const PROVINCIAS_AR = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
    'Tierra del Fuego', 'Tucumán',
];

// ── Sección colapsable ────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
            >
                <Icon size={16} className="text-primary flex-shrink-0" />
                <span className="flex-1 font-semibold text-sm text-gray-800 font-poppins">{title}</span>
                {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
            </button>
            {open && <div className="p-4 space-y-4">{children}</div>}
        </div>
    );
};

// ── Modal principal ───────────────────────────────────────────────────────────
export const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, profile, refreshProfile } = useAuth();
    const isNanny = profile?.role === 'nanny';

    const [form, setForm] = useState({});
    const [children, setChildren] = useState([]); // para familias
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');
    const [saved, setSaved]   = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showPhotoInput, setShowPhotoInput] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [mpDisconnecting, setMpDisconnecting] = useState(false);
    const [mpConfirm, setMpConfirm] = useState(false);

    // Hook de MP — solo activo si es niñera
    const { status: mpStatus, loading: mpLoading, connect: mpConnect, disconnect: mpDisconnectFn, refresh: mpRefresh } = useMpConnect(
        isNanny ? profile?.id : null
    );

    // Pre-poblar con datos actuales del perfil
    useEffect(() => {
        if (!profile || !isOpen) return;
        const [first_name = '', ...rest] = (profile.full_name || '').split(' ');
        setForm({
            first_name,
            last_name:          rest.join(' '),
            phone:              profile.phone              ?? '',
            notification_email: profile.notification_email ?? '',
            province:           profile.province           ?? '',
            locality:           profile.locality           ?? '',
            neighborhood:       profile.neighborhood       ?? '',
            address:            profile.address            ?? '',
            bio:                profile.bio                ?? '',
            experience_years:   profile.experience_years   ?? '',
            household_rules:    profile.household_rules    ?? '',
            profile_image_url:  profile.profile_image_url  ?? '',
        });
        // Inicializar hijos desde el perfil (familias)
        setChildren((profile.children ?? []).map(c => ({ ...c })));
        setError('');
        setSaved(false);
        setShowPhotoInput(false);
        setImgError(false);
        setMpConfirm(false);
    }, [profile, isOpen]);

    const set = (field) => (e) => {
        if (field === 'profile_image_url') setImgError(false);
        setForm((f) => ({ ...f, [field]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.province || !form.locality) {
            setError('La provincia y la localidad son obligatorias.');
            return;
        }
        setLoading(true);
        setError('');
        setSaved(false);
        try {
            const payload = {
                full_name:          `${form.first_name} ${form.last_name}`.trim(),
                phone:              form.phone              || null,
                notification_email: form.notification_email || null,
                province:           form.province,
                locality:           form.locality,
                neighborhood:       form.neighborhood       || null,
                address:            form.address            || null,
                bio:                form.bio                || null,
                profile_image_url:  form.profile_image_url  || null,
                ...(isNanny && form.experience_years !== '' && {
                    experience_years: parseInt(form.experience_years, 10),
                }),
                ...(!isNanny && { household_rules: form.household_rules || null }),
            };
            // Incluir hijos en el payload para familias
            if (!isNanny) {
                payload.children = children.map(c => ({
                    ...(c.id ? { id: c.id } : {}),
                    nickname:             c.nickname || '',
                    age:                  parseInt(c.age, 10) || 0,
                    medical_notes:        c.medical_notes || null,
                    special_instructions: c.special_instructions || null,
                }));
            }
            await api.put(`/users/me?auth_id=${user.id}`, payload);
            await refreshProfile();
            setSaved(true);
            setShowPhotoInput(false);
            setImgError(false);
        } catch (err) {
            setError('Error al guardar. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // ── Helpers de hijos (solo familias) ─────────────────────────────────────
    const addChild = () => setChildren(prev => [
        ...prev,
        { nickname: '', age: '', medical_notes: '', special_instructions: '' }
    ]);

    const removeChild = (idx) => setChildren(prev => prev.filter((_, i) => i !== idx));

    const updateChild = (idx, field, value) => setChildren(prev =>
        prev.map((c, i) => i === idx ? { ...c, [field]: value } : c)
    );

    // ── Handler de desconectar MP ─────────────────────────────────────────────
    const handleMpDisconnect = async () => {
        setMpDisconnecting(true);
        try {
            await mpDisconnectFn();
            setMpConfirm(false);
        } catch {
            // error ya loggeado en el hook
        } finally {
            setMpDisconnecting(false);
        }
    };

    if (!isOpen) return null;

    // Iniciales para el avatar
    const initials = (profile?.full_name || '?')
        .split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

    // Foto a previsualizar (usa form.profile_image_url para mostrar cambios antes de guardar)
    const previewUrl = form.profile_image_url || null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Panel */}
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl z-10 flex flex-col max-h-[92vh]">

                    {/* Header fijo */}
                    <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 flex-shrink-0">
                        {/* Avatar pequeño en header */}
                        <div className="relative flex-shrink-0">
                            {profile?.profile_image_url ? (
                                <img
                                    src={profile.profile_image_url}
                                    alt={profile.full_name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                    <span className="text-primary font-bold font-poppins text-base">{initials}</span>
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                <Camera size={8} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 font-poppins leading-tight truncate">
                                {profile?.full_name || 'Mi Perfil'}
                            </h3>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                isNanny
                                    ? 'bg-secondary/10 text-secondary'
                                    : 'bg-primary/10 text-primary'
                            }`}>
                                {isNanny ? 'Niñera' : 'Familia'}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Contenido scrollable */}
                    <form onSubmit={handleSave} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                        {/* Foto de perfil — centrada, tamaño mediano */}
                        <div className="flex flex-col items-center gap-3 py-2">
                            <div className="relative">
                                {previewUrl && !imgError ? (
                                    <img
                                        src={previewUrl}
                                        alt="Foto de perfil"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 shadow flex items-center justify-center">
                                        <span className="text-primary font-bold font-poppins text-2xl">{initials}</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowPhotoInput((v) => !v)}
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary shadow flex items-center justify-center border-2 border-white hover:bg-primary/90 transition-colors"
                                    title="Cambiar foto"
                                >
                                    <Camera size={14} className="text-white" />
                                </button>
                            </div>
                            <span className="text-xs text-gray-400 font-nunito">
                                {previewUrl ? profile?.full_name : 'Sin foto de perfil'}
                            </span>

                            {/* Input de URL — solo visible al hacer clic en la cámara */}
                            {showPhotoInput && (
                                <div className="w-full max-w-sm">
                                    <Input
                                        label="URL de la foto"
                                        type="url"
                                        placeholder="https://... (link directo a tu imagen)"
                                        value={form.profile_image_url || ''}
                                        onChange={set('profile_image_url')}
                                    />
                                    <p className="text-xs text-gray-400 font-nunito mt-1 text-center">
                                        Pegá el link de una foto tuya (Google Drive, Imgur, etc.)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Datos personales */}
                        <Section icon={User} title="Datos personales">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    label="Nombre"
                                    value={form.first_name || ''}
                                    onChange={set('first_name')}
                                    required
                                />
                                <Input
                                    label="Apellido"
                                    value={form.last_name || ''}
                                    onChange={set('last_name')}
                                    required
                                />
                            </div>
                            <Input
                                label="Teléfono / WhatsApp"
                                type="tel"
                                placeholder="+54 9 11 1234-5678"
                                value={form.phone || ''}
                                onChange={set('phone')}
                            />
                            <Input
                                label="Email de notificaciones"
                                type="email"
                                placeholder="tu@email.com"
                                value={form.notification_email || ''}
                                onChange={set('notification_email')}
                            />
                        </Section>

                        {/* Ubicación */}
                        <Section icon={MapPin} title="Ubicación">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                    Provincia <span className="text-danger">*</span>
                                </label>
                                <select
                                    value={form.province || ''}
                                    onChange={set('province')}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-nunito text-sm"
                                >
                                    <option value="">Seleccioná tu provincia...</option>
                                    {PROVINCIAS_AR.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    label="Localidad *"
                                    placeholder="Ej: Palermo..."
                                    value={form.locality || ''}
                                    onChange={set('locality')}
                                    required
                                />
                                <Input
                                    label="Barrio"
                                    placeholder="Ej: Villa Crespo..."
                                    value={form.neighborhood || ''}
                                    onChange={set('neighborhood')}
                                />
                            </div>
                            <Input
                                label="Dirección (solo visible para vos)"
                                placeholder="Calle y número"
                                value={form.address || ''}
                                onChange={set('address')}
                            />
                        </Section>

                        {/* Perfil — bio + datos específicos por rol */}
                        <Section icon={FileText} title={isNanny ? 'Tu perfil como niñera' : 'Sobre tu familia'}>
                            {isNanny && (
                                <Input
                                    label="Años de experiencia"
                                    type="number"
                                    min="0"
                                    max="50"
                                    placeholder="Ej: 3"
                                    value={form.experience_years ?? ''}
                                    onChange={set('experience_years')}
                                />
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                    {isNanny ? 'Sobre vos y tu experiencia' : 'Descripción de tu familia'}
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-nunito text-sm resize-none"
                                    placeholder={
                                        isNanny
                                            ? 'Contanos tu experiencia, referencias, disponibilidad...'
                                            : 'Contanos sobre tu familia, edades de los chicos, horarios...'
                                    }
                                    value={form.bio || ''}
                                    onChange={set('bio')}
                                />
                            </div>
                            {!isNanny && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                        Reglas del hogar
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-nunito text-sm resize-none"
                                        placeholder="Ej: no fumar, alergia a gatos, el nene duerme siesta a las 14hs..."
                                        value={form.household_rules || ''}
                                        onChange={set('household_rules')}
                                    />
                                </div>
                            )}
                        </Section>

                        {/* Hijos — solo familias */}
                        {!isNanny && (
                            <Section icon={Baby} title="Mis Hijos" defaultOpen={true}>
                                {children.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-2">
                                        Aún no agregaste ningún hijo/a.
                                    </p>
                                )}
                                {children.map((child, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-xl p-3 space-y-2 relative">
                                        <button
                                            type="button"
                                            onClick={() => removeChild(idx)}
                                            className="absolute top-2 right-2 text-gray-300 hover:text-danger transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                label="Apodo / Nombre *"
                                                placeholder="Ej: Sofi"
                                                value={child.nickname || ''}
                                                onChange={e => updateChild(idx, 'nickname', e.target.value)}
                                                required
                                            />
                                            <Input
                                                label="Edad *"
                                                type="number"
                                                min="0"
                                                max="17"
                                                placeholder="Ej: 4"
                                                value={child.age || ''}
                                                onChange={e => updateChild(idx, 'age', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Input
                                            label="Notas médicas"
                                            placeholder="Alergias, medicación, etc."
                                            value={child.medical_notes || ''}
                                            onChange={e => updateChild(idx, 'medical_notes', e.target.value)}
                                        />
                                        <Input
                                            label="Instrucciones especiales"
                                            placeholder="Hora de siesta, comidas, etc."
                                            value={child.special_instructions || ''}
                                            onChange={e => updateChild(idx, 'special_instructions', e.target.value)}
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addChild}
                                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200
                                               rounded-xl py-2.5 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <Plus size={15} />
                                    Agregar hijo/a
                                </button>
                            </Section>
                        )}

                        {/* Cuenta MercadoPago — solo niñeras */}
                        {isNanny && (
                            <Section icon={CreditCard} title="Cuenta MercadoPago" defaultOpen={true}>
                                {mpLoading ? (
                                    <div className="h-10 bg-gray-100 rounded animate-pulse" />
                                ) : (
                                    <div className="space-y-3">
                                        {/* Estado de conexión */}
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                                mpStatus?.connected && !mpStatus?.needs_reconnect
                                                    ? 'bg-green-500'
                                                    : mpStatus?.connected && mpStatus?.needs_reconnect
                                                        ? 'bg-amber-500'
                                                        : 'bg-gray-400'
                                            }`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {mpStatus?.connected && !mpStatus?.needs_reconnect
                                                        ? 'Cuenta conectada'
                                                        : mpStatus?.connected && mpStatus?.needs_reconnect
                                                            ? 'Token vencido — reconectá tu cuenta'
                                                            : 'Sin cuenta vinculada'
                                                    }
                                                </p>
                                                {mpStatus?.mp_account_email && (
                                                    <p className="text-xs text-gray-500">{mpStatus.mp_account_email}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                                            Al vincular tu cuenta, Nina puede dividir los pagos automáticamente.
                                            El dinero llega directamente a tu cuenta MP.
                                        </p>

                                        {/* Acciones */}
                                        <div className="flex gap-2">
                                            {(!mpStatus?.connected || mpStatus?.needs_reconnect) && (
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    className="flex-1 text-sm"
                                                    onClick={mpConnect}
                                                >
                                                    {mpStatus?.needs_reconnect ? 'Reconectar MercadoPago' : 'Conectar MercadoPago'}
                                                </Button>
                                            )}
                                            {mpStatus?.connected && !mpStatus?.needs_reconnect && (
                                                <>
                                                    {!mpConfirm ? (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className="text-sm text-danger border border-red-200 hover:bg-red-50"
                                                            onClick={() => setMpConfirm(true)}
                                                        >
                                                            Desconectar
                                                        </Button>
                                                    ) : (
                                                        <div className="flex gap-2 w-full">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="flex-1 text-sm"
                                                                onClick={() => setMpConfirm(false)}
                                                                disabled={mpDisconnecting}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="flex-1 text-sm text-danger border border-red-200 hover:bg-red-50"
                                                                onClick={handleMpDisconnect}
                                                                isLoading={mpDisconnecting}
                                                            >
                                                                Confirmar
                                                            </Button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Section>
                        )}

                        {/* Documentos legales */}
                        <div className="border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 bg-gray-50/60">
                            <Shield size={15} className="text-primary flex-shrink-0" />
                            <p className="flex-1 text-xs text-gray-500 font-nunito">
                                Podés consultar nuestros{' '}
                                <Link
                                    to="/legal/privacidad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-2 hover:text-primary/80 font-medium"
                                >
                                    Términos y Política de Privacidad
                                </Link>{' '}
                                en cualquier momento.
                            </p>
                        </div>

                        {/* Zona de peligro */}
                        <div className="border border-red-100 rounded-xl bg-red-50/40">
                            <div className="px-4 py-3 flex items-center gap-3">
                                <Trash2 size={15} className="text-danger flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-danger font-poppins">Zona de peligro</p>
                                    <p className="text-xs text-gray-500 font-nunito">
                                        Esta acción es permanente e irreversible.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDelete(true)}
                                    className="text-xs font-medium text-danger hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                                >
                                    Eliminar cuenta
                                </button>
                            </div>
                        </div>

                        {/* Espaciado al final para que el footer no tape contenido */}
                        <div className="h-2" />
                    </form>

                    {/* Footer fijo con acciones */}
                    <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 bg-white rounded-b-2xl">
                        {error && (
                            <p className="text-sm text-danger font-nunito flex-1 text-center sm:text-left">{error}</p>
                        )}
                        {saved && !error && (
                            <p className="text-sm text-success font-nunito flex-1 text-center sm:text-left font-medium">
                                ¡Perfil actualizado correctamente!
                            </p>
                        )}
                        {!error && !saved && <div className="flex-1" />}
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 sm:flex-none"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cerrar
                            </Button>
                            <Button
                                type="submit"
                                form=""
                                className="flex-1 sm:flex-none min-w-[130px]"
                                isLoading={loading}
                                onClick={handleSave}
                            >
                                Guardar cambios
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal eliminación anidado */}
            <DeleteAccountModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                authId={user?.id}
                onSuccess={() => { window.location.href = '/'; }}
            />
        </>
    );
};
