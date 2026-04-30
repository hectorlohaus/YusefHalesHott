import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateGetnetAuth } from '@/lib/getnet';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleReturn(request);
}

export async function POST(request: NextRequest) {
  return handleReturn(request);
}

async function handleReturn(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let solicitudId = searchParams.get('solicitudId');
  let requestId = searchParams.get('requestId');
  let reference = searchParams.get('reference');

  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      if (!solicitudId) solicitudId = formData.get('solicitudId') as string | null;
      if (!requestId) requestId = formData.get('requestId') as string | null;
      if (!reference) reference = formData.get('reference') as string | null;
    } catch (e) {
      console.warn("Could not parse POST formData", e);
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const appUrl = (siteUrl && !siteUrl.includes('localhost')) ? siteUrl : request.nextUrl.origin;

  if (!solicitudId && !requestId && !reference) {
    return NextResponse.redirect(new URL(`${appUrl}/pago/fallo?reason=missing_identifiers`), 303);
  }

  const supabase = await createClient();

  let query = supabase.from('solicitudes').select('id, getnet_session_id');

  if (solicitudId) {
    query = query.eq('id', solicitudId);
  } else if (requestId) {
    query = query.eq('getnet_session_id', requestId);
  } else if (reference && reference.startsWith('REQ-')) {
    const shortId = reference.replace('REQ-', '');
    query = query.ilike('id', `${shortId}%`);
  } else {
    return NextResponse.redirect(new URL(`${appUrl}/pago/fallo?reason=invalid_reference`), 303);
  }

  const { data: solicitud, error: solError } = await query.maybeSingle();

  if (solError || !solicitud || !solicitud.getnet_session_id) {
    return NextResponse.redirect(new URL(`${appUrl}/pago/fallo?reason=not_found`), 303);
  }

  const endpoint = process.env.GETNET_ENDPOINT || 'https://checkout.test.getnet.cl';

  try {
    let status = 'PENDING';
    let data;
    
    for (let i = 0; i < 5; i++) {
      // Regenerate auth for each request to avoid nonce replay errors
      const auth = generateGetnetAuth();
      const payload = { auth };
      
      const res = await fetch(`${endpoint}/api/session/${solicitud.getnet_session_id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'NotariaTraiguen/1.0',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      data = await res.json();
      status = data.status?.status;
      
      if (status !== 'PENDING') {
        break;
      }
      
      if (i < 4) {
        await new Promise(resolve => setTimeout(resolve, 1500));
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

      return NextResponse.redirect(new URL(`${appUrl}/pago/exito?solicitudId=${solicitud.id}`), 303);
    } else {
      await supabase
        .from('solicitudes')
        .update({
          estado_pago: status === 'PENDING' ? 'pendiente' : 'fallido'
        })
        .eq('id', solicitud.id);
        
      return NextResponse.redirect(new URL(`${appUrl}/pago/fallo?solicitudId=${solicitud.id}&status=${status}`), 303);
    }

  } catch (err) {
    console.error("Error verifying payment", err);
    return NextResponse.redirect(new URL(`${appUrl}/pago/fallo?reason=network_error`), 303);
  }
}
