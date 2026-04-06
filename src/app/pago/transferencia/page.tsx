import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PrintButton from '@/components/PrintButton';
import CopyBankingDataButton from '@/components/CopyBankingDataButton';

export const revalidate = 0;

export default async function TransferenciaInstruccionesPage(props: { searchParams: Promise<{ solicitudId?: string }> }) {
  const searchParams = await props.searchParams;
  const solicitudId = searchParams.solicitudId;

  if (!solicitudId) redirect('/');

  const supabase = await createClient();
  const { data: solicitud } = await supabase
    .from('solicitudes')
    .select('*, servicio:servicios(titulo, arancel, documentos_necesarios)')
    .eq('id', solicitudId)
    .single();

  if (!solicitud) redirect('/');

  // Update payment method if it's not already set to transferencia
  if (solicitud.metodo_pago !== 'transferencia') {
    await supabase
      .from('solicitudes')
      .update({ metodo_pago: 'transferencia' })
      .eq('id', solicitudId);
  }

  const codigo = solicitud.id.substring(0, 8).toUpperCase();
  const docs = solicitud.servicio?.documentos_necesarios
    ? solicitud.servicio.documentos_necesarios.split(',').map((d: string) => d.trim()).filter(Boolean)
    : [];
  return (
    <main className="pt-8 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* HEADER COMPACTO */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface leading-tight">Instrucciones de Pago</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-body">Complete su trámite siguiendo los 3 pasos a continuación.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/15 shrink-0 self-start sm:self-auto">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <span className="text-xs font-medium text-on-surface-variant font-label">Portal Seguro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: RESUMEN, PASOS Y DOCS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Resumen del Trámite (Destacando Código y Monto) */}
          <section className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-4">
              <h2 className="font-headline text-lg font-bold">Estado Actual</h2>
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider">Pendiente de Pago</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-label">Trámite</span>
                <span className="font-medium text-right text-on-surface font-body max-w-[200px] truncate" title={solicitud.servicio?.titulo}>{solicitud.servicio?.titulo}</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container rounded-lg p-3 border border-outline-variant/10">
                <span className="text-on-surface font-label text-xs uppercase tracking-wider font-bold">Código Único</span>
                <span className="font-mono font-bold text-lg text-primary">#{codigo}</span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-on-surface-variant font-label block mb-1 uppercase tracking-widest">Total a transferir</span>
                <span className="text-4xl font-headline font-bold text-primary">${solicitud.servicio?.arancel?.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </section>

          {/* Pasos a seguir (Más compactos) */}
          <section className="bg-surface-container-lowest border-2 border-primary/10 rounded-xl p-6 shadow-sm">
            <h2 className="font-headline text-lg font-bold mb-5 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">rule</span>
              ¿Qué debo hacer ahora?
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface font-body">Transfiera el monto exacto</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Copie los datos bancarios y transfiera <strong className="text-on-surface">${solicitud.servicio?.arancel?.toLocaleString('es-CL')}</strong>.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface font-body">Prepare sus respaldos</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Guarde el comprobante (PDF/Foto) y reúna los documentos obligatorios si su trámite lo requiere.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-secondary/30">3</div>
                <div>
                  <h3 className="font-bold text-sm text-secondary font-body">Envíe por Correo <span className="text-on-surface ml-1">(Paso Final)</span></h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Envíe todo a <strong className="text-on-surface bg-surface-container-high px-1 py-0.5 rounded">pagos@notariatraiguen.cl</strong> mencionando el código <strong className="text-on-surface font-mono">#{codigo}</strong> en el asunto.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Documentos Pendientes */}
          {docs.length > 0 && (
            <section className="bg-error-container/20 border border-error/20 p-5 rounded-xl">
               <h3 className="font-headline text-[13px] font-bold text-error flex items-center gap-2 mb-3 uppercase tracking-wider">
                 <span className="material-symbols-outlined text-[18px]">warning</span>
                 Requisitos para este Trámite
               </h3>
               <ul className="space-y-2">
                 {docs.map((doc: string, i: number) => (
                   <li key={i} className="flex items-start gap-2 text-xs text-on-surface font-medium">
                     <span className="text-error mt-0.5">•</span>
                     {doc}
                   </li>
                 ))}
               </ul>
            </section>
          )}

        </div>

        {/* COLUMNA DERECHA: DATOS BANCARIOS Y ACCIONES */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant/15 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/10 pb-4">
              <span className="material-symbols-outlined text-secondary bg-surface-container-high p-2 rounded-lg">account_balance</span>
              <div>
                <h2 className="font-headline text-xl font-bold">Datos de Transferencia</h2>
              </div>
            </div>

            {/* Grid Compacto de Datos */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-6 flex-grow py-2">
              <div className="col-span-1">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 block font-label">Banco</label>
                <span className="text-base font-medium font-body text-on-surface">Banco de Chile</span>
              </div>
              <div className="col-span-1">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 block font-label">Tipo de Cuenta</label>
                <span className="text-base font-medium font-body text-on-surface">Cuenta Corriente</span>
              </div>
              
              <div className="col-span-1">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 block font-label">Número de Cuenta</label>
                <span className="text-base font-mono font-bold tracking-tight text-on-surface">00-142-99812-05</span>
              </div>
              <div className="col-span-1">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 block font-label">RUT</label>
                <span className="text-base font-mono font-bold tracking-tight text-on-surface">72.334.100-K</span>
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 block font-label">Nombre del Destinatario</label>
                <span className="text-base font-headline font-semibold text-on-surface">Notaría y Conservador Traiguén Ltda.</span>
              </div>
              
              <div className="col-span-2 border-t border-dashed border-outline-variant/30 pt-4">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 block font-label">Correo de Confirmación</label>
                <span className="text-base font-medium font-body text-primary">pagos@notariatraiguen.cl</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant/15">
               <CopyBankingDataButton amount={solicitud.servicio?.arancel || 0} id={solicitud.id} />
               <p className="text-center font-label text-[10px] text-outline italic mt-4">
                 Si requiere factura, por favor indíquelo en el correo de envío.
               </p>
            </div>
          </section>

          {/* Acciones */}
          <footer className="flex flex-col sm:flex-row gap-4 justify-end">
            <PrintButton />
            <Link 
               href={`/pago/exito?solicitudId=${solicitud.id}`} 
               className="px-6 py-4 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2 font-body text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              Ya envié el comprobante
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
