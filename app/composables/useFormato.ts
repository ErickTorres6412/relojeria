export const formatoPrecio = (valor: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor)

export const normalizar = (texto: string) =>
  (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export const RELOJES_POR_PAGINA = 4
