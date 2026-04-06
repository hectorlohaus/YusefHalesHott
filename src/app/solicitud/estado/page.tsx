import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0;

// ── Helpers ──────────────────────────────────────────────

type EstadoKey = 'pendiente' | 'en_proceso' | 'listo' | 'pagado' | 'fallido' | 'enviada' | string;

function getStepIndex(estado: EstadoKey) {
  if (estado === 'pendiente' || estado === 'sin enviar') return 0;
  if (estado === 'en_proceso') return 1;
  return 2; // listo / pagado / enviada
}

function estadoLabel(estado: EstadoKey) {
  const map: Record<string, string> = {
    pendiente: 'Ingresado / Pendiente',
    en_proceso: 'En Revisión',
    listo: 'Finalizado',
    pagado: 'Finalizado',
    enviada: 'Finalizado',
    fallido: 'Con Observaciones',
    'sin enviar': 'Pendiente',
  };
  return map[estado] ?? estado.replace('_', ' ');
}

// ── Page ─────────────────────────────────────────────────

export default async function EstadoSolicitudPage(
  props: { searchParams: Promise<{ codigo?: string; rut?: string }> }
) {
  const searchParams = await props.searchParams;
  const codigo = searchParams.codigo?.toLowerCase()?.replace(/^#/, '');
  const rut    = searchParams.rut?.trim();

  if (!codigo) {
    return (
      <main className="min-h-screen bg-background text-on-background flex items-center justify-center p-8">
        <div className="bg-surface-container-lowest shadow-sm border border-outline-variant/20 rounded-3xl p-10 text-center max-w-sm w-full">
          <p className="font-body text-on-surface-variant mb-6">No se proporcionó un código de solicitud.</p>
          <Link href="/solicitud/revisar" className="inline-block bg-primary text-white w-full rounded-xl py-3 font-semibold text-sm hover:bg-slate-800 transition-colors">
            Volver a la búsqueda
          </Link>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: solicitudes } = await supabase
    .from('solicitudes')
    .select('*, servicio:servicios(titulo, arancel)')
    .eq('codigo', codigo.toUpperCase())
    .limit(1);

  const solicitud = solicitudes?.[0];
  const step = solicitud ? getStepIndex(solicitud.estado_trabajo) : 0;

  // Steps definition
  const steps = [
    { 
      label: 'Ingresado Analógicamente', 
      desc: 'Su solicitud ha sido recibida y registrada en el sistema notarial.',
      date: solicitud ? new Date(solicitud.creado_en).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' 
    },
    { 
      label: 'En Revisión (Notario)', 
      desc: 'El notario encargado está validando los antecedentes y el documento.',
      date: step >= 1 ? 'En progreso' : 'Pendiente' 
    },
    { 
      label: 'Finalizado / Autorizado',  
      desc: 'Su trámite ha sido firmado digital o físicamente y está listo.',
      date: step === 2 && solicitud?.actualizado_en 
        ? new Date(solicitud.actualizado_en).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Pendiente' 
    },
  ];

  return (
    <main className="min-h-screen bg-background text-on-background w-full font-body">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-16">
        
        {/* Top Utility Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-8 md:pt-10 gap-6">
          <div className="space-y-2">
            <nav className="flex items-center text-on-surface-variant text-[10px] tracking-widest uppercase mb-2 font-label">
              <span>Portal Consultas</span>
              <span className="mx-3 opacity-30">/</span>
              <span className="text-secondary font-bold">Estado</span>
            </nav>
            <h2 className="text-4xl md:text-5xl font-headline tracking-tight text-on-surface leading-none">
              Progreso del Expediente
            </h2>
          </div>
          {solicitud && (
            <div className="flex items-center gap-4 bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/10">
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">Atención Abierta</p>
                <p className="text-[10px] uppercase tracking-widest font-medium text-on-surface-variant mt-0.5">Mesa Central</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                 <span className="material-symbols-outlined text-sm">support_agent</span>
              </div>
            </div>
          )}
        </header>

        {/* ── NOT FOUND ─────────────────────────────── */}
        {!solicitud ? (
          <section className="flex items-center justify-center py-20">
            <div className="bg-surface-container-lowest shadow-sm ring-1 ring-black/5 rounded-[2rem] border-t-8 border-error p-10 md:p-14 text-center max-w-lg w-full">
              <div className="w-16 h-16 bg-error-container rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <span className="material-symbols-outlined text-on-error-container text-3xl">search_off</span>
              </div>
              <h1 className="font-headline text-3xl text-on-surface mb-3">Expediente Inexistente</h1>
              <p className="text-on-surface-variant mb-8 text-sm leading-relaxed max-w-xs mx-auto">
                No encontramos el identificador{' '}
                <span className="font-mono font-bold text-primary">#{codigo.toUpperCase()}</span>
                {rut && <> ingresado.</>}.
              </p>
              <Link href="/solicitud/revisar" className="inline-flex w-full justify-center bg-primary text-white px-8 py-4 rounded-xl font-medium text-sm hover:bg-slate-800 transition-all shadow-lg shadow-primary/10">
                Regresar al buscador
              </Link>
            </div>
          </section>
        ) : (
          /* ── BENTO GRID ─────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* ── Main Tracking Card (Span 8) ── */}
            <section className="md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 relative overflow-hidden group border border-outline-variant/20 shadow-sm">
              <div className="absolute top-0 right-0 p-8 hidden sm:block">
                <div className={`px-4 py-2 border font-medium text-xs rounded-full uppercase tracking-widest ${
                    solicitud.estado_trabajo === 'listo' || solicitud.estado_trabajo === 'pagado' || solicitud.estado_trabajo === 'enviada'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : solicitud.estado_trabajo === 'en_proceso'
                      ? 'bg-secondary-container/10 border-secondary-container/20 text-secondary'
                      : solicitud.estado_trabajo === 'fallido'
                      ? 'bg-error-container text-on-error-container border-error/20'
                      : 'bg-primary-container/5 text-on-primary-container border-outline-variant/30'
                }`}>
                  {estadoLabel(solicitud.estado_trabajo)}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-headline mb-3 text-on-surface max-w-xl leading-tight">
                  {solicitud.servicio?.titulo || 'Trámite Notarial General'}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 text-on-surface-variant mb-12">
                  <span className="text-[10px] font-label uppercase tracking-widest">Identificador único (Tracking ID):</span>
                  <code className="text-primary font-bold text-lg select-all">#{solicitud.codigo || solicitud.id.substring(0, 8).toUpperCase()}</code>
                  <span className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors ml-2">receipt_long</span>
                </div>

                {/* Progress Visualization */}
                <div className="mb-16 max-w-xl">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Nivel de Avance</span>
                    <span className="text-sm font-bold text-secondary">
                      {step === 0 ? '15%' : step === 1 ? '50%' : '100%'}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full shadow-[0_0_15px_rgba(144,77,0,0.3)] transition-all duration-1000 ease-out" 
                      style={{ width: step === 0 ? '15%' : step === 1 ? '50%' : '100%' }}
                    ></div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="space-y-10">
                  {steps.map((s, i) => {
                    const done = i < step;
                    const active = i === step;
                    const isLast = i === steps.length - 1;

                    return (
                      <div key={i} className={`flex gap-6 relative ${!done && !active ? 'opacity-40' : ''}`}>
                        {!isLast && (
                           <div className={`absolute left-4 top-8 bottom-0 w-[2px] ${done ? 'bg-secondary/40' : 'bg-surface-container-high'} -mb-10`}></div>
                        )}
                        
                        {done ? (
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary flex items-center justify-center z-10 text-on-secondary shadow-lg">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                          </div>
                        ) : active ? (
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-surface-container-high border-4 border-surface-container-lowest flex items-center justify-center z-10 ring-4 ring-secondary-container/20">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-surface-container-high flex items-center justify-center z-10 text-on-surface-variant">
                            <span className="material-symbols-outlined text-sm">pending</span>
                          </div>
                        )}

                        <div className="pb-2">
                          <h4 className={`font-medium ${active ? 'text-secondary font-bold' : 'text-on-surface'}`}>{s.label}</h4>
                          <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed max-w-sm">{s.desc}</p>
                          <span className={`text-[10px] uppercase tracking-widest mt-2 block ${active ? 'text-secondary' : 'text-outline'}`}>{s.date}</span>
                          
                          {active && i === 1 && (
                            <div className="mt-5 flex gap-2">
                              <span className="px-3 py-1.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-md uppercase tracking-wider">Validación Notarial</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* ── Sidebar Details (Span 4) ── */}
            <aside className="md:col-span-4 space-y-8">
              
              {/* General Info Card */}
              <div className="bg-surface-container rounded-[2rem] p-8 border border-white/50 shadow-sm relative overflow-hidden">
                <div className="absolute -right-12 -top-12 opacity-[0.03] text-[150px] pointer-events-none">
                   <span className="material-symbols-outlined">description</span>
                </div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-7">Detalles del Expediente</p>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Nombre Involucrado</span>
                    <span className="font-body font-medium text-on-surface text-sm">{solicitud.cliente_nombre || 'No registrado'}</span>
                  </div>
                  <div>
                    <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Cédula de Identidad (RUT)</span>
                    <span className="font-body font-medium text-on-surface text-sm">{rut || solicitud.cliente_rut || 'No validado en filtro'}</span>
                  </div>
                  <div>
                    <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Área o Tipo de Trámite</span>
                    <span className="font-body font-medium text-on-surface text-sm leading-tight inline-block max-w-xs">{solicitud.servicio?.titulo || 'Trámite General Interno'}</span>
                  </div>
                  <div className="pt-6 border-t border-outline-variant/20 flex justify-between items-end">
                    <div>
                      <p className="font-headline text-2xl text-on-surface">
                        {new Date(solicitud.creado_en).toLocaleDateString('es-CL', { month: 'short', day: 'numeric', year: 'numeric' }).replace('.', '')}
                      </p>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Ingresado a sistema</p>
                    </div>
                    <div className="h-10 w-10 bg-on-primary-container/5 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm">event</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Assistance */}
              <div className="bg-primary-container rounded-[2rem] p-8 text-on-primary-container shadow-xl">
                <h3 className="text-xl font-headline text-white mb-6">Asistencia Oficial</h3>
                <div className="space-y-3">
                  
                  <a href="tel:+56443051909" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary ml-1">call</span>
                      <div className="text-left">
                        <span className="block text-xs text-slate-400 font-label tracking-widest uppercase mb-0.5">Mesa Central</span>
                        <span className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">44 305 1909</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary group-hover:translate-x-1 transition-all">chevron_right</span>
                  </a>

                  <a href="mailto:contacto@notariatraiguen.cl" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all mt-2 group border border-white/10 hover:border-secondary/50">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary ml-1">mail</span>
                      <div className="text-left">
                        <span className="block text-[10px] text-slate-400 font-label tracking-widest uppercase mb-0.5">Correo Electrónico</span>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">contacto@notariatraiguen.cl</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary group-hover:translate-x-1 transition-all">chevron_right</span>
                  </a>

                </div>
              </div>
              
              <div className="pt-2 flex justify-center md:justify-end pb-8">
                <Link
                  href="/solicitud/revisar"
                  className="font-label text-[10px] uppercase tracking-widest font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2 px-4 py-2 hover:bg-surface-container rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Buscar otra solicitud
                </Link>
              </div>

            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
