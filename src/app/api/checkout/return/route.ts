import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateGetnetAuth } from '@/lib/getnet';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const solicitudId = searchParams.get('solicitudId');

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  if (!solicitudId) {
    return NextResponse.redirect(`${appUrl}/pago/fallo?reason=missing_id`);
  }

  const supabase = await createClient();

  const { data: solicitud } = await supabase
    .from('solicitudes')
    .select('id, getnet_session_id')
    .eq('id', solicitudId)
    .single();

  if (!solicitud || !solicitud.getnet_session_id) {
    return NextResponse.redirect(`${appUrl}/pago/fallo?reason=not_found`);
  }

  const auth = generateGetnetAuth();
  const endpoint = process.env.GETNET_ENDPOINT || 'https://checkout.test.getnet.cl';

  try {
    // Request status from Getnet
    const payload = { auth };
    const res = await fetch(`${endpoint}/api/session/${solicitud.getnet_session_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const status = data.status?.status; // 'APPROVED', 'REJECTED', 'PENDING'

    if (status === 'APPROVED') {
      await supabase
        .from('solicitudes')
        .update({
          estado_pago: 'pagado'
        })
        .eq('id', solicitud.id);

      return NextResponse.redirect(`${appUrl}/pago/exito?solicitudId=${solicitud.id}`);
    } else {
      // It might be rejected or pending, or failed
      await supabase
        .from('solicitudes')
        .update({
          estado_pago: status === 'PENDING' ? 'pendiente' : 'fallido'
        })
        .eq('id', solicitud.id);
        
      return NextResponse.redirect(`${appUrl}/pago/fallo?solicitudId=${solicitud.id}&status=${status}`);
    }

  } catch (err) {
    console.error("Error verifying payment", err);
    return NextResponse.redirect(`${appUrl}/pago/fallo?reason=network_error`);
  }
}
