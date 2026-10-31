// app/composables/useFormato.ts
// Funciones auxiliares de formato y búsqueda reutilizadas en varias páginas

export const formatoPrecio = (valor: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor)

// Pasa a minúsculas y elimina tildes para comparar textos en la búsqueda
export const normalizar = (texto: string) =>
  (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Cantidad de relojes que se muestran en cada página de una categoría
export const RELOJES_POR_PAGINA = 4
