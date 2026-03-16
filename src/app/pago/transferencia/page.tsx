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

  return (
    <div className="flex flex-col min-h-screen py-12 px-4 bg-slate-50 items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl border-t-8 border-blue-500 text-left">
        
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">Instrucciones de Transferencia</h1>
        <p className="text-slate-600 mb-8 border-b pb-6 border-slate-100">
          Su solicitud <strong>#{solicitud.id.substring(0,8).toUpperCase()}</strong> ha sido registrada con éxito. Para comenzar a procesar su trámite, por favor realice la transferencia bancaria con los siguientes datos:
        </p>

        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-8">
           <h3 className="font-bold text-[#000080] mb-4 text-lg">Datos Bancarios Notaría</h3>
           <ul className="space-y-3 font-medium text-slate-700">
             <li className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2 gap-1">
               <span className="text-slate-500 text-sm sm:text-base">Banco:</span>
               <span className="font-bold">Banco Estado</span>
             </li>
             <li className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2 gap-1">
               <span className="text-slate-500 text-sm sm:text-base">Tipo de Cuenta:</span>
               <span className="font-bold">Cuenta Corriente</span>
             </li>
             <li className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2 gap-1">
               <span className="text-slate-500 text-sm sm:text-base">Número de Cuenta:</span>
               <span className="font-mono font-bold">123456789</span>
             </li>
             <li className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2 gap-1">
               <span className="text-slate-500 text-sm sm:text-base">RUT:</span>
               <span className="font-mono font-bold">76.123.456-7</span>
             </li>
             <li className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2 gap-1">
               <span className="text-slate-500 text-sm sm:text-base">Nombre:</span>
               <span className="font-bold">Notaría Traiguén SpA</span>
             </li>
             <li className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2 gap-1">
               <span className="text-slate-500 text-sm sm:text-base">Correo Confirmación:</span>
               <span className="break-all font-bold">pagos@notariatraiguen.cl</span>
             </li>
             <li className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center pt-2 gap-1">
               <span className="text-slate-500 text-sm sm:text-base">Monto a Transferir:</span>
               <span className="text-xl font-bold text-emerald-600">${solicitud.servicio?.arancel?.toLocaleString('es-CL')}</span>
             </li>
           </ul>
           
           <CopyBankingDataButton 
             amount={solicitud.servicio?.arancel || 0} 
             id={solicitud.id} 
           />
        </div>

        <div className="mb-8">
            <h4 className="font-bold text-slate-800 mb-2">Siguientes Pasos:</h4>
            <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-sm">
              <li>Realice la transferencia exacta por <strong className="text-slate-800">${solicitud.servicio?.arancel?.toLocaleString('es-CL')}</strong>.</li>
              <li>En el comentario o asunto de la transferencia, incluya el código: <strong className="font-mono bg-slate-100 px-1 rounded text-slate-800">#{solicitud.id.substring(0,8).toUpperCase()}</strong>.</li>
              <li>Envíe el comprobante al correo indicado. Su trámite avanzará una vez que validemos la recepción de los fondos.</li>
              <li>Junto con el comprobante, no olvide enviar los documentos requeridos a <strong className="text-slate-800">temucolaw@gmail.com</strong>.
                {solicitud.servicio?.documentos_necesarios && (
                  <ul className="list-disc pl-5 mt-1">
                    {solicitud.servicio.documentos_necesarios.split(',').map((doc: string, idx: number) => (
                      <li key={idx}>{doc.trim()}</li>
                    ))}
                  </ul>
                )}
              </li>
            </ol>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/pago/exito?solicitudId=${solicitud.id}`} className="bg-[#000080] text-center text-white px-8 font-medium py-3 rounded-lg hover:bg-blue-800 transition-colors w-full sm:w-auto">
            Transferencia Realizada
          </Link>
          <PrintButton />
        </div>

      </div>
    </div>
  );
}
