'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-50 bg-slate-900 shadow-xl shadow-slate-950/20">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">

        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Notaría" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold font-headline text-slate-50 tracking-wide hidden sm:block">Notaría Yusef Hales Hott</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="/"
            className="text-slate-300 hover:text-secondary-fixed transition-colors font-headline"
          >
            Inicio
          </Link>
          <Link
            href="/servicios"
            className="text-slate-300 hover:text-secondary-fixed transition-colors font-headline"
          >
            Trámites y Servicios
          </Link>
          <Link
            href="/aranceles"
            className="text-slate-300 hover:text-secondary-fixed transition-colors font-headline"
          >
            Precios
          </Link>

        </nav>

        <div className="hidden lg:block">
          <Link
            href="/solicitud/revisar"
            className="inline-block bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-medium hover:scale-95 transition-transform active:scale-90"
          >
            Revisar Solicitud
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-slate-300 hover:text-secondary-fixed transition-colors focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMenuOpen ? (
            <span className="material-symbols-outlined">close</span>
          ) : (
            <span className="material-symbols-outlined">menu</span>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-6 py-4 gap-1">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="font-headline px-3 py-3 text-base text-slate-300 border-b border-slate-800"
            >
              Inicio
            </Link>
            <Link
              href="/servicios"
              onClick={() => setIsMenuOpen(false)}
              className="font-headline px-3 py-3 text-base text-slate-300 hover:text-secondary-fixed hover:bg-slate-800 rounded-lg transition-colors border-b border-slate-800"
            >
              Trámites y Servicios
            </Link>
            <Link
              href="/aranceles"
              onClick={() => setIsMenuOpen(false)}
              className="font-headline px-3 py-3 text-base text-slate-300 hover:text-secondary-fixed hover:bg-slate-800 rounded-lg transition-colors border-b border-slate-800"
            >
              Precios
            </Link>

            <Link
              href="/solicitud/revisar"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 text-center bg-secondary text-on-secondary px-6 py-3 text-base font-medium transition-colors rounded-xl"
            >
              Revisar Solicitud
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
