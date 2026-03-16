'use client';
import { useState } from 'react';

export default function CopyBankingDataButton({ amount, id }: { amount: number, id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Banco Estado
Cuenta Corriente
123456789
76.123.456-7
Notaría Traiguén SpA
pagos@notariatraiguen.cl
$${amount.toLocaleString('es-CL')}
#${id.substring(0,8).toUpperCase()}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <button 
      onClick={handleCopy}
      className={`mt-4 w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
        copied 
          ? 'bg-emerald-500 text-white border-emerald-600' 
          : 'bg-white border-2 border-[#000080] text-[#000080] hover:bg-blue-50'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ¡Datos Copiados!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          Copiar Datos para App del Banco
        </>
      )}
    </button>
  );
}
