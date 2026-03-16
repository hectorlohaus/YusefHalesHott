'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RevisarSolicitudPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Limpiar el código: quitar # si lo ingresaron, y espacios
    const cleaned = code.trim().replace(/^#/, '').toLowerCase();

    if (!cleaned || cleaned.length < 6) {
      setError('Por favor ingresa un código de solicitud válido.');
      return;
    }

    // Redirigir a la vista del comprobante usando el ID como búsqueda parcial
    router.push(`/solicitud/estado?codigo=${encodeURIComponent(cleaned)}`);
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center py-16 px-4 bg-slate-50">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#000080] text-white rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Revisar Solicitud</h1>
          <p className="text-slate-600">
            Ingrese el código único de su solicitud para ver su estado actual.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="codigo" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Código de Solicitud
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-lg">#</span>
                <input
                  id="codigo"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: CB640AE4"
                  className="w-full pl-9 pr-4 py-3.5 text-lg font-mono border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#000080] focus:ring-4 focus:ring-blue-100 transition-all uppercase tracking-widest"
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                El código aparece en su comprobante. Ejemplo: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">CB640AE4</span>
              </p>
              {error && (
                <p className="text-sm text-red-600 font-medium mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#000080] text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Buscar Solicitud
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Tiene dudas? Comuníquese con la notaría al{' '}
          <a href="tel:+56451234567" className="text-[#000080] font-medium hover:underline">(45) 123-4567</a>
        </p>
      </div>
    </div>
  );
}
