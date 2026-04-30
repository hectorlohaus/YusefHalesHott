import { createClient } from '@/lib/supabase/server';
import SolicitudForm from '@/components/SolicitudForm';
import Script from 'next/script';

export const metadata = {
  title: 'Solicitar Trámite | Notaría y Conservador Traiguén',
  description: 'Complete el formulario para solicitar su trámite notarial en línea de forma rápida y segura.',
};

export default async function SolicitarPage(
  props: { searchParams: Promise<{ servicio?: string }> }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: servicios, error } = await supabase
    .from('servicios')
    .select('id, titulo, arancel, documentos_necesarios')
    .eq('activo', true)
    .order('titulo');

  return (
    <main className="flex-grow pt-24 pb-16 px-6 md:px-12 flex justify-center items-start min-h-screen bg-surface">
      {/* Google Maps Places API */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=es`}
        strategy="lazyOnload"
        id="google-maps"
      />

      <div className="max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ── LEFT COLUMN (INFO & WIDGETS) ── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <header className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">Solicitar Trámite Notarial</h1>
              <p className="text-on-surface-variant text-sm lg:text-base font-light font-body">
                Inicie su proceso legal con precisión digital. Complete el siguiente formulario para que nuestro equipo procese su solicitud.
              </p>
            </header>

            {/* Warning text requested by the user */}
            <div className="bg-surface-container border-l-4 border-secondary p-6 rounded-r-xl shadow-sm flex items-start gap-4">
              <span className="material-symbols-outlined text-secondary mt-1">outgoing_mail</span>
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-1">Envío de Documentos</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  Una vez completada la solicitud, envíe sus documentos digitalizados a <strong className="text-secondary hover:underline">tramites@notariatraiguen.cl</strong> adjuntando el RUT del solicitante para agilizar todo el proceso.
                </p>
              </div>
            </div>

            <aside className="grid grid-cols-1 gap-4">
              <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <h3 className="text-on-surface font-headline font-bold text-base mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">gavel</span> Revisión Notarial
                </h3>
                <p className="text-on-surface-variant text-xs font-light font-body">Su trámite será procesado a la brevedad por el personal autorizado y nos pondremos en contacto.</p>
              </div>
              <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <h3 className="text-on-surface font-headline font-bold text-base mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">verified</span> Fe Pública
                </h3>
                <p className="text-on-surface-variant text-xs font-light font-body">Otorgamos certeza jurídica y valor probatorio en todos los documentos e instrumentos públicos.</p>
              </div>
              <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <h3 className="text-on-surface font-headline font-bold text-base mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">timeline</span> Seguimiento
                </h3>
                <p className="text-on-surface-variant text-xs font-light font-body">Podrá hacer seguimiento en tiempo real con el identificador de su trámite en el respectivo portal.</p>
              </div>
            </aside>
          </div>

          {/* ── RIGHT COLUMN (FORM) ── */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(19,27,46,0.08)] border border-outline-variant/15">
              {error ? (
                <div className="bg-error-container border-l-4 border-error p-4 rounded-r-xl">
                  <p className="font-body text-on-error-container">Error al cargar los servicios. Por favor, intente más tarde.</p>
                </div>
              ) : (
                <SolicitudForm servicios={servicios || []} preselectedId={searchParams.servicio} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
