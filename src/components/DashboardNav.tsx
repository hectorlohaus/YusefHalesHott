'use client';

import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import { usePathname } from 'next/navigation';

export default function DashboardNav({ perfil }: { perfil: any }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  return (
      <nav className="bg-[#000080] text-white shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-serif font-bold text-xl tracking-wide">Panel Administrativo</span>
              </div>
              <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
                <Link 
                  href="/administracion/dashboard" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/administracion/dashboard' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-blue-200 hover:text-white hover:border-blue-200'
                  }`}
                >
                  Gestión Notarial (Nueva Web)
                </Link>
                <Link 
                  href="/administracion/dashboard/legacy" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname?.includes('/legacy') 
                      ? 'border-white text-white' 
                      : 'border-transparent text-blue-200 hover:text-white hover:border-blue-200'
                  }`}
                >
                  Registros Públicos (Web Existente)
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <span className="text-sm font-medium">{perfil?.nombre || 'Usuario Funcionario'}</span>
                <span className="text-xs text-blue-300 uppercase">{perfil?.rol || 'Empleado'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm bg-blue-800 hover:bg-blue-900 border border-blue-700 px-4 py-1.5 rounded-full transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile tabs */}
        <div className="sm:hidden border-t border-blue-800 flex overflow-x-auto">
          <Link 
            href="/administracion/dashboard" 
            className={`px-4 py-3 whitespace-nowrap text-sm font-medium border-b-2 ${
              pathname === '/administracion/dashboard' ? 'border-white text-white' : 'border-transparent text-blue-200'
            }`}
          >
            Gestión Nueva
          </Link>
          <Link 
            href="/administracion/dashboard/legacy" 
            className={`px-4 py-3 whitespace-nowrap text-sm font-medium border-b-2 ${
              pathname?.includes('/legacy') ? 'border-white text-white' : 'border-transparent text-blue-200'
            }`}
          >
            Web Existente
          </Link>
        </div>
      </nav>
  );
}
