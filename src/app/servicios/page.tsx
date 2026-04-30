import { createClient } from '@/lib/supabase/server';
import ServiceSearch from '@/components/ServiceSearch';

export const revalidate = 3600;

export const metadata = {
  title: 'Trámites y Servicios | Notaría y Conservador Traiguén',
  description:
    'Catálogo de trámites y servicios notariales con aranceles y requisitos. Solicite en línea de forma rápida y segura.',
};

export default async function ServiciosPage() {
  const supabase = await createClient();
  const { data: servicios, error } = await supabase
    .from('servicios')
    .select('id, titulo, descripcion, arancel, arancel_texto, permite_pago_online, documentos_necesarios')
    .eq('activo', true)
    .order('titulo');

  if (error) {
    return (
      <main className="bg-background min-h-screen pt-32 px-8">
        <div className="bg-error-container text-on-error-container p-4 rounded-xl max-w-3xl mx-auto">
          Ocurrió un error al cargar los servicios.
        </div>
      </main>
    );
  }

  return (
    <>
      <ServiceSearch initialServicios={servicios || []} />
    </>
  );
}
