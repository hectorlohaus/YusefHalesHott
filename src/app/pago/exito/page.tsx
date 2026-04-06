import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PrintButton from '@/components/PrintButton';

export const revalidate = 0;

export default async function PagoExitoPage(props: { searchParams: Promise<{ solicitudId?: string }> }) {
  const searchParams = await props.searchParams;
  const solicitudId = searchParams.solicitudId;

  if (!solicitudId) redirect('/');

  const supabase = await createClient();
  const { data: solicitud } = await supabase
    .from('solicitudes')
    .select(`*, servicio:servicios(id, titulo, arancel, documentos_necesarios)`)
    .eq('id', solicitudId)
    .single();

  if (!solicitud) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center p-4 bg-[#f9f9ff]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-500 text-center">
          <h1 className="font-headline text-2xl font-bold text-slate-900 mb-4">Solicitud no encontrada</h1>
          <Link href="/" className="font-label text-[11px] uppercase tracking-widest font-bold bg-[#005ab4] text-white px-8 py-3 rounded-xl hover:bg-[#004a96] transition-all">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const pagado = solicitud.estado_pago === 'pagado';
  const codigo = `#${solicitud.codigo || solicitud.id.substring(0, 8).toUpperCase()}`;
  const docs = solicitud.servicio?.documentos_necesarios
    ? solicitud.servicio.documentos_necesarios.split(',').map((d: string) => d.trim()).filter(Boolean)
    : [];

  return (
    <main className="flex-grow flex flex-col pt-8 pb-16 px-6 md:px-12 max-w-6xl mx-auto w-full">
      {/* Success Header */}
      <div className="mb-12">
        <span className="text-secondary font-medium tracking-widest uppercase text-xs mb-3 block">
          {pagado ? 'Transacción Confirmada' : 'Solicitud Ingresada'}
        </span>
        <h1 className="font-headline text-4xl md:text-5xl text-primary leading-tight max-w-2xl font-bold">
          {pagado ? 'Pago Recibido.' : 'Trámite Registrado.'} <br/>
          <span className="italic text-on-surface-variant font-normal">
             Su solicitud está en proceso.
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Col: Step-by-Step & Applicant Data */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          <div className="space-y-0">
            {/* Step 1 */}
            <div className={`relative pb-10 ${pagado ? "after:content-[''] after:absolute after:top-8 after:bottom-0 after:left-4 after:w-px after:bg-secondary/30" : "after:content-[''] after:absolute after:top-8 after:bottom-0 after:left-4 after:w-px after:bg-outline-variant/30"}`}>
              <div className="flex items-start gap-5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${pagado ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-on-surface border border-outline-variant'}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                     {pagado ? 'check' : 'hourglass_empty'}
                  </span>
                </div>
                <div className="pt-0.5">
                  <h3 className="font-headline text-lg font-bold text-primary">Autenticación de Pago</h3>
                  <p className="text-on-surface-variant text-sm mt-1">ID de Trámite: {codigo}</p>
                  <span className={`inline-block mt-3 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${pagado ? 'bg-surface-container-high text-secondary' : 'bg-surface-container-low text-on-surface-variant'}`}>
                    {pagado ? 'Completado' : 'Pendiente Validar'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative pb-10 after:content-[''] after:absolute after:top-8 after:bottom-0 after:left-4 after:w-px after:bg-outline-variant/30">
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0 z-10 border border-outline-variant">
                  <span className="material-symbols-outlined text-sm">description</span>
                </div>
                <div className="pt-0.5">
                  <h3 className="font-headline text-lg font-bold text-primary">Revisión Documental</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Verificamos integridad e identidades.</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-surface-container-low text-on-surface-variant text-[10px] font-bold tracking-widest uppercase rounded-full">
                    Pendiente
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pb-0">
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-full bg-surface-container-low text-outline flex items-center justify-center shrink-0 z-10 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-sm">ink_pen</span>
                </div>
                <div className="pt-0.5">
                  <h3 className="font-headline text-lg font-bold text-outline">Firma y Certificación</h3>
                  <p className="text-outline text-sm mt-1">Certificación final por parte de Notaría.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applicant Summary */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
             <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Datos del Solicitante</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="font-label text-[9px] uppercase tracking-widest text-outline">Nombre</p>
                   <p className="font-body text-sm font-semibold text-on-surface truncate mt-1">{solicitud.cliente_nombre}</p>
                </div>
                <div>
                   <p className="font-label text-[9px] uppercase tracking-widest text-outline">RUT</p>
                   <p className="font-body text-sm font-semibold text-on-surface mt-1">{solicitud.cliente_rut}</p>
                </div>
                <div className="col-span-2">
                   <p className="font-label text-[9px] uppercase tracking-widest text-outline">Email de Contacto</p>
                   <p className="font-body text-sm font-semibold text-on-surface truncate mt-1">{solicitud.cliente_email}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Col: Required Documents Canvas */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-low p-8 md:p-10 rounded-3xl relative overflow-hidden h-full">
            {/* Glassmorphic Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
            
            <h2 className="font-headline text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              Documentos Requeridos
              <span className="material-symbols-outlined text-secondary">fact_check</span>
            </h2>
            
            <p className="font-body text-sm text-on-surface-variant mb-8 leading-relaxed">
               Para avanzar con la solicitud <strong className="text-on-surface">{solicitud.servicio?.titulo}</strong>, envíe los siguientes documentos a <a href="mailto:tramites@notariatraiguen.cl" className="text-secondary font-semibold hover:underline">tramites@notariatraiguen.cl</a> indicando el código <span className="font-mono bg-surface-container-highest px-1.5 py-0.5 rounded text-primary">{codigo}</span> en el asunto del correo.
            </p>

            {docs.length > 0 ? (
              <div className="space-y-4">
                {docs.map((doc: string, i: number) => (
                  <div key={i} className="group flex items-center justify-between p-5 bg-surface-container-lowest rounded-xl hover:shadow-md transition-shadow ring-1 ring-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary">description</span>
                      </div>
                      <div>
                        <p className="font-medium font-body text-on-surface text-sm mb-0.5">{doc}</p>
                        <p className="text-xs text-on-surface-variant">Requisito obligatorio para {solicitud.servicio?.titulo}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors hidden sm:block">cloud_upload</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 bg-surface-container-lowest rounded-xl ring-1 ring-outline-variant/10 text-center">
                 <p className="font-body text-sm font-medium text-on-surface">No se requieren documentos anexos para esta solicitud.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="mt-16 pt-10 border-t border-outline-variant/20 flex flex-wrap gap-6 justify-center items-center">
        <a href={`mailto:tramites@notariatraiguen.cl?subject=Documentos Trámite ${codigo}`} className="px-8 py-3.5 bg-primary text-on-primary rounded-xl font-medium flex items-center gap-3 hover:opacity-90 transition-all font-body text-sm shadow-md">
          <span className="material-symbols-outlined text-[20px]">mail</span>
          Enviar Documentos
        </a>
        <PrintButton />
        <Link href="/" className="text-secondary font-medium underline underline-offset-4 decoration-1 hover:decoration-2 transition-all ml-4 font-body text-sm">
           Volver al Inicio
        </Link>
      </div>
    </main>
  );
}
