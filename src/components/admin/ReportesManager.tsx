'use client';

import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportesManagerProps {
  solicitudes: any[];
  historial: any[];
  empleados: any[];
  servicios: any[];
}

const formatTimeFromMinutes = (totalMinutes: number) => {
  if (isNaN(totalMinutes) || totalMinutes === 0) return "0h 0m";
  if (totalMinutes < 1) return "< 1m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export default function ReportesManager({ solicitudes, historial, empleados, servicios }: ReportesManagerProps) {
  const [periodo, setPeriodo] = useState('semanal');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const getDates = () => {
    let start = new Date(0);
    let end = new Date(); // To end of 'hasta' strictly handling
    
    if (periodo === 'personalizado') {
      if (fechaDesde) start = new Date(`${fechaDesde}T00:00:00`);
      if (fechaHasta) end = new Date(`${fechaHasta}T23:59:59`);
      return { start, end };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    switch (periodo) {
      case 'hoy': 
        start = todayStart;
        break;
      case 'semanal': 
        start = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000); 
        break;
      case 'mensual': 
        start = new Date(todayStart.getFullYear(), todayStart.getMonth() - 1, todayStart.getDate()); 
        break;
      case 'anual': 
        start = new Date(todayStart.getFullYear() - 1, todayStart.getMonth(), todayStart.getDate()); 
        break;
    }
    return { start, end };
  };

  const { 
    filteredSolicitudes, 
    filteredHistorial,
    ingresosTotales,
    ingresosPorPago,
    tramitesMasSolicitados,
    rendimientoEmpleados,
    promedioGeneralMinutos,
    tramitesCompletados
  } = useMemo(() => {
    const { start: startDate, end: endDate } = getDates();

    const fSolsMap = Object.fromEntries(solicitudes.map(s => [s.id, s]));

    const fSols = solicitudes.filter(s => {
      const d = new Date(s.creado_en);
      return d >= startDate && d <= endDate;
    });

    const fHist = historial.filter(h => {
      const d = new Date(h.creado_en);
      return d >= startDate && d <= endDate;
    });

    let ingresos = 0;
    const pagoBreakdown = { getnet: 0, transferencia: 0, getnet_fisico: 0 };
    const serviciosCount: Record<string, number> = {};

    fSols.forEach(s => {
      if (s.estado_pago === 'pagado') {
        const arancel = Number(s.servicio?.arancel) || 0;
        ingresos += arancel;
        const metodo = s.metodo_pago as keyof typeof pagoBreakdown;
        if (metodo && pagoBreakdown[metodo] !== undefined) {
          pagoBreakdown[metodo] += arancel;
        }
      }
      
      if (s.servicio_id) {
        serviciosCount[s.servicio_id] = (serviciosCount[s.servicio_id] || 0) + 1;
      }
    });

    const topServicios = Object.keys(serviciosCount)
      .sort((a, b) => serviciosCount[b] - serviciosCount[a])
      .slice(0, 3)
      .map(id => ({
        titulo: servicios.find(srv => srv.id === id)?.titulo || 'Servicio Desconocido',
        cantidad: serviciosCount[id]
      }));

    let totalCompletadosGlobal = 0;
    let totalMinutosGlobal = 0;

    // Track logic mapping
    const rendEmpleados: Record<string, { id: string, nombre: string, listos: number, reparos: number, totalMinsListos: number, completadasInfo: Array<{ id: string, titulo: string, min: number }>, servCounter: Record<string, number> }> = {};
    
    empleados.forEach(e => {
        if (e.rol !== 'notario' && e.rol !== 'supervisor') {
             rendEmpleados[e.id] = { id: e.id, nombre: e.nombre, listos: 0, reparos: 0, totalMinsListos: 0, completadasInfo: [], servCounter: {} };
        }
    });

    let countCompletadosGeneralesInsideFilter = 0;

    fHist.forEach(h => {
        if (h.accion === 'cambio_estado') {
             if (h.estado_nuevo === 'listo') {
                countCompletadosGeneralesInsideFilter++;
                
                const originalS = fSolsMap[h.solicitud_id];
                let diffMins = 0;
                let srvTitle = 'Trámite Genérico';
                if (originalS) {
                    diffMins = Math.max(0, (new Date(h.creado_en).getTime() - new Date(originalS.creado_en).getTime()) / 1000 / 60);
                    totalMinutosGlobal += diffMins;
                    totalCompletadosGlobal++;
                    
                    const serv = servicios.find(s => s.id === originalS.servicio_id);
                    if (serv) srvTitle = serv.titulo;
                }

                if (h.usuario_id && rendEmpleados[h.usuario_id]) {
                    rendEmpleados[h.usuario_id].listos++;
                    if (originalS) {
                        rendEmpleados[h.usuario_id].totalMinsListos += diffMins;
                        rendEmpleados[h.usuario_id].completadasInfo.push({
                            id: originalS.codigo || originalS.id.split('-')[0],
                            titulo: srvTitle,
                            min: diffMins
                        });
                        
                        rendEmpleados[h.usuario_id].servCounter[srvTitle] = (rendEmpleados[h.usuario_id].servCounter[srvTitle] || 0) + 1;
                    }
                }
             }

             if (h.estado_nuevo === 'en_reparo' && h.usuario_id && rendEmpleados[h.usuario_id]) {
                 rendEmpleados[h.usuario_id].reparos++;
             }
        }
    });

    const promedioGeneral = totalCompletadosGlobal > 0 ? totalMinutosGlobal / totalCompletadosGlobal : 0;
    const rendimientoFinal = Object.values(rendEmpleados).sort((a,b) => b.listos - a.listos);

    return { 
      filteredSolicitudes: fSols, 
      filteredHistorial: fHist,
      ingresosTotales: ingresos,
      ingresosPorPago: pagoBreakdown,
      tramitesCompletados: countCompletadosGeneralesInsideFilter,
      tramitesMasSolicitados: topServicios,
      rendimientoEmpleados: rendimientoFinal,
      promedioGeneralMinutos: promedioGeneral
    };
  }, [solicitudes, historial, empleados, servicios, periodo, fechaDesde, fechaHasta]);


  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 90, 180);
    doc.text('Reporte de Gestión Avanzado', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Entidad: Notaría Yusef Hales Hott`, 14, 32);
    const periodoStr = periodo === 'personalizado' ? `Custom: ${fechaDesde} al ${fechaHasta}` : periodo.charAt(0).toUpperCase() + periodo.slice(1);
    doc.text(`Período de Análisis: ${periodoStr}`, 14, 38);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 44);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumen General', 14, 56);

    autoTable(doc, {
      startY: 62,
      head: [['Métrica', 'Valor']],
      body: [
        ['Solicitudes Ingresadas', filteredSolicitudes.length.toString()],
        ['Trámites Completados', tramitesCompletados.toString()],
        ['Tiempo Promedio de Proceso', formatTimeFromMinutes(promedioGeneralMinutos)],
        ['Ingresos Totales (Pagados)', `$${ingresosTotales.toLocaleString('es-CL')}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 90, 180] }
    });

    // Rendimiento Empleados
    doc.text('Desempeño de Empleados', 14, (doc as any).lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [['Nombre', 'Trámites puestos en "Listo"', 'Tiempo Promedio/Tramite']],
      body: rendimientoEmpleados.map(e => [
        e.nombre, 
        e.listos, 
        e.listos > 0 ? formatTimeFromMinutes(e.totalMinsListos / e.listos) : '0h 0m'
      ]),
      theme: 'striped',
      headStyles: { fillColor: [180, 90, 0] }
    });

    doc.save(`Reporte_Notaria_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const selectedEmployeeData = useMemo(() => {
    return rendimientoEmpleados.find(r => r.id === selectedEmployeeId);
  }, [selectedEmployeeId, rendimientoEmpleados]);

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-6 px-4 md:px-8 pb-12">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col xl:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-2 gap-4">
        <div className="shrink-0 w-full xl:w-auto text-center xl:text-left">
          <h1 className="text-2xl font-bold text-slate-800">Panel de Métricas</h1>
          <p className="text-sm text-slate-500 mt-1">Análisis de viabilidad, operatividad y finanzas del equipo.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Preset tabs */}
          <div className="flex flex-wrap bg-slate-50 p-1 rounded-lg border border-slate-200 justify-center">
             {['hoy', 'semanal', 'mensual', 'anual', 'todo', 'personalizado'].map(p => (
                 <button
                    key={p}
                    onClick={() => setPeriodo(p)}
                    className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors ${periodo === p ? 'bg-white text-[#005ab4] font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                     {p === 'personalizado' ? 'Por Rango' : p.charAt(0).toUpperCase() + p.slice(1)}
                 </button>
             ))}
          </div>

          {/* Date Range Selectors */}
          {periodo === 'personalizado' && (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 bg-white p-2 border border-[#005ab4]/30 rounded-lg shadow-sm">
              <label className="text-[10px] text-[#005ab4] font-bold uppercase tracking-wider">Desde</label>
              <input type="date" value={fechaDesde} onChange={e=>setFechaDesde(e.target.value)} className="border-none text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded focus:ring-1 focus:ring-[#005ab4] outline-none"/>
              <label className="text-[10px] text-[#005ab4] font-bold uppercase tracking-wider ml-1">Hasta</label>
              <input type="date" value={fechaHasta} onChange={e=>setFechaHasta(e.target.value)} className="border-none text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded focus:ring-1 focus:ring-[#005ab4] outline-none"/>
            </div>
          )}

          <button 
             onClick={handleExportPDF}
             className="flex items-center justify-center gap-2 px-5 py-2 w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* KPI TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* INGRESOS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 -z-0"></div>
           <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Financiero</p>
           </div>
           <div className="relative z-10">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider leading-none">Ingresos Totales (Pagados)</p>
              <h2 className="text-4xl font-black text-slate-800 mt-3">${ingresosTotales.toLocaleString('es-CL')}</h2>
           </div>
        </div>

        {/* TRAMITES LISTOS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 -z-0"></div>
           <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#005ab4]/10 text-[#005ab4] flex items-center justify-center shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Operaciones</p>
           </div>
           <div className="relative z-10">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider leading-none">Trámites Listos</p>
              <div className="flex items-end gap-3 mt-3">
                 <h2 className="text-4xl font-black text-slate-800">{tramitesCompletados}</h2>
                 <p className="text-xs text-slate-400 font-bold mb-1 opacity-80">de {filteredSolicitudes.length} nuevas solic.</p>
              </div>
           </div>
        </div>

        {/* TIEMPO PROMEDIO GENERAL */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 -z-0"></div>
           <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#005ab4] flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Rendimiento</p>
           </div>
           <div className="relative z-10">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider leading-none">Tiempo Promedio</p>
              <div className="flex items-end gap-3 mt-3">
                <h2 className="text-4xl font-black text-[#005ab4] drop-shadow-sm">{formatTimeFromMinutes(promedioGeneralMinutos)}</h2>
              </div>
           </div>
        </div>

        {/* REPAROS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-500 -z-0"></div>
           <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Atención</p>
           </div>
           <div className="relative z-10">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider leading-none">Alertas de Reparo</p>
              <div className="flex items-end gap-3 mt-3">
                 <h2 className="text-4xl font-black text-slate-800">{filteredHistorial.filter(h => h.accion==='cambio_estado' && h.estado_nuevo==='en_reparo').length}</h2>
                 <p className="text-xs text-orange-600 font-bold mb-1 tracking-wide">Tasa de fricción</p>
              </div>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* DESEMPEÑO EMPLEADOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex-1 group hover:shadow-md transition-shadow relative">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Desempeño del Equipo
            </h3>
            <span className="text-[10px] bg-white border border-slate-200 text-indigo-600 px-2 py-1 rounded font-bold uppercase tracking-widest shadow-sm">Click p/ ver detalle</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                 <tr>
                     <th className="px-6 py-4">Empleado</th>
                     <th className="px-6 py-4 text-center">Tpo. Promedio</th>
                     <th className="px-6 py-4 text-center">Gestiones "Listo"</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {rendimientoEmpleados.length === 0 ? (
                   <tr><td colSpan={3} className="p-8 text-center text-slate-400 font-medium">Sin datos de empleados en el periodo.</td></tr>
                 ) : (
                   rendimientoEmpleados.map(e => (
                     <tr key={e.id} onClick={() => setSelectedEmployeeId(e.id)} className="hover:bg-indigo-50/40 transition-colors cursor-pointer">
                       <td className="px-6 py-3 font-medium text-slate-700 transition-colors flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black uppercase shrink-0 shadow-sm">
                            {e.nombre.slice(0, 2)}
                          </div>
                          {e.nombre}
                       </td>
                       <td className="px-6 py-3 text-center">
                          <span className="text-slate-600 font-black text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                             {e.listos > 0 ? formatTimeFromMinutes(e.totalMinsListos / e.listos) : '0h 0m'}
                          </span>
                       </td>
                       <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-1 rounded-full font-black text-xs shadow-sm">
                             {e.listos}
                          </span>
                       </td>
                     </tr>
                   ))
                 )}
              </tbody>
            </table>
          </div>
        </div>

        {/* METODOS PAGO Y TOP SERVICIOS */}
        <div className="flex flex-col gap-6 w-full">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-5 pb-4 border-b border-slate-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Financiamiento por Método
              </h3>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                    <span className="font-semibold text-slate-600 text-sm flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div> Webpay (Getnet)</span>
                    <span className="font-black text-lg text-slate-800">${ingresosPorPago.getnet.toLocaleString('es-CL')}</span>
                 </div>
                 <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                    <span className="font-semibold text-slate-600 text-sm flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></div> Transferencia</span>
                    <span className="font-black text-lg text-slate-800">${ingresosPorPago.transferencia.toLocaleString('es-CL')}</span>
                 </div>
                 <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                    <span className="font-semibold text-slate-600 text-sm flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm"></div> POS Físico</span>
                    <span className="font-black text-lg text-slate-800">${ingresosPorPago.getnet_fisico.toLocaleString('es-CL')}</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-5 pb-4 border-b border-slate-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Ranking de Trámites Solicitados
              </h3>
               <div className="space-y-4">
                 {tramitesMasSolicitados.length === 0 ? (
                    <p className="text-slate-400 text-sm font-medium p-4 text-center">Sin datos para mostrar en el período.</p>
                 ) : (
                    tramitesMasSolicitados.map((srv, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                         <div className="flex justify-between text-xs items-center">
                            <span className="font-bold text-slate-700 truncate pr-4">{srv.titulo}</span>
                            <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded shadow-sm">{srv.cantidad}</span>
                         </div>
                         <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
                            <div className="bg-gradient-to-r from-rose-400 to-rose-500 h-2 rounded-full shadow-sm" style={{ width: `${(srv.cantidad / (tramitesMasSolicitados[0]?.cantidad || 1)) * 100}%`}}></div>
                         </div>
                      </div>
                    ))
                 )}
               </div>
           </div>
        </div>
      </div>

      {/* MODAL DETALLES DEL EMPLEADO */}
      {selectedEmployeeId && selectedEmployeeData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           {/* Modal Overlay Gradient */}
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEmployeeId(null)}></div>
           
           <div className="bg-white w-full max-w-4xl relative shadow-2xl rounded-3xl overflow-hidden flex flex-col md:max-h-[85vh] animate-in zoom-in-[0.98] duration-200 border border-white/20">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#005ab4] to-[#00458a] px-8 py-6 text-white flex justify-between items-center relative overflow-hidden">
                 {/* Decorative background shapes */}
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                 <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
                 
                 <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center font-black text-2xl uppercase border-2 border-blue-300 shadow-inner">
                      {selectedEmployeeData.nombre.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-widest text-blue-200 mb-1 font-bold">Analítica de Empleado</p>
                      <h2 className="font-headline text-3xl font-black leading-tight drop-shadow-md">{selectedEmployeeData.nombre}</h2>
                      <p className="text-xs text-blue-300 mt-1 font-medium">{periodo === 'personalizado' ? `Período Rango Seleccionado` : `Período: ${periodo}`}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedEmployeeId(null)} className="p-2 bg-white/10 hover:bg-white/20 hover:scale-110 rounded-full transition-all flex items-center relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-[#f8fafc]">
                
                {/* Employee KPI Mini-cards */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                   {/* Tramites Resueltos */}
                   <div className="bg-white border-b-4 border-emerald-500 p-5 rounded-2xl flex-1 text-center shadow-lg w-full relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-[2] transition-transform duration-500 z-0 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="mx-auto w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Tramites Resueltos</p>
                        <p className="text-4xl font-black text-slate-800">{selectedEmployeeData.listos}</p>
                      </div>
                   </div>

                   {/* Documentos en Reparo */}
                   <div className="bg-white border-b-4 border-orange-500 p-5 rounded-2xl flex-1 text-center shadow-lg w-full relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-50 rounded-full group-hover:scale-[2] transition-transform duration-500 z-0 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="mx-auto w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Doc. a Reparo</p>
                        <p className="text-4xl font-black text-slate-800">{selectedEmployeeData.reparos}</p>
                      </div>
                   </div>

                   {/* Tiempo Promedio */}
                   <div className="bg-white border-b-4 border-blue-500 p-5 rounded-2xl flex-1 text-center shadow-lg relative overflow-hidden group w-full">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-[2] transition-transform duration-500 z-0 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="mx-auto w-8 h-8 rounded-full bg-blue-50 text-[#005ab4] flex items-center justify-center mb-2">
                          <span className="material-symbols-outlined text-[16px]">timer</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Tiempo Promedio</p>
                        <p className="text-3xl font-black text-[#005ab4] mt-1.5">{selectedEmployeeData.listos > 0 ? formatTimeFromMinutes(selectedEmployeeData.totalMinsListos / selectedEmployeeData.listos) : 'N/A'}</p>
                      </div>
                   </div>
                </div>

                {/* Subsections: Services distribution & Work Log */}
                <div className="flex flex-col lg:flex-row gap-6">
                   
                   {/* Distribution */}
                   <div className="w-full lg:w-1/3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm self-start">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-blue-500">donut_small</span>
                        Servicios Atendidos
                      </h4>
                      <div className="space-y-2.5">
                        {Object.entries(selectedEmployeeData.servCounter).length === 0 ? (
                          <div className="py-6 text-center">
                            <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">inbox</span>
                            <p className="text-xs text-slate-400 font-medium">No hay servicios<br/>registrados</p>
                          </div>
                        ) : (
                          Object.entries(selectedEmployeeData.servCounter).sort((a,b) => b[1] - a[1]).map(([title, count]) => (
                            <div key={title} className="flex justify-between items-center group bg-slate-50 p-2 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                              <span className="text-[11px] text-slate-600 font-bold truncate pr-2 group-hover:text-indigo-600 transition-colors w-full" title={title}>{title}</span>
                              <span className="text-[11px] font-black bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded shadow-sm shrink-0">x{count}</span>
                            </div>
                          ))
                        )}
                      </div>
                   </div>

                   {/* Work Log */}
                   <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[400px]">
                      <div className="p-5 border-b border-slate-100 shrink-0 flex justify-between items-center bg-slate-50/50">
                         <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-indigo-500">format_list_bulleted</span>
                            Desglose de Operaciones
                         </h4>
                         <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">Basado en periodo activo</span>
                      </div>
                      <div className="overflow-y-auto custom-scrollbar flex-1 p-3">
                        {selectedEmployeeData.completadasInfo.length === 0 ? (
                           <div className="flex flex-col items-center justify-center h-full opacity-60">
                              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">history</span>
                              <p className="text-sm font-medium text-slate-500">Sin historial operativo</p>
                           </div>
                        ) : (
                           <ul className="space-y-2">
                             {selectedEmployeeData.completadasInfo.map((info, i) => (
                               <li key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
                                  <div className="flex items-center gap-3">
                                     <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-500 group-hover:border-indigo-200 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                     </div>
                                     <div className="flex flex-col">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.id}</span>
                                       <span className="text-[13px] font-bold text-slate-700 truncate max-w-[200px] md:max-w-[280px]" title={info.titulo}>{info.titulo}</span>
                                     </div>
                                  </div>
                                  <div className="shrink-0 text-right flex flex-col items-end">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tomó</span>
                                    <span className="text-xs font-black bg-blue-50 text-[#005ab4] px-2 py-0.5 rounded shadow-sm border border-blue-100">
                                       {formatTimeFromMinutes(info.min)}
                                    </span>
                                  </div>
                               </li>
                             ))}
                           </ul>
                        )}
                      </div>
                   </div>

                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
