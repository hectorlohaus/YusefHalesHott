import { createClient } from '@/lib/supabase/server';
import ServiceSearch from '@/components/ServiceSearch';

export const revalidate = 0;

export default async function ServiciosPage() {
  const supabase = await createClient();
  const { data: servicios, error } = await supabase
    .from('servicios')
    .select('*')
    .eq('activo', true)
    .order('titulo');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-[#000080] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Trámites y Servicios</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Seleccione el trámite que desea realizar. Nuestro proceso es rápido y 100% online.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">Ocurrió un error al cargar los servicios.</p>
          </div>
        )}

        {servicios && servicios.length > 0 && (
          <ServiceSearch initialServicios={servicios} />
        )}
      </div>
    </div>
  );
}
