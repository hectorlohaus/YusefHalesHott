'use client';

import { useState } from 'react';
import { submitReclamo } from '@/app/actions/reclamos';
import Link from 'next/link';

export default function ReclamosPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const result = await submitReclamo(formData);
    
    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(result.error || 'Error desconocido');
    }
    setLoading(false);
  };

  return (
    <div className="bg-background text-on-background font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant min-h-screen relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-2/3 h-2/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-container-low to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-surface-container-high rounded-full blur-[120px] opacity-20"></div>
      
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto w-full relative z-10">
        
        {/* Header Section */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="text-secondary font-semibold tracking-widest uppercase text-sm mb-4 block">Atención al Cliente</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-on-surface leading-tight tracking-tight">
              Reclamos y Sugerencias
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed border-l-2 border-secondary-container pl-6 italic">
              Su opinión es el pilar fundamental para la excelencia de nuestra gestión notarial.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        {success ? (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-12px_rgba(19,27,46,0.06)] p-8 md:p-16 text-center border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/5 opacity-50"></div>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-secondary text-5xl md:text-6xl mb-6 bg-secondary/10 p-4 rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h3 className="text-2xl md:text-3xl font-bold text-on-surface mb-4 font-headline">¡Enviado con Éxito!</h3>
              <p className="text-on-surface-variant font-body mb-10 text-base md:text-lg max-w-lg mx-auto">Hemos recibido su información correctamente. Nuestro equipo legal revisará su caso a la brevedad.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-8 py-4 bg-surface-container-high text-on-surface font-label font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors rounded-xl shadow-sm border border-outline-variant/20"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-12px_rgba(19,27,46,0.06)] p-8 md:p-12 relative border border-outline-variant/10">
            {errorMsg && (
              <div className="bg-error-container text-on-error-container p-4 mb-8 rounded-lg shadow-sm border border-error/20 flex gap-3 items-center">
                 <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                 <p className="font-body text-sm font-medium">{errorMsg}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Type (Asymmetric Bento Element) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary scale-75">category</span>
                    Tipo de Solicitud
                  </label>
                  <div className="relative">
                    <select name="tipo" required className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-secondary/20 appearance-none font-body">
                      <option value="">Seleccione una opción</option>
                      <option value="Reclamo">Reclamo</option>
                      <option value="Sugerencia">Sugerencia</option>
                      <option value="Felicitación">Felicitación</option>
                      <option value="Consulta General">Consulta General</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary scale-75">person</span>
                    Nombre Completo
                  </label>
                  <input required name="nombre_cliente" className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/20 font-body" placeholder="Ej. Juan Pérez Soto" type="text"/>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary scale-75">mail</span>
                  Correo Electrónico
                </label>
                <input required name="email" className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/20 font-body" placeholder="contacto@ejemplo.com" type="email"/>
              </div>

              {/* Message Area */}
              <div className="space-y-3">
                <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary scale-75">edit_note</span>
                  Mensaje o Descripción
                </label>
                <textarea required name="mensaje" className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/20 resize-none font-body" placeholder="Por favor, detalle su requerimiento de forma clara..." rows={6}></textarea>
              </div>

              {/* Action Section */}
              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-3 max-w-sm">
                  <input required className="mt-1 rounded text-secondary focus:ring-secondary border-outline-variant bg-surface-container-low" id="privacy" type="checkbox"/>
                  <label className="text-xs text-on-surface-variant leading-tight" htmlFor="privacy">
                    Acepto el tratamiento de mis datos personales de acuerdo a la <Link className="text-secondary font-medium underline underline-offset-2" href="/legal/privacidad">Política de Privacidad</Link> de Notaría Traiguén.
                  </label>
                </div>
                <button disabled={loading} className="w-full md:w-auto bg-primary text-on-primary px-10 py-5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95 group disabled:opacity-50" type="submit">
                  {loading ? 'ENVIANDO...' : 'ENVIAR FORMULARIO'}
                  {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>}
                </button>
              </div>
            </form>

            {/* Decorative Element */}
            <div className="absolute -top-6 -right-6 hidden lg:block pointer-events-none">
              <div className="w-32 h-32 rounded-full border border-secondary/10 flex items-center justify-center p-4 bg-surface-container-lowest shadow-sm z-10">
                <div className="w-full h-full rounded-full border-2 border-dashed border-secondary/30 animate-[spin_20s_linear_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Post-Form Info (Tonal Layering) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-3 border border-outline-variant/10 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-secondary text-3xl">model_training</span>
            <h3 className="font-bold text-on-surface">Mejora Continua</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Sus comentarios nos permiten evaluar y optimizar de manera constante la calidad de nuestra gestión notarial.</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-3 border border-outline-variant/10 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-secondary text-3xl">verified_user</span>
            <h3 className="font-bold text-on-surface">Confidencialidad</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Toda la información proporcionada es tratada bajo estrictos estándares de privacidad y seguridad.</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg flex flex-col gap-3 border border-outline-variant/10 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-secondary text-3xl">call</span>
            <h3 className="font-bold text-on-surface">Atención Telefónica</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Si requiere asistencia inmediata de parte de nuestro equipo, contáctenos directamente al +56 44 305 1909.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
