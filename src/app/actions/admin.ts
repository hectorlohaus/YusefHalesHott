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
  if (rol !== 'notario' && rol !== 'supervisor') {
    return { success: false, error: "Sólo el notario o supervisor pueden editar servicios." };
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
    const { error } = await supabase.from('servicios').update({
      ...payload,
      actualizado_en: new Date().toISOString()
    }).eq('id', id);
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
  if (rol !== 'notario' && rol !== 'supervisor') {
    return { success: false, error: "Sólo el notario o supervisor pueden crear empleados." };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nombre = formData.get('nombre') as string;
  const rolNuevo = formData.get('rol') as string || 'empleado';
  const sueldo = parseInt(formData.get('sueldo') as string) || 0;
  const activo = formData.get('activo') === 'on';

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
      activo: activo
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
  if (rol !== 'notario' && rol !== 'supervisor') {
    return { success: false, error: "Sólo el notario o supervisor pueden editar empleados." };
  }

  const supabase = await createClient();
  const id = formData.get('id');
  const sueldo = parseInt(formData.get('sueldo') as string);
  const nombre = formData.get('nombre') as string;
  const activo = formData.get('activo') === 'on';

  const { error } = await supabase.from('usuarios').update({ sueldo, nombre, activo }).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/administracion/dashboard');
  revalidatePath('/transparencia');
  return { success: true };
}

// ==== SOLICITUDES ====
export async function updateSolicitud(solicitudId: string, statusType: 'trabajo' | 'boleta' | 'pago', value: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: perfil } = await supabase.from('usuarios').select('id, rol').eq('auth_id', user.id).single();
  
  // Obtenemos sol actual para guardar el estado previo
  const { data: solAnterior } = await supabase.from('solicitudes').select('*').eq('id', solicitudId).single();

  let payload: any = { actualizado_en: new Date().toISOString() };
  
  if (statusType === 'trabajo') payload.estado_trabajo = value;
  else if (statusType === 'boleta') payload.estado_boleta = value;
  else if (statusType === 'pago') {
    payload.estado_pago = value;
    if (value === 'pagado') {
      if (solAnterior?.metodo_pago === 'getnet') {
        payload.estado_boleta = 'enviada';
      }
    }
  }

  const { error } = await supabase.from('solicitudes').update(payload).eq('id', solicitudId);
  if (error) return { success: false, error: error.message };

  // Guardar en historial si es cambio de trabajo
  if (statusType === 'trabajo' && perfil?.id && solAnterior?.estado_trabajo !== value) {
     await supabase.from('historial_solicitudes').insert({
       solicitud_id: solicitudId,
       usuario_id: perfil.id,
       accion: 'cambio_estado',
       estado_anterior: solAnterior?.estado_trabajo,
       estado_nuevo: value
     });
  }

  revalidatePath('/administracion/dashboard');
  return { success: true };
}

export async function assignSolicitud(solicitudId: string, targetUserId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { data: perfil } = await supabase.from('usuarios').select('id, rol').eq('auth_id', user.id).single();
  
  const { error } = await supabase.from('solicitudes').update({
    empleado_asignado_id: targetUserId,
    actualizado_en: new Date().toISOString()
  }).eq('id', solicitudId);

  if (error) return { success: false, error: error.message };

  await supabase.from('historial_solicitudes').insert({
    solicitud_id: solicitudId,
    usuario_id: perfil?.id,
    accion: targetUserId ? 'asignacion' : 'liberacion',
    detalles: targetUserId ? `Asignado a usuario ID: ${targetUserId}` : 'Liberado'
  });

  revalidatePath('/administracion/dashboard');
  return { success: true };
}

export async function createSolicitudManual(formData: FormData) {
  const rol = await checkAdmin();
  if (!rol) return { success: false, error: "No autenticado" };

  const supabase = await createClient();
  
  const nombre = formData.get('nombre') as string;
  const rut = formData.get('rut') as string;
  const email = formData.get('email') as string;
  const telefono = formData.get('telefono') as string;
  const direccion = formData.get('direccion') as string || '';
  const servicioId = formData.get('servicio_id') as string;
  const estadoPago = formData.get('estado_pago') as string;
  const metodoPago = formData.get('metodo_pago') as string;
  const codigoInput = formData.get('codigo') as string;

  if (!nombre || !rut || !email || !servicioId || !metodoPago) {
    return { success: false, error: 'Faltan campos obligatorios' };
  }

  const codigo = codigoInput || Math.random().toString(36).substring(2, 10).toUpperCase();

  const { error } = await supabase.from('solicitudes').insert({
    cliente_nombre: nombre,
    cliente_rut: rut,
    cliente_email: email,
    cliente_telefono: telefono,
    cliente_direccion: direccion,
    servicio_id: servicioId,
    estado_trabajo: 'pendiente',
    estado_pago: estadoPago,
    metodo_pago: metodoPago,
    estado_boleta: 'sin enviar',
    codigo: codigo
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/administracion/dashboard');
  return { success: true };
}

// ==== RECLAMOS ====
export async function updateReclamoStatus(reclamoId: string, newState: string) {
  const rol = await checkAdmin();
  if (rol !== 'notario' && rol !== 'supervisor') {
    return { success: false, error: "Sólo notario o supervisor pueden gestionar reclamos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('reclamos_sugerencias').update({ estado: newState }).eq('id', reclamoId);
  if (error) return { success: false, error: error.message };

  revalidatePath('/administracion/dashboard');
  return { success: true };
}

// ==== DOCUMENTOS INSTITUCIONALES ====
export async function uploadDocumentoInstitucional(formData: FormData) {
  const rol = await checkAdmin();
  if (rol !== 'notario') {
    return { success: false, error: "Sólo el notario puede subir documentos institucionales." };
  }

  const supabase = await createClient();
  const file = formData.get('archivo') as File;
  const categoria = formData.get('categoria') as string;
  const titulo = formData.get('titulo') as string;

  if (!file || !categoria || !titulo) {
    return { success: false, error: "Faltan datos obligatorios." };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${categoria}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documentos-institucionales')
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    return { success: false, error: "Error al subir archivo: " + uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('documentos-institucionales')
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase.from('documentos_institucionales').insert({
    categoria,
    titulo,
    url_archivo: publicUrl
  });

  if (dbError) {
    return { success: false, error: "Error al registrar documento: " + dbError.message };
  }

  revalidatePath('/administracion/dashboard');
  revalidatePath('/documentos-legales');
  return { success: true };
}

export async function deleteDocumentoInstitucional(id: string, url: string) {
  const rol = await checkAdmin();
  if (rol !== 'notario') {
    return { success: false, error: "Sólo el notario puede eliminar documentos." };
  }

  const supabase = await createClient();

  const { error: dbError } = await supabase.from('documentos_institucionales').delete().eq('id', id);
  if (dbError) return { success: false, error: dbError.message };

  const urlParts = url.split('/documentos-institucionales/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    await supabase.storage.from('documentos-institucionales').remove([filePath]);
  }

  revalidatePath('/administracion/dashboard');
  revalidatePath('/documentos-legales');
  return { success: true };
}
