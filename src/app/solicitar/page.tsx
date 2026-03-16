import { createClient } from '@/lib/supabase/server';
import SolicitudForm from '@/components/SolicitudForm';

export default async function SolicitarPage(props: { searchParams: Promise<{ servicio?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: servicios, error } = await supabase
    .from('servicios')
    .select('id, titulo, arancel, documentos_necesarios')
    .eq('activo', true)
    .order('titulo');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-[#000080] mb-2">Solicitar Trámite Notarial</h1>
          <p className="text-slate-600">
            Complete el siguiente formulario. Asegúrese de ingresar sus datos correctamente para poder contactarle.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#000080]"></div>
          
          {error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">Error al cargar los servicios. Por favor, intente más tarde.</p>
            </div>
          ) : (
            <SolicitudForm servicios={servicios || []} preselectedId={searchParams.servicio} />
          )}
        </div>
      </div>
    </div>
  );
}
