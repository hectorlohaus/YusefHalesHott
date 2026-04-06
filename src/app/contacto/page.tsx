export const metadata = {
  title: 'Horarios y Contacto | Notaría Yusef Hales Hott',
  description:
    'Horarios de atención, teléfonos, correos y ubicación de la Notaría Yusef Hales Hott en Traiguén, Chile.',
};

export default function ContactoPage() {
  return (
    <main className="pt-24 pb-24">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        {/* Hero Header Section */}
        <header className="mb-20">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-background tracking-tight mb-4">Ubicación y Contacto</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">Encuéntrenos en el corazón de Traiguén. Ofrecemos excelencia jurídica y atención personalizada en un entorno de máxima profesionalidad.</p>
        </header>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Professional Details */}
          <div className="lg:col-span-5 space-y-12">
            <section className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary transition-colors group-hover:bg-secondary group-hover:text-white shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h3 className="text-sm font-label font-bold uppercase tracking-widest text-secondary mb-2">Dirección</h3>
                  <p className="text-2xl font-headline font-medium text-on-background">Errázuriz N°418</p>
                  <p className="text-on-surface-variant">Traiguén, Región de la Araucanía</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary transition-colors group-hover:bg-secondary group-hover:text-white shrink-0">
                  <span className="material-symbols-outlined">phone_in_talk</span>
                </div>
                <div>
                  <h3 className="text-sm font-label font-bold uppercase tracking-widest text-secondary mb-2">Teléfono</h3>
                  <p className="text-2xl font-headline font-medium text-on-background flex flex-col gap-1">
                    <a href="tel:443051909" className="hover:text-secondary transition-colors">44 305 1909</a>
                  </p>
                  <p className="text-on-surface-variant">Atención telefónica directa</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary transition-colors group-hover:bg-secondary group-hover:text-white shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h3 className="text-sm font-label font-bold uppercase tracking-widest text-secondary mb-2">Correo Electrónico</h3>
                  <p className="text-xl md:text-2xl font-headline font-medium text-on-background break-all">
                    <a href="mailto:contacto@notariatraiguen.cl" className="hover:text-secondary transition-colors">contacto@notariatraiguen.cl</a>
                  </p>
                  <p className="text-on-surface-variant">Consultas generales y trámites digitales</p>
                </div>
              </div>
            </section>

            {/* Punto de Referencia Section */}
            <section className="p-8 bg-surface-container-low rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">explore</span>
              </div>
              <h3 className="text-lg font-headline font-bold text-on-background mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">info</span>
                Punto de Referencia
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Nuestras oficinas se encuentran estratégicamente ubicadas, a pasos de los principales servicios públicos y financieros de la ciudad.
              </p>
            </section>
          </div>

          {/* Right Column: Integrated Map */}
          <div className="lg:col-span-7 h-[600px] rounded-xl overflow-hidden shadow-2xl relative">
            <div className="absolute w-full left-0 bg-slate-200" style={{ top: '-150px', height: 'calc(100% + 150px)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3133.2926574445605!2d-72.6677277!3d-38.249518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x966b1da53ff2f9c5%3A0xdee45cebc8a41554!2sNotaria%20y%20conservador%20de%20Traigu%C3%A9n%20Yusef%20Hales%20Hott!5e0!3m2!1sen!2scl!4v1775361230974!5m2!1sen!2scl"
                className="w-full h-full border-0 pointer-events-auto"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>

            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-white/90 backdrop-blur-md p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="font-headline font-bold text-slate-900">Notaría Yusef Hales Hott</p>
                <p className="text-sm text-slate-600">Traiguén, Araucanía</p>
              </div>
              <a
                href="https://maps.app.goo.gl/FAd99SEssRxHLPnz5"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary transition-colors text-center w-full sm:w-auto"
              >
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Hours Section */}
        <section className="mt-32">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-headline font-bold mb-4 text-on-background">Horarios de Atención</h2>
            <p className="text-on-surface-variant">Nuestro compromiso es la puntualidad y la eficiencia en cada servicio.</p>
          </div>

          <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-high">
                    <th className="px-6 md:px-8 py-5 font-headline font-bold text-on-surface whitespace-nowrap">Día</th>
                    <th className="px-6 md:px-8 py-5 font-headline font-bold text-on-surface whitespace-nowrap">Horario Mañana</th>
                    <th className="px-6 md:px-8 py-5 font-headline font-bold text-on-surface whitespace-nowrap">Horario Tarde</th>
                    <th className="px-6 md:px-8 py-5 font-headline font-bold text-on-surface text-right whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 md:px-8 py-4 font-medium text-on-surface">Lunes a Jueves</td>
                    <td className="px-6 md:px-8 py-4 text-on-surface-variant font-mono">09:00 - 14:00</td>
                    <td className="px-6 md:px-8 py-4 text-on-surface-variant font-mono">15:00 - 17:00</td>
                    <td className="px-6 md:px-8 py-4 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Abierto</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 md:px-8 py-4 font-medium text-on-surface">Viernes</td>
                    <td className="px-6 md:px-8 py-4 text-on-surface-variant font-mono">09:00 - 14:00</td>
                    <td className="px-6 md:px-8 py-4 text-on-surface-variant italic font-sm">Cerrado</td>
                    <td className="px-6 md:px-8 py-4 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Mañana</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-low/50">
                    <td className="px-6 md:px-8 py-4 font-medium text-on-surface">Sábado y Domingo</td>
                    <td className="px-6 md:px-8 py-4 text-on-surface-variant italic font-sm" colSpan={2}>Cerrado por descanso semanal</td>
                    <td className="px-6 md:px-8 py-4 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Cerrado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 md:p-8 bg-slate-900 text-white flex flex-col justify-center items-center gap-4 text-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500">event_note</span>
                <p className="text-sm opacity-90 italic">Turnos especiales y feriados legales se informarán oportunamente por este medio.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
