import Link from 'next/link';
import Image from 'next/image';
import WelcomeModal from '@/components/WelcomeModal';
import { createClient } from '@/lib/supabase/server';
import { getHorarios } from '@/app/actions/horarios';

export const revalidate = 3600; // Revalidar cada hora

export default async function Home() {
  const supabase = await createClient();
  const { data: servicios } = await supabase
    .from('servicios')
    .select('id, titulo, descripcion, arancel, documentos_necesarios')
    .eq('activo', true)
    .limit(3);

  const horarios = await getHorarios();

  const cardImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD7xsDOmfU9gvN8GDn00rohTM4aBgx4rPwPIXUl4gr2EzSJ6Q7LTBR4GtMwp7zasmWp1paNyslFd_PHUetVbLlzud5tCj_8VxDZdZX9HJ8b_qmYB4zNOL71irePLr7iZFhXOvk1G7e59o6SjygOpDN48vyhsavCQCMx_6Qh3BhToaj0jWOMEQJYnkUIMm8Hb3Am7VKXrEY1VzgHVXvevnD4cnJahzw9QysMTBu6Kumb6wd6XXIxlxrk2u-cps-LIhYzHCDu1iyKPA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCREF9S-hek1HfnDHB1a7seoU4xUvmHVCPS9dzqLGsmqxLpFdd39CX2iEtENvYli9uACo0ZNd0DIEHvJ6AEqufEtTkPSoxQKtZyV2hAne0i2RVqF649O6zS0fRrRmC2kIbH-kTYlPdlf4C58gmFYVittdfTJcNjmBnOgdos7_A1UZhSoVavNZktPC1Hbiq5U4xi4JAzXZLkyVEJyYlISmtfuAXuLxqYALcQfnb_Y0ZQL8-BjhcEQk07VSbamriQaQ_SEPRnj3WTJA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCj7aasmZ83B8H9uljeF0KeDW8eMPFv87x_bthtx_wzq5PsanwFp6UHK9p60HnjKyMR_9b3S5CrX7xbwE-Fo7RxEc_QO9iZnjOA0lOJST7y2ri_6VVbODaJodCtm_S6kS324ZrBGTwpcwUrsPtrXhIXmyKZSUmRRM1U5WRIZ1Rn7nG5j4qb_GdcQh3r8HT6kSWTPSWOjogs5xXxBpE5cYZwGZgjaiEQpNFUMpYtlnxUiqs_t2Ad0hfuRp6d_ctrIr7qt5BtDsO2Xg"
  ];

  return (
    <>
      <WelcomeModal horarios={horarios} />
      <main>
        {/* Hero Section: Slide 1 (Split View) */}
        <section className="relative h-[870px] flex items-center overflow-hidden bg-primary-container text-white">
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-full overflow-hidden">
              <Image className="w-full h-full object-cover opacity-30 md:opacity-60 grayscale hover:grayscale-0 transition-all duration-700" alt="Exterior neoclásico de la notaría" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUJABwnaMon5ECpBiHMLqPPUSUWmwzQoDh7yCun5Fv7bMnYCURYjfVGsOT8ugTFbubQo5MoDRlD1eBi1DTw3vKutJW33AqMrzNKykImeIusk_wJp9m0XyL_v6n_11xBK1C5qrV23IADr4I49-CKIga_EbSeKxe-FiE3wcEGYmu41alxvuDd4Q63C_0N44ebSmiuHZCDbG9jfW0dOnJ1-xleWK9iaUAe9DrWpHb2-vVWmi0bDvemooeuB8CiFplRfON53yCqch_KA" fill sizes="50vw" priority unoptimized />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-container to-transparent opacity-80"></div>
            </div>
            <div className="relative h-full overflow-hidden hidden md:block">
              <Image className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" alt="Interior moderno de oficina legal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlo2L9wHo7yVl5GjGUrmt2JrVta9xmh5gpc-AKpOqczQf44k7V6ZbZAVAJRtyaEpupQgrvi_USFrKAu6SZeg1N8usOjf4DAfBie4te8tq4kgZpwNF75KWw_DwaeaaUIqBR6VlXYnRBBVdzoZCVAJA5dsIQuASMNEaBlnQq4FWMRoj12q_G-P72lp8bD6uwgSpjG6OTrWHChMlkB_VJphV5XrB1NLTzI7okxSk2T3EbWa4IApmKeS5jbgJB6RNw60lzykEpRwTNmQ" fill sizes="50vw" priority unoptimized />
              <div className="absolute inset-0 bg-gradient-to-l from-primary-container to-transparent opacity-80"></div>
            </div>
          </div>
          <div className="relative z-10 max-w-screen-xl mx-auto px-8 w-full text-center">
            <h1 className="font-headline text-5xl md:text-7xl text-slate-50 leading-tight tracking-tight mb-8">
              Trámites Notariales <br/>
              <span className="text-secondary italic">a un clic de distancia</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 font-light">
              Fusionamos la tradición legal con la agilidad digital para ofrecerle seguridad jurídica en tiempo récord.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/servicios" className="bg-secondary text-on-secondary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-on-secondary-container transition-all">
                Iniciar Trámite Online
              </Link>
              <Link href="/aranceles" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all">
                Ver Aranceles
              </Link>
            </div>
          </div>
        </section>
        
        {/* Slide 2: Digital Advantages (Asymmetric Bento) */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 p-12 bg-surface-container-low rounded-xl flex flex-col justify-center">
                <h2 className="font-headline text-4xl mb-6 text-on-surface">La nueva era de la <span className="text-secondary">Fe Pública</span></h2>
                <p className="text-on-surface-variant">Optimizamos cada proceso para que su tiempo sea la prioridad, manteniendo los más altos estándares legales.</p>
              </div>
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-surface-container-highest rounded-xl flex flex-col items-start hover:shadow-lg transition-shadow">
                  <span className="material-symbols-outlined text-secondary text-4xl mb-4">security</span>
                  <h3 className="font-headline text-xl mb-2 text-on-surface">100% Digital &amp; Seguro</h3>
                  <p className="text-sm text-on-surface-variant">Firmas electrónicas avanzadas y encriptación de grado militar en cada documento.</p>
                </div>
                <div className="p-8 bg-primary-container text-white rounded-xl flex flex-col items-start">
                  <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">bolt</span>
                  <h3 className="font-headline text-xl mb-2 text-white">Procesamiento Veloz</h3>
                  <p className="text-sm text-slate-400">Reducción del 70% en tiempos de espera comparado con notarías tradicionales.</p>
                </div>
                <div className="p-8 bg-surface-container-low rounded-xl flex flex-col items-start border border-outline-variant/10">
                  <span className="material-symbols-outlined text-secondary text-4xl mb-4">verified_user</span>
                  <h3 className="font-headline text-xl mb-2 text-on-surface">Respaldo Legal</h3>
                  <p className="text-sm text-on-surface-variant">Garantía jurídica total bajo la normativa vigente de la República de Chile.</p>
                </div>
                <div className="p-8 bg-surface-container-highest rounded-xl flex flex-col items-start">
                  <span className="material-symbols-outlined text-secondary text-4xl mb-4">cloud_done</span>
                  <h3 className="font-headline text-xl mb-2 text-on-surface">Acceso Permanente</h3>
                  <p className="text-sm text-on-surface-variant">Su repositorio digital disponible las 24 horas, desde cualquier lugar del mundo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: Requested Services (Horizontal Pacing) */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-screen-xl mx-auto px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-secondary font-semibold uppercase tracking-widest text-xs">Servicios Destacados</span>
                <h2 className="font-headline text-4xl mt-2 text-on-surface">Trámites más Solicitados</h2>
              </div>
              <Link className="text-on-surface-variant font-medium flex items-center gap-2 hover:text-secondary transition-colors" href="/servicios">
                Ver todo el catálogo <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servicios?.map((servicio) => {
                const requisitos = servicio.documentos_necesarios 
                  ? servicio.documentos_necesarios.split(',').map((r: string) => r.trim()).filter(Boolean)
                  : [];
                
                return (
                  <div
                    key={servicio.id}
                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group"
                  >
                    {/* Card body */}
                    <div className="p-8 flex flex-col flex-grow">
                      {/* Icon only */}
                      <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 mb-5 group-hover:bg-primary/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>

                      {/* Title */}
                      <h2 className="font-headline text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-snug">
                        {servicio.titulo}
                      </h2>

                      {/* Descripcion Corta */}
                      {servicio.descripcion && (
                        <p className="font-body text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                          {servicio.descripcion}
                        </p>
                      )}

                      {/* Requisitos */}
                      {requisitos.length > 0 && (
                        <div className="mt-auto pt-4">
                          <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/70 mb-2">
                            Requisitos Clave
                          </p>
                          <ul className="space-y-1">
                            {requisitos.slice(0, 3).map((req: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                                <span className="font-body text-sm italic text-on-surface-variant leading-snug line-clamp-1">{req}</span>
                              </li>
                            ))}
                            {requisitos.length > 3 && (
                              <li className="font-body text-[10px] text-primary font-medium pt-1 italic">
                                + {requisitos.length - 3} más...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Card footer — precio + acción */}
                    <div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/70 mb-0.5">Arancel</p>
                        <p className="font-label font-bold text-lg tabular-nums text-on-surface">
                          {servicio.arancel ? `$\u00a0${servicio.arancel.toLocaleString('es-CL')}` : '—'}
                        </p>
                      </div>
                      <Link href={`/solicitar?servicio=${servicio.id}`} className="text-[10px] font-label font-bold uppercase tracking-widest text-primary flex items-center gap-1 transition-all">
                        Gestionar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Registro Público Digital (Dark Section) */}
        <section className="py-24 bg-primary-container text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 blur-[120px] -mr-40 pointer-events-none"></div>
          <div className="max-w-screen-xl mx-auto px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-secondary-container font-medium text-sm tracking-[0.2em] uppercase">Ecosistema Legal</span>
                <h2 className="font-headline text-5xl mt-6 mb-8 leading-tight">Registro Público <br/> <span className="text-secondary-container">Digital</span></h2>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                  Acceda de forma directa a las plataformas de validación y repositorios oficiales. Transparencia y trazabilidad en cada instrumento público emitido por nuestra notaría.
                </p>
                <div className="space-y-6">
                  <Link className="group flex items-center justify-between p-6 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-secondary-container/50 transition-all" href="/repertorio-conservador">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary-container">
                        <span className="material-symbols-outlined">account_balance</span>
                      </div>
                      <div>
                    <h4 className="font-semibold text-lg">Repertorio Conservador</h4>
                        <p className="text-sm text-slate-500">Consulta de inscripciones y gravámenes</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-700 group-hover:text-secondary-container transition-colors">open_in_new</span>
                  </Link>
                  <Link className="group flex items-center justify-between p-6 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-secondary-container/50 transition-all" href="/repertorio-instrumentos">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary-container">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Repositorio de Instrumentos</h4>
                        <p className="text-sm text-slate-500">Validación de firmas y copias digitales</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-700 group-hover:text-secondary-container transition-colors">open_in_new</span>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-800 shadow-2xl relative">
                  {/* Visual representation of "Digital Registry" */}
                  <div className="h-full w-full bg-slate-950/40 rounded-2xl flex flex-col p-6 overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                    </div>
                    <div className="space-y-4 opacity-50">
                      <div className="h-4 bg-slate-800 rounded-full w-3/4"></div>
                      <div className="h-4 bg-slate-800 rounded-full w-full"></div>
                      <div className="h-4 bg-slate-800 rounded-full w-5/6"></div>
                      <div className="h-24 bg-slate-900 rounded-xl w-full border border-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-700 text-4xl">barcode_scanner</span>
                      </div>
                      <div className="h-4 bg-slate-800 rounded-full w-2/3"></div>
                      <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
                    </div>
                    <div className="mt-auto pt-8 border-t border-slate-800 flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-lg bg-secondary/20"></div>
                        <div className="w-10 h-10 rounded-lg bg-slate-800"></div>
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono tracking-tighter">CERTIFICATE_ID: 992-TX-2024</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
