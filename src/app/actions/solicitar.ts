'use server'

import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { validateRut } from '@/lib/rut';

export async function submitSolicitud(formData: FormData) {
  try {
    const supabase = await createClient();

    // Ensure bucket exists or create it (requires privileges, but harmless if already exists)
    // Supabase JS will fail gracefully if we don't have permissions, we assume bucket 'documentos' exists 
    // or is created by the admin or through this call if anon has RLS bypass sadfasf

    const nombre = formData.get('nombre') as string;
    const rut = formData.get('rut') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;
    const direccion = formData.get('direccion') as string;
    const servicioId = formData.get('servicio_id') as string;

    if (!nombre || !rut || !email || !servicioId) {
      return { success: false, error: 'Faltan campos obligatorios' };
    }

    if (!validateRut(rut)) {
      return { success: false, error: 'El RUT ingresado no es válido.' };
    }

    // Límite de seguridad: Máximo 3 solicitudes pendientes por RUT para evitar SPAM de transferencias
    const { count, error: countError } = await supabase
      .from('solicitudes')
      .select('id', { count: 'exact', head: true })
      .eq('cliente_rut', rut)
      .eq('estado_pago', 'pendiente');

    if (countError) {
      console.error("Error checking limits:", countError);
      return { success: false, error: 'Error interno validando los límites de seguridad.' };
    }

    if (count !== null && count >= 3) {
      return {
        success: false,
        error: 'Por razones de seguridad, no puedes tener más de 3 solicitudes con pago pendiente. Por favor completa los pagos anteriores o comunícate con la notaría.'
      };
    }

    // Insert Solicitud DB record
    const { data: solData, error: solError } = await supabase
      .from('solicitudes')
      .insert({
        cliente_nombre: nombre,
        cliente_rut: rut,
        cliente_email: email,
        cliente_telefono: telefono,
        cliente_direccion: direccion,
        servicio_id: servicioId,
        estado_trabajo: 'pendiente',
        estado_pago: 'pendiente',
        estado_boleta: 'sin enviar'
      })
      .select('id')
      .single();

    if (solError) {
      console.error("DB insert error:", solError);
      return { success: false, error: 'Error al guardar la solicitud en la base de datos.' };
    }

    return {
      success: true,
      message: 'Solicitud creada con éxito.',
      solicitudId: solData.id
    };

  } catch (err: any) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message || 'Error inesperado del servidor.' };
  }
}
