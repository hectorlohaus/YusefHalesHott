'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

type Servicio = { 
  id: string; 
  titulo: string; 
  arancel: number | null; 
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

  const filtered = servicios.filter((s) =>
    s.titulo.toLowerCase().includes(active.toLowerCase())
  );

  const handleSearch = () => setActive(query);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setQuery('');
    setActive('');
    inputRef.current?.focus();
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
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl bg-surface-container-low/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high">
                  <th className="px-8 py-6 font-headline text-sm font-bold text-on-surface uppercase tracking-wider">Trámite</th>
                  <th className="px-8 py-6 font-headline text-sm font-bold text-on-surface uppercase tracking-wider">Base (CLP)</th>
                  <th className="px-8 py-6 font-headline text-sm font-bold text-on-surface uppercase tracking-wider">Requisitos Clave</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((servicio, index) => {
                  const reqs = parseRequisitos(servicio.documentos_necesarios);
                  const isStripe = index % 2 !== 0;

                  return (
                    <tr key={servicio.id} className={`group hover:bg-surface-container-lowest transition-colors ${isStripe ? 'bg-surface-container-low/30' : ''}`}>
                      <td className="px-8 py-8">
                        <div className="font-bold text-on-surface text-lg">{servicio.titulo}</div>
                      </td>
                      <td className="px-8 py-8 font-mono font-medium text-on-surface">{formatPrice(servicio.arancel)}</td>
                      <td className="px-8 py-8 flex flex-wrap gap-2">
                        {reqs.length > 0 ? (
                          reqs.slice(0, 3).map((req, i) => (
                            <span key={i} className="text-xs bg-surface-variant px-3 py-1 rounded-full text-on-surface-variant font-medium">
                              {req.length > 20 ? req.substring(0, 20) + '...' : req}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-on-surface-variant/50 font-medium italic">Sin requisitos</span>
                        )}
                        {reqs.length > 3 && (
                          <span className="text-xs bg-surface-variant px-2 py-1 rounded-full text-on-surface-variant font-medium">+{reqs.length - 3}</span>
                        )}
                      </td>
                      <td className="px-8 py-8 text-right">
                        <Link href={`/solicitar?servicio=${servicio.id}`} className="text-secondary font-bold text-sm flex items-center justify-end gap-1 group-hover:underline">
                          Iniciar <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden space-y-4">
            {filtered.map((servicio) => {
              const reqs = parseRequisitos(servicio.documentos_necesarios);

              return (
                <div key={servicio.id} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="pr-4">
                      <h3 className="font-bold text-xl text-on-surface leading-tight">{servicio.titulo}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-secondary">{formatPrice(servicio.arancel)}</div>
                      <div className="text-[10px] text-on-surface-variant">BASE CLP</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex flex-wrap gap-2">
                    {reqs.length > 0 ? (
                      reqs.map((req, i) => (
                        <span key={i} className="text-[10px] bg-surface-container-high px-2 py-1 rounded-lg text-on-surface-variant font-bold uppercase truncate max-w-full">
                          {req}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/50 font-bold uppercase italic">Sin requisitos específicos</span>
                    )}
                  </div>
                  
                  <Link href={`/solicitar?servicio=${servicio.id}`} className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-tertiary transition-colors active:scale-95">
                    Solicitar Trámite <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
