import { createClient } from '@/lib/supabase/server';
import ArancelesSearch from '@/components/ArancelesSearch';

export const revalidate = 3600;

export const metadata = {
  title: 'Precios y Aranceles | Notaría y Conservador Traiguén',
  description: 'Consulte nuestra lista actualizada de servicios notariales con transparencia total en cada trámite.',
};

export default async function ArancelesPage() {
  const supabase = await createClient();
  const { data: servicios, error } = await supabase
    .from('servicios')
    .select('id, titulo, arancel, arancel_texto, permite_pago_online, documentos_necesarios')
    .eq('activo', true)
    .order('titulo');

  return (
    <main className="pt-24 pb-24 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto">
      {/* Header Section */}
      <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="text-secondary font-semibold tracking-widest uppercase text-xs mb-4 block">Tarifario Vigente {new Date().getFullYear()}</span>
          <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-bold leading-tight mb-6">Precios y <br /><span className="text-secondary italic">Aranceles</span></h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
            Consulte los aranceles oficiales para nuestros servicios notariales. Valores expresados en Pesos Chilenos (CLP) conforme a la normativa legal vigente.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="p-6 bg-surface-container-low rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-secondary text-3xl">account_balance_wallet</span>
            <div>
              <div className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter">Métodos de Pago</div>
              <div className="text-sm font-medium">Débito, Crédito, Transferencia</div>
            </div>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="mb-8 flex items-center gap-3 bg-error-container p-4 rounded-xl">
          <p className="font-body text-sm text-on-error-container">Ocurrió un error al cargar los aranceles. Por favor, intente más tarde.</p>
        </div>
      )}

      {/* Search and Pricing Client Component */}
      <ArancelesSearch servicios={servicios || []} />

      {/* Footnotes / Legal Context */}
      <footer className="mt-20 grid md:grid-cols-3 gap-12 bg-surface-container-low p-10 rounded-3xl">
        <div className="space-y-4">
          <h4 className="font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">info</span> Consideraciones Legales
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Los valores presentados son referenciales para trámites estándar. Trámites complejos o que involucren mayor número de fojas pueden tener costos adicionales según el Decreto de Justicia respectivo.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">payments</span> Formas de Pago
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Aceptamos todas las tarjetas de crédito y débito a través de Getnet. Transferencias bancarias solo para trámites de Escritura Pública previa validación de presupuesto.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">support_agent</span> Soporte Presupuestario
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Si requiere un presupuesto formal para una empresa o trámite múltiple, contáctenos a <span className="text-secondary font-medium">contacto@notariatraiguen.cl</span> indicando el detalle de su requerimiento.
          </p>
        </div>
      </footer>
    </main>
  );
}
