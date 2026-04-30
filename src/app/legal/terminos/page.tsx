import Link from "next/link";

export const metadata = {
  title: 'Términos y Condiciones | Notaría y Conservador Traiguén',
  description: 'Términos y condiciones de uso del sitio web y plataforma digital de la Notaría y Conservador Traiguén, Traiguén.',
};

export default function TerminosPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline mb-8 font-label text-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Inicio
        </Link>
        <span className="text-secondary font-semibold tracking-widest uppercase text-xs mb-2 block">Documento Legal</span>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">Términos y Condiciones</h1>
        <p className="text-on-surface-variant mt-4 text-lg font-body border-l-2 border-secondary-container pl-4 italic">
          Vigente desde el {new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <article className="max-w-none font-body text-on-surface-variant space-y-8">
        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">1. Aceptación de los Términos</h2>
          <p className="leading-relaxed mb-4">
            Al acceder y utilizar el sitio web y la plataforma digital de la <strong className="text-on-surface">Notaría y Conservador Traiguén Ltda.</strong>, usted acepta en su totalidad los presentes Términos y Condiciones de uso. Si no está de acuerdo con alguno de ellos, le solicitamos abstenerse de utilizar el portal web para realizar solicitudes de trámites notariales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">2. De los Servicios Prestados</h2>
          <p className="leading-relaxed mb-4">
            Nuestra plataforma facilita a los usuarios la cotización, solicitud remota, coordinación y pago en línea de diversos actos propios y exclusivos de la normativa procesal notarial y registral en Chile (ej. declaraciones juradas, finiquitos, poderes, etc).
          </p>
          <p className="leading-relaxed">
            <strong className="text-on-surface">Validación Física de la Identidad:</strong> Es mandatario entender que, salvo el uso de Firma Electrónica Avanzada cuando proceda, la solicitud digital adelantada exime el papeleo y acorta tiempos, pero existen actos donde la ley de Notarios y Conservadores exige su presencia material en nuestro oficio, portando su Cédula de Identidad en vigencia e íntegra.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">3. Aranceles y Transacciones</h2>
          <p className="leading-relaxed mb-4">Todas las transacciones realizadas mediante nuestra pasarela en línea están regidas por las siguientes normas:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Los valores mostrados e indicados en la web están sujetos al Arancel de Notarios vigente u Honorarios Conservatorios aplicables por los actos y copias correspondientes.</li>
            <li>En caso de que el acto no pueda ejecutarse por fallas del requiriente en presentación o incompatibilidad legal, será regulada la devolución parcial o total del saldo según las políticas internas.</li>
            <li>La plataforma de cobro es provista por terceros responsables de procesar los datos de su tarjeta (ej. Getnet, Banco Santander). La notaría asume la legalidad una vez emitido el comprobante de liquidación del pago.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">4. Propiedad del Sitio y Responsabilidad</h2>
          <p className="leading-relaxed mb-4">
            Usted se compromete a no darle a la plataforma un uso ilícito (subir archivos engañosos, documentos encriptados ilegiblemente o virus). La documentación ingresada reviste carácter de fe de legalidad, por lo que falsificar antecedentes a sabiendas persigue penas delictuales de falsificación de instrumento privado y público en Chile. 
          </p>
          <p className="leading-relaxed">
            Aunque nos esmeramos en la disponibilidad del sitio 24/7, la notaría no asume responsabilidades por fallas atribuibles a caídas generalizadas de internet, fallas en sistemas bancarios y caídas de servidores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">5. Propiedad Intelectual</h2>
          <p className="leading-relaxed">
            Todos los textos, logotipos, arquitecturas informáticas y diseños son propiedad exclusiva de la Notaría y desarrolladores licenciantes, protegidos bajo la Ley N° 17.336 de Propiedad Intelectual de Chile. 
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">6. Jurisdicción y Ley Aplicable</h2>
          <p className="leading-relaxed">
            Cualquier disputa o discrepancia emanada del uso particular de la plataforma será sometida obligatoriamente a la jurisdicción de los Tribunales Ordinarios de Justicia de la ciudad de Traiguén, Región de la Araucanía, Chile; rigiéndose exclusivamente por la legislación chilena aplicable.
          </p>
        </section>
      </article>

      {/* Decorative */}
      <div className="mt-16 pt-8 border-t border-outline-variant/20 flex items-center justify-center gap-4 text-secondary/30">
         <span className="material-symbols-outlined text-4xl">account_balance</span>
         <span className="material-symbols-outlined text-4xl">inventory</span>
         <span className="material-symbols-outlined text-4xl">security</span>
      </div>
    </main>
  );
}
