import RepertorioSearch from '@/components/RepertorioSearch';

export const metadata = {
  title: 'Consultar Repertorio Conservador | Notaría',
  description: 'Buscador público del Repertorio Conservador de la Notaría para consultas de inscripciones y registros.',
};

export default function RepertorioConservadorPage() {
  const columns = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'numero_inscripcion', label: 'N° Inscripción' },
    { key: 'interesado', label: 'Interesado' },
    { key: 'acto_o_contrato', label: 'Acto o Contrato' },
    { key: 'clase_inscripcion', label: 'Clase Inscripción' },
    { key: 'registro_parcial', label: 'Registro Parcial' },
  ];

  const searchFields = [
    { id: 'fecha_desde', label: 'Fecha Desde', type: 'date' },
    { id: 'fecha_hasta', label: 'Fecha Hasta', type: 'date' },
    { id: 'numero_inscripcion', label: 'N° Inscripción', type: 'text' },
    { id: 'interesado', label: 'Interesado', type: 'text' },
    { id: 'acto_o_contrato', label: 'Acto o Contrato', type: 'text' },
    { 
      id: 'registro_parcial', 
      label: 'Registro Parcial', 
      type: 'select', 
      options: ['Registro de Propiedad', 'Registro de Hipotecas y Gravamenes', 'Registro de Interdicciones y Prohibiciones', 'Registro de Comercio', 'Registro de Aguas'] 
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
            Repertorio Conservador
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Acceda a la información del Conservador de forma rápida y sencilla. 
            Realice búsquedas por número de inscripción, nombre del interesado o rango de fechas.
          </p>
        </header>

        <RepertorioSearch
          tableName="repertorio_conservador"
          title="Búsqueda Conservador"
          columns={columns}
          searchFields={searchFields}
          defaultSort={{ column: 'fecha', ascending: false }}
        />
      </div>
    </main>
  );
}
