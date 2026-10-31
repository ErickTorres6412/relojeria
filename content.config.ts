// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Un archivo JSON por categoría (content/categorias/*.json)
    categorias: defineCollection({
      type: 'data',
      source: 'categorias/**.json',
      schema: z.object({
        slug: z.string(),
        nombre: z.string(),
        descripcion: z.string(),
        imagen: z.string(),
        orden: z.number()
      })
    }),
    // Un archivo JSON por reloj (content/relojes/*.json)
    relojes: defineCollection({
      type: 'data',
      source: 'relojes/**.json',
      schema: z.object({
        // Información genérica
        slug: z.string(),
        nombre: z.string(),
        descripcion: z.string(),
        categoria: z.string(),
        imagen: z.string(),
        // Información específica del reloj
        precio: z.number(),
        marca: z.string(),
        modelo: z.string(),
        genero: z.enum(['Hombre', 'Mujer', 'Unisex']),
        movimiento: z.string(),
        materialCaja: z.string(),
        correa: z.string(),
        cristal: z.string(),
        diametro: z.number(),
        resistenciaAgua: z.number(),
        garantia: z.number(),
        caracteristicas: z.array(z.string()),
        stock: z.number(),
        destacado: z.boolean().default(false)
      })
    })
  }
})
