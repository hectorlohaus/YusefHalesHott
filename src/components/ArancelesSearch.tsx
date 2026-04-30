'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Servicio = { 
  id: string; 
  titulo: string; 
  arancel: number | null; 
  arancel_texto: string | null;
  permite_pago_online: boolean;
  documentos_necesarios?: string | null;
};

// Formatear precio
function formatPrice(n: number | null | undefined) {
  if (!n && n !== 0) return '—';
  return `$\u00a0${n.toLocaleString('es-CL')}`;
}

// Parsear requisitos (documentos_necesarios) a array de tags
function parseRequisitos(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(',').map((r) => r.trim()).filter(Boolean);
}

export default function ArancelesSearch({ servicios }: { servicios: Servicio[] }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    setVisibleCount(3);
  }, [active]);

  const filtered = servicios.filter((s) =>
    s.titulo.toLowerCase().includes(active.toLowerCase())
  );

  const visibleItems = filtered.slice(0, visibleCount);

  const handleSearch = () => setActive(query);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setQuery('');
    setActive('');
    inputRef.current?.focus();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Tarifario de Aranceles - Notaría y Conservador Traiguén', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-CL')}`, 14, 30);

    const tableData = servicios.map(s => [
      s.titulo,
      s.arancel_texto || formatPrice(s.arancel),
      s.permite_pago_online ? 'Disponible Online' : 'Trámite Presencial'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Trámite', 'Arancel Referencial', 'Disponibilidad']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94] },
      styles: { fontSize: 9 },
    });

    doc.save('aranceles-notaria-conservador.pdf');
  };

  return (
    <>
      {/* Search Bar (LexCurator Style - Larger) */}
      <div className="mb-16 -mt-10 relative z-20">
        <div className="w-full max-w-3xl relative flex items-center bg-surface-container-lowest rounded-xl shadow-2xl shadow-black/5 p-2 focus-within:ring-2 focus-within:ring-secondary transition-all border border-outline-variant/10">
          <div className="flex-grow relative flex items-center">
            <div className="absolute left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-secondary">search</span>
            </div>
            <input 
              ref={inputRef}
              className="w-full pl-12 pr-10 py-5 bg-transparent text-on-surface border-none focus:ring-0 outline-none text-lg font-body" 
              placeholder="¿Qué arancel desea consultar?" 
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(e.target.value); // Live filtering
              }}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            )}
          </div>
          <button 
            className="hidden md:flex bg-primary text-on-primary px-8 py-5 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 duration-200 uppercase tracking-widest text-xs"
            onClick={handleSearch}
          >
            Buscar
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-variant text-on-surface py-3 px-6 rounded-lg font-bold text-sm transition-colors border border-outline-variant/10 shadow-sm"
          >
            <span className="material-symbols-outlined text-secondary">picture_as_pdf</span>
            Descargar Tarifario (PDF)
          </button>
        </div>
      </div>

      {active && (
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-6">
          {filtered.length === 0
            ? 'Sin resultados para la búsqueda'
            : `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'} encontrados`}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <p className="font-body text-on-surface-variant">No se encontraron trámites para su búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {visibleItems.map((servicio) => {
            const reqs = parseRequisitos(servicio.documentos_necesarios);
            return (
              <div key={servicio.id} className="bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline-variant/10 hover:shadow-lg transition-all duration-300 flex flex-col group relative">
                
                {/* Header (Título + Badge) */}
                <div className="flex flex-col gap-3 mb-6">
                  {servicio.permite_pago_online ? (
                    <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-secondary/10 text-secondary border border-secondary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      Disponible Online
                    </span>
                  ) : (
                    <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-surface-variant/50 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[12px]">storefront</span>
                      Trámite Presencial
                    </span>
                  )}
                  <h3 className="font-headline font-bold text-xl sm:text-2xl text-on-surface leading-tight">
                    {servicio.titulo}
                  </h3>
                </div>

                {/* Arancel / Precio */}
                <div className="mb-6 pb-6 border-b border-outline-variant/10">
                  <div className="text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">Arancel Referencial</div>
                  <div className="font-headline font-bold text-3xl text-primary tabular-nums">
                    {servicio.arancel_texto || formatPrice(servicio.arancel)}
                  </div>
                  {servicio.arancel_texto && (
                    <div className="text-xs text-on-surface-variant mt-2 italic font-medium">
                      Valores variables requieren evaluación en notaría.
                    </div>
                  )}
                </div>

                {/* Requisitos */}
                <div className="space-y-3 mb-8 flex-grow">
                  <div className="text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-bold mb-2">Requisitos Clave</div>
                  <div className="flex flex-wrap gap-2">
                    {reqs.length > 0 ? (
                      reqs.slice(0, 3).map((req, i) => (
                        <span key={i} className="text-[10px] bg-surface-container-high px-2 py-1.5 rounded-lg text-on-surface-variant font-bold uppercase truncate max-w-full">
                          {req}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/50 font-bold uppercase italic">Sin requisitos documentados</span>
                    )}
                    {reqs.length > 3 && (
                      <span className="text-[10px] bg-surface-container-high px-2 py-1.5 rounded-lg text-on-surface-variant font-bold uppercase">
                        +{reqs.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acción */}
                {servicio.permite_pago_online ? (
                  <Link href={`/solicitar?servicio=${servicio.id}`} className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-tertiary transition-colors active:scale-95 shadow-md shadow-primary/20">
                    Solicitar Trámite <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </Link>
                ) : (
                  <div className="w-full py-4 px-2 rounded-xl border border-outline-variant/20 bg-surface text-center flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-on-surface-variant flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-sm">info</span>
                      Requiere Atención Presencial
                    </span>
                    <span className="text-[10px] text-on-surface-variant/70 italic px-2">Este trámite no se puede pagar anticipadamente por web.</span>
                  </div>
                )}
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
    </>
  );
}
