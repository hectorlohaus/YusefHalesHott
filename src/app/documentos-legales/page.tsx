import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0;

export default async function DocumentosLegalesPage() {
  const supabase = await createClient();
  const { data: documentos, error } = await supabase
    .from('documentos_institucionales')
    .select('*')
    .order('categoria', { ascending: true })
    .order('creado_en', { ascending: false });

  // Map icons
  const getIcon = (categoria: string) => {
    if (categoria === 'balances') return 'account_balance_wallet';
    if (categoria === 'intereses') return 'gavel';
    if (categoria === 'supervision') return 'policy';
    return 'description';
  };

  const getLabel = (categoria: string) => {
    if (categoria === 'balances') return 'Balances Anuales';
    if (categoria === 'intereses') return 'Declaraciones de Intereses y Patrimonio';
    if (categoria === 'supervision') return 'Informes de Supervisión';
    return 'Documento';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="bg-[#005ab4] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-screen-xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight mb-4">Documentos Legales e Institucionales</h1>
          <p className="font-body text-lg text-blue-100 max-w-2xl mx-auto">
            Acceso público a balances, declaraciones de intereses y reportes de supervisión de la Notaría.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-12 w-full">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl shadow-sm">
            <p className="text-red-700 font-body text-sm font-medium">Ocurrió un error al cargar la información.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos?.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md group relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-slate-100/50 group-hover:scale-[2.5] transition-transform duration-500 z-0"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl flex-shrink-0 bg-slate-50 text-slate-500 group-hover:bg-[#005ab4]/10 group-hover:text-[#005ab4] transition-colors">
                    <span className="material-symbols-outlined text-[24px]">{getIcon(doc.categoria)}</span>
                  </div>
                  <div>
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[#005ab4]">{getLabel(doc.categoria)}</span>
                  </div>
                </div>
                
                <h3 className="font-headline font-bold text-lg text-slate-900 mb-2 leading-snug line-clamp-2">{doc.titulo}</h3>
                
                <div className="font-body text-sm text-slate-500 flex items-center gap-2 mt-4">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {new Date(doc.actualizado_en).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 relative z-10 flex justify-end">
                <a 
                  href={doc.url_archivo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-[#005ab4] text-slate-600 hover:text-white font-label text-xs font-bold uppercase tracking-widest rounded-lg transition-colors border border-slate-200 hover:border-[#005ab4]"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span> Ver Documento
                </a>
              </div>
            </div>
          ))}

          {(!documentos || documentos.length === 0) && !error && (
             <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
                <span className="material-symbols-outlined text-slate-300 text-6xl mb-4 block">inventory_2</span>
                <p className="font-body text-lg font-medium text-slate-500">No hay documentos institucionales disponibles por el momento.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
