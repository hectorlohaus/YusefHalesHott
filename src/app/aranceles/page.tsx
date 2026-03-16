import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0;

export default async function ArancelesPage() {
  const supabase = await createClient();
  const { data: servicios, error } = await supabase
    .from('servicios')
    .select('id, titulo, arancel')
    .eq('activo', true)
    .order('titulo');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-slate-100 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#000080] mb-4">Precios y Aranceles</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Listado oficial de precios para nuestros servicios notariales.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">Ocurrió un error al cargar los aranceles.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-[#000080] text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Trámite / Servicio
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">
                    Precio (CLP)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {servicios?.map((servicio) => (
                  <tr key={servicio.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-900 border-r border-slate-100">
                      {servicio.titulo}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-emerald-600 text-right border-r border-slate-100">
                      ${servicio.arancel?.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <Link 
                        href={`/solicitar?servicio=${servicio.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                      >
                        Solicitar
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {servicios?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      No hay información de aranceles disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            Los precios mostrados corresponden al arancel base de cada trámite. Dependiendo de las copias o carillas adicionales, el valor final podría variar ligeramente (lo cual será ajustado e informado internamente tras la solicitud).
          </p>
        </div>
      </div>
    </div>
  );
}
