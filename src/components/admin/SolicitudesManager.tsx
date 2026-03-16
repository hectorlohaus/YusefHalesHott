'use client';

import { useState, useMemo } from 'react';
import { updateSolicitud } from '@/app/actions/admin';
import { formatRut } from '@/lib/rut';

export default function SolicitudManager({ initialSolicitudes }: { initialSolicitudes: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  // Filtros
  const [filterFecha, setFilterFecha] = useState('');
  const [filterId, setFilterId] = useState('');
  const [filterRut, setFilterRut] = useState('');
  const [filterEstadoPago, setFilterEstadoPago] = useState('');
  const [filterEstadoBoleta, setFilterEstadoBoleta] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleStatusChange = async (solicitudId: string, type: 'trabajo' | 'boleta' | 'pago', value: string) => {
    // Si queremos enviar la boleta pero el pago NO está pagado, lo bloqueamos
    if (type === 'boleta' && value === 'enviada') {
       const isCurrentPaid = selectedDoc?.estado_pago === 'pagado';
       if (!isCurrentPaid) {
         alert("No se puede marcar la boleta/factura como ENVIADA si el estado del pago no está PAGADO.");
         return;
       }
    }

    setLoadingId(solicitudId);
    await updateSolicitud(solicitudId, type as any, value);
    
    if (selectedDoc && selectedDoc.id === solicitudId) {
      setSelectedDoc({
        ...selectedDoc,
        [type === 'trabajo' ? 'estado_trabajo' : type === 'boleta' ? 'estado_boleta' : 'estado_pago']: value
      });
    }

    setLoadingId(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'en_proceso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'listo': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pagado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'fallido': return 'bg-red-100 text-red-800 border-red-200';
      case 'enviada': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sin enviar': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Filtrado de solicitudes en memoria
  const solicitudesFiltradas = useMemo(() => {
    // Reset page to 1 whenever filters change
    setCurrentPage(1);

    return initialSolicitudes.filter(sol => {
      // 1. Ocultar pagos fallidos por defecto
      if (sol.estado_pago === 'fallido') return false;

      // 2. Filtro Fecha (Y-M-D parcial match es suficiente para este caso simple, o un exact match local date)
      if (filterFecha) {
        const solDate = new Date(sol.creado_en).toISOString().split('T')[0];
        if (solDate !== filterFecha) return false;
      }

      // 3. Filtro ID corto
      if (filterId && !sol.id.toLowerCase().includes(filterId.toLowerCase())) return false;

      // 4. Filtro RUT
      if (filterRut) {
        const cleanRutFilter = filterRut.replace(/[^0-9kK]/g, '').toLowerCase();
        const cleanSolRut = sol.cliente_rut.replace(/[^0-9kK]/g, '').toLowerCase();
        if (!cleanSolRut.includes(cleanRutFilter)) return false;
      }

      // 5. Filtro Estado Pago
      if (filterEstadoPago && sol.estado_pago !== filterEstadoPago) return false;

      // 6. Filtro Estado Boleta
      if (filterEstadoBoleta && (sol.estado_boleta || 'sin enviar') !== filterEstadoBoleta) return false;

      return true;
    });
  }, [initialSolicitudes, filterFecha, filterId, filterRut, filterEstadoPago, filterEstadoBoleta]);

  // Cálculo de Paginación
  const totalPages = Math.ceil(solicitudesFiltradas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitudes = solicitudesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800 font-serif">Solicitudes Ingresadas</h2>
           <span className="text-sm text-slate-500 mt-1 block">Mostrando {solicitudesFiltradas.length} resultados (Se ocultan pagos fallidos)</span>
        </div>
      </div>

      {/* Barra de Filtros (Texto grande para accesibilidad) */}
      <div className="bg-white p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
         <div>
           <label className="text-sm font-semibold text-slate-700 block mb-1">Buscar por ID</label>
           <input type="text" value={filterId} onChange={e => setFilterId(e.target.value)} placeholder="Ej. A1B2" className="w-full text-base border-slate-300 rounded-lg px-3 py-2" />
         </div>
         <div>
           <label className="text-sm font-semibold text-slate-700 block mb-1">Buscar por RUT</label>
           <input type="text" value={filterRut} onChange={e => setFilterRut(e.target.value)} placeholder="12345678-9" className="w-full text-base border-slate-300 rounded-lg px-3 py-2" />
         </div>
         <div>
           <label className="text-sm font-semibold text-slate-700 block mb-1">Filtrar Fecha</label>
           <input type="date" value={filterFecha} onChange={e => setFilterFecha(e.target.value)} className="w-full text-base border-slate-300 rounded-lg px-3 py-2" />
         </div>
         <div>
           <label className="text-sm font-semibold text-slate-700 block mb-1">Estado Pago</label>
           <select value={filterEstadoPago} onChange={e => setFilterEstadoPago(e.target.value)} className="w-full text-base border-slate-300 rounded-lg px-3 py-2">
             <option value="">Todos</option>
             <option value="pendiente">Pendiente</option>
             <option value="pagado">Pagado</option>
           </select>
         </div>
         <div>
           <label className="text-sm font-semibold text-slate-700 block mb-1">Estado Facturación</label>
           <select value={filterEstadoBoleta} onChange={e => setFilterEstadoBoleta(e.target.value)} className="w-full text-base border-slate-300 rounded-lg px-3 py-2">
             <option value="">Todos</option>
             <option value="sin enviar">Sin Enviar</option>
             <option value="enviada">Enviada</option>
           </select>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">ID / Fecha</th>
              <th className="px-6 py-4 font-bold">Cliente</th>
              <th className="px-6 py-4 font-bold">Trámite</th>
              <th className="px-6 py-4 font-bold">Pago</th>
              <th className="px-6 py-4 font-bold">Trabajo</th>
              <th className="px-6 py-4 font-bold">Facturación</th>
              <th className="px-6 py-4 font-bold text-right">Fecha Ingreso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentSolicitudes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-lg text-slate-500">No hay solicitudes que coincidan con la búsqueda.</td>
              </tr>
            )}
            {currentSolicitudes.map((sol) => (
              <tr key={sol.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => setSelectedDoc(sol)}>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base font-mono font-bold text-[#000080]">#{sol.id.substring(0,8)}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-base font-bold text-slate-900">{sol.cliente_nombre}</div>
                  <div className="text-sm text-slate-600 font-mono">{formatRut(sol.cliente_rut)}</div>
                </td>
                <td className="px-6 py-5 text-base text-slate-800">
                  {sol.servicio?.titulo?.substring(0, 30)}...
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                   <span className={`inline-block px-3 py-1.5 text-sm font-bold rounded border ${getStatusColor(sol.estado_pago)}`}>
                    {sol.estado_pago.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1.5 text-sm font-bold rounded border ${getStatusColor(sol.estado_trabajo)}`}>
                    {sol.estado_trabajo.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1.5 text-sm font-bold rounded border ${getStatusColor(sol.estado_boleta || 'sin enviar')}`}>
                    {(sol.estado_boleta || 'sin enviar').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <div className="text-base font-bold text-slate-800">{new Date(sol.creado_en).toLocaleDateString('es-CL')}</div>
                  <div className="text-sm text-slate-500">{new Date(sol.creado_en).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit'})}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-600 font-medium">
            Mostrando del {indexOfFirstItem + 1} al {Math.min(indexOfLastItem, solicitudesFiltradas.length)} de {solicitudesFiltradas.length} solicitudes
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors bg-white text-slate-700"
            >
              &larr; Anterior
            </button>
            <span className="flex items-center justify-center px-4 font-bold text-slate-700">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors bg-white text-slate-700"
            >
              Siguiente &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Modal de Detalles / Edición (Fuentes más grandes) */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 lg:p-10 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto relative">
            
            {loadingId === selectedDoc.id && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl backdrop-blur-[2px]">
                <span className="text-[#000080] font-bold text-xl bg-white px-8 py-4 rounded-2xl shadow-2xl border border-slate-200">Guardando cambios...</span>
              </div>
            )}

            <div className="sticky top-0 bg-white border-b border-slate-200 flex justify-between items-center px-8 py-6 z-0 shadow-sm">
              <h3 className="text-2xl font-bold font-serif text-[#000080]">Gestionar Solicitud #{selectedDoc.id.substring(0,8)}</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-3 rounded-full transition-colors flex items-center gap-2 font-bold">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                <span>Cerrar</span>
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Información de Sólo Lectura */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-500 mb-3 border-b-2 border-slate-100 pb-2">Datos del Solicitante</h4>
                  <ul className="text-base space-y-3 text-slate-800">
                    <li className="flex"><span className="font-bold w-28 text-slate-500 shrink-0">Nombre:</span> <span>{selectedDoc.cliente_nombre}</span></li>
                    <li className="flex"><span className="font-bold w-28 text-slate-500 shrink-0">RUT:</span> <span className="font-mono">{formatRut(selectedDoc.cliente_rut)}</span></li>
                    <li className="flex"><span className="font-bold w-28 text-slate-500 shrink-0">Email:</span> <span>{selectedDoc.cliente_email}</span></li>
                    <li className="flex"><span className="font-bold w-28 text-slate-500 shrink-0">Teléfono:</span> <span>{selectedDoc.cliente_telefono}</span></li>
                    <li className="flex"><span className="font-bold w-28 text-slate-500 shrink-0">Dirección:</span> <span>{selectedDoc.cliente_direccion}</span></li>
                    <li className="flex mt-2 pt-2 border-t border-slate-100">
                      <span className="font-bold w-28 text-[#000080] shrink-0">Método Pago:</span> 
                      <span className="font-bold">
                        {selectedDoc.getnet_session_id ? '🌐 Webpay / Getnet (Tarjeta)' : '🏦 Transferencia Bancaria'}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-500 mb-3 border-b-2 border-slate-100 pb-2">Recepción de Documentos</h4>
                  <p className="text-base text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    Los documentos asociados a este trámite deben ser verificados en la bandeja de entrada del correo <strong>temucolaw@gmail.com</strong>, buscando por el código <strong>#{selectedDoc.codigo || selectedDoc.id.substring(0,8).toUpperCase()}</strong>.
                  </p>
                </div>
              </div>

              {/* Controles Interactivos */}
              <div className="bg-slate-50 shadow-inner rounded-2xl p-8 border border-slate-200 space-y-8">
                <h4 className="font-bold text-xl text-slate-800 border-b-2 border-slate-200 pb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Controles de Estado Activo
                </h4>
                
                <div>
                  <label className="text-sm font-bold text-slate-600 uppercase mb-2 block">1. Estado del Pago (Transferencias / Getnet)</label>
                  <select 
                    value={selectedDoc.estado_pago}
                    onChange={(e) => handleStatusChange(selectedDoc.id, 'pago', e.target.value)}
                    disabled={selectedDoc.getnet_session_id && selectedDoc.estado_pago === 'pagado'}
                    className={`w-full text-lg font-bold rounded-xl border-2 py-3 px-4 shadow-sm focus:ring-4 focus:ring-blue-100 outline-none transition-colors disabled:opacity-75 disabled:cursor-not-allowed ${getStatusColor(selectedDoc.estado_pago)}`}
                  >
                    <option value="pendiente">⏳ PENDIENTE (Esperando pago)</option>
                    <option value="pagado">✅ PAGADO (Aprobado y Validado)</option>
                    <option value="fallido">❌ FALLIDO / RECHAZADO</option>
                  </select>
                  {selectedDoc.getnet_session_id && selectedDoc.estado_pago === 'pagado' && (
                    <p className="text-xs text-blue-600 font-bold mt-2 bg-blue-50 p-2 rounded border border-blue-100 italic">
                      🔒 Pago aprobado automáticamente por Getnet. No se puede modificar.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600 uppercase mb-2 block">2. Progreso del Trámite Interno</label>
                  <select 
                    value={selectedDoc.estado_trabajo}
                    onChange={(e) => handleStatusChange(selectedDoc.id, 'trabajo', e.target.value)}
                    className={`w-full text-lg font-bold rounded-xl border-2 py-3 px-4 shadow-sm focus:ring-4 focus:ring-blue-100 outline-none transition-colors ${getStatusColor(selectedDoc.estado_trabajo)}`}
                  >
                    <option value="pendiente">📥 PENDIENTE (Nuevo en Bandeja)</option>
                    <option value="en_proceso">⚙️ EN PROCESO (En redacción / Notario)</option>
                    <option value="listo">🟢 LISTO (Finalizado / Para Retiro)</option>
                  </select>
                </div>
                
                <div>
                   <div className="flex justify-between items-end mb-2">
                     <label className="text-sm font-bold text-slate-600 uppercase block">3. Facturación / Envío Boleta</label>
                     {selectedDoc.estado_pago !== 'pagado' && (
                       <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Bloqueado (No pagado)</span>
                     )}
                   </div>
                  <select 
                    value={selectedDoc.estado_boleta || 'sin enviar'}
                    onChange={(e) => handleStatusChange(selectedDoc.id, 'boleta', e.target.value)}
                    disabled={selectedDoc.estado_pago !== 'pagado'}
                    className={`w-full text-lg font-bold rounded-xl border-2 py-3 px-4 shadow-sm focus:ring-4 focus:ring-blue-100 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(selectedDoc.estado_boleta || 'sin enviar')}`}
                  >
                    <option value="sin enviar">📄 SIN EMITIR / SIN ENVIAR</option>
                    <option value="enviada">📧 ENVIADA AL CLIENTE</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
