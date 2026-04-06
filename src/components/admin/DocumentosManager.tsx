'use client';

import { useState } from 'react';
import { uploadDocumentoInstitucional, deleteDocumentoInstitucional } from '@/app/actions/admin';

export default function DocumentosManager({ documentos, userRole }: { documentos: any[], userRole: string }) {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await uploadDocumentoInstitucional(formData);
    
    if (result.success) {
      (e.target as HTMLFormElement).reset();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('¿Está seguro de eliminar este documento? Esta acción no se puede deshacer.')) return;
    
    setDeletingId(id);
    const result = await deleteDocumentoInstitucional(id, url);
    if (!result.success) {
      alert(result.error);
    }
    setDeletingId(null);
  };

  return (
    <section className="p-8 mb-12">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
             <span className="hover:text-[#005ab4] cursor-pointer">Dashboard</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             <span className="text-[#005ab4]">Documentos Legales</span>
          </nav>
          <h2 className="text-3xl font-extrabold text-[#181c22] tracking-tight">Gestión de Documentos Institucionales</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario Nueva Subida */}
        {userRole === 'notario' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sticky top-8">
              <h3 className="font-headline font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005ab4]">upload_file</span>
                Subir Nuevo Documento
              </h3>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-[#005ab4]">Categoría Legal</label>
                  <select name="categoria" required className="w-full font-body text-sm text-slate-900 border border-slate-200 focus:border-[#005ab4] focus:ring-1 focus:ring-[#005ab4] rounded-xl px-4 py-3 transition-all bg-slate-50 cursor-pointer hover:bg-white">
                    <option value="">Seleccione categoría...</option>
                    <option value="balances">Balances Anuales</option>
                    <option value="intereses">Declaraciones de Intereses y Patrimonio</option>
                    <option value="supervision">Informes de Supervisión</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-[#005ab4]">Título del Documento</label>
                  <input required type="text" name="titulo" className="w-full font-body text-sm text-slate-900 border border-slate-200 focus:border-[#005ab4] focus:ring-1 focus:ring-[#005ab4] rounded-xl px-4 py-3 transition-all bg-slate-50 focus:bg-white" placeholder="Ej: Balance General 2023" />
                </div>

                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-[#005ab4]">Archivo (PDF)</label>
                  <input required type="file" name="archivo" accept="application/pdf" className="w-full font-body text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#005ab4]/10 file:text-[#005ab4] hover:file:bg-[#005ab4]/20 cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50" />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full px-6 py-4 bg-[#005ab4] text-white text-xs font-label font-bold uppercase tracking-widest hover:bg-[#3381cc] transition-all shadow-lg shadow-[#005ab4]/20 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {loading ? 'Subiendo...' : (
                      <>
                        <span className="material-symbols-outlined text-base">cloud_upload</span>
                        Registrar Documento
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Documentos */}
        <div className={userRole === 'notario' ? "lg:col-span-2" : "col-span-full"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentos.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">inventory_2</span>
                <p className="font-body text-slate-500 font-medium">No hay documentos institucionales registrados.</p>
              </div>
            ) : (
              documentos.map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-[#005ab4]/30 hover:shadow-md transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-[6px] text-[10px] font-bold uppercase tracking-widest">{doc.categoria}</span>
                      
                      {userRole === 'notario' && (
                        <button 
                          onClick={() => handleDelete(doc.id, doc.url_archivo)}
                          disabled={deletingId === doc.id}
                          className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Eliminar documento"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                    
                    <h4 className="font-headline font-bold text-slate-900 leading-snug mb-2">{doc.titulo}</h4>
                    <p className="font-body text-xs text-slate-400">
                      Subido el {new Date(doc.creado_en).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <a 
                      href={doc.url_archivo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#005ab4] font-label text-[10px] font-bold uppercase tracking-widest hover:text-[#bd5700] transition-colors flex items-center gap-1"
                    >
                      Ver Archivo <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
