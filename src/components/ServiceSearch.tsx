'use client';

import { useState } from 'react';
import Link from 'next/link';

type Servicio = {
  id: string;
  titulo: string;
  descripcion: string;
  arancel: number;
};

export default function ServiceSearch({ initialServicios }: { initialServicios: Servicio[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado de servicios en el cliente
  const filteredServicios = initialServicios.filter(servicio => {
    const term = searchTerm.toLowerCase();
    const tituloMatch = servicio.titulo.toLowerCase().includes(term);
    const descMatch = servicio.descripcion ? servicio.descripcion.toLowerCase().includes(term) : false;
    return tituloMatch || descMatch;
  });

  return (
    <>
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow"
            placeholder="Buscar por nombre de trámite o palabras clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredServicios.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500">No se encontraron trámites para su búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServicios.map((servicio) => (
            <div key={servicio.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold font-serif text-[#000080] mb-2">{servicio.titulo}</h2>
                <p className="text-slate-600 mb-6 text-sm flex-grow">
                  {servicio.descripcion || "Sin descripción adicional."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-slate-500">Arancel estimado:</span>
                  <span className="text-lg font-bold text-emerald-600">
                    ${servicio.arancel?.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100">
                <Link
                  href={`/solicitar?servicio=${servicio.id}`}
                  className="block w-full text-center bg-[#000080] text-white font-medium py-2.5 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Solicitar Ahora
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
