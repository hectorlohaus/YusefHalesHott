import RepertorioSearch from '@/components/RepertorioSearch';

export const metadata = {
  title: 'Consultar Repertorio de Instrumentos Públicos | Notaría',
  description: 'Buscador público de escrituras y repertorios de instrumentos públicos de la Notaría.',
};

export default function RepertorioInstrumentosPage() {
  const columns = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'n_rep', label: 'N° Repertorio' },
    { key: 'contratante_1', label: 'Contratante 1', composite: ['contratante_1_nombre', 'contratante_1_apellido'] },
    { key: 'contratante_2', label: 'Contratante 2', composite: ['contratante_2_nombre', 'contratante_2_apellido'] },
    { key: 'acto_o_contrato', label: 'Acto o Contrato' },
    { key: 'abogado_redactor', label: 'Abogado Redactor' },
  ];

  const searchFields = [
    { id: 'fecha_desde', label: 'Fecha Desde', type: 'date' },
    { id: 'fecha_hasta', label: 'Fecha Hasta', type: 'date' },
    { id: 'n_rep', label: 'N° Repertorio', type: 'text' },
    { id: 'contratante_1', label: 'Contratante 1 (Nombre o Apellido)', type: 'text', searchIn: ['contratante_1_nombre', 'contratante_1_apellido'] },
    { id: 'contratante_2', label: 'Contratante 2 (Nombre o Apellido)', type: 'text', searchIn: ['contratante_2_nombre', 'contratante_2_apellido'] },
    { id: 'acto_o_contrato', label: 'Acto o Contrato', type: 'text' },
    { id: 'abogado_redactor', label: 'Abogado Redactor', type: 'text' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
            Repertorio de Instrumentos Públicos
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Utilice nuestro buscador para consultar registros de escrituras públicas. 
            La información mostrada es de carácter público y referencial.
          </p>
        </header>

        <RepertorioSearch
          tableName="repertorio_instrumentos"
          title="Búsqueda de Instrumentos"
          columns={columns}
          searchFields={searchFields}
          defaultSort={{ column: 'fecha', ascending: false }}
        />
      </div>
    </main>
  );
}
