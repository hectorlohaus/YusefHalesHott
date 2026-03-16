import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PrintButton from '@/components/PrintButton';

export const revalidate = 0;

export default async function PagoExitoPage(props: { searchParams: Promise<{ solicitudId?: string }> }) {
  const searchParams = await props.searchParams;
  const solicitudId = searchParams.solicitudId;

  if (!solicitudId) {
    redirect('/');
  }

  const supabase = await createClient();
  const { data: solicitud } = await supabase
    .from('solicitudes')
    .select(`
      *,
      servicio:servicios(id, titulo, arancel, documentos_necesarios)
    `)
    .eq('id', solicitudId)
    .single();

  if (!solicitud) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-t-8 border-red-500 text-center">
          <h1 className="text-2xl font-bold mb-4">Solicitud no encontrada</h1>
          <Link href="/" className="bg-[#000080] text-white px-6 py-2 rounded">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-12 px-4 bg-slate-50 items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-emerald-900/5 text-left border-t-8 border-emerald-500">
        <div className="flex items-center gap-4 mb-6 border-b pb-4 border-slate-100">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${solicitud.estado_pago === 'pagado' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            {solicitud.estado_pago === 'pagado' ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {solicitud.estado_pago === 'pagado' ? '¡Pago Exitoso!' : 'Solicitud Ingresada'}
            </h1>
            <p className="text-slate-500 font-medium">Comprobante de Trámite Notarial</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm text-slate-500 uppercase font-semibold">Código de Solicitud</p>
              <p className="font-mono text-slate-800 font-bold tracking-tight">#{solicitud.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-semibold">Estado de Pago</p>
              {solicitud.estado_pago === 'pagado' ? (
                <p className="text-emerald-600 font-bold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  PAGADO
                </p>
              ) : (
                <p className="text-amber-600 font-bold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  VALIDANDO TRASNFERENCIA
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-slate-500 uppercase font-semibold">Trámite Solicitado</p>
              <p className="text-lg text-[#000080] font-bold font-serif">{solicitud.servicio?.titulo}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-semibold">Monto {solicitud.estado_pago !== 'pagado' && 'A Transferir'}</p>
              <p className="text-slate-800 font-bold">${solicitud.servicio?.arancel?.toLocaleString('es-CL')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-semibold">Fecha</p>
              <p className="text-slate-800">{new Date(solicitud.creado_en).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
            </div>
          </div>

           <div>
             <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Datos del Solicitante</h3>
             <ul className="space-y-3 text-slate-700">
               <li><strong className="text-slate-500 block text-xs uppercase">Nombre</strong> {solicitud.cliente_nombre}</li>
               <li><strong className="text-slate-500 block text-xs uppercase">RUT</strong> {solicitud.cliente_rut}</li>
               <li><strong className="text-slate-500 block text-xs uppercase">Email</strong> {solicitud.cliente_email}</li>
               <li><strong className="text-slate-500 block text-xs uppercase">Teléfono</strong> {solicitud.cliente_telefono}</li>
             </ul>
           </div>
        </div>

        {/* CADA VEZ QUE SE COMPLETA LA SOLICITUD INDEPENDIENTEMENTE DEL MÉTODO, DEBEN ENVIAR LOS DOCUMENTOS */}
        <div className="mt-8 bg-blue-50 border-l-4 border-[#000080] p-5 rounded-r-xl flex gap-4">
          <div className="mt-0.5">
            <svg className="w-6 h-6 text-[#000080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-[#000080] mb-1">Paso Final Importante: Envío de Documentos</h4>
            <p className="text-sm text-slate-700">
              Para comenzar a gestionar su trámite, recuerde <strong>enviar los documentos requeridos</strong> al correo electrónico:
              <br/>
              <a href="mailto:temucolaw@gmail.com" className="font-bold text-[#000080] hover:underline my-1 inline-block">temucolaw@gmail.com</a>
              <br/>
              Asegúrese de escribir en el <strong>Asunto del correo</strong> el siguiente código:
              <strong className="ml-2 font-mono bg-blue-100 px-1.5 py-0.5 rounded text-[#000080]">#{solicitud.id.substring(0,8).toUpperCase()}</strong>
            </p>
            {solicitud.servicio?.documentos_necesarios && (
              <div className="mt-3">
                <strong className="text-sm text-[#000080] block mb-1">El trámite solicitado requiere los siguientes documentos:</strong>
                <ul className="text-sm text-slate-700 list-disc list-inside">
                  {solicitud.servicio.documentos_necesarios.split(',').map((doc: string, idx: number) => (
                    <li key={idx}>{doc.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-[#000080] text-center text-white px-8 font-medium py-3 rounded-lg hover:bg-blue-800 transition-colors w-full sm:w-auto">
            Volver al Inicio
          </Link>
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
