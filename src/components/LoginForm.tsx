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
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
        <input 
          required 
          type="email" 
          id="email" 
          name="email" 
          placeholder="usuario@notaria.cl"
          className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border" 
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
        <input 
          required 
          type="password" 
          id="password" 
          name="password" 
          placeholder="••••••••"
          className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border" 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-2.5 px-4 text-white font-medium rounded-lg transition-colors ${
          loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#000080] hover:bg-blue-800'
        }`}
      >
        {loading ? 'Iniciando sesión...' : 'Ingresar'}
      </button>
    </form>
  );
}
