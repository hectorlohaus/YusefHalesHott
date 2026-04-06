import { NextResponse } from 'next/server';

export async function GET() {
  const fileContent = `
    window.ENV = {
      SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL}',
      SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}'
    };
  `;

  return new NextResponse(fileContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
