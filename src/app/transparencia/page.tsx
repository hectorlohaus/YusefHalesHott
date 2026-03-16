import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function TransparenciaPage() {
  const supabase = await createClient();
  const { data: empleados, error } = await supabase
    .from('usuarios')
    .select('nombre, rol, sueldo')
    .eq('activo', true)
    .order('rol', { ascending: false }) // 'notario' usually sorts after 'empleado', so descending puts Notario first
    .order('nombre', { ascending: true });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="bg-[#000080] py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Portal de Transparencia</h1>
          <p className="text-blue-200">
            En línea con nuestro compromiso de probidad y transparencia institucional, publicamos la nómina de funcionarios y sus respectivas remuneraciones brutas.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">Ocurrió un error al cargar la información de transparencia.</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg leading-6 font-medium text-slate-900 font-serif">
              Nómina de Personal
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Personal activo en la Notaría Traiguén correspondiente al período actual.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-[#000080] text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Nombre del Funcionario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Cargo / Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-sm font-semibold tracking-wider">
                    Remuneración Mensual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {empleados?.map((empleado, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {empleado.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                      {empleado.rol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900">
                      ${empleado.sueldo?.toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
                
                {empleados?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Información temporalmente no disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
