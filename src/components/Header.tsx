'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#000080] text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nav superior con enlaces */}
        <div className="flex justify-between items-center h-14 border-b border-blue-800">
          <div className="hidden md:flex gap-4">
             <span className="text-sm text-blue-200">Notaría Traiguén SpA</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/servicios" className="text-sm font-medium hover:text-blue-200 transition-colors">
              Trámites y Servicios
            </Link>
            <Link href="/aranceles" className="text-sm font-medium hover:text-blue-200 transition-colors">
              Precios y Aranceles
            </Link>
            <Link href="/solicitud/revisar" className="text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Revisar Solicitud
            </Link>
            <Link href="/administracion" className="text-sm font-medium hover:text-blue-200 transition-colors">
              Admin
            </Link>
          </nav>

          <div className="md:hidden flex items-center justify-between w-full">
            <span className="font-serif font-bold text-lg">Notaría</span>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 focus:outline-none p-2 bg-blue-900 rounded-lg"
            >
              {!isMenuOpen ? (
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              ) : (
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Menú Desplegable en Móvil */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-b border-blue-800 flex flex-col gap-2 animate-in slide-in-from-top-2">
            <Link href="/servicios" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium hover:bg-blue-800 rounded-lg">
              Trámites y Servicios
            </Link>
            <Link href="/aranceles" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium hover:bg-blue-800 rounded-lg">
              Precios y Aranceles
            </Link>
            <Link href="/solicitud/revisar" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Revisar Solicitud
            </Link>
            <Link href="/administracion" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium hover:bg-blue-800 rounded-lg">
              Administración
            </Link>
          </nav>
        )}

        {/* Zona del logo principal centrado */}
        <div className="flex justify-center items-center py-4 md:py-6">
          <Link href="/" className="inline-block outline-none focus:ring-4 focus:ring-blue-400 rounded-xl transition-transform hover:scale-105">
             <Image 
               src="/logo.png" 
               alt="Notaría Traiguén Logo" 
               width={200} 
               height={200} 
               className="object-contain drop-shadow-lg w-[140px] h-[140px] md:w-[200px] md:h-[200px]" 
               priority
             />
          </Link>
        </div>

      </div>
    </header>
  );
}
