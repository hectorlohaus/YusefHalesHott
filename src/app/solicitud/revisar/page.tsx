'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RevisarSolicitudPage() {
  const [code, setCode] = useState('');
  const [rut, setRut] = useState('');
  const [errors, setErrors] = useState<{ code?: string; rut?: string }>({});
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { code?: string; rut?: string } = {};
    const cleanedCode = code.trim().replace(/^#/, '').toLowerCase();
    const cleanedRut  = rut.trim();

    if (!cleanedCode || cleanedCode.length < 6) {
      newErrors.code = 'Ingrese un código de solicitud válido (mín. 6 caracteres).';
    }
    if (!cleanedRut || cleanedRut.length < 7) {
      newErrors.rut = 'Ingrese un RUT válido. Ej: 12.345.678-9';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    router.push(
      `/solicitud/estado?codigo=${encodeURIComponent(cleanedCode)}&rut=${encodeURIComponent(cleanedRut)}`
    );
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface">
      {/* Main Content: Search Form */}
      <section className="flex-1 bg-surface-container-lowest p-8 md:p-24 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl">
          <header className="mb-12 text-center md:text-left">
            <span className="text-secondary font-semibold tracking-widest text-xs uppercase mb-2 block">Portal de Seguimiento</span>
            <h1 className="font-headline text-4xl md:text-5xl text-primary mb-4 leading-none">Revisar Solicitud</h1>
            <p className="text-on-surface-variant max-w-md">Ingrese las credenciales de su trámite para obtener el estado actual y descargar copias digitales autorizadas.</p>
          </header>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              
              {/* Request Code Input */}
              <div className="space-y-2">
                <label className="block font-label text-sm font-medium text-on-surface-variant ml-1">Código de Solicitud</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">qr_code_2</span>
                  </div>
                  <input 
                    className={`block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-1 focus:ring-secondary focus:bg-white transition-all text-primary placeholder:text-outline font-medium shadow-sm uppercase ${errors.code ? 'ring-1 ring-error bg-error-container/20' : ''}`}
                    placeholder="Ej: CB640AE4" 
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErrors((p) => ({ ...p, code: undefined })); }}
                  />
                </div>
                {errors.code && (
                  <p className="text-xs text-error ml-1 font-medium">{errors.code}</p>
                )}
              </div>

              {/* RUT Input */}
              <div className="space-y-2">
                <label className="block font-label text-sm font-medium text-on-surface-variant ml-1">RUT del Solicitante</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">badge</span>
                  </div>
                  <input 
                    className={`block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-1 focus:ring-secondary focus:bg-white transition-all text-primary placeholder:text-outline font-medium shadow-sm ${errors.rut ? 'ring-1 ring-error bg-error-container/20' : ''}`}
                    placeholder="12.345.678-9" 
                    type="text"
                    value={rut}
                    onChange={(e) => { setRut(e.target.value); setErrors((p) => ({ ...p, rut: undefined })); }}
                  />
                </div>
                {errors.rut && (
                  <p className="text-xs text-error ml-1 font-medium">{errors.rut}</p>
                )}
              </div>

            </div>
            
            <div className="pt-4">
              <button 
                className="w-full bg-primary text-white py-5 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-primary/10" 
                type="submit"
              >
                <span>Consultar Trámite</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-8 border-t border-surface-container-high">
              <button className="text-sm font-medium text-secondary hover:underline flex items-center gap-2" type="button">
                <span className="material-symbols-outlined text-lg">help</span>
                ¿Olvidó su código?
              </button>
              <button className="text-sm font-medium text-on-surface-variant hover:text-primary flex items-center gap-2" type="button">
                <span className="material-symbols-outlined text-lg">support_agent</span>
                Soporte Legal
              </button>
            </div>
          </form>
          
          {/* Featured Image / Visual Anchor */}
          <div className="mt-20 relative h-64 rounded-xl overflow-hidden group hidden md:block">
            <img 
              alt="Legal Professional Office" 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJaqWwtfHwObQ54PzY4mDnt9ZrXQA5aCWJIFmqG-rpR94gNo33ysW2ZOboUq7_hPNyHct6izDYTQYHnuv1EkNteazdpIAPJeobT5Gfnz80_6o8QRgyjhE5j3_PeahXhwO_R3FiaFJmfP_Z8ddav0B1o-BFj_hdogQ6wqK0b0wpJgYheB97RBfnWVvaz5M3YFqrUBICccDeg9woM7OHHdsi3NtgsMMejCk9MWQtMNJA5jgrVZ1R8LB7eMDfrdGEZuOR6y_tcUUIGg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-primary/40">Excelencia Digital &amp; Tradición Legal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar: Security Benefits */}
      <aside className="md:w-1/3 lg:w-1/4 bg-primary-container text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Decorative Gradient Shape */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-surface-container-high/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 pt-10 md:pt-24">
          <h2 className="font-headline text-3xl mb-8 leading-tight">Seguridad Institucional Digital</h2>
          <div className="space-y-10">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>enhanced_encryption</span>
              </div>
              <div>
                <h3 className="font-headline text-lg text-secondary-fixed">Privacidad Estándar</h3>
                <p className="text-sm text-on-primary-container leading-relaxed mt-1">Sus documentos operan sobre servidores en la nube resguardados con cifrado estándar AES-256 en reposo y conexiones seguras TLS.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
              </div>
              <div>
                <h3 className="font-headline text-lg text-secondary-fixed">Sincronización Notarial</h3>
                <p className="text-sm text-on-primary-container leading-relaxed mt-1">Conexión directa con la base de datos nacional para validación en tiempo real.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <div>
                <h3 className="font-headline text-lg text-secondary-fixed">Firma Electrónica</h3>
                <p className="text-sm text-on-primary-container leading-relaxed mt-1">Cumplimiento total con la Ley de Firma Electrónica Avanzada.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-12 md:mt-24 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-secondary">info</span>
            <span className="text-xs uppercase tracking-widest font-semibold text-on-primary-container">Estado del Sistema</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-slate-300">Servidores Operativos</span>
          </div>
        </div>
      </aside>

    </main>
  );
}
