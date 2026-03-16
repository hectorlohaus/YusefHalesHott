import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';

export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/administracion');
  }

  // Fetch the internal user profile to get roles and info
  const { data: perfil } = await supabase
    .from('usuarios')
    .select('id, nombre, rol, email')
    .eq('auth_id', user.id)
    .single();

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <DashboardNav perfil={perfil} />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}
