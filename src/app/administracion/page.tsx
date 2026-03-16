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
    <div className="flex flex-col min-h-[80vh] bg-slate-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-[#000080]">Acceso Restringido</h2>
          <p className="mt-2 text-slate-600">Sistema de Administración Interno - Notaría Traiguén</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10">
          <LoginForm />
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-[#000080] font-medium">
            &larr; Volver al Portal Público
          </Link>
        </div>
      </div>
    </div>
  );
}
