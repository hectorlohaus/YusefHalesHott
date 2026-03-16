'use client';

import { useRouter } from 'next/navigation';
import ServiciosManager from './ServiciosManager';
import EmpleadosManager from './EmpleadosManager';
import SolicitudManager from './SolicitudesManager';

type DashboardTabsProps = {
  activeTab: string;
  solicitudes: any[];
  servicios: any[];
  empleados: any[];
  rol: string;
};

export default function DashboardTabs({ activeTab, solicitudes, servicios, empleados, rol }: DashboardTabsProps) {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    router.push(`/administracion/dashboard?tab=${tab}`);
  };

  const tabs = [
    { id: 'solicitudes', label: 'Bandeja de Solicitudes' },
    { id: 'servicios', label: 'Gestión de Servicios y Aranceles' },
    { id: 'empleados', label: 'Gestión de Empleados y Sueldos' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-[#000080] text-white shadow-md rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-4 sm:border-b-0 sm:border-r ${
                activeTab === tab.id
                  ? 'bg-blue-800 border-blue-400 text-white'
                  : 'border-transparent text-blue-100 hover:bg-blue-900/50 hover:text-white'
              } sm:last:border-r-0 flex-1 text-center`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {activeTab === 'solicitudes' && <SolicitudManager initialSolicitudes={solicitudes} />}
        {activeTab === 'servicios' && <ServiciosManager initialServicios={servicios} userRole={rol} />}
        {activeTab === 'empleados' && <EmpleadosManager initialEmpleados={empleados} userRole={rol} />}
      </div>
    </div>
  );
}
