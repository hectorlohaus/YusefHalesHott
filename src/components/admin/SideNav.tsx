'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

export default function SideNav({ perfil }: { perfil: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Responsive auto-collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update main layout padding dynamically
  useEffect(() => {
    const main = document.getElementById('dashboard-main');
    if (main) {
      main.style.paddingLeft = isCollapsed ? '5rem' : '16rem'; // w-20 = 5rem, w-64 = 16rem
    }
  }, [isCollapsed]);

  let currentTab = searchParams.get('tab') || 'solicitudes';
  if (pathname.includes('/legacy')) {
    currentTab = 'legacy';
  }

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <aside className={`fixed left-0 top-0 flex flex-col bg-slate-900 h-screen ${sidebarWidth} border-r border-slate-800 shadow-xl z-50 transition-all duration-300`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white p-1 rounded-full z-50 shadow-md hover:scale-110 transition-transform hidden md:block"
        title={isCollapsed ? "Expandir panel" : "Contraer panel"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={`pt-6 ${isCollapsed ? 'px-2' : 'px-6'} pb-2 shrink-0`}>
        <div className={`flex items-center gap-3 mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 shrink-0 rounded-lg bg-[#005ab4] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight truncate">Notaría y Conservador</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider truncate">Panel Admin</p>
            </div>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-3' : 'px-6'} space-y-1 pb-4`}>
        <nav className="space-y-1">
          {/* Bandeja de Solicitudes */}
          <Link
            href="/administracion/dashboard?tab=solicitudes"
            title={isCollapsed ? "Bandeja de Solicitudes" : undefined}
            className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${currentTab === 'solicitudes'
                ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            {!isCollapsed && <span className="truncate">Bandeja de Solicitudes</span>}
          </Link>

          {/* Gestión de Servicios */}
          {(perfil?.rol === 'notario' || perfil?.rol === 'supervisor') && (
            <Link
              href="/administracion/dashboard?tab=servicios"
              title={isCollapsed ? "Gestión de Servicios" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${currentTab === 'servicios'
                  ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {!isCollapsed && <span className="truncate">Gestión de Servicios</span>}
            </Link>
          )}

          {/* Gestión de Empleados */}
          {(perfil?.rol === 'notario' || perfil?.rol === 'supervisor') && (
            <Link
              href="/administracion/dashboard?tab=empleados"
              title={isCollapsed ? "Gestión de Empleados" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${currentTab === 'empleados'
                  ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {!isCollapsed && <span className="truncate">Gestión de Empleados</span>}
            </Link>
          )}

          {/* Reclamos y Sugerencias */}
          {(perfil?.rol === 'notario' || perfil?.rol === 'supervisor') && (
            <Link
              href="/administracion/dashboard?tab=reclamos"
              title={isCollapsed ? "Reclamos y Sugerencias" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${currentTab === 'reclamos'
                  ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {!isCollapsed && <span className="truncate">Reclamos y Sugerencias</span>}
            </Link>
          )}

          {/* Documentos Institucionales */}
          {perfil?.rol === 'notario' && (
            <Link
              href="/administracion/dashboard?tab=documentos"
              title={isCollapsed ? "Documentos Legales" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${currentTab === 'documentos'
                  ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {!isCollapsed && <span className="truncate">Documentos Legales</span>}
            </Link>
          )}

          {/* Horarios de Atención */}
          {perfil?.rol === 'notario' && (
            <Link
              href="/administracion/dashboard/horarios"
              title={isCollapsed ? "Horarios de Atención" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${pathname?.includes('/horarios')
                  ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!isCollapsed && <span className="truncate">Horarios de Atención</span>}
            </Link>
          )}

          {/* Registros Públicos */}
          {perfil?.rol === 'notario' && (
            <Link
              href="/administracion/dashboard/legacy"
              title={isCollapsed ? "Registros Públicos (Legacy)" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${currentTab === 'legacy'
                  ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                } mt-4`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {!isCollapsed && <span className="truncate">Registros Públicos</span>}
            </Link>
          )}

          {/* Reportes Avanzados */}
          {(perfil?.rol === 'notario' || perfil?.rol === 'supervisor') && (
            <Link
              href="/administracion/dashboard?tab=reportes"
              title={isCollapsed ? "Reportes Avanzados" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 font-inter text-sm font-medium transition-all duration-200 ease-in-out rounded-lg ${currentTab === 'reportes'
                  ? `text-blue-400 bg-slate-800/50 ${isCollapsed ? 'border-l-4' : 'border-r-4'} border-[#005ab4]`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                } mt-4`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {!isCollapsed && <span className="truncate">Reportes Avanzados</span>}
            </Link>
          )}
        </nav>
      </div>

      <div className={`mt-auto ${isCollapsed ? 'px-2' : 'px-4'} pb-4 space-y-1 shrink-0`}>
        {/* Ayuda */}
        <a 
          href="https://wa.me/56962101244" 
          target="_blank" 
          rel="noopener noreferrer" 
          title={isCollapsed ? "Ayuda y Soporte" : undefined}
          className={`flex items-center w-full ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-inter text-sm font-medium`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {!isCollapsed && <span>Ayuda y Soporte</span>}
        </a>
      </div>

      <div className={`p-4 border-t border-slate-800 shrink-0 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm tracking-widest shrink-0">
            {perfil?.nombre ? perfil.nombre.substring(0, 2).toUpperCase() : 'AD'}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{perfil?.nombre || 'Administrador'}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{perfil?.rol || 'Administrador Senior'}</p>
            </div>
          )}
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={() => logout()}
          title={isCollapsed ? "Cerrar Sesión" : undefined}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'px-0 py-2' : 'gap-2 px-4 py-2'} text-sm font-semibold text-red-400 border border-red-900/50 bg-red-950/20 rounded-lg hover:bg-red-900/40 hover:text-red-300 transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
