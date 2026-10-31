<!-- app/components/RelojCard.vue -->
<script setup lang="ts">
defineProps<{
  reloj: {
    slug: string
    nombre: string
    marca: string
    precio: number
    imagen: string
    descripcion: string
    movimiento: string
    stock: number
    destacado?: boolean
  }
}>()
</script>

<template>
  <article class="tarjeta">
    <NuxtLink :to="`/relojes/${reloj.slug}`" class="tarjeta-imagen">
      <span v-if="reloj.destacado" class="etiqueta">Destacado</span>
      <img :src="reloj.imagen" :alt="`${reloj.marca} ${reloj.nombre}`" loading="lazy">
    </NuxtLink>
    <div class="tarjeta-cuerpo">
      <p class="marca">{{ reloj.marca }}</p>
      <h5><NuxtLink :to="`/relojes/${reloj.slug}`">{{ reloj.nombre }}</NuxtLink></h5>
      <p class="detalle">{{ reloj.movimiento }}</p>
      <p class="precio">{{ formatoPrecio(reloj.precio) }}</p>
      <div class="tarjeta-acciones">
        <NuxtLink :to="`/relojes/${reloj.slug}`" class="button">Ver detalle</NuxtLink>
        <BotonComprar :reloj="reloj" texto="Comprar" />
      </div>
    </div>
  </article>
</template>
