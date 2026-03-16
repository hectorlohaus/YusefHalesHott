'use client';

import { useState } from 'react';
import { submitSolicitud } from '@/app/actions/solicitar';
import { validateRut } from '@/lib/rut';

type Servicio = {
  id: string;
  titulo: string;
  arancel: number;
  documentos_necesarios?: string;
};

export default function SolicitudForm({ 
  servicios, 
  preselectedId 
}: { 
  servicios: Servicio[]; 
  preselectedId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedId || "");

  const selectedService = servicios.find(s => s.id === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const formRut = formData.get('rut') as string;

    if (!validateRut(formRut)) {
      setErrorMsg('El RUT ingresado no es válido. Por favor verifíquelo.');
      setLoading(false);
      return;
    }

    try {
      const result = await submitSolicitud(formData);
      if (result.success) {
        setSuccess(true);
        // Guardamos el ID para usarlo en el botón
        setTimeout(() => {
          const metaTag = document.querySelector('meta[name="solicitud-id"]') as HTMLMetaElement;
          if (metaTag) metaTag.content = result.solicitudId;
          else {
            const meta = document.createElement('meta');
            meta.name = "solicitud-id";
            meta.content = result.solicitudId;
            document.head.appendChild(meta);
          }
        }, 10);
      } else {
        setErrorMsg(result.error || 'Ocurrió un error al enviar la solicitud.');
      }
    } catch (err: any) {
      setErrorMsg('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-serif text-slate-900 mb-4">¡Solicitud Enviada con Éxito!</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
          Hemos recibido sus datos correctamente. Para continuar, por favor haga clic en el siguiente botón para realizar el pago de su trámite.
        </p>
        <button 
          className="bg-emerald-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2 mx-auto"
          onClick={() => window.location.href = `/checkout?solicitudId=${(document.querySelector('meta[name="solicitud-id"]') as HTMLMetaElement)?.content || ''}`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          IR A PAGAR
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
          <input required type="text" id="nombre" name="nombre" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border" placeholder="Ej. Juan Pérez" />
        </div>
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-1">RUT *</label>
          <input required type="text" id="rut" name="rut" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border" placeholder="12.345.678-9" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico *</label>
          <input required type="email" id="email" name="email" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border" placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1">Teléfono Móvil *</label>
          <input required type="text" id="telefono" name="telefono" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border" placeholder="+56 9 1234 5678" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="direccion" className="block text-sm font-medium text-slate-700 mb-1">Dirección Completa *</label>
          <input required type="text" id="direccion" name="direccion" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border" placeholder="Calle Ejemplo 123, Comuna" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="servicio_id" className="block text-sm font-medium text-slate-700 mb-1">Servicio a Solicitar *</label>
          <select 
            required 
            id="servicio_id" 
            name="servicio_id" 
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border bg-white"
          >
            <option value="" disabled>Seleccione un trámite</option>
            {servicios.map(s => (
              <option key={s.id} value={s.id}>
                {s.titulo} - ${s.arancel.toLocaleString('es-CL')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border border-blue-200 rounded-xl p-6 bg-blue-50/50 text-center">
        <label className="block text-base font-bold text-[#000080] mb-2">Envío de Documentos</label>
        <div className="flex flex-col items-center justify-center gap-3">
          <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-700 max-w-md">
            Luego de completar este formulario y el pago, deberá enviarnos los documentos asociados a su trámite al correo <strong>temucolaw@gmail.com</strong> indicando en el asunto el <strong>código de solicitud</strong> que se generará a continuación.
          </p>

          {selectedService?.documentos_necesarios && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <strong className="text-sm text-[#000080] block mb-2 uppercase tracking-wide">Documentos requeridos para este trámite:</strong>
              <ul className="text-sm text-slate-700 text-left list-disc list-inside space-y-1 mx-auto max-w-sm">
                {selectedService.documentos_necesarios.split(',').map((doc, idx) => (
                  <li key={idx}>{doc.trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full md:w-auto md:px-12 py-3 rounded-lg text-white font-medium shadow-md transition-all ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#000080] hover:bg-blue-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-900'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          ) : 'Continuar al Pago'}
        </button>
      </div>
    </form>
  );
}
