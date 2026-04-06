import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full pt-20 pb-10 bg-slate-950 border-t border-slate-800/50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-8 max-w-screen-xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo.png" alt="Logo Notaría Footer" width={40} height={40} className="h-10 w-auto opacity-80" />
            <span className="font-headline text-lg text-slate-100 block">Notaría Yusef Hales Hott</span>
          </div>
          <p className="font-body text-sm text-slate-400 leading-relaxed max-w-xs">
            Liderando la transformación digital en servicios notariales con integridad, seguridad y eficiencia.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="text-slate-500 hover:text-secondary-fixed transition-colors"><span className="material-symbols-outlined">public</span></Link>
            <Link href="/contacto" className="text-slate-500 hover:text-secondary-fixed transition-colors"><span className="material-symbols-outlined">share</span></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h5 className="text-slate-200 font-semibold mb-6 text-sm uppercase tracking-wider">Navegación</h5>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/">Inicio</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/servicios">Trámites y Servicios</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/aranceles">Aranceles</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/solicitud/revisar">Revisar Solicitud</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-slate-200 font-semibold mb-6 text-sm uppercase tracking-wider">Información Pública</h5>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/transparencia">Transparencia</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/legal/privacidad">Política de Privacidad</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/legal/terminos">Términos y Condiciones</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/reclamos">Reclamos y Sugerencias</Link></li>
              <li><Link className="text-slate-500 hover:text-secondary-fixed transition-colors text-sm" href="/administracion">Acceso Administración</Link></li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800">
          <h5 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">Ubicación & Soporte</h5>
          <a 
            href="https://maps.app.goo.gl/FAd99SEssRxHLPnz5" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 text-sm mb-4 block hover:text-secondary-fixed transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">location_on</span>
            Errazuriz N°418, 4730334 Traiguen, Traiguén, Araucanía
          </a>
          <a href="tel:+56443051909" className="text-[#fe932c] font-medium text-sm hover:underline block mb-1">44 305 1909</a>
          <p className="text-slate-400 text-sm mt-1 italic">contacto@notariatraiguen.cl</p>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-8 mt-20 pt-8 border-t border-slate-900/50 text-center">
        <p className="font-body text-sm text-slate-400 opacity-100 mb-1">
          &copy; {new Date().getFullYear()} Notaría Yusef Hales Hott. Excelencia Digital y Tradición Legal.
        </p>
        <p className="font-body text-xs text-slate-500 opacity-60">
          Desarrollado por Hector Lohaus
        </p>
      </div>
    </footer>
  );
}
