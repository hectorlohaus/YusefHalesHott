import Link from 'next/link';
import Image from 'next/image';
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
    <main className="flex-grow pt-24 pb-12 px-6 flex flex-col items-center justify-start min-h-[80vh] bg-surface">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl p-8 md:p-12 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(19,27,46,0.08)] border border-outline-variant/15">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-surface-container-low text-on-secondary-container text-[10px] uppercase tracking-[0.2em] font-bold rounded-full mb-4">Finalizar Trámite</span>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-on-surface mb-2 tracking-tight">Seleccione Medio de Pago</h1>
          <p className="text-on-surface-variant font-body italic text-sm">Notaría Traiguén — Digital Services</p>
        </div>

        {/* Transaction Summary */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center border border-outline-variant/10">
          <div>
             <h3 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-2">Servicio</h3>
             <p className="text-lg md:text-xl font-semibold font-headline text-on-surface">{solicitud.servicio?.titulo}</p>
          </div>
          <div className="mt-6 md:mt-0 text-center md:text-right">
             <h3 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-2">Total a Pagar</h3>
             <p className="text-3xl md:text-4xl font-headline font-bold text-secondary">${solicitud.servicio?.arancel?.toLocaleString('es-CL')} <span className="text-sm font-normal text-on-surface-variant ml-1 font-body">CLP</span></p>
          </div>
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Cards (Getnet) */}
          <a href={`/api/checkout?solicitudId=${solicitud.id}`} className="group flex flex-col items-center p-8 rounded-xl bg-surface-container text-left transition-all duration-200 hover:bg-surface-container-high ring-1 ring-transparent hover:ring-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-on-primary text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-lg">
               Pago Inmediato
            </div>
            <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform shadow-sm p-2 border border-outline-variant/10">
              <Image 
                 src="/Logo_WebCheckout_Getnet.svg" 
                 alt="Getnet Logo" 
                 width={64}
                 height={64}
                 className="w-full h-auto"
              />
            </div>
            <h3 className="text-lg font-bold font-headline text-on-surface text-center mb-3">Tarjeta de crédito, débito o prepago</h3>
            <p className="text-sm text-on-surface-variant text-center leading-relaxed font-body">
              Paga seguro todo lo que necesitas con Getnet utilizando tus tarjetas de crédito, débito y prepago, de todos los emisores nacionales e internacionales.
            </p>
          </a>

          {/* Option 2: Transfer */}
          <Link href={`/pago/transferencia?solicitudId=${solicitud.id}`} className="group flex flex-col items-center p-8 rounded-xl bg-surface-container text-left transition-all duration-200 hover:bg-surface-container-high ring-1 ring-transparent hover:ring-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-surface-variant text-on-surface-variant text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-lg">
               Validación Manual
            </div>
            <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform shadow-sm border border-outline-variant/10">
              <span className="material-symbols-outlined text-[32px]">account_balance</span>
            </div>
            <h3 className="text-lg font-bold font-headline text-on-surface text-center mb-3">Transferencia Bancaria</h3>
            <p className="text-sm text-on-surface-variant text-center leading-relaxed font-body">
              Realice una transferencia a la cuenta de la notaría. Reciba los datos por correo para una comprobación posterior.
            </p>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex items-center justify-center space-x-3 text-on-surface-variant opacity-60">
          <span className="material-symbols-outlined text-base">lock</span>
          <span className="text-xs font-label uppercase tracking-widest">Protegido por Estándares de Seguridad Notaría Traiguén</span>
        </div>

      </div>
    </main>
  );
}
