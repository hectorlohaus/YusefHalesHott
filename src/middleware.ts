import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca el token de sesión si es necesario verificando el usuario
  const { data: { user } } = await supabase.auth.getUser()

  // Protección del dashboard administrativo
  if (request.nextUrl.pathname.startsWith('/administracion/dashboard')) {
    if (!user) {
      // Redirigir a login si no está autenticado
      const url = request.nextUrl.clone()
      url.pathname = '/administracion'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Asegurar que el middleware solo corra en rutas específicas para ahorrar cómputo
    '/administracion/dashboard/:path*',
  ],
}
