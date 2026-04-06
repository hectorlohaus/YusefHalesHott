'use client';

import { useState } from 'react';
import { login } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      router.push('/administracion/dashboard');
      router.refresh();
    } else {
      setErrorMsg(result.error || 'Error al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Error message */}
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
          <p className="font-body text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Email field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="font-label text-[11px] font-semibold uppercase tracking-wider text-slate-500 block"
        >
          Correo Electrónico
        </label>
        <div className="relative">
          <input
            required
            type="email"
            id="email"
            name="email"
            placeholder="usuario@notaria.cl"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005ab4]/20 focus:border-[#005ab4] transition-all font-body text-slate-900 placeholder:text-slate-300 text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="font-label text-[11px] font-semibold uppercase tracking-wider text-slate-500 block"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            required
            type="password"
            id="password"
            name="password"
            placeholder="••••••••••••"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005ab4]/20 focus:border-[#005ab4] transition-all font-body text-slate-900 placeholder:text-slate-300 text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full font-label text-[11px] uppercase tracking-[0.2em] font-bold py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 rounded-lg h-14 ${
          loading
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-[#001b3e] text-white hover:bg-[#005ab4] shadow-lg shadow-blue-900/10 active:scale-[0.99]'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Autenticando...</span>
          </>
        ) : (
          <>
            <span>Autenticar</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </>
        )}
      </button>

    </form>
  );
}
