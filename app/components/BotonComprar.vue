<!-- app/components/BotonComprar.vue -->
<!-- Botón de compra de Snipcart: la clase snipcart-add-item y los atributos
     data-item-* describen el producto. Snipcart valida el precio visitando
     data-item-url, que debe ser la página de detalle del reloj en el sitio publicado. -->
<script setup lang="ts">
const props = defineProps<{
  reloj: {
    slug: string
    nombre: string
    marca: string
    precio: number
    imagen: string
    descripcion: string
    stock: number
  }
  texto?: string
}>()

const { siteUrl } = useRuntimeConfig().public
const descripcionCorta = computed(() => props.reloj.descripcion.slice(0, 120))
</script>

<template>
  <button
    class="snipcart-add-item button-primary boton-comprar"
    :disabled="reloj.stock === 0"
    :data-item-id="reloj.slug"
    :data-item-name="`${reloj.marca} ${reloj.nombre}`"
    :data-item-price="reloj.precio"
    :data-item-url="`${siteUrl}/relojes/${reloj.slug}/`"
    :data-item-description="descripcionCorta"
    :data-item-image="`${siteUrl}${reloj.imagen}`"
    :data-item-max-quantity="reloj.stock"
  >
    {{ reloj.stock === 0 ? 'Agotado' : (texto || 'Agregar al carrito') }}
  </button>
</template>
