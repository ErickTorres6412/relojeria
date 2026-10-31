# Relojería Cronos — Proyecto 2 (EIF-511 Arquitectura de Información)

Tienda en línea de relojes (tema 9, Relojería) desarrollada con **Nuxt 4** y **Nuxt Content**, siguiendo los tutoriales del curso.

## Funcionalidades

| Requisito | Implementación |
|---|---|
| Catálogo de ≥30 artículos en JSON | 36 relojes en `content/relojes/*.json` (un documento por reloj) y 6 categorías en `content/categorias/*.json`, declarados como colecciones `data` en `content.config.ts` (Tutorial 5) |
| Organización por categorías | `/categorias` → `/categorias/[categoria]` → `/relojes/[id]` |
| Búsqueda | Campo en el encabezado y en la portada → `/buscar?q=...` (busca sin importar tildes ni mayúsculas en nombre, marca, modelo, descripción, categoría, materiales y características) |
| Paginación | 4 relojes por página: `/categorias/buceo`, `/categorias/buceo/2`, … con Anterior/Siguiente y números de página (`.skip()` y `.limit()`) |
| Snipcart | Plugin `app/plugins/snipcart.client.ts`, botón de compra en cada tarjeta y en el detalle (`BotonComprar.vue`) y botón del carrito con contador en el menú (Tutorial 9) |
| Utterances | `CommentsUtterances.vue` en la página de detalle de cada reloj (Tutorial 8) |

Además, se aplican patrones de los capítulos 14 y 15 del temario: detalle de producto completo (imágenes, especificaciones, disponibilidad, plazos de envío y garantía), enlace a la política de devoluciones, productos destacados en la portada, venta cruzada ("También te puede interesar") y migas de pan.

## Estructura

```
content/
  categorias/*.json      6 categorías
  relojes/*.json         36 relojes
app/
  pages/                 index, categorias, categorias/[categoria]/[[pagina]], relojes/[id], buscar, politicas
  components/            HeaderView, FooterView, AppSearchInput, RelojCard, BotonComprar,
                         PaginacionView, MigasPan, CommentsUtterances
  plugins/snipcart.client.ts
  layouts/default.vue
public/images/relojes/   ilustraciones SVG de cada reloj
scripts/generar-imagenes.mjs   genera las ilustraciones a partir de los JSON
```

## Ejecución local

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # genera el sitio estático en .output/public (dist)
```

Copie `.env.example` como `.env` y coloque su clave pública de Snipcart y su repositorio de comentarios.

Las imágenes de los relojes son ilustraciones generadas con `npm run imagenes`. Para usar fotografías basta con colocarlas en `public/images/relojes/` y actualizar el campo `imagen` del JSON.

## Configuración pendiente (cuentas propias)

1. **Snipcart:** crear cuenta en snipcart.com, copiar la *clave pública de prueba* y registrar el dominio de Netlify en *Dominios*.
2. **Utterances:** crear un repositorio **público** en GitHub (p. ej. `usuario/relojeria-comentarios`) e instalar la app desde github.com/apps/utterances en ese repositorio.
3. **Netlify:** conectar el repositorio. `netlify.toml` ya define el comando `npm run generate` y el directorio `dist`. En *Site configuration → Environment variables* definir:
   - `NUXT_PUBLIC_SNIPCART_API_KEY` = clave pública de Snipcart
   - `NUXT_PUBLIC_SITE_URL` = `https://su-sitio.netlify.app`
   - `NUXT_PUBLIC_UTTERANCES_REPO` = `usuario/relojeria-comentarios`

   Después de definirlas, volver a publicar (*Trigger deploy*).

## Entrega en el Aula Virtual

Subir el código **sin** `node_modules`, `.nuxt`, `.output`, `.data` ni `dist`.
