import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SideNav from '@/components/admin/SideNav';

export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/administracion');
  }

  // Fetch the internal user profile to get roles and info
  const { data: perfil, error: perfilError } = await supabase
    .from('usuarios')
    .select('id, nombre, rol, email, auth_id')
    .eq('auth_id', user.id)
    .single();


  return (
    <div className="flex bg-[#f9f9ff] min-h-screen text-slate-800 antialiased font-inter">
      <SideNav perfil={perfil} />
      
      {/* Main Content Area */}
      <main className="pl-64 flex-1 flex flex-col w-full min-h-screen">
        {/* We keep the inner pad inside page.tsx so managers can handle full width lines if needed */}
        {children}
      </main>
    </div>
  );
}
