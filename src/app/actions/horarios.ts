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

import { z } from 'zod';

const HorariosSchema = z.object({
  modo_actual: z.enum(['normal', 'especial']),
  tipo_horario: z.enum(['partido', 'corrido', 'mixto']),
  manana_inicio: z.string().max(10).nullable().optional(),
  manana_fin: z.string().max(10).nullable().optional(),
  manana_dias: z.string().max(100).nullable().optional(),
  tarde_inicio: z.string().max(10).nullable().optional(),
  tarde_fin: z.string().max(10).nullable().optional(),
  tarde_dias: z.string().max(100).nullable().optional(),
  corrido_inicio: z.string().max(10).nullable().optional(),
  corrido_fin: z.string().max(10).nullable().optional(),
  corrido_dias: z.string().max(100).nullable().optional(),
  mensaje_viernes: z.string().max(500).nullable().optional(),
  especial_titulo: z.string().max(150).nullable().optional(),
  especial_mensaje: z.string().max(1000).nullable().optional(),
});

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

  // Parse and validate the payload using Zod
  const rawPayload = {
    modo_actual: formData.get('modo_actual'),
    tipo_horario: formData.get('tipo_horario'),
    manana_inicio: formData.get('manana_inicio'),
    manana_fin: formData.get('manana_fin'),
    manana_dias: formData.get('manana_dias'),
    tarde_inicio: formData.get('tarde_inicio'),
    tarde_fin: formData.get('tarde_fin'),
    tarde_dias: formData.get('tarde_dias'),
    corrido_inicio: formData.get('corrido_inicio'),
    corrido_fin: formData.get('corrido_fin'),
    corrido_dias: formData.get('corrido_dias'),
    mensaje_viernes: formData.get('mensaje_viernes'),
    especial_titulo: formData.get('especial_titulo'),
    especial_mensaje: formData.get('especial_mensaje'),
  };

  const parsedPayload = HorariosSchema.safeParse(rawPayload);

  if (!parsedPayload.success) {
    console.error('Validation Error:', parsedPayload.error.format());
    throw new Error('Datos inválidos o campos demasiado largos.');
  }

  const finalPayload = {
    ...parsedPayload.data,
    actualizado_en: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('configuracion_horarios')
    .update(finalPayload)
    .eq('id', 1);

  if (error) {
    console.error('Error updating horarios:', error);
    throw new Error('Error al actualizar la base de datos');
  }

  // Revalidar las rutas que muestran los horariosss
  revalidatePath('/', 'layout');
}
