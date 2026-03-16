'use client';

import { useState } from 'react';
import { updateEmpleado, createEmpleado } from '@/app/actions/admin';

export default function EmpleadosManager({ initialEmpleados, userRole }: { initialEmpleados: any[], userRole: string }) {
  const [empleados, setEmpleados] = useState(initialEmpleados);
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
    const result = await updateEmpleado(formData);
    
    if (result.success) {
      setEditingId(null);
      window.location.reload(); 
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createEmpleado(formData);
    
    if (result.success) {
      setEditingId(null);
      window.location.reload(); 
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 font-serif">Gestión de Empleados y Sueldos</h2>
        {canEdit && (
          <button onClick={() => setEditingId('new')} className="text-sm bg-[#000080] text-white px-3 py-1.5 rounded-lg hover:bg-blue-800">
            + Nuevo Empleado
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-[#000080] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sueldo Asignado</th>
              {canEdit && <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {editingId === 'new' && (
              <tr className="bg-emerald-50">
                <td colSpan={5} className="p-4">
                  <form onSubmit={handleCreate} className="flex gap-4 flex-wrap items-end">
                    <div className="flex-1 min-w-[150px]">
                      <label className="text-xs text-slate-500">Nombre Completo</label>
                      <input required name="nombre" className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="text-xs text-slate-500">Email</label>
                      <input required type="email" name="email" className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div className="w-32">
                      <label className="text-xs text-slate-500">Contraseña</label>
                      <input required type="password" name="password" className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-slate-500">Rol</label>
                      <select name="rol" className="w-full text-sm border-slate-300 rounded bg-white">
                        <option value="empleado">Empleado</option>
                        <option value="notario">Notario</option>
                      </select>
                    </div>
                    <div className="w-28">
                      <label className="text-xs text-slate-500">Sueldo</label>
                      <input required type="number" name="sueldo" defaultValue={0} className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div className="flex gap-2 mb-1">
                      <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50">Crear</button>
                      <button type="button" onClick={cancelEdit} className="bg-slate-200 text-slate-800 px-3 py-1.5 rounded text-sm">Cancelar</button>
                    </div>
                  </form>
                </td>
              </tr>
            )}

            {empleados?.map((e) => (
              <tr key={e.id}>
                {editingId === e.id ? (
                  <td colSpan={5} className="p-4 bg-emerald-50">
                    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                      <input type="hidden" name="id" value={e.id} />
                      <div className="flex-1">
                        <input required name="nombre" defaultValue={e.nombre} className="w-full text-sm border-slate-300 rounded px-3 py-2" placeholder="Nombre completo" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-slate-500">{e.email}</span>
                      </div>
                      <div className="w-24">
                        <span className="text-sm text-slate-500 capitalize">{e.rol}</span>
                      </div>
                      <div className="w-32">
                        <input required type="number" name="sueldo" defaultValue={e.sueldo} className="w-full text-sm border-slate-300 rounded px-3 py-2" />
                      </div>
                      <div className="flex gap-2 text-right">
                        <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50">Guardar</button>
                        <button type="button" onClick={cancelEdit} className="bg-slate-200 text-slate-800 px-3 py-1.5 rounded text-sm">Cancelar</button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{e.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{e.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">{e.rol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">${e.sueldo?.toLocaleString('es-CL') || 0}</td>
                    {canEdit && (
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button onClick={() => handleEdit(e.id)} className="text-blue-600 hover:text-blue-900">Modificar</button>
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
