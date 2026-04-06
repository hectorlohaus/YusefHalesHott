import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function TransparenciaPage() {
  const supabase = await createClient();
  const { data: empleados, error } = await supabase
    .from('usuarios')
    .select('nombre, rol, sueldo')
    .eq('activo', true)
    .order('rol', { ascending: false })
    .order('nombre', { ascending: true });

  const totalSueldos = empleados?.reduce((acc, curr) => acc + (curr.sueldo || 0), 0) || 0;

  return (
    <main className="pt-24 pb-24 bg-surface min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl shadow-sm text-red-700 text-sm font-medium">
            Ocurrió un error al cargar la información de transparencia.
          </div>
        )}

        {/* Hero Branding Section */}
        <section className="mb-16 relative overflow-hidden rounded-xl bg-slate-900 h-64 flex items-center px-8 md:px-12 group">
          <img 
            alt="Legal professional workspace" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxrx5CqfP2fBy7KAK1jHHKJ1pk_8PHYApRuzqmoS5AOXc6oySFTF4LYoSxTIzrF7oujJMZym1FNhAFZiThcaFfi7lhQD59s4b-QpHlZnD8JQ4239wEzQNem9KdTn9z9msZmb2B8loe8tGE-1O9aW-FXm8jWCk258WeLp4AXFepqQiXhmtHy00HBWmVrT88A4f3C9l-pDDvHdNOMkCGTFhm24b6Z0lZqCF4OTbBDQQOr32VtJsC2c63Hfgg4hxJ8cE14Gs9dx44Pw"
          />
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-headline text-4xl md:text-5xl text-slate-50 font-bold mb-4 tracking-tight">Personal y Remuneraciones</h1>
            <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed">
              Registro detallado de los profesionales y colaboradores que integran Notaría Yusef Hales Hott, bajo estándares de transparencia activa institucional.
            </p>
          </div>
        </section>

        {/* Stats Bento Grid (Visual Interest) */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-3 bg-surface-container-low p-6 rounded-xl">
            <span className="material-symbols-outlined text-secondary mb-4">badge</span>
            <p className="text-on-surface-variant text-sm mb-1">Dotación Total</p>
            <p className="text-3xl font-headline font-bold text-on-surface">{empleados?.length || 0} Funcionarios</p>
          </div>
          
          <div className="col-span-12 md:col-span-6 bg-slate-900 text-slate-50 p-6 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-amber-500 text-3xl">verified_user</span>
              <div>
                <p className="text-slate-400 text-sm mb-1 font-body">Cumplimiento Normativo</p>
                <p className="text-2xl md:text-3xl font-headline font-bold">Transparencia 100%</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-3 bg-surface-container-high p-6 rounded-xl">
            {/* Se reemplaza Fecha por Inversión Mensual manteniendo el estilo del html proporcionado por el usuario usando la data dinámica de la vieja página */}
            <span className="material-symbols-outlined text-secondary mb-4">account_balance</span>
            <p className="text-on-surface-variant text-sm mb-1">Inversión Mensual</p>
            <p className="text-2xl md:text-3xl font-headline font-bold text-on-surface">${totalSueldos.toLocaleString('es-CL')}</p>
          </div>
        </div>

        {/* Data Table Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 md:px-8 py-6 border-b border-outline-variant/15 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
            <h3 className="text-xl font-headline font-semibold text-on-surface">Nómina de Personal {new Date().getFullYear()}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Nombre Completo</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Cargo / Función</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Remuneración Bruta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {empleados?.map((empleado, index) => {
                  let funcion = 'Personal Regular';
                  
                  if (empleado.rol === 'notario') {
                    funcion = 'Notario Titular';
                  } else if (empleado.rol === 'supervisor') {
                    funcion = 'Supervisor Administrativo';
                  } else {
                    funcion = empleado.nombre.includes('Palma') ? 'Oficial Primero' : 
                              empleado.nombre.includes('Riquelme') ? 'Abogado Asesor' : 
                              'Personal Administrativo';
                  }

                  return (
                    <tr key={index} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-8 py-6 font-medium text-on-surface">{empleado.nombre}</td>
                      <td className="px-8 py-6 text-on-surface-variant">{funcion}</td>
                      <td className="px-8 py-6 text-right font-headline font-bold text-secondary text-lg">
                        ${empleado.sueldo?.toLocaleString('es-CL') || 0}
                      </td>
                    </tr>
                  )
                })}

                {empleados?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-16 text-center text-on-surface-variant">
                       <span className="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
                       <p className="font-medium text-sm">No hay registros de personal disponibles.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 md:px-8 py-6 bg-surface-container-low flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-on-surface-variant">
            <span>Mostrando {empleados?.length || 0} registros de personal activo</span>
            <div className="flex gap-4">
              <button className="hover:text-secondary transition-colors">Anterior</button>
              <div className="flex gap-2">
                <span className="w-6 h-6 bg-secondary text-on-secondary flex items-center justify-center rounded">1</span>
              </div>
              <button className="hover:text-secondary transition-colors">Siguiente</button>
            </div>
          </div>
        </section>

        {/* Asymmetric Note Section */}
        <div className="mt-20 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4 italic font-headline text-slate-400 text-lg leading-relaxed">
            "La fe pública no es solo un acto jurídico, es el compromiso de transparencia total ante la ciudadanía que nos confía sus trámites más vitales."
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <h4 className="text-on-surface font-bold uppercase tracking-widest text-xs">Aclaración de Haberes</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Las remuneraciones presentadas corresponden a los haberes brutos mensuales. Estos incluyen sueldo base, asignaciones de antigüedad y bonificaciones legales vigentes al periodo informado. La información es actualizada trimestralmente para garantizar la fidelidad de los datos presentados en este portal de Transparencia Activa.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-secondary cursor-pointer hover:underline">
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Reglamento de Remuneraciones
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-secondary cursor-pointer hover:underline">
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Escalafón Institucional
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
