import Link from 'next/link';

export default async function PagoFalloPage(props: { searchParams: Promise<{ solicitudId?: string, reason?: string, status?: string }> }) {
  const searchParams = await props.searchParams;
  const { solicitudId, reason, status } = searchParams;

  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-red-900/5 text-center border-t-8 border-red-500">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Pago Incompleto</h1>
        <p className="text-slate-600 mb-6">
          No pudimos conﬁrmar su pago. {status === 'REJECTED' ? 'La transacción ha sido rechazada por su banco.' : 'Puede que la operación haya sido cancelada o expirado.'}
        </p>
        
        {solicitudId && (
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 mb-8 border border-slate-100">
            Su solicitud (ID: {solicitudId.substring(0,8)}) sigue guardada en nuestros registros como pendiente de pago.
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          {solicitudId && (
            <>
              <Link href={`/api/checkout?solicitudId=${solicitudId}`} className="bg-[#000080] text-white font-medium py-3 rounded-lg hover:bg-blue-800 transition-colors">
                Reintentar Pago con Tarjeta
              </Link>
              <div className="relative py-2 text-center">
                <span className="bg-white px-2 text-xs text-slate-400 font-bold uppercase relative z-10">O intentar con</span>
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              </div>
              <Link href={`/pago/transferencia?solicitudId=${solicitudId}`} className="bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                Pagar vía Transferencia Bancaria
              </Link>
            </>
          )}
          <Link href="/servicios" className="text-slate-600 font-medium py-3 rounded-lg hover:bg-slate-100 transition-colors">
            Volver a Servicios
          </Link>
        </div>
      </div>
    </div>
  );
}
