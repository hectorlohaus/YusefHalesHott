'use client';

import { useState, useEffect, useMemo } from 'react';
import { upsertServicio } from '@/app/actions/admin';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ServiciosManager({ initialServicios, userRole }: { initialServicios: any[], userRole: string }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canEdit = userRole === 'notario';

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'todos' | 'activo' | 'inactivo' | 'online'>('todos');

  // State para los requisitos dinámicos
  const [requisitos, setRequisitos] = useState<string[]>(['']);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado]);

  const activeServiceEditing = useMemo(() => {
    return editingId === 'new' ? null : initialServicios.find(s => s.id === editingId);
  }, [editingId, initialServicios]);

  // Cargar requisitos al abrir el modal
  useEffect(() => {
    if (activeServiceEditing?.documentos_necesarios) {
      const parsed = activeServiceEditing.documentos_necesarios
        .split(',')
        .map((r: string) => r.trim())
        .filter(Boolean);
      setRequisitos(parsed.length > 0 ? parsed : ['']);
    } else {
      setRequisitos(['']); // Empieza con uno vacío si es nuevo o no tiene
    }
  }, [activeServiceEditing]);

  const handleEdit = (id: string) => {
    if (canEdit) setEditingId(id);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleRequisitoChange = (index: number, value: string) => {
    const newReqs = [...requisitos];
    newReqs[index] = value;
    setRequisitos(newReqs);
  };

  const addRequisito = () => {
    setRequisitos([...requisitos, '']);
  };

  const removeRequisito = (index: number) => {
    if (requisitos.length > 1) {
      const newReqs = [...requisitos];
      newReqs.splice(index, 1);
      setRequisitos(newReqs);
    } else {
      setRequisitos(['']); // Vacía si es el último
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Inject custom compiled requisitos as comma separated string
    const stringifiedRequisitos = requisitos.map(r => r.trim()).filter(Boolean).join(',');
    formData.set('documentos_necesarios', stringifiedRequisitos);

    const result = await upsertServicio(formData);
    
    if (result.success) {
      setEditingId(null);
      window.location.reload(); 
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  // Stats Reales
  const stats = useMemo(() => {
    let activos = 0;
    let inactivos = 0;
    let online = 0;
    initialServicios.forEach(s => {
      if (s.activo) activos++;
      else inactivos++;
      if (s.permite_pago_online) online++;
    });
    return {
      total: initialServicios.length,
      activos,
      inactivos,
      online
    };
  }, [initialServicios]);

  const listFiltered = useMemo(() => {
    return initialServicios.filter(s => {
      // Filtrar por término
      if (searchTerm && !s.titulo.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Filtrar por estado de tarjeta Bento
      if (filterEstado === 'activo' && !s.activo) return false;
      if (filterEstado === 'inactivo' && s.activo) return false;
      if (filterEstado === 'online' && !s.permite_pago_online) return false;
      return true;
    });
  }, [initialServicios, searchTerm, filterEstado]);

  const totalPages = Math.ceil(listFiltered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listFiltered.slice(indexOfFirstItem, indexOfLastItem);

  const generarPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Actuación", "Arancel", "Última Actualización"];
    const tableRows: any[] = [];

    listFiltered.forEach(servicio => {
      const actuacion = servicio.titulo;
      const arancel = `$${(servicio.arancel || 0).toLocaleString('es-CL')}`;
      const actualizacion = servicio.actualizado_en ? new Date(servicio.actualizado_en).toLocaleDateString('es-CL', {
        year: 'numeric', month: 'short', day: '2-digit'
      }) : 'Sin cambios';
      
      tableRows.push([actuacion, arancel, actualizacion]);
    });

    const fechaStr = new Date().toLocaleDateString('es-CL');
    doc.text(`Aranceles ${fechaStr}`, 14, 15);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, font: 'helvetica' },
      headStyles: { fillColor: [0, 90, 180] },
    });

    doc.save(`Aranceles_${fechaStr.replace(/\//g, '-')}.pdf`);
  };

  return (
    <>
      <section className="p-8 mb-12">
        {/* Header Section (Estilo SolicitudesManager) */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
              <span className="hover:text-[#005ab4] cursor-pointer">Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-[#005ab4]">Gestión de Servicios</span>
            </nav>
            <h2 className="text-3xl font-extrabold text-[#181c22] tracking-tight">Gestión de Servicios</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#005ab4]/20 focus:border-[#005ab4] placeholder:text-slate-400 shadow-sm"
                placeholder="Buscar por título..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {canEdit && (
              <button 
                onClick={() => setEditingId('new')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-[#005ab4] text-white hover:bg-[#00458a] shadow-sm ml-0 sm:ml-2 w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Nuevo Servicio
              </button>
            )}
            <button 
              onClick={generarPDF}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm ml-0 sm:ml-2 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Dashboard Stats Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <div 
            onClick={() => setFilterEstado('todos')}
            className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstado === 'todos' ? 'border-[#005ab4] ring-1 ring-[#005ab4]' : 'border-slate-100'}`}
          >
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstado === 'todos' ? 'bg-[#005ab4]/10' : 'bg-slate-100/50'}`}></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstado === 'todos' ? 'bg-[#005ab4] text-white' : 'bg-slate-50 text-slate-500'}`}>
                <span className="material-symbols-outlined text-[20px]">folder_open</span>
              </div>
              <div>
                <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">Total Registrados</p>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Todos</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 relative z-10">{stats.total}</div>
          </div>

          {/* Activos */}
          <div 
            onClick={() => setFilterEstado(filterEstado === 'activo' ? 'todos' : 'activo')}
            className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstado === 'activo' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100'}`}
          >
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstado === 'activo' ? 'bg-emerald-500/10' : 'bg-emerald-50/50'}`}></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstado === 'activo' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
              <div>
                <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">Servicios Activos</p>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Públicos</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 relative z-10">{stats.activos}</div>
          </div>

          {/* Inactivos */}
          <div 
            onClick={() => setFilterEstado(filterEstado === 'inactivo' ? 'todos' : 'inactivo')}
            className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstado === 'inactivo' ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-100'}`}
          >
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstado === 'inactivo' ? 'bg-red-500/10' : 'bg-red-50/50'}`}></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstado === 'inactivo' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600'}`}>
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </div>
              <div>
                <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">Servicios Inactivos</p>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Borradores</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 relative z-10">{stats.inactivos}</div>
          </div>

          {/* Online */}
          <div 
            onClick={() => setFilterEstado(filterEstado === 'online' ? 'todos' : 'online')}
            className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstado === 'online' ? 'border-purple-500 ring-1 ring-purple-500' : 'border-slate-100'}`}
          >
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstado === 'online' ? 'bg-purple-500/10' : 'bg-purple-50/50'}`}></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstado === 'online' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600'}`}>
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </div>
              <div>
                <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">Pago Online</p>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Habilitados</p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 relative z-10">{stats.online}</div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-bold">Nombre del Trámite</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-bold">Descripción del Servicio</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-bold text-right">Arancel Base</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-bold text-center">Estado</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-bold">Fecha de Registro</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-bold">Fecha de Actualización</th>
                  {canEdit && <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-bold text-center">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((s) => {
                  const createdDate = s.creado_en ? new Date(s.creado_en).toLocaleDateString('es-CL', {
                    year: 'numeric', month: 'short', day: '2-digit'
                  }) : 'No registrada';
                  const updatedDate = s.actualizado_en ? new Date(s.actualizado_en).toLocaleDateString('es-CL', {
                    year: 'numeric', month: 'short', day: '2-digit'
                  }) : 'Sin cambios';

                  return (
                    <tr key={s.id} className="hover:bg-[#005ab4]/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-headline font-bold text-lg text-slate-900 group-hover:text-[#005ab4] transition-colors">{s.titulo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body text-xs text-slate-500 italic line-clamp-2 max-w-xs">{s.descripcion || "Sin descripción detallada."}</div>
                      </td>
                      <td className="px-6 py-5 text-right font-label text-base font-bold tabular-nums text-slate-900">
                        ${s.arancel ? s.arancel.toLocaleString('es-CL') : '0'}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {s.activo ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter text-red-700 bg-red-50 px-2 py-1 rounded-full border border-red-100 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 font-body text-xs font-medium text-slate-600">
                        {createdDate}
                      </td>
                      <td className="px-6 py-5 font-body text-xs font-medium text-slate-600">
                        {updatedDate}
                      </td>
                      {canEdit && (
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center">
                            <button onClick={() => handleEdit(s.id)} className="bg-slate-100 text-[#005ab4] font-label text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#005ab4] hover:text-white transition-colors shadow-sm" title="Modificar Datos">
                              Editar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* Footer Table */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs font-medium text-slate-500">
              Mostrando {listFiltered.length === 0 ? 0 : indexOfFirstItem + 1} a {Math.min(indexOfLastItem, listFiltered.length)} de {listFiltered.length} servicios en total.
            </p>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 transition-colors shadow-sm"
              >
                Anterior
              </button>
              <button 
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 transition-colors shadow-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal - Tarjeta Flotante Extendida */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={cancelEdit}></div>
          <div className="bg-white w-full max-w-2xl relative shadow-2xl rounded-3xl overflow-hidden flex flex-col md:max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#005ab4] px-8 py-6 text-white flex justify-between items-center rounded-t-3xl">
              <div>
                <p className="font-label text-[10px] uppercase tracking-widest opacity-80 mb-1">
                  {editingId === 'new' ? 'Registro Institucional' : 'Edición de Trámite'}
                </p>
                <h2 className="font-headline text-3xl font-bold">
                  {editingId === 'new' ? 'Nuevo Servicio' : 'Modificar Servicio'}
                </h2>
              </div>
              <button onClick={cancelEdit} type="button" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
              {activeServiceEditing && <input type="hidden" name="id" value={activeServiceEditing.id} />}
              
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Título */}
                  <div className="flex-grow space-y-2">
                    <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[#005ab4]">Nombre del Trámite</label>
                    <input 
                      required 
                      name="titulo" 
                      defaultValue={activeServiceEditing?.titulo} 
                      placeholder="Ej: Autorización de Viaje"
                      className="w-full font-body text-lg text-slate-900 border border-slate-200 focus:border-[#005ab4] focus:ring-1 focus:ring-[#005ab4] rounded-xl px-4 py-3 transition-all" 
                    />
                  </div>

                  {/* Arancel */}
                  <div className="w-full sm:w-1/4 space-y-2 shrink-0">
                    <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[#005ab4]">Arancel Base</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 font-bold">$</span>
                      <input 
                        required 
                        type="number" 
                        name="arancel" 
                        defaultValue={activeServiceEditing?.arancel} 
                        className="w-full pl-8 font-headline font-bold text-xl text-slate-900 border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005ab4] focus:ring-1 focus:ring-[#005ab4] rounded-xl px-4 py-3 transition-all tabular-nums" 
                      />
                    </div>
                  </div>

                  {/* Arancel Texto */}
                  <div className="w-full sm:w-1/3 space-y-2 shrink-0">
                    <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[#005ab4]">Texto Variable (Opcional)</label>
                    <input 
                      type="text" 
                      name="arancel_texto" 
                      defaultValue={activeServiceEditing?.arancel_texto || ''} 
                      placeholder="Ej: $15.000 + FEA"
                      className="w-full font-headline font-bold text-sm text-slate-900 border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005ab4] focus:ring-1 focus:ring-[#005ab4] rounded-xl px-4 py-3 transition-all" 
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[#005ab4]">Descripción Legal / Contexto</label>
                  <textarea 
                    name="descripcion" 
                    defaultValue={activeServiceEditing?.descripcion || ''} 
                    className="w-full font-body text-sm text-slate-700 border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#005ab4] focus:ring-1 focus:ring-[#005ab4] rounded-xl px-4 py-3 transition-all min-h-[100px] resize-none" 
                    placeholder="Breve explicación del objetivo y marco del trámite..."
                  />
                </div>

                {/* Requisitos Dinámicos */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[#005ab4]">Lista de Requisitos</label>
                  </div>
                  
                  <div className="space-y-3">
                    {requisitos.map((req, i) => (
                      <div key={i} className="flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300 relative group">
                        <span className="hidden sm:block font-bold text-slate-300 w-3 text-right text-xs shrink-0">{i + 1}.</span>
                        <input 
                          value={req}
                          onChange={(e) => handleRequisitoChange(i, e.target.value)}
                          className="w-full font-body text-sm text-slate-700 border border-slate-200 focus:border-[#005ab4] focus:ring-1 focus:ring-[#005ab4] rounded-xl px-4 py-2.5 transition-all shadow-sm" 
                          placeholder="Ej: Fotocopia Cédula de Identidad..."
                        />
                        {/* Action buttons embedded on mobile, next to it on desktop */}
                        <div className="flex shrink-0 gap-1 sm:w-8 justify-center mt-2 sm:mt-0 items-center">
                          {requisitos.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeRequisito(i)}
                              className="text-slate-300 hover:text-red-500 rounded-full transition-colors flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100"
                              title="Quitar"
                            >
                              <span className="material-symbols-outlined text-[20px]">remove_circle_outline</span>
                            </button>
                          )}
                          {i === requisitos.length - 1 && (
                            <button 
                              type="button" 
                              onClick={addRequisito}
                              className="bg-slate-50 border border-slate-200 text-[#005ab4] hover:bg-[#005ab4]/10 rounded-xl px-3 py-1.5 transition-colors absolute sm:static right-0 bottom-full mb-2 sm:mb-0 hidden"
                              title="Añadir requisito"
                            >
                              <span className="text-xs font-bold uppercase">Añadir</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={addRequisito}
                    className="mt-2 text-[11px] font-label font-bold text-[#005ab4] uppercase tracking-widest flex items-center gap-1 hover:text-[#00458a] transition-colors sm:ml-6"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span> 
                    Agregar Requisito
                  </button>
                </div>

                {/* Estado Público y Disponibilidad */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <label className="flex flex-1 items-center gap-4 cursor-pointer group p-4 rounded-xl border border-slate-200 hover:border-[#005ab4] transition-colors bg-slate-50">
                    <div className="relative flex items-center shrink-0">
                      <input 
                        type="checkbox" 
                        name="activo" 
                        defaultChecked={activeServiceEditing ? activeServiceEditing.activo : true} 
                        className="peer h-6 w-6 cursor-pointer appearance-none border-2 border-slate-300 rounded-lg checked:border-[#005ab4] checked:bg-[#005ab4] transition-all" 
                      />
                      <span className="absolute text-white material-symbols-outlined text-[18px] left-[12px] top-[12px] -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                    </div>
                    <div>
                      <span className="block font-label text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Visible en Catálogo
                      </span>
                      <span className="block font-body text-[10px] text-slate-500 mt-0.5 max-w-[200px]">
                        Permite que se muestre en la web.
                      </span>
                    </div>
                  </label>

                  <label className="flex flex-1 items-center gap-4 cursor-pointer group p-4 rounded-xl border border-slate-200 hover:border-emerald-500 transition-colors bg-slate-50">
                    <div className="relative flex items-center shrink-0">
                      <input 
                        type="checkbox" 
                        name="permite_pago_online" 
                        defaultChecked={activeServiceEditing ? activeServiceEditing.permite_pago_online : true} 
                        className="peer h-6 w-6 cursor-pointer appearance-none border-2 border-slate-300 rounded-lg checked:border-emerald-500 checked:bg-emerald-500 transition-all" 
                      />
                      <span className="absolute text-white material-symbols-outlined text-[18px] left-[12px] top-[12px] -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                    </div>
                    <div>
                      <span className="block font-label text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Pago Online Habilitado
                      </span>
                      <span className="block font-body text-[10px] text-slate-500 mt-0.5 max-w-[200px]">
                        Permite a los usuarios iniciar e pagar el trámite vía web.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white shadow-[0_-10px_10px_-10px_rgba(0,0,0,0.05)]">
                <button 
                  type="button" 
                  disabled={loading}
                  onClick={cancelEdit} 
                  className="px-6 py-3 text-sm font-label font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors rounded-xl shadow-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-3 bg-[#005ab4] text-white text-sm font-label font-bold uppercase tracking-widest hover:bg-[#bd5700] transition-all shadow-lg shadow-[#005ab4]/20 rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    'Guardando...'
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
