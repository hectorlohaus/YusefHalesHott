'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RevisarSolicitudPage() {
  const [code, setCode] = useState('');
  const [rut, setRut] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Limpiar el código: quitar # si lo ingresaron, y espacios
    const cleanedCode = code.trim().replace(/^#/, '').toLowerCase();
    const cleanedRut = rut.trim();

    if (!cleanedCode || cleanedCode.length < 6) {
      setError('Por favor ingresa un código de solicitud válido.');
      return;
    }

    if (!cleanedRut) {
      setError('Por favor ingresa un RUT válido.');
      return;
    }

    // Redirigir a la vista del comprobante usando el ID como búsqueda parcial
    router.push(`/solicitud/estado?codigo=${encodeURIComponent(cleanedCode)}&rut=${encodeURIComponent(cleanedRut)}`);
  };

  return (
    <div className="flex flex-col md:flex-row w-full bg-background font-body text-on-background selection:bg-secondary-fixed min-h-screen">
      {/* Left Side: Visual Anchor */}
      <section className="relative w-full md:w-1/2 min-h-[409px] md:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-primary-container/60 z-10"></div>
        <img 
          alt="Modern Office" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEXKREmCVQ20CMz6xEepv2vKhatBomx-lzUCq_-zjEvoZo8PD3NKVgHSb-JkXjgxVbozoxNRl51TtByCKhNgwZJtrzhyzvQVEp1K_K5vVr6zzFXzjU-JSHpNJracvok7DIjHHlKyjt7WonBRBKTOLTNZAESsSkL7oK19jO-SM_c5Z4Of34Ef3BbFbsJx44qEb0_aEGvQlMAj_aJrY9DDS4rZC15zqAWaP3q-Su3LnI2LW30oxUj_Jbgoc1dSZMWA-DgAgY81xZhw" 
        />
        <div className="relative z-20 h-full flex flex-col justify-end p-12 md:p-24 space-y-6">
          <h1 className="font-headline text-5xl md:text-7xl text-slate-50 leading-tight tracking-tight max-w-xl">
            Excelencia Legal en la Era <span className="text-secondary-fixed-dim">Digital.</span>
          </h1>
          <p className="text-slate-300 font-light text-lg max-w-md leading-relaxed">
            Acceda a sus documentos y estados de trámite con la seguridad y respaldo de Notaría Traiguén SpA.
          </p>
          <div className="flex items-center gap-4 pt-8">
            <div className="w-12 h-[1px] bg-secondary-fixed-dim"></div>
            <span className="text-xs uppercase tracking-[0.3em] text-secondary-fixed-dim font-medium">Seguridad Certificada</span>
          </div>
        </div>
      </section>

      {/* Right Side: Interaction Canvas */}
      <section className="w-full md:w-1/2 bg-surface flex items-center justify-center p-8 md:p-24">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="font-headline text-3xl text-on-surface mb-2">Revisar Solicitud</h2>
            <p className="text-on-surface-variant font-light">Ingrese sus credenciales para consultar el estado actual de su trámite notarial.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input Field: Folio */}
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Código de solicitud</label>
              <div className="relative">
                <input 
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-on-surface-variant/40" 
                  placeholder="CB640AE4" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">description</span>
              </div>
            </div>

            {/* Input Field: RUT */}
            <div className="space-y-2">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold">RUT del Solicitante</label>
              <div className="relative">
                <input 
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-on-surface-variant/40" 
                  placeholder="12.345.678-9" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">fingerprint</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-error font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
            )}

            {/* CTA Section */}
            <div className="pt-4 space-y-6">
              <button type="submit" className="w-full bg-primary text-on-primary font-medium py-4 rounded-xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <span>Consultar Estado</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
              <div className="flex items-center px-2">
                <p className="w-full text-center text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  ¿Tiene dudas? Comuníquese con la notaría al (44) 305 1909
                </p>
              </div>
            </div>
          </form>

          {/* Information Bento Grid Minor */}
          <div className="mt-20 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-surface-container-low">
              <span className="material-symbols-outlined text-secondary mb-3">verified_user</span>
              <h4 className="text-sm font-semibold text-on-surface mb-1">Encriptación 256-bit</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Sus datos están protegidos bajo los más altos estándares.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low">
              <span className="material-symbols-outlined text-secondary mb-3">schedule</span>
              <h4 className="text-sm font-semibold text-on-surface mb-1">Sincronización</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Actualizaciones en tiempo real con nuestra oficina física.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
