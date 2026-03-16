'use client';

import { useState } from 'react';
import { upsertServicio } from '@/app/actions/admin';

export default function ServiciosManager({ initialServicios, userRole }: { initialServicios: any[], userRole: string }) {
  const [servicios, setServicios] = useState(initialServicios);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canEdit = userRole === 'notario';

  const handleEdit = (id: string) => {
    if (canEdit) setEditingId(id);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await upsertServicio(formData);
    
    if (result.success) {
      // The page will revalidate (Next.js server action side effect), but locally we close edit
      setEditingId(null);
      // Let standard Next Router refresh the data prop natively
      window.location.reload(); 
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 font-serif">Gestión de Servicios y Aranceles</h2>
        {canEdit && (
          <button onClick={() => setEditingId('new')} className="text-sm bg-[#000080] text-white px-3 py-1.5 rounded-lg hover:bg-blue-800">
            + Nuevo Servicio
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-[#000080] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Documentos Requeridos</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Arancel</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
              {canEdit && <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {editingId === 'new' && (
              <tr className="bg-blue-50">
                <td colSpan={5} className="p-4">
                  <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-xs text-slate-500">Título</label>
                      <input required name="titulo" className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-xs text-slate-500">Descripción</label>
                      <input name="descripcion" className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-xs text-slate-500">Documentos Requeridos (separados por coma)</label>
                      <input name="documentos_necesarios" className="w-full text-sm border-slate-300 rounded px-3 py-2" placeholder="Ej: Carnet, Certificado Nacimiento" />
                    </div>
                    <div className="w-32">
                      <label className="text-xs text-slate-500">Arancel</label>
                      <input required type="number" name="arancel" className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div className="w-24 flex items-center gap-2 mb-2">
                      <input type="checkbox" name="activo" defaultChecked className="rounded border-slate-300 text-blue-600" />
                      <span className="text-xs">Activo</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50">Guardar</button>
                      <button type="button" onClick={cancelEdit} className="bg-slate-200 text-slate-800 px-3 py-1.5 rounded text-sm">Cancelar</button>
                    </div>
                  </form>
                </td>
              </tr>
            )}

            {servicios?.map((s) => (
              <tr key={s.id}>
                {editingId === s.id ? (
                  <td colSpan={6} className="p-4 bg-blue-50">
                    <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap items-end">
                      <input type="hidden" name="id" value={s.id} />
                      <div className="flex-1 min-w-[200px]">
                        <input required name="titulo" defaultValue={s.titulo} className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <input name="descripcion" defaultValue={s.descripcion} className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <input name="documentos_necesarios" defaultValue={s.documentos_necesarios} className="w-full text-sm border-slate-300 rounded px-3 py-2" placeholder="Ej: Carnet, Certificado Nacimiento" />
                      </div>
                      <div className="w-32">
                        <input required type="number" name="arancel" defaultValue={s.arancel} className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                      </div>
                      <div className="w-24 flex items-center gap-2 mb-2">
                        <input type="checkbox" name="activo" defaultChecked={s.activo} className="rounded border-slate-300 text-blue-600" />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50">Guardar</button>
                        <button type="button" onClick={cancelEdit} className="bg-slate-200 text-slate-800 px-3 py-1.5 rounded text-sm">Cancelar</button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{s.titulo}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{s.descripcion}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{s.documentos_necesarios || <span className="text-slate-300 italic">No requiere</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">${s.arancel.toLocaleString('es-CL')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {s.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    {canEdit && (
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button onClick={() => handleEdit(s.id)} className="text-blue-600 hover:text-blue-900">Editar</button>
                       </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
