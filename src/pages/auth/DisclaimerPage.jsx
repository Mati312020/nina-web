import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShieldAlert } from 'lucide-react';
import logo from '../../assets/logo.png';

/**
 * Deslinde de Responsabilidades — pantalla previa al registro.
 *
 * El usuario debe leer y aceptar explícitamente los términos antes de poder
 * crear su cuenta. La fecha/hora de aceptación se guarda en sessionStorage
 * y luego se persiste en la DB cuando se completa el perfil (CreateProfilePage).
 *
 * Para actualizar el texto: editar el componente DisclaimerText debajo.
 */

// ─── Texto del deslinde ────────────────────────────────────────────────────────
const DisclaimerText = () => (
    <div className="font-nunito text-gray-700 space-y-5 text-sm leading-relaxed">
        <p className="text-xs text-gray-400 italic">
            Vigencia: Marzo 2026 · Jurisdicción: República Argentina
        </p>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">1. Naturaleza del Servicio (el "Nexo Intermediario")</h3>
            <p>
                Nina App y Nina Web (en adelante, "La Plataforma") operan exclusivamente como un ecosistema digital
                de contacto y una herramienta tecnológica de intermediación. El servicio consiste únicamente en
                facilitar la ubicación, comunicación y conexión eficiente entre usuarios que buscan servicios de
                cuidado infantil ("Familias") y prestadores independientes que ofrecen dichos servicios ("Niñeras/os").
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">2. Ausencia de Vínculo Laboral (Art. 25 y conc. Ley 26.844)</h3>
            <p className="mb-2">De conformidad con la Ley 26.844, La Plataforma deja constancia expresa de que:</p>
            <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>No es Empleador:</strong> Nina no reviste el carácter de empleador ni de agencia de colocación de personal.</li>
                <li><strong>Sin Relación de Dependencia:</strong> No existe vínculo de subordinación, técnica, económica ni jurídica entre La Plataforma y las personas que ofrecen servicios de cuidado.</li>
                <li><strong>Inexistencia de Nómina:</strong> Las Niñeras/os no forman parte de la nómina de empleados de Nina. Son prestadores independientes que establecerán, en su caso, una relación directa con la Familia, siendo esta última la única responsable de las obligaciones de registro, aportes y contribuciones de seguridad social ante la AFIP.</li>
            </ul>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">3. Exclusión de Responsabilidad por Daños y Conducta</h3>
            <p className="mb-2">En los términos del Art. 1710 y ss. del Código Civil y Comercial de la Nación, La Plataforma no será responsable por:</p>
            <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Daños a la Propiedad:</strong> Cualquier daño material, pérdida, rotura o perjuicio causado en la propiedad privada de las Familias por parte de las Niñeras/os, o viceversa.</li>
                <li><strong>Conductas y Tratos:</strong> Malos tratos, ofensas, incumplimientos de horario o cualquier tipo de comportamiento personal o profesional inadecuado durante el desempeño de la tarea.</li>
                <li><strong>Riesgo de la Actividad:</strong> La elección final y el proceso de selección (entrevistas, pedido de antecedentes y verificación de referencias) recaen exclusivamente sobre la Familia. El uso de La Plataforma implica la aceptación de que el encuentro y la contratación se realizan bajo el propio riesgo de los usuarios.</li>
            </ul>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">4. Alcance Técnico y Veracidad de Datos</h3>
            <p>
                Nina no garantiza la veracidad absoluta de la información proporcionada por los usuarios en sus
                perfiles (identidad, certificaciones o habilidades). La Plataforma funciona como un canal de
                comunicación "As-Is" (tal como es). Nina no supervisa, dirige ni controla la prestación del
                servicio en el domicilio.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">5. Cláusula de Indemnidad</h3>
            <p>
                Tanto las Familias como las Niñeras/os se obligan a mantener indemne a Nina App, Nina Web y sus
                propietarios ante cualquier reclamo judicial o extrajudicial, demanda o sanción derivada de la
                relación civil o laboral que surja entre las partes contactadas a través de La Plataforma.
            </p>
        </section>
    </div>
);
// ──────────────────────────────────────────────────────────────────────────────

export const DisclaimerPage = () => {
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!accepted) return;
        // Guardar timestamp de aceptación en sessionStorage (persiste en esta pestaña)
        // CreateProfilePage lo leerá y lo enviará al backend al guardar el perfil.
        sessionStorage.setItem('nina_terms_accepted_at', new Date().toISOString());
        navigate('/register');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50 py-12">
            <div className="max-w-2xl w-full space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="bg-primary p-3 rounded-2xl inline-flex mb-4">
                        <img src={logo} alt="Nina Logo" className="h-10 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 font-poppins">Antes de registrarte</h1>
                    <p className="text-gray-500 font-nunito mt-1 text-sm">
                        Leé atentamente el siguiente deslinde de responsabilidades.
                    </p>
                </div>

                {/* Contenido del deslinde */}
                <Card className="p-6 border border-orange-100 bg-orange-50/40 max-h-[55vh] overflow-y-auto">
                    <div className="flex items-start gap-3 mb-4">
                        <ShieldAlert size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide font-poppins">
                            Deslinde de Responsabilidades
                        </span>
                    </div>
                    <DisclaimerText />
                </Card>

                {/* Checkbox de aceptación */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 font-nunito group-hover:text-gray-900 transition-colors">
                        He leído y acepto el deslinde de responsabilidades. Entiendo que Nina es una plataforma
                        de conexión y no se hace responsable por los acuerdos entre usuarios.
                    </span>
                </label>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        className="flex-1"
                        onClick={() => navigate('/')}
                    >
                        Volver al inicio
                    </Button>
                    <Button
                        className="flex-1"
                        disabled={!accepted}
                        onClick={handleContinue}
                    >
                        Acepto y continúo
                    </Button>
                </div>
            </div>
        </div>
    );
};
