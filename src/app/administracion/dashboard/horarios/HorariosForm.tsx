'use client';

import { useState } from 'react';
import { updateHorarios } from '@/app/actions/horarios';

export default function HorariosForm({ horarios }: { horarios: any }) {
  const [tipoHorario, setTipoHorario] = useState(horarios.tipo_horario || 'partido');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setSuccessMessage(null);
    try {
      await updateHorarios(formData);
      
      const modo = formData.get('modo_actual');
      if (modo === 'especial') {
        setSuccessMessage('✅ Notaría Cerrada: El modo de cierre por feriado/evento ha sido activado y es visible para el público.');
      } else {
        const tipo = formData.get('tipo_horario');
        let detalle = '';
        if (tipo === 'mixto') {
          detalle = `Mixto (L-J: ${formData.get('manana_inicio')} - ${formData.get('manana_fin')} y ${formData.get('tarde_inicio')} - ${formData.get('tarde_fin')} | V: ${formData.get('corrido_inicio')} - ${formData.get('corrido_fin')})`;
        } else if (tipo === 'corrido') {
          detalle = `Corrido (${formData.get('corrido_inicio')} - ${formData.get('corrido_fin')})`;
        } else {
          detalle = `Partido (${formData.get('manana_inicio')} - ${formData.get('manana_fin')} y ${formData.get('tarde_inicio')} - ${formData.get('tarde_fin')})`;
        }
        setSuccessMessage(`✅ Horario Público Actualizado. Configuración activa: ${detalle}. Estado: Abierto.`);
      }
    } catch (e: any) {
      alert(e.message || 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
      // Auto-hide success message after 8 seconds
      setTimeout(() => setSuccessMessage(null), 8000);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      {successMessage && (
        <div className="fixed bottom-8 right-8 z-[100] max-w-md w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-5 shadow-2xl flex items-start gap-4 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <span className="material-symbols-outlined text-emerald-600 text-2xl animate-bounce">check_circle</span>
          <div className="flex-grow">
            <p className="font-bold text-emerald-900 mb-1">¡Cambios Guardados!</p>
            <p className="font-medium text-sm leading-relaxed">{successMessage}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-700 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      )}

      {/* Selector de Modo */}
      <div className="bg-gradient-to-br from-white to-slate-50/80 p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">tune</span>
          </div>
          Modo de Operación
        </h2>
        <div className="flex flex-col sm:flex-row gap-5 relative z-10">
          <label className={`group flex-1 flex items-start p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${horarios.modo_actual === 'normal' ? 'bg-indigo-50/50 border-indigo-600 shadow-md ring-4 ring-indigo-600/10' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
            <div className="flex items-center h-6">
              <input type="radio" name="modo_actual" value="normal" defaultChecked={horarios.modo_actual === 'normal'} className="h-5 w-5 text-indigo-600 border-slate-300 focus:ring-indigo-600 transition-all cursor-pointer" />
            </div>
            <div className="ml-4">
              <span className={`block text-base font-bold transition-colors ${horarios.modo_actual === 'normal' ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'}`}>Horario Normal</span>
              <span className="block text-sm text-slate-500 mt-1">Muestra la jornada predeterminada y abre la notaría.</span>
            </div>
          </label>

          <label className={`group flex-1 flex items-start p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${horarios.modo_actual === 'especial' ? 'bg-orange-50/50 border-orange-500 shadow-md ring-4 ring-orange-500/10' : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-slate-50'}`}>
            <div className="flex items-center h-6">
              <input type="radio" name="modo_actual" value="especial" defaultChecked={horarios.modo_actual === 'especial'} className="h-5 w-5 text-orange-600 border-slate-300 focus:ring-orange-600 transition-all cursor-pointer" />
            </div>
            <div className="ml-4">
              <span className={`block text-base font-bold transition-colors ${horarios.modo_actual === 'especial' ? 'text-orange-900' : 'text-slate-700 group-hover:text-orange-700'}`}>Cerrar Notaría (Feriado/Evento)</span>
              <span className="block text-sm text-slate-500 mt-1">Oculta los horarios y muestra un aviso de cierre en toda la web.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuración Horario Normal */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-emerald-500/10"></div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3 relative z-10">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            Horarios Habituales
          </h2>

          <div className="space-y-8 relative z-10">
            <div className="flex flex-col sm:flex-row gap-3">
              {['partido', 'corrido', 'mixto'].map((tipo) => (
                <label key={tipo} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${tipoHorario === tipo ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-emerald-200'}`}>
                  <input type="radio" name="tipo_horario" value={tipo} checked={tipoHorario === tipo} onChange={() => setTipoHorario(tipo)} className="hidden" />
                  <span className="text-sm font-bold capitalize">{tipo === 'mixto' ? 'Mixto (L-J / V)' : tipo}</span>
                </label>
              ))}
            </div>

            {(tipoHorario === 'partido' || tipoHorario === 'mixto') && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">light_mode</span>
                    Jornada Mañana {tipoHorario === 'mixto' ? '(Lunes a Jueves)' : ''}
                  </h3>
                  <div className="grid grid-cols-2 gap-5 mb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Apertura</label>
                      <input type="time" name="manana_inicio" defaultValue={horarios.manana_inicio} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cierre</label>
                      <input type="time" name="manana_fin" defaultValue={horarios.manana_fin} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                    </div>
                  </div>
                  {tipoHorario === 'partido' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Días aplicables</label>
                      <input type="text" name="manana_dias" defaultValue={horarios.manana_dias} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                    </div>
                  )}
                  {tipoHorario === 'mixto' && (
                    <input type="hidden" name="manana_dias" value="Lunes a Jueves" />
                  )}
                </div>

                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500 text-lg">dark_mode</span>
                    Jornada Tarde {tipoHorario === 'mixto' ? '(Lunes a Jueves)' : ''}
                  </h3>
                  <div className="grid grid-cols-2 gap-5 mb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Apertura</label>
                      <input type="time" name="tarde_inicio" defaultValue={horarios.tarde_inicio} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cierre</label>
                      <input type="time" name="tarde_fin" defaultValue={horarios.tarde_fin} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                    </div>
                  </div>
                  {tipoHorario === 'partido' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Días aplicables</label>
                      <input type="text" name="tarde_dias" defaultValue={horarios.tarde_dias} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                    </div>
                  )}
                  {tipoHorario === 'mixto' && (
                    <input type="hidden" name="tarde_dias" value="Lunes a Jueves" />
                  )}
                </div>
              </div>
            )}

            {(tipoHorario === 'corrido' || tipoHorario === 'mixto') && (
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2">
                <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-500 text-lg">timelapse</span>
                  Jornada de Corrido {tipoHorario === 'mixto' ? '(Viernes)' : ''}
                </h3>
                <div className="grid grid-cols-2 gap-5 mb-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Apertura</label>
                    <input type="time" name="corrido_inicio" defaultValue={horarios.corrido_inicio || '09:00'} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cierre</label>
                    <input type="time" name="corrido_fin" defaultValue={horarios.corrido_fin || '17:00'} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                  </div>
                </div>
                {tipoHorario === 'corrido' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Días aplicables</label>
                    <input type="text" name="corrido_dias" defaultValue={horarios.corrido_dias || 'Lunes a Viernes'} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" />
                  </div>
                )}
                {tipoHorario === 'mixto' && (
                  <input type="hidden" name="corrido_dias" value="Viernes" />
                )}
              </div>
            )}

            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">event_busy</span>
                Mensaje de Cierre Semanal
              </h3>
              <input type="text" name="mensaje_viernes" defaultValue={horarios.mensaje_viernes} className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-medium py-2.5 transition-all hover:border-slate-300" placeholder="Ej: Fines de semana y festivos cerrados." />
            </div>
          </div>
        </div>

        {/* Configuración Horario Especial */}
        <div className="bg-gradient-to-br from-white to-orange-50/50 p-8 rounded-3xl shadow-sm border border-orange-200/60 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-all duration-700 group-hover:bg-orange-500/10"></div>
          
          <h2 className="text-2xl font-bold text-orange-900 mb-8 flex items-center gap-3 relative z-10">
            <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">warning</span>
            </div>
            Cierre Temporal
          </h2>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-orange-100 flex-grow shadow-sm relative z-10">
            <p className="text-sm text-orange-800 mb-8 leading-relaxed font-medium">
              Al activar el <strong className="text-orange-900 bg-orange-200/50 px-2 py-0.5 rounded">Modo de Cierre</strong> arriba, esta información reemplazará tus horarios habituales en toda la web.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-orange-800 uppercase tracking-wider mb-2">Título del Aviso</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-orange-400 text-lg">title</span>
                  </div>
                  <input type="text" name="especial_titulo" defaultValue={horarios.especial_titulo} className="block w-full pl-10 rounded-xl border-orange-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm font-medium py-3 transition-all hover:border-orange-300 placeholder:text-orange-300" placeholder="Ej: Cerrado por Feriado Irrenunciable" />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-orange-800 uppercase tracking-wider mb-2">Mensaje de Detalles</label>
                <textarea name="especial_mensaje" rows={5} defaultValue={horarios.especial_mensaje} className="block w-full rounded-xl border-orange-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm font-medium p-4 transition-all hover:border-orange-300 placeholder:text-orange-300 resize-none leading-relaxed" placeholder="Ej: Informamos a nuestra comunidad que la notaría permanecerá cerrada el día de hoy. Retomaremos nuestras actividades..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end pt-6">
        <button 
          type="submit" 
          disabled={isSaving}
          className="group relative inline-flex justify-center items-center gap-2 py-3.5 px-8 shadow-lg shadow-indigo-600/20 text-sm font-bold rounded-full text-white bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">sync</span>
              Guardando Configuración...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">save</span>
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </form>
  );
}
