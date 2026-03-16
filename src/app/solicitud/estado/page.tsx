import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0;

export default async function EstadoSolicitudPage(props: { searchParams: Promise<{ codigo?: string }> }) {
  const searchParams = await props.searchParams;
  const codigo = searchParams.codigo?.toLowerCase()?.replace(/^#/, '');

  if (!codigo) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="max-w-sm text-center">
          <p className="text-slate-600 mb-4">No se proporcionó un código de solicitud.</p>
          <Link href="/solicitud/revisar" className="bg-[#000080] text-white px-6 py-2 rounded-lg">Volver a la búsqueda</Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  // Buscar por el campo `codigo` directamente (búsqueda exacta, ultra-rápida gracias al índice)
  const { data: solicitudes } = await supabase
    .from('solicitudes')
    .select('*, servicio:servicios(titulo, arancel)')
    .eq('codigo', codigo.toUpperCase())
    .limit(1);

  const solicitud = solicitudes?.[0];

  const statusStyles: Record<string, string> = {
    pendiente: 'bg-amber-100 text-amber-800 border-amber-300',
    en_proceso: 'bg-blue-100 text-blue-800 border-blue-300',
    listo: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    pagado: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    fallido: 'bg-red-100 text-red-800 border-red-300',
    'sin enviar': 'bg-slate-100 text-slate-600 border-slate-300',
    enviada: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-xl w-full">
        {!solicitud ? (
          <div className="bg-white rounded-2xl shadow-xl border-t-8 border-red-500 p-8 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Solicitud no encontrada</h1>
            <p className="text-slate-600 mb-6">No encontramos ninguna solicitud con el código <span className="font-mono font-bold text-slate-800">#{codigo.toUpperCase()}</span>. Verifique el código e intente nuevamente.</p>
            <Link href="/solicitud/revisar" className="bg-[#000080] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">Buscar de nuevo</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border-t-8 border-[#000080] p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6 border-b pb-5 border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-[#000080] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Código de Solicitud</p>
                <h1 className="text-2xl font-mono font-bold text-slate-900">#{solicitud.codigo || solicitud.id.substring(0,8).toUpperCase()}</h1>
              </div>
            </div>

            <div className="space-y-6">
              {/* Trámite */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Trámite Solicitado</p>
                <p className="text-lg font-semibold text-[#000080] font-serif">{solicitud.servicio?.titulo || '—'}</p>
              </div>

              {/* Estado del Trámite — grande, sin tarjeta */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Estado del Trámite</p>
                <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-2xl font-extrabold border-2 ${statusStyles[solicitud.estado_trabajo] || statusStyles.pendiente}`}>
                  {solicitud.estado_trabajo === 'pendiente' && <span>📥</span>}
                  {solicitud.estado_trabajo === 'en_proceso' && <span>⚙️</span>}
                  {solicitud.estado_trabajo === 'listo' && <span>✅</span>}
                  {(solicitud.estado_trabajo?.toUpperCase() ?? 'PENDIENTE').replace('_', ' ')}
                </div>
              </div>

              {/* Fecha de Ingreso */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Ingreso</p>
                <p className="text-base text-slate-800 font-medium">{new Date(solicitud.creado_en).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Link href="/solicitud/revisar" className="w-full sm:w-auto text-center border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                Buscar otra solicitud
              </Link>
              <Link href="/" className="w-full sm:w-auto text-center bg-[#000080] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors">
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
