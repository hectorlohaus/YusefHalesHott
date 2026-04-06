'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitReclamo(formData: FormData) {
  const supabase = await createClient();
  
  const tipo = formData.get('tipo') as string;
  const nombre_cliente = formData.get('nombre_cliente') as string;
  const email = formData.get('email') as string;
  const mensaje = formData.get('mensaje') as string;

  if (!tipo || !nombre_cliente || !email || !mensaje) {
    return { success: false, error: 'Todos los campos son obligatorios.' };
  }

  const { error } = await supabase.from('reclamos_sugerencias').insert({
    tipo,
    nombre_cliente,
    email,
    mensaje,
    estado: 'pendiente'
  });

  if (error) {
    return { success: false, error: 'Error al enviar el formulario.' };
  }

  revalidatePath('/administracion/dashboard');
  return { success: true };
}
