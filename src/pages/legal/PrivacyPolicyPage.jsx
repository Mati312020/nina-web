import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail } from 'lucide-react';
import logo from '../../assets/logo.png';

/**
 * Página standalone de Política de Privacidad y Términos de Uso.
 * Accesible desde el footer sin necesidad de autenticación.
 * Vigencia: Marzo 2026 · Jurisdicción: República Argentina
 */

const Section = ({ title, children }) => (
    <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 font-poppins border-b border-gray-100 pb-2">{title}</h2>
        <div className="text-sm text-gray-700 font-nunito leading-relaxed space-y-2">
            {children}
        </div>
    </section>
);

const PolicyBlock = ({ icon: Icon, iconClass, title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-3">
            <Icon size={20} className={iconClass} />
            <h2 className="text-xl font-bold text-gray-900 font-poppins">{title}</h2>
        </div>
        {children}
    </div>
);

export const PrivacyPolicyPage = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

            {/* Header */}
            <div className="text-center space-y-3">
                <Link to="/" className="inline-flex">
                    <div className="bg-primary p-3 rounded-2xl inline-flex">
                        <img src={logo} alt="Nina Logo" className="h-10 w-auto" />
                    </div>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 font-poppins">Políticas Legales</h1>
                <p className="text-gray-500 font-nunito text-sm">
                    Vigencia: Marzo 2026 · Jurisdicción: República Argentina
                </p>
            </div>

            {/* ── Deslinde de Responsabilidades ───────────────────────────── */}
            <PolicyBlock icon={ShieldAlert} iconClass="text-orange-500" title="Deslinde de Responsabilidades y Términos de Uso">

                <Section title="1. Naturaleza del Servicio (el «Nexo Intermediario»)">
                    <p>
                        Nina App y Nina Web (en adelante, «La Plataforma») operan exclusivamente como un ecosistema
                        digital de contacto y una herramienta tecnológica de intermediación. El servicio consiste
                        únicamente en facilitar el encuentro entre familias que buscan cuidado infantil y personas
                        dispuestas a proveer dicho cuidado. <strong>La Plataforma no es parte de ningún acuerdo de
                        prestación de servicios de cuidado que pueda celebrarse entre los usuarios.</strong>
                    </p>
                </Section>

                <Section title="2. Ausencia de Vínculo Laboral (Ley 26.844)">
                    <p>
                        Nina no es empleadora de ninguna persona registrada como niñera o cuidadora. El uso de la
                        Plataforma no crea vínculo laboral, ni relación de dependencia entre La Plataforma y los
                        usuarios prestadores de servicios. <strong>Todo acuerdo laboral o de prestación de servicios
                        es de carácter privado entre las partes.</strong> La relación entre la familia y la niñera
                        queda comprendida, si correspondiere, en el régimen previsto por la Ley 26.844 (Régimen
                        Especial de Contrato de Trabajo para el Personal de Casas Particulares) o el Código Civil y
                        Comercial de la Nación.
                    </p>
                </Section>

                <Section title="3. Exclusión de Responsabilidad">
                    <p>
                        La Plataforma no garantiza la veracidad, exactitud ni integridad de la información publicada
                        por los usuarios. En virtud del Art. 1710 del Código Civil y Comercial, Nina adoptará medidas
                        razonables para minimizar riesgos, pero <strong>no será responsable por daños, perjuicios ni
                        incidentes que puedan ocurrir en el marco de servicios contratados entre usuarios.</strong>
                    </p>
                    <p>
                        Cada usuario es responsable de realizar su propia diligencia antes de acordar cualquier
                        prestación de servicios. Nina recomienda verificar referencias y, cuando corresponda, solicitar
                        antecedentes penales.
                    </p>
                </Section>

                <Section title="4. Alcance Técnico">
                    <p>
                        Las funciones de geolocalización, valoraciones, disponibilidad y búsqueda son herramientas
                        informativas. Nina no garantiza la disponibilidad continua de la Plataforma ni la exactitud
                        de los datos de localización.
                    </p>
                </Section>

                <Section title="5. Cláusula de Indemnidad">
                    <p>
                        El usuario acepta defender, indemnizar y mantener indemne a Nina App, sus directores, empleados
                        y agentes, frente a cualquier reclamo de terceros derivado del incumplimiento de estos términos
                        o de las leyes aplicables.
                    </p>
                </Section>
            </PolicyBlock>

            {/* ── Política de Privacidad ─────────────────────────────────── */}
            <PolicyBlock icon={Lock} iconClass="text-blue-500" title="Política de Privacidad y Protección de Datos Personales">
                <p className="text-sm text-gray-500 font-nunito">
                    En cumplimiento de la <strong>Ley 25.326</strong> de Protección de Datos Personales de la
                    República Argentina.
                </p>

                <Section title="1. Responsable del Tratamiento">
                    <p>
                        Nina (en adelante «Nina» o «La Plataforma»), con domicilio digital en{' '}
                        <a href="mailto:privacidad@nina-app.com.ar" className="text-primary underline">
                            privacidad@nina-app.com.ar
                        </a>{' '}
                        es responsable del tratamiento de los datos personales recopilados a través de Nina App y Nina Web.
                    </p>
                </Section>

                <Section title="2. Datos Recopilados">
                    <p>Recopilamos los siguientes datos para poder operar la Plataforma:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Identidad:</strong> Nombre, apellido y correo electrónico.</li>
                        <li><strong>Contacto:</strong> Número de teléfono y dirección de correo electrónico alternativa.</li>
                        <li><strong>Ubicación:</strong> Provincia, localidad y barrio (para mostrar resultados geográficamente relevantes).</li>
                        <li><strong>Perfil Profesional/Familiar:</strong> Experiencia, valoraciones de otros usuarios y preferencias de cuidado.</li>
                    </ul>
                    <p>
                        <strong>Finalidad única:</strong> Facilitar el contacto entre las partes. Nina no vende ni cede
                        tus datos a terceros con fines publicitarios ajenos a la plataforma.
                    </p>
                </Section>

                <Section title="3. Consentimiento Informado">
                    <p>
                        Al registrarte en Nina, prestás tu consentimiento libre, expreso e informado para que tus datos
                        sean tratados conforme a esta política. Ciertos datos (como tu nombre y valoración) serán
                        visibles para otros usuarios de la red de Nina.
                    </p>
                </Section>

                <Section title="4. Transferencia a Terceros">
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Entre usuarios:</strong> Los datos de contacto se revelarán únicamente cuando ambas partes manifiesten interés mutuo en la prestación del servicio.</li>
                        <li><strong>Proveedores de servicios:</strong> Podremos compartir datos con procesadores de pagos o servicios de validación de identidad, quienes están obligados a mantener la confidencialidad bajo contratos de rigor.</li>
                    </ul>
                </Section>

                <Section title="5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)">
                    <p>
                        De acuerdo con el Art. 14 de la Ley 25.326, el titular de los datos personales tiene la
                        facultad de ejercer el derecho de acceso en forma gratuita. Podés:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Acceder a tus datos registrados en Nina.</li>
                        <li>Actualizar o rectificar información inexacta.</li>
                        <li>Solicitar la supresión de tu cuenta y datos (<strong>Derecho al olvido</strong>), siempre que no exista una obligación legal de conservarlos.</li>
                    </ul>
                    <p>
                        Para eliminar tu cuenta directamente desde la plataforma, ingresá a tu dashboard y usá la
                        opción <strong>"Eliminar mi cuenta"</strong>.
                    </p>
                    <p className="flex items-center gap-2">
                        <Mail size={14} className="text-primary flex-shrink-0" />
                        Contacto para ejercer derechos:{' '}
                        <a href="mailto:privacidad@nina-app.com.ar" className="text-primary underline">
                            privacidad@nina-app.com.ar
                        </a>
                    </p>
                </Section>

                <Section title="6. Seguridad de la Información">
                    <p>
                        Nina implementa medidas de seguridad técnicas y organizativas para evitar la pérdida, mal uso,
                        alteración o acceso no autorizado. Sin embargo, el usuario reconoce que las medidas de seguridad
                        en Internet no son inexpugnables.
                    </p>
                </Section>

                <Section title="7. Cookies y Tecnologías de Seguimiento">
                    <p>
                        Nina Web utiliza cookies para mejorar la experiencia de usuario y recordar preferencias. Podés
                        desactivarlas en la configuración de tu navegador, aunque esto podría afectar la funcionalidad
                        de la plataforma.
                    </p>
                </Section>

                <Section title="8. Autoridad de Control">
                    <p>
                        La <strong>Agencia de Acceso a la Información Pública</strong>, órgano de control de la Ley
                        N° 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con
                        relación al incumplimiento de las normas sobre protección de datos personales.
                    </p>
                </Section>
            </PolicyBlock>

            {/* Footer de la página */}
            <div className="text-center space-y-3">
                <p className="text-xs text-gray-400 font-nunito">
                    © 2026 Nina App y Nina Web desarrolladas por Byteraft. Todos los derechos reservados.
                </p>
                <Link to="/" className="text-sm text-primary hover:underline font-nunito">
                    ← Volver al inicio
                </Link>
            </div>
        </div>
    </div>
);
