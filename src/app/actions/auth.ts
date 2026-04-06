'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: 'Credenciales inválidas.' };
  }

  if (data.user) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('activo')
      .eq('auth_id', data.user.id)
      .single();

    if (usuario && !usuario.activo) {
      await supabase.auth.signOut();
      return { success: false, error: 'Su cuenta está inactiva. Contacte al Notario.' };
    }
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/administracion');
}
