import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.notaria-conservador-traiguen-lumaco.cl'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/administracion/', 
        '/api/', 
        '/checkout/', 
        '/pago/',
        '/solicitud/' // Ocultar páginas de flujos intermedios
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
