'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getHorarios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('configuracion_horarios')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching horarios:', error);
    return null;
  }

  return data;
}

export async function updateHorarios(formData: FormData) {
  const supabase = await createClient();
  
  // Verify user is notario
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error('No autorizado');
  }

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('auth_id', authData.user.id)
    .single();

  if (!usuario || usuario.rol !== 'notario') {
    throw new Error('Acceso denegado: Se requiere rol de notario.');
  }

  const payload = {
    modo_actual: formData.get('modo_actual') as string,
    tipo_horario: formData.get('tipo_horario') as string,
    manana_inicio: formData.get('manana_inicio') as string,
    manana_fin: formData.get('manana_fin') as string,
    manana_dias: formData.get('manana_dias') as string,
    tarde_inicio: formData.get('tarde_inicio') as string,
    tarde_fin: formData.get('tarde_fin') as string,
    tarde_dias: formData.get('tarde_dias') as string,
    corrido_inicio: formData.get('corrido_inicio') as string,
    corrido_fin: formData.get('corrido_fin') as string,
    corrido_dias: formData.get('corrido_dias') as string,
    mensaje_viernes: formData.get('mensaje_viernes') as string,
    especial_titulo: formData.get('especial_titulo') as string,
    especial_mensaje: formData.get('especial_mensaje') as string,
    actualizado_en: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('configuracion_horarios')
    .update(payload)
    .eq('id', 1);

  if (error) {
    console.error('Error updating horarios:', error);
    throw new Error('Error al actualizar la base de datos');
  }

  // Revalidar las rutas que muestran los horarios
  revalidatePath('/');
  revalidatePath('/contacto');
  revalidatePath('/administracion/dashboard/horarios');
}
