'use client';

import { useState, useMemo } from 'react';
import { updateSolicitud, createSolicitudManual, assignSolicitud } from '@/app/actions/admin';
import { formatRut } from '@/lib/rut';

export default function SolicitudesManager({ initialSolicitudes, servicios = [], currentUserId, currentUserRole }: { initialSolicitudes: any[], servicios?: any[], currentUserId?: string | null, currentUserRole?: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  // Modal Nueva Solicitud
  const [showNewModal, setShowNewModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Custom Searchable Dropdown for Modal
  const [searchServicio, setSearchServicio] = useState('');
  const [selectedServicioId, setSelectedServicioId] = useState('');
  const [isServicioDropdownOpen, setIsServicioDropdownOpen] = useState(false);

  // Filtros Avanzados Toggle
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filtros
  const [filterFecha, setFilterFecha] = useState('');
  const [filterId, setFilterId] = useState('');
  const [filterRut, setFilterRut] = useState('');
  const [filterEstadoPago, setFilterEstadoPago] = useState('');
  const [filterEstadoBoleta, setFilterEstadoBoleta] = useState('');
  const [filterEstadoTrabajo, setFilterEstadoTrabajo] = useState(''); // NEW

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleStatusChange = async (solicitudId: string, type: 'trabajo' | 'boleta' | 'pago', value: string) => {
    // Regla de negocio: No se puede emitir boleta si no está pagado
    if (type === 'boleta' && value === 'enviada') {
       const isCurrentPaid = selectedDoc?.estado_pago === 'pagado';
       if (!isCurrentPaid) {
         alert("No se puede marcar la boleta/factura como ENVIADA si el estado del pago no está PAGADO.");
         return;
       }
    }

    // Regla de negocio: No se puede finalizar el trámite si no está pagado o sin boleta
    if (type === 'trabajo' && value === 'listo') {
       const isCurrentPaid = selectedDoc?.estado_pago === 'pagado';
       if (!isCurrentPaid) {
         alert("No se puede marcar el trámite como LISTO si el pago todavía está PENDIENTE. Valida el pago primero.");
         return;
       }
       if (selectedDoc?.estado_boleta !== 'enviada') {
         alert("No se puede marcar el trámite como LISTO si no se ha EMITIDO la boleta.");
         return;
       }
       if (!confirm("¿Está seguro de que desea marcar este trámite como LISTO? Esta acción notificará al cliente y es definitiva.")) {
         return;
       }
    }

    setLoadingId(solicitudId);
    await updateSolicitud(solicitudId, type as any, value);
    
    // Auto emitir boleta si es getnet y pagado
    const isAutoGetnetBoleta = type === 'pago' && value === 'pagado' && selectedDoc?.metodo_pago === 'getnet';

    if (selectedDoc && selectedDoc.id === solicitudId) {
      setSelectedDoc({
        ...selectedDoc,
        [type === 'trabajo' ? 'estado_trabajo' : type === 'boleta' ? 'estado_boleta' : 'estado_pago']: value,
        ...(isAutoGetnetBoleta && { estado_boleta: 'enviada' })
      });
    }

    setLoadingId(null);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    let pendientes = 0;
    let enRevision = 0;
    let enReparo = 0;
    let completadas = 0;
    initialSolicitudes.forEach(sol => {
      if (sol.estado_pago === 'fallido') return;
      if (sol.estado_trabajo === 'pendiente') pendientes++;
      else if (sol.estado_trabajo === 'en_revision') enRevision++;
      else if (sol.estado_trabajo === 'en_reparo') enReparo++;
      else if (sol.estado_trabajo === 'listo') {
        const checkDate = sol.actualizado_en || sol.creado_en;
        if (checkDate && checkDate.startsWith(todayStr)) {
          completadas++;
        }
      }
    });
    return { pendientes, enRevision, enReparo, completadas };
  }, [initialSolicitudes, todayStr]);

  const solicitudesFiltradas = useMemo(() => {
    setCurrentPage(1);
    return initialSolicitudes.filter(sol => {
      if (sol.estado_pago === 'fallido') return false;
      if (filterFecha) {
        const dateToUse = sol.actualizado_en || sol.creado_en;
        const solDate = dateToUse ? new Date(dateToUse).toISOString().split('T')[0] : '';
        if (solDate !== filterFecha) return false;
      }
      if (filterId && !sol.id.toLowerCase().includes(filterId.toLowerCase())) return false;
      if (filterRut) {
        const cleanRutFilter = filterRut.replace(/[^0-9kK]/g, '').toLowerCase();
        const cleanSolRut = sol.cliente_rut.replace(/[^0-9kK]/g, '').toLowerCase();
        if (!cleanSolRut.includes(cleanRutFilter)) return false;
      }
      if (filterEstadoPago && sol.estado_pago !== filterEstadoPago) return false;
      if (filterEstadoBoleta && (sol.estado_boleta || 'sin enviar') !== filterEstadoBoleta) return false;
      if (filterEstadoTrabajo && sol.estado_trabajo !== filterEstadoTrabajo) return false;
      return true;
    });
  }, [initialSolicitudes, filterFecha, filterId, filterRut, filterEstadoPago, filterEstadoBoleta, filterEstadoTrabajo]);

  const totalPages = Math.ceil(solicitudesFiltradas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitudes = solicitudesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const split = name.trim().split(' ');
    if (split.length === 1) return split[0].substring(0, 2).toUpperCase();
    return (split[0][0] + split[split.length - 1][0]).toUpperCase();
  };

  const handleBentoClick = (tipo: string) => {
    if (filterEstadoTrabajo === tipo) {
      setFilterEstadoTrabajo(''); // Toggle off
      if (tipo === 'listo') setFilterFecha('');
    } else {
      setFilterEstadoTrabajo(tipo);
      if (tipo === 'listo') {
         setFilterFecha(todayStr);
      } else {
         setFilterFecha('');
      }
    }
  };

  const handleCreateManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedServicioId) {
      alert("Por favor selecciona un trámite válido de la lista.");
      return;
    }
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);
    const res = await createSolicitudManual(formData);
    setIsCreating(false);
    if (res.success) {
      setShowNewModal(false);
      setSearchServicio('');
      setSelectedServicioId('');
    } else {
      alert("Error al crear solicitud: " + res.error);
    }
  };

  const filteredServiciosModal = useMemo(() => {
    if (!servicios) return [];
    const active = servicios.filter(s => s.activo);
    if (!searchServicio) return active;
    const q = searchServicio.toLowerCase();
    return active.filter(s => s.titulo.toLowerCase().includes(q));
  }, [searchServicio, servicios]);

  return (
    <div className="p-8 mb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
            <span className="hover:text-[#005ab4] cursor-pointer">Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[#005ab4]">Bandeja de Solicitudes</span>
          </nav>
          <h2 className="text-3xl font-extrabold text-[#181c22] tracking-tight">Bandeja de Solicitudes</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Main ID Search */}
          <div className="relative w-full sm:w-64">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#005ab4]/20 focus:border-[#005ab4] placeholder:text-slate-400 shadow-sm"
              placeholder="Buscar por código..."
              type="text"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${showAdvancedFilters ? 'bg-[#f2f3fd] border-[#005ab4]/30 text-[#005ab4]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filtros Avanzados
          </button>
          
          <button 
            onClick={() => {
              setSearchServicio('');
              setSelectedServicioId('');
              setShowNewModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-[#005ab4] text-white hover:bg-[#00458a] shadow-sm ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Solicitud
          </button>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-4 fade-in duration-200">
           <div>
             <label className="text-sm font-bold text-slate-700 block mb-2">RUT Cliente</label>
             <input type="text" value={filterRut} onChange={e => setFilterRut(e.target.value)} placeholder="Ej. 12345678-9" className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors" />
           </div>
           <div>
             <label className="text-sm font-bold text-slate-700 block mb-2">Fecha Ingreso</label>
             <input type="date" value={filterFecha} onChange={e => setFilterFecha(e.target.value)} className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors" />
           </div>
           <div>
             <label className="text-sm font-bold text-slate-700 block mb-2">Estado Pago</label>
             <select value={filterEstadoPago} onChange={e => setFilterEstadoPago(e.target.value)} className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors cursor-pointer">
               <option value="">Todos</option>
               <option value="pendiente">Pendiente</option>
               <option value="pagado">Pagado</option>
             </select>
           </div>
           <div>
             <label className="text-sm font-bold text-slate-700 block mb-2">Estado Facturación</label>
             <select value={filterEstadoBoleta} onChange={e => setFilterEstadoBoleta(e.target.value)} className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors cursor-pointer">
               <option value="">Todos</option>
               <option value="sin enviar">Sin Enviar</option>
               <option value="enviada">Enviada</option>
             </select>
           </div>
           <div>
             <label className="text-sm font-bold text-slate-700 block mb-2">Estado Interno</label>
             <select value={filterEstadoTrabajo} onChange={e => setFilterEstadoTrabajo(e.target.value)} className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors cursor-pointer">
               <option value="">Todos</option>
               <option value="pendiente">Nuevas (Pendiente)</option>
               <option value="en_revision">En Revisión</option>
               <option value="en_reparo">En Reparo</option>
               <option value="listo">Listos</option>
             </select>
           </div>
        </div>
      )}

      {/* Dashboard Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={() => handleBentoClick('pendiente')}
          className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstadoTrabajo === 'pendiente' ? 'border-[#005ab4] ring-1 ring-[#005ab4]' : 'border-slate-100'}`}
        >
          <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstadoTrabajo === 'pendiente' ? 'bg-[#005ab4]/10' : 'bg-blue-50/50'}`}></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstadoTrabajo === 'pendiente' ? 'bg-[#005ab4] text-white' : 'bg-blue-50 text-[#005ab4]'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">Nuevas</p>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Pendientes</p>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 relative z-10">{stats.pendientes}</div>
        </div>

        <div 
          onClick={() => handleBentoClick('en_revision')}
          className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstadoTrabajo === 'en_revision' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-100'}`}
        >
          <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstadoTrabajo === 'en_revision' ? 'bg-amber-500/10' : 'bg-amber-50/50'}`}></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstadoTrabajo === 'en_revision' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">Revisión</p>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">En proceso</p>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 relative z-10">{stats.enRevision}</div>
        </div>

        <div 
          onClick={() => handleBentoClick('en_reparo')}
          className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstadoTrabajo === 'en_reparo' ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-100'}`}
        >
          <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstadoTrabajo === 'en_reparo' ? 'bg-red-500/10' : 'bg-red-50/50'}`}></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstadoTrabajo === 'en_reparo' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">En Reparo</p>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Observaciones</p>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 relative z-10">{stats.enReparo}</div>
        </div>

        <div 
          onClick={() => handleBentoClick('listo')}
          className={`cursor-pointer bg-white py-3 px-4 rounded-xl shadow-sm border flex items-center justify-between transition-all hover:shadow-md relative overflow-hidden group ${filterEstadoTrabajo === 'listo' ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-100'}`}
        >
          <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full group-hover:scale-[2.5] transition-transform duration-500 z-0 ${filterEstadoTrabajo === 'listo' ? 'bg-green-500/10' : 'bg-green-50/50'}`}></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-lg flex-shrink-0 ${filterEstadoTrabajo === 'listo' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">SOLO HOY</span>
              </div>
              <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wider">Completados</p>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 relative z-10">{stats.completadas}</div>
        </div>
      </div>

      {/* High Density Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800">Resultados</h3>
            <span className="px-3 py-1 rounded-full bg-[#f2f3fd] text-[#005ab4] text-[10px] font-bold uppercase tracking-wider hidden sm:block">
              {solicitudesFiltradas.length} Trámites
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4 border-b border-slate-100">Código / Fecha</th>
                <th className="px-4 py-4 border-b border-slate-100">Cliente</th>
                <th className="px-4 py-4 border-b border-slate-100">Trámite Solicitado</th>
                <th className="px-4 py-4 border-b border-slate-100">Estado Interno</th>
                <th className="px-4 py-4 border-b border-slate-100">Pago</th>
                <th className="px-4 py-4 border-b border-slate-100 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {currentSolicitudes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-semibold text-lg text-slate-700">No se encontraron solicitudes.</p>
                    <p className="text-sm mt-1">Intenta ajustando tus parámetros de búsqueda.</p>
                  </td>
                </tr>
              )}
              {currentSolicitudes.map((sol) => {
                const init = (sol.cliente_nombre && typeof sol.cliente_nombre === 'string') 
                    ? sol.cliente_nombre.substring(0,2).toUpperCase() 
                    : 'CL';
                return (
                  <tr 
                    key={sol.id} 
                    className="hover:bg-[#005ab4]/5 transition-colors cursor-pointer group"
                    onClick={() => setSelectedDoc(sol)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-bold text-[#005ab4]">#{sol.id.substring(0,8)}</div>
                      <div className="text-xs font-medium text-slate-500 mt-1">{new Date(sol.creado_en).toLocaleDateString('es-CL')}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm ring-1 ring-slate-200">
                          {init}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm whitespace-nowrap">{sol.cliente_nombre}</p>
                          <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">{formatRut(sol.cliente_rut)} · {sol.cliente_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {sol.servicio?.titulo?.substring(0, 45) || 'Servicio Desconocido'}{sol.servicio?.titulo?.length > 45 && '...'}
                       </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${sol.estado_trabajo === 'listo' ? 'bg-emerald-500' : sol.estado_trabajo === 'en_reparo' ? 'bg-red-500' : sol.estado_trabajo === 'en_revision' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                          <span className={`font-bold text-[13px] ${sol.estado_trabajo === 'listo' ? 'text-emerald-700' : sol.estado_trabajo === 'en_reparo' ? 'text-red-700' : sol.estado_trabajo === 'en_revision' ? 'text-blue-700' : 'text-amber-700'}`}>
                            {sol.estado_trabajo.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        {sol.empleado_asignado?.nombre ? (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            {sol.empleado_asignado.nombre}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">No asignado</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${sol.estado_pago === 'pagado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {sol.estado_pago}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-slate-400 group-hover:text-[#005ab4] transition-colors p-1" onClick={(e) => { e.stopPropagation(); setSelectedDoc(sol); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs font-medium text-slate-500">
            Mostrando {solicitudesFiltradas.length === 0 ? 0 : indexOfFirstItem + 1} a {Math.min(indexOfLastItem, solicitudesFiltradas.length)} de {solicitudesFiltradas.length} solicitudes en total.
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

      {/* Modal Nueva Solicitud */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 lg:p-10 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto relative animate-in slide-in-from-bottom-8 duration-300">
            
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 z-10 flex justify-between items-start bg-white/90 backdrop-blur">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#005ab4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Crear Nueva Solicitud
                </h3>
                <p className="text-xs font-medium text-slate-500">Ingreso manual de trámites gestionados en notaría</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-colors border border-slate-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Nombre Completo *</label>
                  <input required name="nombre" type="text" className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">RUT *</label>
                  <input required name="rut" type="text" className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors" placeholder="Ej. 12.345.678-9" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Email *</label>
                  <input required name="email" type="email" className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors" placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Teléfono</label>
                  <input name="telefono" type="text" className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors" placeholder="+56 9 1234 5678" />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="text-sm font-bold text-slate-700 block mb-2">Trámite a Solicitar *</label>
                <div className="relative">
                  <input type="hidden" name="servicio_id" value={selectedServicioId} required />
                  <input 
                    type="text"
                    value={searchServicio}
                    onChange={(e) => {
                      setSearchServicio(e.target.value);
                      setSelectedServicioId('');
                      setIsServicioDropdownOpen(true);
                    }}
                    onFocus={() => setIsServicioDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsServicioDropdownOpen(false), 200)}
                    placeholder="🔎 Buscar o escribir el trámite..."
                    className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-3 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors"
                    required={!selectedServicioId}
                  />
                  {isServicioDropdownOpen && (
                    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filteredServiciosModal.length > 0 ? (
                        <ul className="py-2">
                          {filteredServiciosModal.map(serv => (
                            <li 
                              key={serv.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSelectedServicioId(serv.id);
                                setSearchServicio(`${serv.titulo} - $${(serv.arancel || 0).toLocaleString('es-CL')}`);
                                setIsServicioDropdownOpen(false);
                              }}
                              className={`px-4 py-2 hover:bg-[#f2f3fd] cursor-pointer text-sm transition-colors ${selectedServicioId === serv.id ? 'bg-[#f2f3fd] text-[#005ab4] font-bold border-l-4 border-[#005ab4]' : 'text-slate-700 border-l-4 border-transparent'}`}
                            >
                              <div className="font-semibold">{serv.titulo}</div>
                              <div className="text-xs text-slate-500 mt-0.5">${(serv.arancel || 0).toLocaleString('es-CL')}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-500 italic">No se encontraron trámites coincidiendo con tu búsqueda.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Método de Pago *</label>
                  <select required name="metodo_pago" className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors cursor-pointer">
                    <option value="getnet">💳 Pago en Línea (Webpay / Getnet)</option>
                    <option value="transferencia">🏦 Transferencia Bancaria</option>
                    <option value="getnet_fisico">📠 POS Local Físico (Getnet)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Estado de Pago Inicial *</label>
                  <select required name="estado_pago" className="w-full text-sm sm:text-base bg-slate-50 border-slate-300 rounded-lg py-2.5 px-3 focus:bg-white focus:border-[#005ab4] focus:ring-[#005ab4] transition-colors cursor-pointer">
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado (Validado por Caja)</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p>Las solicitudes ingresadas manualmente comenzarán en estado <strong>Pendiente</strong> y con la boleta <strong>Sin Emitir</strong>.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowNewModal(false)} className="px-5 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={isCreating} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-[#005ab4] hover:bg-[#00458a] transition-colors disabled:opacity-75 disabled:cursor-not-allowed">
                  {isCreating ? 'Guardando...' : 'Crear Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {!showNewModal && selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 lg:p-10 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative animate-in slide-in-from-bottom-8 duration-300">
            
            {loadingId === selectedDoc.id && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl backdrop-blur-[2px]">
                <span className="text-[#005ab4] font-bold text-lg bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-xl flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-[#005ab4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando cambios...
                </span>
              </div>
            )}

            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 z-0 flex justify-between items-start bg-white/90 backdrop-blur">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                  Detalle de Solicitud
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Código:</span>
                  <span className="bg-[#f2f3fd] text-[#005ab4] px-2.5 py-0.5 rounded-md border border-[#005ab4]/20 font-mono text-sm tracking-widest font-bold">
                    #{selectedDoc.codigo || selectedDoc.id.substring(0,8).toUpperCase()}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-colors border border-slate-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Información Solicitante (Columna 1) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Resumen Price/Service */}
                <div className="bg-[#005ab4] rounded-xl p-6 text-white text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-br from-[#005ab4] to-[#00458a] shadow-lg shadow-[#005ab4]/20">
                  <div className="flex-1">
                    <span className="text-blue-200 text-[10px] uppercase tracking-widest font-bold mb-1 block">Trámite</span>
                    <h4 className="text-lg font-bold leading-tight">{selectedDoc.servicio?.titulo}</h4>
                  </div>
                  <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
                    <span className="text-blue-200 text-[10px] uppercase tracking-widest font-bold mb-1 block">Monto</span>
                    <div className="text-3xl font-black font-serif">${(selectedDoc.servicio?.arancel || 0).toLocaleString('es-CL')}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#005ab4] mb-4">Datos del Solicitante</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Nombre Completo</span>
                       <span className="font-bold text-slate-800 text-sm">{selectedDoc.cliente_nombre}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">RUT</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">{formatRut(selectedDoc.cliente_rut)}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Email</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedDoc.cliente_email}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Teléfono</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedDoc.cliente_telefono}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 sm:col-span-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Dirección Registrada</span>
                       <span className="font-bold text-slate-800 text-sm">{selectedDoc.cliente_direccion || 'No registrada'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 flex gap-4 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 mb-1">Recepción de Archivos</h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Busca los documentos en el correo <strong>tramites@notariatraiguen.cl</strong> referenciando el código <span className="font-mono bg-white px-1 py-0.5 rounded text-amber-900 select-all border border-amber-300">#{selectedDoc.codigo || selectedDoc.id.substring(0,8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Controles Internos (Columna 2) */}
              <div className="lg:col-span-5 relative">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6 sticky top-0">
                  <h4 className="font-extrabold text-[#181c22] border-b border-slate-200 pb-3 flex items-center gap-2">
                    Panel de Acción
                  </h4>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">1. Estado del Pago</label>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Método Elegido: <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{selectedDoc.metodo_pago === 'getnet' ? '💳 Webpay / Getnet' : selectedDoc.metodo_pago === 'transferencia' ? '🏦 Transferencia' : 'Otro / No indicado'}</span></p>

                    <select 
                      value={selectedDoc.estado_pago}
                      onChange={(e) => handleStatusChange(selectedDoc.id, 'pago', e.target.value)}
                      disabled={selectedDoc.getnet_session_id && selectedDoc.estado_pago === 'pagado'}
                      className={`w-full text-sm font-bold rounded-xl border py-3 px-4 shadow-sm outline-none transition-colors disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer ${
                        selectedDoc.estado_pago === 'pagado' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-[#005ab4]'
                      }`}
                    >
                      <option value="pendiente">⏳ PENDIENTE (Esperando)</option>
                      <option value="pagado">✅ PAGADO (Validado)</option>
                      <option value="fallido">❌ FALLIDO / RECHAZADO</option>
                    </select>
                    {selectedDoc.getnet_session_id && selectedDoc.estado_pago === 'pagado' && (
                      <p className="text-[10px] text-emerald-600 font-bold mt-2 bg-emerald-100 p-2 rounded border border-emerald-200">
                        🔒 Pago realizado por Webpay/Getnet. Validado automáticamente.
                      </p>
                    )}
                  </div>

                   <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                          Asignación
                        </label>
                      </div>
                      
                      {selectedDoc.empleado_asignado_id ? (
                        <div className="bg-slate-100 rounded-xl p-3 flex justify-between items-center border border-slate-200">
                          <span className="text-sm font-bold text-slate-700">{selectedDoc.empleado_asignado?.nombre || 'Desconocido'}</span>
                          {(currentUserRole === 'notario' || currentUserRole === 'supervisor' || currentUserId === selectedDoc.empleado_asignado_id) && (
                            <button 
                              onClick={async () => {
                                setLoadingId(selectedDoc.id);
                                await assignSolicitud(selectedDoc.id, null);
                                setSelectedDoc({...selectedDoc, empleado_asignado_id: null, empleado_asignado: null});
                                setLoadingId(null);
                              }}
                              className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-2 py-1 rounded">
                              Liberar
                            </button>
                          )}
                        </div>
                      ) : (
                        <button 
                          onClick={async () => {
                            setLoadingId(selectedDoc.id);
                            await assignSolicitud(selectedDoc.id, currentUserId || null);
                            setSelectedDoc({...selectedDoc, empleado_asignado_id: currentUserId, empleado_asignado: { nombre: 'Yo (Asignado)' }});
                            setLoadingId(null);
                          }}
                          className="w-full text-sm font-bold rounded-xl border border-dashed border-[#005ab4]/40 py-3 px-4 shadow-sm text-[#005ab4] bg-blue-50/50 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>
                          Tomar Solicitud / Asignarme
                        </button>
                      )}
                      
                      {!selectedDoc.empleado_asignado_id && (
                        <p className="text-[10px] text-amber-600 mt-2 font-medium">⚠️ Debes asignarte esta solicitud para poder trabajarla.</p>
                      )}
                  </div>

                  <div className={(selectedDoc.empleado_asignado_id && selectedDoc.empleado_asignado_id !== currentUserId && currentUserRole !== 'notario' && currentUserRole !== 'supervisor') ? 'opacity-50 pointer-events-none' : ''}>
                    <div className="flex justify-between items-end mb-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">2. Progreso Interno</label>
                       {selectedDoc.estado_pago !== 'pagado' && (
                         <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Falta Pago para procesar</span>
                       )}
                     </div>
                    <select 
                      value={selectedDoc.estado_trabajo}
                      onChange={(e) => handleStatusChange(selectedDoc.id, 'trabajo', e.target.value)}
                      disabled={selectedDoc.estado_pago !== 'pagado' || !selectedDoc.empleado_asignado_id}
                      className={`w-full text-sm font-bold rounded-xl border py-3 px-4 shadow-sm outline-none transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                        selectedDoc.estado_trabajo === 'listo' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : selectedDoc.estado_trabajo === 'en_reparo' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-slate-300'
                      }`}
                    >
                      <option value="pendiente">📥 PENDIENTE (Nuevo trámite)</option>
                      <option value="en_revision">⚙️ EN REVISIÓN (Redacción interna)</option>
                      <option value="en_reparo">⚠️ EN REPARO (Incidencia)</option>
                      <option value="listo">🟢 LISTO (Habilitado para firma/retiro)</option>
                    </select>
                  </div>
                  
                  <div>
                     <div className="flex justify-between items-end mb-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">3. Emisión Boleta</label>
                       {selectedDoc.estado_pago !== 'pagado' && (
                         <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">Bloqueado</span>
                       )}
                     </div>
                    <select 
                      value={selectedDoc.estado_boleta || 'sin enviar'}
                      onChange={(e) => handleStatusChange(selectedDoc.id, 'boleta', e.target.value)}
                      disabled={selectedDoc.estado_pago !== 'pagado'}
                      className={`w-full text-sm font-bold rounded-xl border py-3 px-4 shadow-sm outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                        (selectedDoc.estado_boleta || 'sin enviar') === 'enviada' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-300'
                      }`}
                    >
                      <option value="sin enviar">📄 SIN EMITIR</option>
                      <option value="enviada">📧 ENVIADA AL CLIENTE</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
