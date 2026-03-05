import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShieldAlert, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import logo from '../../assets/logo.png';

/**
 * Pantalla previa al registro — Doble Check legal obligatorio.
 *
 * Sección 1: Deslinde de Responsabilidades
 * Sección 2: Política de Privacidad y Protección de Datos Personales (Ley 25.326)
 *
 * Ambos checkboxes son obligatorios para continuar.
 * La fecha/hora de aceptación se guarda en sessionStorage y luego se persiste
 * en la DB cuando se completa el perfil (CreateProfilePage → terms_accepted_at).
 */

// ─── Sección 1: Deslinde de Responsabilidades ────────────────────────────────
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

// ─── Sección 2: Política de Privacidad (Ley 25.326) ──────────────────────────
const PrivacyText = () => (
    <div className="font-nunito text-gray-700 space-y-5 text-sm leading-relaxed">
        <p className="text-xs text-gray-400 italic">
            Última actualización: Marzo 2026 · Ámbito: República Argentina (Ley 25.326)
        </p>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">1. Responsable del Tratamiento</h3>
            <p>
                El responsable del tratamiento de tus datos es Nina (en adelante, "La Plataforma"). Los datos
                recolectados se incorporarán a una base de datos de titularidad de Nina, debidamente inscripta
                o declarada ante la autoridad de control competente en Argentina.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">2. Datos Recolectados y Finalidad</h3>
            <p className="mb-2">Para que la intermediación entre Familias y Niñeras/os sea efectiva, Nina recolecta:</p>
            <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Datos Identificatorios:</strong> Nombre, DNI/CUIL, foto de perfil y validación de identidad.</li>
                <li><strong>Datos de Contacto:</strong> Email, número de teléfono y zona de residencia.</li>
                <li><strong>Geolocalización:</strong> Solo para facilitar la ubicación más rápida y eficiente entre las partes (Art. 5, Ley 25.326).</li>
                <li><strong>Perfil Profesional/Familiar:</strong> Experiencia, valoraciones de otros usuarios y preferencias de cuidado.</li>
            </ul>
            <p className="mt-2">
                <strong>Finalidad única:</strong> Facilitar el contacto entre las partes. Nina no vende ni cede tus datos a terceros con fines publicitarios ajenos a la plataforma.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">3. Consentimiento Informado</h3>
            <p>
                Al utilizar Nina App o Nina Web, el usuario presta su consentimiento libre, expreso e informado
                para que sus datos sean tratados conforme a esta política. Entendés que, para que el servicio
                funcione, ciertos datos (como tu nombre y valoración) serán visibles para otros usuarios de la
                red de Nina.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">4. Transferencia a Terceros</h3>
            <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Entre usuarios:</strong> Los datos de contacto se revelarán únicamente cuando ambas partes manifiesten interés mutuo en la prestación del servicio.</li>
                <li><strong>Proveedores de servicios:</strong> Podremos compartir datos con procesadores de pagos o servicios de validación de identidad, quienes están obligados a mantener la confidencialidad bajo contratos de rigor.</li>
            </ul>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h3>
            <p className="mb-2">
                De acuerdo con el Art. 14 de la Ley 25.326, el titular de los datos personales tiene la facultad
                de ejercer el derecho de acceso en forma gratuita. Podrás:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
                <li>Acceder a tus datos registrados en Nina.</li>
                <li>Actualizar o rectificar información inexacta.</li>
                <li>Solicitar la supresión de tu cuenta y datos (<strong>Derecho al olvido</strong>), siempre que no exista una obligación legal de conservarlos.</li>
            </ul>
            <p className="mt-2 text-gray-500">
                Contacto para ejercer derechos:{' '}
                <a href="mailto:privacidad@nina-app.com.ar" className="text-primary underline">
                    privacidad@nina-app.com.ar
                </a>
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">6. Seguridad de la Información</h3>
            <p>
                Nina implementa medidas de seguridad técnicas y organizativas para evitar la pérdida, mal uso,
                alteración o acceso no autorizado. Sin embargo, el usuario reconoce que las medidas de seguridad
                en Internet no son inexpugnables.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">7. Cookies y Tecnologías de Seguimiento</h3>
            <p>
                Nina Web utiliza cookies para mejorar la experiencia de usuario y recordar preferencias. Podés
                desactivarlas en la configuración de tu navegador, aunque esto podría afectar la funcionalidad
                de la plataforma.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 mb-1">8. Autoridad de Control</h3>
            <p>
                Se informa que la <strong>Agencia de Acceso a la Información Pública</strong>, órgano de control
                de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan
                con relación al incumplimiento de las normas sobre protección de datos personales.
            </p>
        </section>
    </div>
);

// ─── Componente de sección colapsable ────────────────────────────────────────
const LegalSection = ({ icon: Icon, iconClass, badgeText, badgeClass, title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className={`border ${badgeClass.includes('orange') ? 'border-orange-100 bg-orange-50/30' : 'border-blue-100 bg-blue-50/30'}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 p-4 text-left"
            >
                <Icon size={18} className={`flex-shrink-0 ${iconClass}`} />
                <div className="flex-1 min-w-0">
                    <span className={`text-xs font-semibold uppercase tracking-wide font-poppins ${iconClass}`}>
                        {badgeText}
                    </span>
                    <p className="text-sm font-medium text-gray-800 mt-0.5 font-nunito">{title}</p>
                </div>
                {open
                    ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                }
            </button>
            {open && (
                <div className="px-4 pb-4 max-h-72 overflow-y-auto border-t border-gray-100 pt-3">
                    {children}
                </div>
            )}
        </Card>
    );
};

// ─── Página principal ─────────────────────────────────────────────────────────
export const DisclaimerPage = () => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const navigate = useNavigate();

    const canContinue = acceptedTerms && acceptedPrivacy;

    const handleContinue = () => {
        if (!canContinue) return;
        // Guardar timestamp en sessionStorage — CreateProfilePage lo enviará al backend (terms_accepted_at)
        sessionStorage.setItem('nina_terms_accepted_at', new Date().toISOString());
        navigate('/register');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50 py-12">
            <div className="max-w-2xl w-full space-y-5">
                {/* Header */}
                <div className="text-center">
                    <div className="bg-primary p-3 rounded-2xl inline-flex mb-4">
                        <img src={logo} alt="Nina Logo" className="h-10 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 font-poppins">Antes de registrarte</h1>
                    <p className="text-gray-500 font-nunito mt-1 text-sm">
                        Leé ambos documentos y aceptá cada uno para continuar.
                    </p>
                </div>

                {/* Sección 1: Deslinde */}
                <LegalSection
                    icon={ShieldAlert}
                    iconClass="text-orange-500"
                    badgeClass="text-orange-600"
                    badgeText="Deslinde de Responsabilidades"
                    title="Naturaleza del servicio, exclusión de responsabilidad y cláusula de indemnidad"
                    defaultOpen={true}
                >
                    <DisclaimerText />
                </LegalSection>

                {/* Checkbox 1 */}
                <label className="flex items-start gap-3 cursor-pointer group px-1">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer flex-shrink-0 accent-primary"
                    />
                    <span className="text-sm text-gray-700 font-nunito group-hover:text-gray-900 transition-colors">
                        He leído y acepto el <strong>Deslinde de Responsabilidades y Términos de Uso</strong>.
                        Entiendo que Nina es una plataforma de intermediación y no asume responsabilidad por los
                        acuerdos entre usuarios.
                    </span>
                </label>

                {/* Sección 2: Privacidad */}
                <LegalSection
                    icon={Lock}
                    iconClass="text-blue-500"
                    badgeClass="text-blue-600"
                    badgeText="Política de Privacidad — Ley 25.326"
                    title="Tratamiento de datos personales, derechos ARCO y transferencia a terceros"
                    defaultOpen={false}
                >
                    <PrivacyText />
                </LegalSection>

                {/* Checkbox 2 */}
                <label className="flex items-start gap-3 cursor-pointer group px-1">
                    <input
                        type="checkbox"
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer flex-shrink-0 accent-primary"
                    />
                    <span className="text-sm text-gray-700 font-nunito group-hover:text-gray-900 transition-colors">
                        He leído y acepto la <strong>Política de Privacidad y Protección de Datos</strong> de Nina
                        (Ley 25.326). Presto mi consentimiento libre, expreso e informado para el tratamiento de
                        mis datos personales conforme a dicha política.
                    </span>
                </label>

                {/* Indicador de progreso */}
                {!canContinue && (
                    <p className="text-xs text-center text-gray-400 font-nunito">
                        {!acceptedTerms && !acceptedPrivacy
                            ? 'Debés aceptar ambos documentos para continuar.'
                            : !acceptedTerms
                                ? 'Falta aceptar el Deslinde de Responsabilidades.'
                                : 'Falta aceptar la Política de Privacidad.'}
                    </p>
                )}

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <Button
                        variant="ghost"
                        className="flex-1"
                        onClick={() => navigate('/')}
                    >
                        Volver al inicio
                    </Button>
                    <Button
                        className="flex-1"
                        disabled={!canContinue}
                        onClick={handleContinue}
                    >
                        Acepto ambos y continúo
                    </Button>
                </div>
            </div>
        </div>
    );
};
