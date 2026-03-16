'use server'

import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Reusable permission check
async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: perfil } = await supabase.from('usuarios').select('rol').eq('auth_id', user.id).single();
  return perfil?.rol; // 'notario' or 'empleado'
}

// ==== SERVICIOS ====
export async function upsertServicio(formData: FormData) {
  const rol = await checkAdmin();
  if (rol !== 'notario') {
    return { success: false, error: "Sólo el notario puede editar servicios." };
  }

  const supabase = await createClient();
  const id = formData.get('id');
  const titulo = formData.get('titulo') as string;
  const descripcion = formData.get('descripcion') as string;
  const arancel = parseInt(formData.get('arancel') as string);
  const activo = formData.get('activo') === 'on';
  const documentos_necesarios = formData.get('documentos_necesarios') as string;

  const payload = { titulo, descripcion, arancel, activo, documentos_necesarios };

  if (id) {
    const { error } = await supabase.from('servicios').update(payload).eq('id', id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('servicios').insert(payload);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/administracion/dashboard');
  revalidatePath('/servicios');
  revalidatePath('/aranceles');
  return { success: true };
}

// ==== EMPLEADOS ====
export async function createEmpleado(formData: FormData) {
  const rol = await checkAdmin();
  if (rol !== 'notario') {
    return { success: false, error: "Sólo el notario puede crear empleados." };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nombre = formData.get('nombre') as string;
  const rolNuevo = formData.get('rol') as string || 'empleado';
  const sueldo = parseInt(formData.get('sueldo') as string) || 0;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { success: false, error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor." };
  }

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return { success: false, error: error.message };

  if (data.user) {
    const { error: dbError } = await supabaseAdmin.from('usuarios').insert({
      auth_id: data.user.id,
      nombre,
      email,
      rol: rolNuevo,
      sueldo,
      activo: true
    });

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      return { success: false, error: dbError.message };
    }
  }

  revalidatePath('/administracion/dashboard');
  revalidatePath('/transparencia');
  return { success: true };
}

export async function updateEmpleado(formData: FormData) {
  const rol = await checkAdmin();
  if (rol !== 'notario') {
    return { success: false, error: "Sólo el notario puede editar empleados." };
  }

  const supabase = await createClient();
  const id = formData.get('id');
  const sueldo = parseInt(formData.get('sueldo') as string);
  const nombre = formData.get('nombre') as string;

  const { error } = await supabase.from('usuarios').update({ sueldo, nombre }).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/administracion/dashboard');
  revalidatePath('/transparencia');
  return { success: true };
}

// ==== SOLICITUDES ====
export async function updateSolicitud(solicitudId: string, statusType: 'trabajo' | 'boleta' | 'pago', value: string) {
  await checkAdmin(); // Both notario and empleado can update statuses

  const supabase = await createClient();
  let payload: any = {};
  
  if (statusType === 'trabajo') payload = { estado_trabajo: value };
  else if (statusType === 'boleta') payload = { estado_boleta: value };
  else if (statusType === 'pago') payload = { estado_pago: value };

  const { error } = await supabase.from('solicitudes').update(payload).eq('id', solicitudId);
  if (error) return { success: false, error: error.message };

  revalidatePath('/administracion/dashboard');
  return { success: true };
}
