import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight leading-tight">
            Trámites Notariales <br className="hidden md:block" /> a un clic de distancia
          </h1>
          <p className="text-lg md:text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Realice sus solicitudes, adjunte sus documentos y pague sus aranceles de forma segura, rápida y 100% online.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/servicios" 
              className="bg-white text-[#000080] font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1"
            >
              Solicitar Trámite Ahora
            </Link>
            <Link 
              href="/aranceles" 
              className="bg-transparent border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all"
            >
              Consultar Precios
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">¿Cómo Funciona?</h2>
            <p className="text-slate-500">Un proceso diseñado para su comodidad y transparencia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Elija su Trámite</h3>
              <p className="text-slate-600">
                Seleccione el servicio que necesita de nuestro catálogo actualizado de aranceles.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Sube tus Documentos</h3>
              <p className="text-slate-600">
                Llene un breve formulario y adjunte los archivos necesarios (ej. Word, PDF) de forma segura.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Pague Fácilmente</h3>
              <p className="text-slate-600">
                Realice su pago a través de Getnet y haga seguimiento a su solicitud hasta el retiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Registries Section (Web Existente shortcut) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#000080] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="p-10 md:p-14 md:w-2/3 flex flex-col justify-center">
              <h2 className="text-3xl font-serif font-bold text-white mb-4">Consulta de Registros Públicos</h2>
              <p className="text-blue-100 mb-8 max-w-lg">
                Acceda libremente al Repertorio de Instrumentos Públicos y al Repertorio del Conservador de su notaría.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/repertorio-conservador" className="bg-white text-[#000080] font-medium px-6 py-2.5 rounded-lg shadow hover:bg-blue-50 transition-colors">
                  Repertorio Conservador
                </Link>
                <Link href="/repertorio-instrumentos" className="bg-transparent border border-white text-white font-medium px-6 py-2.5 rounded-lg shadow hover:bg-white/10 transition-colors">
                  Repertorio Instrumentos
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 bg-blue-800 p-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-blue-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
