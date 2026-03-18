export const metadata = {
  title: 'Horarios y Ubicación | Notaría Traiguén',
  description: 'Conozca nuestros horarios de atención y visítenos en Errazuriz N°418, Traiguén.',
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
            Horarios y Ubicación
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Estamos ubicados en el corazón de Traiguén. Conozca nuestros horarios de atención para planificar su visita.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Detalles de Contacto y Horarios */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Nuestra Dirección
                </h2>
                <p className="text-slate-600 text-lg">
                  Errazuriz N°418<br/>
                  Código Postal 4730334<br/>
                  Traiguén, Araucanía
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Teléfono de Contacto
                </h2>
                <p className="text-slate-600 text-lg">
                  <a href="tel:+56443051909" className="hover:text-blue-600 transition-colors">
                    (44) 305 1909
                  </a>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Horarios de Atención
                </h2>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-medium text-slate-800">Lunes a Jueves</span>
                    <span className="text-right">09:00 – 14:00 hrs<br/>15:00 – 17:00 hrs</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-medium text-slate-800">Viernes</span>
                    <span className="text-right">09:00 – 14:00 hrs</span>
                  </li>
                  <li className="flex justify-between items-center text-slate-400">
                    <span className="font-medium">Sábado y Domingo</span>
                    <span>Cerrado</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Mapa interactivo */}
            <div className="bg-slate-200 min-h-[400px] h-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3133.2926574445605!2d-72.6677277!3d-38.249518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x966b1da53ff2f9c5%3A0xdee45cebc8a41554!2sNotaria%20y%20conservador%20de%20Traigu%C3%A9n%20Yusef%20Hales%20Hott!5e0!3m2!1sen!2scl!4v1773860404230!5m2!1sen!2scl" 
                className="w-full h-full border-0"
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
