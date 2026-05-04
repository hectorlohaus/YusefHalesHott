'use client';

import { useState } from 'react';
import { updateHorarios } from '@/app/actions/horarios';

export default function HorariosForm({ horarios }: { horarios: any }) {
  const [tipoHorario, setTipoHorario] = useState(horarios.tipo_horario || 'partido');

  return (
    <form action={updateHorarios} className="space-y-8">
      {/* Selector de Modo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">tune</span>
          Modo de Operación
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className={`flex-1 flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${horarios.modo_actual === 'normal' ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
            <input type="radio" name="modo_actual" value="normal" defaultChecked={horarios.modo_actual === 'normal'} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
            <div className="ml-3">
              <span className="block text-sm font-medium text-gray-900">Horario Normal</span>
              <span className="block text-xs text-gray-500">Muestra la jornada predeterminada.</span>
            </div>
          </label>

          <label className={`flex-1 flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${horarios.modo_actual === 'especial' ? 'bg-amber-50 border-amber-500' : 'hover:bg-gray-50'}`}>
            <input type="radio" name="modo_actual" value="especial" defaultChecked={horarios.modo_actual === 'especial'} className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
            <div className="ml-3">
              <span className="block text-sm font-medium text-gray-900">Cerrar Notaría (Feriado/Evento)</span>
              <span className="block text-xs text-gray-500">Oculta los horarios y muestra un aviso de cierre en toda la web.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuración Horario Normal */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600">schedule</span>
            Horarios Habituales
          </h2>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipo_horario" value="partido" checked={tipoHorario === 'partido'} onChange={() => setTipoHorario('partido')} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Partido</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipo_horario" value="corrido" checked={tipoHorario === 'corrido'} onChange={() => setTipoHorario('corrido')} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Corrido</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipo_horario" value="mixto" checked={tipoHorario === 'mixto'} onChange={() => setTipoHorario('mixto')} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Mixto (Partido L-J, Corrido V)</span>
              </label>
            </div>

            {(tipoHorario === 'partido' || tipoHorario === 'mixto') && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">Jornada Mañana {tipoHorario === 'mixto' ? '(Lunes a Jueves)' : ''}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Apertura</label>
                      <input type="time" name="manana_inicio" defaultValue={horarios.manana_inicio} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Cierre</label>
                      <input type="time" name="manana_fin" defaultValue={horarios.manana_fin} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                  </div>
                  {tipoHorario === 'partido' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Días aplicables</label>
                      <input type="text" name="manana_dias" defaultValue={horarios.manana_dias} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                  )}
                  {tipoHorario === 'mixto' && (
                    <input type="hidden" name="manana_dias" value="Lunes a Jueves" />
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">Jornada Tarde {tipoHorario === 'mixto' ? '(Lunes a Jueves)' : ''}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Apertura</label>
                      <input type="time" name="tarde_inicio" defaultValue={horarios.tarde_inicio} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Cierre</label>
                      <input type="time" name="tarde_fin" defaultValue={horarios.tarde_fin} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                  </div>
                  {tipoHorario === 'partido' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Días aplicables</label>
                      <input type="text" name="tarde_dias" defaultValue={horarios.tarde_dias} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                  )}
                  {tipoHorario === 'mixto' && (
                    <input type="hidden" name="tarde_dias" value="Lunes a Jueves" />
                  )}
                </div>
              </>
            )}

            {(tipoHorario === 'corrido' || tipoHorario === 'mixto') && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Jornada de Corrido {tipoHorario === 'mixto' ? '(Viernes)' : ''}</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Apertura</label>
                    <input type="time" name="corrido_inicio" defaultValue={horarios.corrido_inicio || '09:00'} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Cierre</label>
                    <input type="time" name="corrido_fin" defaultValue={horarios.corrido_fin || '17:00'} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
                </div>
                {tipoHorario === 'corrido' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Días aplicables</label>
                    <input type="text" name="corrido_dias" defaultValue={horarios.corrido_dias || 'Lunes a Viernes'} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
                )}
                {tipoHorario === 'mixto' && (
                  <input type="hidden" name="corrido_dias" value="Viernes" />
                )}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Mensaje de Cierre Semanal</h3>
              <input type="text" name="mensaje_viernes" defaultValue={horarios.mensaje_viernes} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ej: Viernes por la tarde: Cerrado." />
            </div>
          </div>
        </div>

        {/* Configuración Horario Especial */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">warning</span>
            Cierre por Feriado o Evento Especial
          </h2>
          <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100 flex-grow">
            <p className="text-sm text-amber-800 mb-6">
              Esta información se mostrará de forma destacada en la página principal y sección de contacto cuando se active el <strong>Modo de Cierre</strong>.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Aviso</label>
                <input type="text" name="especial_titulo" defaultValue={horarios.especial_titulo} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" placeholder="Ej: Cerrado por Feriado Irrenunciable" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Detalles</label>
                <textarea name="especial_mensaje" rows={4} defaultValue={horarios.especial_mensaje} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" placeholder="Ej: Informamos que la notaría permanecerá cerrada el día de hoy..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button type="submit" className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}
