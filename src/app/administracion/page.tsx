import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/administracion/dashboard');
  }

  return (
    <div className="flex-grow flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">

      {/* ── LEFT: Branding panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center p-20 xl:p-24 text-white"
        style={{ background: 'linear-gradient(135deg, #001b3e 0%, #00458d 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] border border-white rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-white rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-lg">
          <div className="w-14 h-0.5 bg-blue-300 mb-8" />
          <h2 className="font-headline text-5xl font-light leading-tight mb-6 text-white">
            Custodia y Legalidad Digital
          </h2>
          <p className="text-blue-200 text-lg font-light leading-relaxed opacity-90 max-w-md">
            Bienvenido al portal seguro de gestión notarial. Nuestra plataforma garantiza
            la integridad de sus archivos bajo los estándares más estrictos de seguridad jurídica.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 pt-12 mt-8 border-t border-white/10">
            <div>
              <span className="font-label block text-[10px] uppercase tracking-widest text-blue-300 mb-2">
                Auditoría
              </span>
              <p className="text-sm font-light text-white/80">Trazabilidad completa de registros</p>
            </div>
            <div>
              <span className="font-label block text-[10px] uppercase tracking-widest text-blue-300 mb-2">
                Fe Pública
              </span>
              <p className="text-sm font-light text-white/80">Documentos con validez jurídica plena</p>
            </div>
          </div>
        </div>

        {/* Bottom brand badge */}
        <div className="absolute bottom-12 left-20 xl:left-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3" />
              </svg>
            </div>
            <span className="font-label text-[10px] uppercase tracking-widest text-white/60">
              Notaría y Conservador Traiguén
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Login form ── */}
      <div
        className="flex-grow flex items-center justify-center p-6 sm:p-10"
        style={{
          backgroundColor: '#fcfcfd',
          backgroundImage:
            'linear-gradient(rgba(224,226,236,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(224,226,236,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-slate-100 rounded-xl">

            {/* Mobile header */}
            <div className="lg:hidden text-center mb-10">
              <span className="font-label text-[10px] uppercase tracking-widest text-slate-400 block mb-1">
                Notaría y Conservador Traiguén
              </span>
              <h1 className="font-headline text-3xl font-bold text-slate-900">Acceso Administrativo</h1>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-10">
              <h2 className="font-headline text-[28px] font-bold text-slate-900 leading-tight mb-2">
                Acceso Administrativo
              </h2>
              <p className="font-body text-slate-500 text-sm">
                Por favor, identifíquese para gestionar la oficina virtual.
              </p>
            </div>

            {/* The actual form with logic */}
            <LoginForm />

            {/* Security badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-6">
              <div className="flex items-center gap-1.5 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="font-label text-[9px] uppercase tracking-widest">SSL Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
                <span className="font-label text-[9px] uppercase tracking-widest">Auth v2</span>
              </div>
            </div>

          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="font-label text-[11px] uppercase tracking-widest text-slate-400 hover:text-[#005ab4] transition-colors"
            >
              ← Volver al Portal Público
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
