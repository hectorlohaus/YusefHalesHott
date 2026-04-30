'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Servicio = {
  id: string;
  titulo: string;
  descripcion: string | null;
  arancel: number | null;
  arancel_texto: string | null;
  permite_pago_online: boolean;
  documentos_necesarios: string | null;
};

// Format price Chilean style
function formatPrice(n: number | null) {
  if (!n && n !== 0) return '—';
  return `$\u00a0${n.toLocaleString('es-CL')}`;
}

// Parse comma-separated requisitos
function parseRequisitos(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);
}

export default function ServiceSearch({
  initialServicios,
}: {
  initialServicios: Servicio[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'presencial'>('all');
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedServicio(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedServicio) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedServicio]);

  const filtered = initialServicios.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = s.titulo.toLowerCase().includes(term) || (s.descripcion ?? '').toLowerCase().includes(term);
    const matchesFilter = filterType === 'all' || (filterType === 'online' && s.permite_pago_online) || (filterType === 'presencial' && !s.permite_pago_online);
    return matchesSearch && matchesFilter;
  });

  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    setVisibleCount(9);
  }, [searchTerm, filterType]);

  const visibleItems = filtered.slice(0, visibleCount);

  return (
    <>
      <div className="bg-background font-body text-on-surface overflow-x-hidden">
        
        {/* Hero Section */}
        <header className="relative pt-24 pb-12 overflow-hidden bg-primary-container">
          <div className="absolute inset-0 opacity-20">
            <Image className="w-full h-full object-cover" alt="Arquitectura moderna" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo8GMyNd1Wh4hJnZ1Ausmb_FDqnyyxGr0eyj9NCDhrNQb_cOTNOB88l5q-rbNdYVBckdARd3x0GnGZ7NHkRoBfuzzVsX-MUM6z54Jk45XkW2dvWVbGz4-NO7cbAyx_UDW7jqDJnGZHnUQnLuzCEUNs34TNrinNRfCRqg4MYX5Su2RgqZOZrCQusQple7YAhNmgCB_vUdXMhXoYVnNE6FqRw_z1vZCDsKmsXiLnyZwRfTBwAy2D7ktENj3dhbP5JxEc2vCMHIkCKQ" fill sizes="100vw" priority />
          </div>
          <div className="relative max-w-7xl mx-auto px-8 flex flex-col items-start">
            <h1 className="font-headline text-5xl md:text-6xl text-slate-50 tracking-tight leading-tight max-w-2xl mb-4">
              Trámites y Servicios
            </h1>
            <p className="font-body text-slate-300 text-lg max-w-xl mb-8"><span style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>Encuentre y gestione sus trámites notariales con la precisión que exige la ley y la agilidad de la era digital.</span></p>

            {/* Search Bar */}
            <div className="w-full max-w-3xl relative flex items-center bg-surface-container-lowest rounded-xl shadow-2xl shadow-black/20 p-2 focus-within:ring-2 focus-within:ring-secondary transition-all">
              <div className="flex-grow relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-primary-container">search</span>
                </div>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-on-surface border-none focus:ring-0 outline-none text-lg" 
                  placeholder="¿Qué trámite necesita realizar hoy?" 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors active:scale-95 duration-200"
                onClick={(e) => e.preventDefault()}
              >
                Buscar
              </button>
            </div>
          </div>
        </header>

        {/* Services Grid */}
        <main className="max-w-7xl mx-auto px-8 py-24">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="font-headline text-2xl font-bold text-on-surface">Catálogo de Servicios</h2>
            <div className="flex bg-surface-container-low p-1.5 rounded-xl shadow-sm border border-outline-variant/20 w-full sm:w-auto overflow-x-auto">
              <button 
                onClick={() => setFilterType('all')} 
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-label font-bold uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilterType('online')} 
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-label font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${filterType === 'online' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'}`}
              >
                <span className="material-symbols-outlined text-[16px]">language</span>
                Online
              </button>
              <button 
                onClick={() => setFilterType('presencial')} 
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-label font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${filterType === 'presencial' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'}`}
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                Presencial
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
              <p className="font-body text-on-surface-variant">No se encontraron trámites para su búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleItems.map((servicio) => {
                const requisitos = parseRequisitos(servicio.documentos_necesarios);
                let iconName = "history_edu"; // default icon
                let t = servicio.titulo.toLowerCase();
                if (t.includes("inmueble") || t.includes("propiedad") || t.includes("venta")) iconName = "home_work";
                else if (t.includes("vehícul") || t.includes("transferencia")) iconName = "directions_car";
                else if (t.includes("poder") || t.includes("mandato")) iconName = "gavel";
                else if (t.includes("sociedad") || t.includes("empresa")) iconName = "business";
                else if (t.includes("testamento")) iconName = "shield_with_heart";

                return (
                  <div 
                    key={servicio.id}
                    onClick={() => setSelectedServicio(servicio)}
                    className="group bg-surface-container-lowest p-8 rounded-xl transition-all duration-300 hover:translate-y-[-4px] border border-outline-variant/10 cursor-pointer flex flex-col"
                  >
                    <div className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-xl mb-6 group-hover:bg-secondary-container transition-colors shrink-0">
                      <span className="material-symbols-outlined text-secondary text-3xl group-hover:text-on-secondary-container">{iconName}</span>
                    </div>
                    <h3 className="font-headline text-2xl text-on-surface mb-3 flex-grow">{servicio.titulo}</h3>
                    {servicio.descripcion && (
                      <p className="text-on-surface-variant mb-6 text-sm leading-relaxed line-clamp-2">
                        {servicio.descripcion}
                      </p>
                    )}
                    {requisitos.length > 0 && (
                      <div className="mb-8">
                        <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/70 mb-2">
                          Requisitos Clave
                        </p>
                        <ul className="space-y-1">
                          {requisitos.slice(0, 3).map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                              <span className="font-body text-sm italic text-on-surface-variant leading-snug line-clamp-1">{req}</span>
                            </li>
                          ))}
                          {requisitos.length > 3 && (
                            <li className="font-body text-[10px] text-primary font-medium pt-1 italic">
                              + {requisitos.length - 3} documento(s) más...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10 mt-auto gap-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-secondary truncate max-w-[50%]">
                        {servicio.arancel_texto || (servicio.arancel ? `Desde $${servicio.arancel.toLocaleString('es-CL')}` : 'Consultar')}
                      </span>
                      {servicio.permite_pago_online ? (
                        <button className="flex items-center gap-2 text-on-surface font-semibold group/btn text-sm whitespace-nowrap">
                          Iniciar Trámite 
                          <span className="material-symbols-outlined text-secondary transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-on-surface-variant font-semibold text-xs bg-surface-variant/50 px-2 py-1 rounded-md">
                          <span className="material-symbols-outlined text-[14px]">storefront</span> Presencial
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length > visibleCount && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="bg-surface-container-high hover:bg-surface-variant text-on-surface py-3 px-8 rounded-full font-bold text-sm transition-colors border border-outline-variant/10 shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-secondary">expand_more</span>
                Ver más trámites
              </button>
            </div>
          )}
        </main>

        {/* FAQ Section */}
        <section className="bg-surface-container-low py-32">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="font-headline text-4xl text-on-surface mb-16 text-center">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              {/* Accordion Item 1 */}
              <div 
                className="bg-surface-container-lowest p-6 rounded-xl cursor-pointer group"
                onClick={(e) => {
                  const content = e.currentTarget.querySelector('.accordion-content');
                  const icon = e.currentTarget.querySelector('.accordion-icon');
                  if (content && icon) {
                    content.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">¿Cómo se realiza el pago de los trámites?</span>
                  <span className="material-symbols-outlined text-secondary accordion-icon transition-transform duration-300">expand_more</span>
                </div>
                <div className="accordion-content mt-4 text-on-surface-variant text-sm leading-relaxed hidden border-t border-outline-variant/10 pt-4">
                  Los trámites se pagan de forma online a través de nuestra plataforma web de pagos seguros (Webpay) tras generar su solicitud, permitiéndole ahorrar tiempo al iniciar la gestión de su documento directamente desde nuestro portal.
                </div>
              </div>
              
              {/* Accordion Item 2 */}
              <div 
                className="bg-surface-container-lowest p-6 rounded-xl cursor-pointer group"
                onClick={(e) => {
                  const content = e.currentTarget.querySelector('.accordion-content');
                  const icon = e.currentTarget.querySelector('.accordion-icon');
                  if (content && icon) {
                    content.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">¿Cómo debo enviar mis datos o documentos previos?</span>
                  <span className="material-symbols-outlined text-secondary accordion-icon transition-transform duration-300">expand_more</span>
                </div>
                <div className="accordion-content mt-4 text-on-surface-variant text-sm leading-relaxed hidden border-t border-outline-variant/10 pt-4">
                  Una vez completado y confirmado el pago online de su trámite, usted deberá enviarnos todos los datos y antecedentes necesarios a través de un correo electrónico directamente al departamento de informaciones de la Notaría.
                </div>
              </div>
              
              {/* Accordion Item 3 */}
              <div 
                className="bg-surface-container-lowest p-6 rounded-xl cursor-pointer group"
                onClick={(e) => {
                  const content = e.currentTarget.querySelector('.accordion-content');
                  const icon = e.currentTarget.querySelector('.accordion-icon');
                  if (content && icon) {
                    content.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">¿Es necesario acudir físicamente a la notaría?</span>
                  <span className="material-symbols-outlined text-secondary accordion-icon transition-transform duration-300">expand_more</span>
                </div>
                <div className="accordion-content mt-4 text-on-surface-variant text-sm leading-relaxed hidden border-t border-outline-variant/10 pt-4">
                  Sí. A pesar de que la solicitud, el pago y el envío de antecedentes se realizan totalmente a distancia vía electrónica, <strong>siempre es necesario acudir presencialmente</strong> a nuestras oficinas ubicadas en la Notaría única y exclusivamente para la entrega certificada y firma personal de los documentos legales que correspondan.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── MODAL DE DETALLES ── */}
      {selectedServicio && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedServicio(null)}
          />
          
          {/* Modal Content container */}
          <div className="bg-surface w-full max-w-5xl relative shadow-2xl rounded-3xl ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 fade-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSelectedServicio(null)}
              className="absolute top-6 right-6 z-20 p-2 bg-on-surface/5 hover:bg-on-surface/10 rounded-full transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface-variant group-active:scale-95 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header / Accent top */}
            <div className="h-2 w-full bg-primary" />

            <div className="p-6 sm:p-10 lg:p-14 overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex items-start gap-5 mb-8 pb-8 border-b border-outline-variant/10">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-3xl">history_edu</span>
                </div>
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-label text-[10px] uppercase tracking-[0.1em] font-bold rounded-full mb-3">
                    Catálogo Notarial
                  </span>
                  <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
                    {selectedServicio.titulo}
                  </h1>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                
                {/* Left Column: Info & Requisitos */}
                <div className="flex-1 space-y-8">
                  {/* Description */}
                  <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
                    <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-sm">info</span> Acerca del Trámite
                    </h3>
                    <p className="font-body text-base text-on-surface leading-relaxed">
                      {selectedServicio.descripcion || 'Este trámite no cuenta con una descripción detallada en este momento. Puede consultar directamente en notaría para más información.'}
                    </p>
                  </div>

                  {/* Requisitos */}
                  <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6">
                    <h3 className="font-label text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-sm">assignment</span> Requisitos Obligatorios
                    </h3>
                    {selectedServicio.documentos_necesarios ? (
                      <ul className="space-y-4">
                        {parseRequisitos(selectedServicio.documentos_necesarios).map((req, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary mt-0.5 text-lg">check_circle</span>
                            <span className="font-body text-sm text-on-surface-variant leading-relaxed pt-0.5">{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex items-center gap-3 text-on-surface-variant/70 italic p-4 bg-surface-container-low rounded-xl">
                        <span className="material-symbols-outlined">description</span>
                        <p className="font-body text-sm">Este trámite no requiere documentación especial obligatoria.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Arancel & Action */}
                <div className="w-full lg:w-96 shrink-0 space-y-6">
                  {/* Tarjeta de Arancel */}
                  <div className="bg-surface-container-low p-6 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                    <div className="relative z-10">
                      <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">payments</span> Valor Referencial
                      </h3>
                      <div className="mb-4">
                        {selectedServicio.arancel_texto ? (
                          <p className="font-headline text-2xl font-bold text-on-surface leading-tight">
                            {selectedServicio.arancel_texto}
                          </p>
                        ) : (
                          <p className="font-headline text-4xl font-bold text-on-surface tabular-nums">
                            {formatPrice(selectedServicio.arancel)}
                          </p>
                        )}
                      </div>
                      <div className="h-[1px] w-full bg-outline-variant/20 my-4"></div>
                      <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                        {selectedServicio.permite_pago_online 
                          ? 'Los precios referenciales pueden estar sujetos a variaciones menores dependiendo de la complejidad específica del documento.'
                          : 'El valor exacto de este trámite debe ser cotizado presencialmente de acuerdo a sus antecedentes.'}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-3">
                    {selectedServicio.permite_pago_online ? (
                      <Link
                        href={`/solicitar?servicio=${selectedServicio.id}`}
                        className="w-full bg-primary text-on-primary py-4 rounded-xl font-body font-bold text-sm flex items-center justify-center gap-2 hover:bg-tertiary transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_task</span>
                        Iniciar Trámite Ahora
                      </Link>
                    ) : (
                      <div className="w-full bg-surface-container text-on-surface-variant py-4 px-4 rounded-xl font-body font-medium text-sm flex flex-col items-center justify-center gap-2 border border-outline-variant/20 text-center">
                        <div className="flex items-center gap-2 text-on-surface font-bold">
                          <span className="material-symbols-outlined text-[20px]">storefront</span>
                          Exclusivo Presencial
                        </div>
                        <span className="text-xs font-normal italic leading-tight text-on-surface-variant/90">
                          Debe acudir a la notaría para realizar la gestión y cotización de este servicio.
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setSelectedServicio(null)}
                      className="w-full py-3 text-on-surface-variant font-body font-semibold text-sm hover:text-on-surface transition-colors hover:bg-surface-container rounded-xl"
                    >
                      Volver al Catálogo
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
