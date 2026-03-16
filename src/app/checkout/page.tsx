import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function CheckoutSelectionPage(props: { searchParams: Promise<{ solicitudId?: string }> }) {
  const searchParams = await props.searchParams;
  const solicitudId = searchParams.solicitudId;

  if (!solicitudId) redirect('/');

  const supabase = await createClient();
  const { data: rawSolicitud } = await supabase
    .from('solicitudes')
    .select('id, servicio:servicios(titulo, arancel)')
    .eq('id', solicitudId)
    .single();

  const solicitud = rawSolicitud as unknown as { 
    id: string; 
    servicio: { titulo: string; arancel: number; } 
  } | null;

  if (!solicitud) {
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-[80vh] bg-slate-50 items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-[#000080] mb-3">Seleccione Medio de Pago</h1>
          <p className="text-slate-600">Trámite: <strong>{solicitud.servicio?.titulo}</strong></p>
          <p className="text-slate-600 text-lg mt-1">Total a Pagar: <strong className="text-emerald-700">${solicitud.servicio?.arancel?.toLocaleString('es-CL')}</strong></p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          
          {/* Opción 1: Getnet */}
          <a href={`/api/checkout?solicitudId=${solicitud.id}`} className="block w-full bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 transition-all p-6 group">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center p-3 border border-slate-100 group-hover:border-red-200 transition-colors">
                <img 
                  src="https://banco.santander.cl/uploads/000/029/870/0620f532-9fc9-4248-b99e-78bae9f13e1d/original/Logo_WebCheckout_Getnet.svg" 
                  alt="Getnet Logo" 
                  className="w-full h-auto"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Tarjeta de crédito, débito o prepago</h3>
                <p className="text-sm text-slate-500">Paga seguro todo lo que necesitas con Getnet utilizando tus tarjetas de crédito, débito y prepago, de todos los emisores nacionales e internacionales.</p>
              </div>
              <div className="ml-auto text-blue-600">
                <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </a>

          {/* Opción 2: Transferencia */}
          <Link href={`/pago/transferencia?solicitudId=${solicitud.id}`} className="block w-full bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 transition-all p-6 group">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center p-3 border border-blue-100 group-hover:border-blue-200 transition-colors">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Transferencia Bancaria</h3>
                <p className="text-sm text-slate-500">Realice una transferencia manual a la cuenta de la notaría. Su solicitud quedará pendiente hasta validar el pago.</p>
              </div>
               <div className="ml-auto text-blue-600">
                <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
