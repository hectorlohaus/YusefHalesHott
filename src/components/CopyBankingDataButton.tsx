'use client';
import { useState } from 'react';

export default function CopyBankingDataButton({ amount, id }: { amount: number, id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Banco Estado
Cuenta Corriente
123456789
76.123.456-7
Notaría y Conservador Traiguén
notaria.conservador.traiguen@gmail.com
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
      className={`w-full py-4 rounded-xl font-body font-bold text-base flex justify-center items-center gap-3 transition-all active:scale-95 ${
        copied 
          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
          : 'bg-primary text-on-primary hover:bg-primary-container'
      }`}
    >
      {copied ? (
        <>
          <span className="material-symbols-outlined">check</span>
          ¡Datos Copiados!
        </>
      ) : (
        <>
          <span className="material-symbols-outlined">content_copy</span>
          Copiar Datos para App del Banco
        </>
      )}
    </button>
  );
}
