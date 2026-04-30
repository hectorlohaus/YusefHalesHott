import Link from "next/link";

export const metadata = {
  title: 'Política de Privacidad | Notaría y Conservador Traiguén',
  description: 'Política de privacidad y protección de datos personales conforme a la Ley 19.628 de Chile y estándares RGPD.',
};

export default function PrivacidadPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline mb-8 font-label text-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Inicio
        </Link>
        <span className="text-secondary font-semibold tracking-widest uppercase text-xs mb-2 block">Documento Legal</span>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">Política de Privacidad</h1>
        <p className="text-on-surface-variant mt-4 text-lg font-body border-l-2 border-secondary-container pl-4 italic">
          Vigente desde el {new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <article className="max-w-none font-body text-on-surface-variant space-y-8">
        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">1. Introducción y Marco Legal</h2>
          <p className="leading-relaxed mb-4">
            En <strong className="text-on-surface">Notaría y Conservador Traiguén Ltda.</strong> (en adelante, "la Notaría"), valoramos profundamente la confidencialidad y privacidad de la información de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos sus datos personales al usar nuestra plataforma digital.
          </p>
          <p className="leading-relaxed">
            El tratamiento de sus datos personales se realiza en estricto cumplimiento con la <strong className="text-on-surface">Ley N° 19.628 sobre Protección de la Vida Privada de la República de Chile</strong> y las normativas orgánicas correspondientes. Asimismo, para asegurar los más altos estándares, alineamos nuestras operaciones y políticas bajo principios provistos por normativas internacionales referenciales como el Reglamento General de Protección de Datos (RGPD) de la Unión Europea, garantizando transparencia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">2. Información que Recopilamos</h2>
          <p className="leading-relaxed mb-4">Recopilamos información personal de manera justa y lícita, únicamente lo necesario para cumplir con los fines detallados. Los datos solicitados pueden incluir:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-on-surface">Datos de Identificación y Contacto:</strong> Nombre completo, RUT, correo electrónico, teléfono móvil o fijo y domicilio.</li>
            <li><strong className="text-on-surface">Datos Documentales:</strong> Archivos en formato PDF, imágenes o texto adjuntados para la preparación y ejecución de escrituras públicas, autorizaciones, u otros oficios que requieren fe de conocimiento o redacción.</li>
            <li><strong className="text-on-surface">Información de Pago:</strong> Historial de transacciones de aranceles. No almacenamos datos completos ni credenciales de sus tarjetas bancarias; están protegidos a través de la pasarela de pagos oficial e integrada a nuestra plataforma.</li>
            <li><strong className="text-on-surface">Datos de Uso de la Plataforma:</strong> Registros automáticos como la dirección IP de conexión, logs de seguridad y configuración de sesión.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">3. Uso de la Información</h2>
          <p className="leading-relaxed mb-4">La recolección de sus datos tiene finalidades estrictamente apegadas al quehacer notarial:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ejecutar, revisar y proceder conforme a derecho los trámites y documentos requeridos por el usuario de forma telemática y/o presencial.</li>
            <li>Comunicarnos de forma operativa con el solicitante para notificar sobre el estado o eventualidades de su trámite.</li>
            <li>Responder a reclamos, consultas y sugerencias desde nuestros formularios de atención.</li>
            <li>Cumplimientos obligatorios según leyes financieras y tributarias nacionales reguladas por el Estado y el Servicio de Impuestos Internos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">4. Base de Licitud para el Tratamiento</h2>
          <p className="leading-relaxed">
            Sus datos son tratados bajo la base del <strong className="text-on-surface">consentimiento expreso</strong> provisto en los formularios de registro y contacto, así como la <strong className="text-on-surface">necesidad para el cumplimiento legal y la prestación de los servicios solicitados</strong>. Ningún dato se utilizará con fines distintos a su propósito legal y operativo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">5. Confidencialidad y Compartición con Terceros</h2>
          <p className="leading-relaxed mb-4">
            Resguardamos el deber del <strong className="text-on-surface">secreto notarial</strong>. Nunca comercializamos, alquilamos ni divulgamos sus datos. Su información sólo será compartida en los siguientes escenarios excepcionales y protegidos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-on-surface">Servicios Subcontratados:</strong> Contamos con proveedores limitados y fiscalizados que operan la estructura en la nube, y pasarelas de cobro legalmente reguladas en Chile.</li>
            <li><strong className="text-on-surface">Razones Legales:</strong> Por mandato explícito en virtud de investigaciones u órdenes judiciales proveídas por entidades del Gobierno de Chile u organismos como Poder Judicial o Registro Civil.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">6. Almacenamiento y Ciberseguridad</h2>
          <p className="leading-relaxed">
            Empleamos cifrado moderno y arquitecturas que se apoyan en bases de datos gestionadas de alta seguridad para prevenir fuga de datos, con sistemas automatizados de monitoreo y restricción de roles (Zero Trust Network Access y Role-based Access Control).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">7. Derechos ARCO y Consentimiento (RGPD Standard)</h2>
          <p className="leading-relaxed mb-4">
            Usted tiene, y se le garantiza conforme a ley, el control sobre el procesamiento personal en la plataforma. Puede solicitar gratuitamente:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-on-surface">Acceso:</strong> Obtener información detallada de qué datos suyos se retienen.</li>
            <li><strong className="text-on-surface">Rectificación:</strong> Solicitar enmiendas si la información fuera imprecisa o errónea.</li>
            <li><strong className="text-on-surface">Cancelación o Eliminación:</strong> Solicitar que sean borrados los datos del registro en la Nube. (Sujeto a los mandatos imperiosos de mantener matrices de escrituras obligatorias ordenadas por la Corte de Apelaciones y ley de notariado, los cuales no pueden ser borrados de los libros nacionales oficiales).</li>
            <li><strong className="text-on-surface">Oposición:</strong> Cesar el uso de los datos en áreas perimetrales a la función oficial.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">8. Contacto con el Delegado de Privacidad</h2>
          <p className="leading-relaxed">
            Para el ejercicio libre y sin costo de cualquier facultad descrita u otras consultas, le invitamos a escribirnos a <strong className="text-on-surface bg-surface-container-high px-1 rounded">contacto@notariatraiguen.cl</strong> o comunicándose a nuestro soporte en horario hábil al teléfono oficial: <strong className="text-on-surface">+56 44 305 1909</strong>.
          </p>
        </section>
      </article>

      {/* Decorative */}
      <div className="mt-16 pt-8 border-t border-outline-variant/20 flex items-center justify-center gap-4 text-secondary/30">
         <span className="material-symbols-outlined text-4xl">gavel</span>
         <span className="material-symbols-outlined text-4xl">policy</span>
         <span className="material-symbols-outlined text-4xl">health_and_safety</span>
      </div>
    </main>
  );
}
