import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ServiciosManager from '@/components/admin/ServiciosManager';
import EmpleadosManager from '@/components/admin/EmpleadosManager';
import SolicitudesManager from '@/components/admin/SolicitudesManager';
import ReportesManager from '@/components/admin/ReportesManager';
import ReclamosManager from '@/components/admin/ReclamosManager';
import DocumentosManager from '@/components/admin/DocumentosManager';

export const revalidate = 0; // Ensure fresh data on Dashboard load

export default async function DashboardPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || 'solicitudes';
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/administracion');
  }

  // Obtener ID y rol del usuario autenticado en tabla externa
  const { data: perfil } = await supabase.from('usuarios').select('id, rol').eq('auth_id', user.id).single();
  const rol = perfil?.rol || 'empleado';
  const profileId = perfil?.id || null;

  // Obtener Datos para CRUDs
  const [
    { data: servicios },
    { data: empleados },
    { data: solicitudes },
    { data: historial },
    { data: reclamos },
    { data: documentos }
  ] = await Promise.all([
    supabase.from('servicios').select('*').order('titulo'),
    supabase.from('usuarios').select('*').order('rol', { ascending: false }).order('nombre'),
    supabase.from('solicitudes').select(`
      *,
      servicio:servicios(titulo, arancel),
      empleado_asignado:usuarios!empleado_asignado_id(id, nombre),
      documentos_adjuntos(id, url_archivo, nombre_archivo)
    `).order('creado_en', { ascending: false }),
    activeTab === 'reportes' && (rol === 'notario' || rol === 'supervisor') 
      ? supabase.from('historial_solicitudes').select('*, usuario:usuarios(nombre)').order('creado_en', { ascending: false }) 
      : Promise.resolve({ data: [] }),
    activeTab === 'reclamos' && (rol === 'notario' || rol === 'supervisor')
      ? supabase.from('reclamos_sugerencias').select('*').order('creado_en', { ascending: false })
      : Promise.resolve({ data: [] }),
    activeTab === 'documentos' && rol === 'notario'
      ? supabase.from('documentos_institucionales').select('*').order('creado_en', { ascending: false })
      : Promise.resolve({ data: [] })
  ]);

  return (
    <div className="flex-1 w-full bg-[#f9f9ff]">
      {/* We let each manager handle its own padding so they can have edge-to-edge elements if they want, or we wrap everything in p-8 like the design */ }
      {activeTab === 'solicitudes' && <SolicitudesManager initialSolicitudes={solicitudes || []} servicios={servicios || []} currentUserId={profileId} currentUserRole={rol} />}
      
      {/* The following managers aren't redesigned yet, so we give them a generic padding container so they don't stick to the edges */}
      {activeTab === 'servicios' && (
        <div className="p-8">
           <ServiciosManager initialServicios={servicios || []} userRole={rol} />
        </div>
      )}
      
      {activeTab === 'empleados' && (
        <div className="p-8">
           <EmpleadosManager initialEmpleados={empleados || []} userRole={rol} />
        </div>
      )}

      {activeTab === 'reportes' && rol === 'notario' && (
        <div className="p-8">
           <ReportesManager 
             solicitudes={solicitudes || []} 
             historial={historial || []} 
             empleados={empleados || []} 
             servicios={servicios || []} 
           />
        </div>
      )}

      {activeTab === 'reclamos' && (rol === 'notario' || rol === 'supervisor') && (
        <div className="p-8">
           <ReclamosManager reclamos={reclamos || []} userRole={rol} />
        </div>
      )}

      {activeTab === 'documentos' && rol === 'notario' && (
        <div className="p-8">
           <DocumentosManager documentos={documentos || []} userRole={rol} />
        </div>
      )}
    </div>
  );
}
