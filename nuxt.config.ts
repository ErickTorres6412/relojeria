// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      // Se sobrescriben en producción con variables de entorno:
      // NUXT_PUBLIC_SNIPCART_API_KEY, NUXT_PUBLIC_SITE_URL y NUXT_PUBLIC_UTTERANCES_REPO
      snipcartApiKey: 'CLAVE_PUBLICA_DE_PRUEBA',
      siteUrl: 'http://localhost:3000',
      utterancesRepo: 'usuario/relojeria-comentarios'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      titleTemplate: '%s - Relojería Cronos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Relojería Cronos: tienda en línea de relojes deportivos, de vestir, de buceo, smartwatches, clásicos y de lujo.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:400,300,600' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css' }
      ]
    }
  },
  nitro: {
    prerender: {
      // Se recorren los enlaces del sitio para generar todas las páginas
      // (categorías, páginas de la paginación y detalle de cada reloj)
      crawlLinks: true,
      routes: ['/', '/buscar', '/politicas']
    }
  }
})
