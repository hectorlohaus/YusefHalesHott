import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardTabs from '@/components/admin/DashboardTabs';

export const revalidate = 0; // Ensure fresh data on Dashboard load

export default async function DashboardPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || 'solicitudes';
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/administracion');
  }

  // Obtener rol del usuario autenticado
  const { data: perfil } = await supabase.from('usuarios').select('rol').eq('auth_id', user.id).single();
  const rol = perfil?.rol || 'empleado';

  // Obtener Datos para CRUDs
  const [
    { data: servicios },
    { data: empleados },
    { data: solicitudes }
  ] = await Promise.all([
    supabase.from('servicios').select('*').order('titulo'),
    supabase.from('usuarios').select('*').order('rol', { ascending: false }).order('nombre'),
    supabase.from('solicitudes').select(`
      *,
      servicio:servicios(titulo),
      documentos_adjuntos(id, url_archivo, nombre_archivo)
    `).order('creado_en', { ascending: false })
  ]);

  return (
    <div className="pb-12 h-full flex flex-col w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <DashboardTabs 
        activeTab={activeTab} 
        solicitudes={solicitudes || []} 
        servicios={servicios || []} 
        empleados={empleados || []} 
        rol={rol} 
      />
    </div>
  );
}
