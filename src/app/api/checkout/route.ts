import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateGetnetAuth } from '@/lib/getnet';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const solicitudId = searchParams.get('solicitudId');

  if (!solicitudId) {
    return NextResponse.json({ error: 'Missing solicitudId' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  // Get Solicitud & Servicio info
  const { data: solicitud, error } = await supabase
    .from('solicitudes')
    .select(`
      *,
      servicio:servicios(id, titulo, arancel)
    `)
    .eq('id', solicitudId)
    .single();

  if (error || !solicitud || !solicitud.servicio) {
    return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
  }

  const auth = generateGetnetAuth();
  const endpoint = process.env.GETNET_ENDPOINT || 'https://checkout.test.getnet.cl';
  
  // 15 minutes expiration
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 15);

  // Prefer request.nextUrl.origin over localhost for mobile testing
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const appUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : request.nextUrl.origin;
  const returnUrl = `${appUrl}/api/checkout/return?solicitudId=${solicitud.id}`;

  const payload = {
    locale: "es_CL",
    auth,
    buyer: {
      name: solicitud.cliente_nombre.split(' ')[0],
      surname: solicitud.cliente_nombre.split(' ').slice(1).join(' '),
      email: solicitud.cliente_email,
      document: solicitud.cliente_rut,
      documentType: "CLRUT",
      mobile: solicitud.cliente_telefono
    },
    payment: {
      reference: `REQ-${solicitud.id.substring(0, 8)}`,
      description: `Pago por servicio: ${solicitud.servicio.titulo}`,
      amount: {
        currency: "CLP",
        total: solicitud.servicio.arancel
      }
    },
    expiration: expiration.toISOString(),
    returnUrl: returnUrl,
    ipAddress: request.headers.get('x-forwarded-for') || "127.0.0.1",
    userAgent: request.headers.get('user-agent') || "NotariaApp/1.0"
  };

  try {
    const res = await fetch(`${endpoint}/api/session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'NotariaTraiguen/1.0'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000)
    });

    const data = await res.json();

    if (data.status?.status === 'OK' && data.processUrl) {
      // Update our DB with the getnet_session_id
      await supabase
        .from('solicitudes')
        .update({ 
          getnet_session_id: data.requestId.toString(),
          metodo_pago: 'getnet'
        })
        .eq('id', solicitud.id);

      return NextResponse.redirect(data.processUrl);
    } else {
      console.error("Getnet API Error:", data);
      return NextResponse.json({ error: 'Error al generar sesión de pago Getnet', details: data }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Fetch error to Getnet:", err);
    return NextResponse.json({ error: 'Error de red con Getnet', details: err.message }, { status: 500 });
  }
}
