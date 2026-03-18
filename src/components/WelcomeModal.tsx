'use client';

import { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si ya mostramos el modal en esta sesión
    const hasSeenModal = sessionStorage.getItem('hasSeenWelcomeModal');
    
    if (!hasSeenModal) {
      // Pequeño retraso para que la animación se vea bien al entrar
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenWelcomeModal', 'true');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-[#000080] p-6 text-center relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-1"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="modal-title" className="text-2xl font-serif font-bold text-white">
            Información Importante
          </h2>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Horarios de Atención</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Lunes a Jueves:</strong> 09:00 a 14:00 hrs. y 15:00 a 17:00 hrs.<br/>
                <strong>Viernes:</strong> 09:00 a 14:00 hrs.<br/>
                <strong>Sábado y Domingo:</strong> Cerrado
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Correo Electrónico</h3>
              <p className="text-slate-600 text-sm">
                <a href="mailto:notariatraiguen@gmail.com" className="hover:text-blue-600 transition-colors">
                  notariatraiguen@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Teléfonos</h3>
              <p className="text-slate-600 text-sm">
                <a href="tel:+56443051909" className="block hover:text-blue-600 transition-colors mb-1">
                  (44) 305 1909
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto px-8 py-2.5 bg-[#000080] text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:bg-blue-900 active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
