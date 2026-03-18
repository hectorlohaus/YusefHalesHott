import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-4">Notaría Traiguén</h3>
            <p className="text-sm text-slate-400">
              Servicios notariales rápidos, seguros y transparentes para toda la comunidad.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Accesos Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/servicios" className="hover:text-white transition-colors">Trámites y Servicios</Link></li>
              <li><Link href="/aranceles" className="hover:text-white transition-colors">Precios de Aranceles</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Horarios y Ubicación</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Información Pública</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/transparencia" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Transparencia (Sueldos y Empleados)
                </Link>
              </li>
              <li>
                <Link href="/administracion" className="hover:text-white transition-colors mt-2 flex items-center gap-2">
                  Acceso Administración
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Notaría Traiguén. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs text-slate-600">Desarrollado por Hector Lohaus</p>
        </div>
      </div>
    </footer>
  );
}
