import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateGetnetAuth } from '@/lib/getnet';

export async function GET(request: NextRequest) {
  return handleReturn(request);
}

export async function POST(request: NextRequest) {
  return handleReturn(request);
}

async function handleReturn(request: NextRequest) {
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
    const payload = { auth };
    let status = 'PENDING';
    let data;
    
    // Check up to 4 times (delay of 0s, 2s, 2s, 2s) to avoid race conditions 
    // where Getnet backend hasn't updated the status by the time the user is redirected.
    for (let i = 0; i < 4; i++) {
      const res = await fetch(`${endpoint}/api/session/${solicitud.getnet_session_id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'NotariaTraiguen/1.0',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000)
      });

      data = await res.json();
      status = data.status?.status; // 'APPROVED', 'REJECTED', 'PENDING'
      
      if (status !== 'PENDING') {
        break; // Status is definitive, break the loop
      }
      
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (status === 'APPROVED') {
      await supabase
        .from('solicitudes')
        .update({
          estado_pago: 'pagado',
          estado_boleta: 'enviada'
        })
        .eq('id', solicitud.id);

      return NextResponse.redirect(`${appUrl}/pago/exito?solicitudId=${solicitud.id}`);
    } else {
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
