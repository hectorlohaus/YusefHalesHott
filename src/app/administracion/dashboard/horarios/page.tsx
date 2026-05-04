import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getHorarios, updateHorarios } from '@/app/actions/horarios';
import HorariosForm from './HorariosForm';

export const metadata = {
  title: 'Gestión de Horarios | Notaría y Conservador Traiguén',
};

export default async function HorariosPage() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect('/auth/login');
  }

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('auth_id', authData.user.id)
    .single();

  if (!usuario || usuario.rol !== 'notario') {
    redirect('/administracion/dashboard');
  }

  const horarios = await getHorarios();

  if (!horarios) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          No se pudo cargar la configuración de horarios. Asegúrese de haber corrido la migración en la base de datos.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Configuración de Horarios de Atención</h1>
        <p className="mt-2 text-sm text-gray-600">
          Administre el horario habitual y active el horario especial en caso de emergencia, cierre o feriado legal.
        </p>
      </div>

      <HorariosForm horarios={horarios} />
    </div>
  );
}
