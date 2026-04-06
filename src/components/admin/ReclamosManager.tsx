'use client';

import { useState } from 'react';
import { updateReclamoStatus } from '@/app/actions/admin';

export default function ReclamosManager({ reclamos, userRole }: { reclamos: any[], userRole: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pendientes = reclamos.filter(r => r.estado === 'pendiente').length;

  const handleUpdate = async (id: string, newState: string) => {
    setLoadingId(id);
    const result = await updateReclamoStatus(id, newState);
    if (!result.success) {
      alert(result.error);
    }
    setLoadingId(null);
  };

  return (
    <section className="p-8 mb-12">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
             <span className="hover:text-[#005ab4] cursor-pointer">Dashboard</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             <span className="text-[#005ab4]">Reclamos y Sugerencias</span>
          </nav>
          <h2 className="text-3xl font-extrabold text-[#181c22] tracking-tight">Reclamos y Sugerencias</h2>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white py-4 px-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-slate-100/50 group-hover:scale-[2.5] transition-transform duration-500 z-0"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-xl flex-shrink-0 bg-slate-50 text-slate-500">
              <span className="material-symbols-outlined text-[24px]">inbox</span>
            </div>
            <div>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Total Recibidos</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{reclamos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white py-4 px-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-orange-50/50 group-hover:scale-[2.5] transition-transform duration-500 z-0"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-xl flex-shrink-0 bg-orange-50 text-orange-600">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
            <div>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Pendientes</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{pendientes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista Bento */}
      <div className="grid grid-cols-1 gap-4">
        {reclamos.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">mail</span>
            <p className="font-body text-slate-500 font-medium">Bandeja limpia. No hay reclamos ni sugerencias registrados.</p>
          </div>
        ) : (
          reclamos.map((r) => (
            <div key={r.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-shadow hover:shadow-md ${r.estado === 'pendiente' ? 'border-orange-200 bg-orange-50/10' : 'border-slate-100'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-widest ${r.tipo === 'reclamo' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {r.tipo}
                    </span>
                    <span className="font-body text-xs text-slate-400 font-medium whitespace-nowrap">
                       {new Date(r.creado_en).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' })}
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-slate-900 leading-tight mb-4">{r.nombre_cliente} <span className="text-slate-400 font-body font-normal text-sm ml-2">({r.email})</span></h3>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-slate-700 font-body text-sm leading-relaxed whitespace-pre-line">
                    {r.mensaje}
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end md:w-48 shrink-0 justify-between">
                  <div className="mb-4">
                     {r.estado === 'pendiente' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter text-orange-700 bg-orange-50 border border-orange-200">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span> Pendiente
                        </span>
                     ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter text-[#005ab4] bg-[#005ab4]/5 border border-[#005ab4]/20">
                          <span className="w-1.5 h-1.5 bg-[#005ab4] rounded-full"></span> Revisado
                        </span>
                     )}
                  </div>

                  {userRole === 'notario' && r.estado === 'pendiente' && (
                    <button 
                      onClick={() => handleUpdate(r.id, 'revisado')}
                      disabled={loadingId === r.id}
                      className="w-full md:w-auto px-5 py-2.5 bg-[#005ab4] text-white font-label text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#bd5700] transition-colors shadow-sm shadow-[#005ab4]/20 disabled:opacity-50"
                    >
                      {loadingId === r.id ? 'Marcando...' : 'Marcar Revisado'}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
