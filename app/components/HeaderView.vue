<script setup lang="ts">
const cartCount = useState('cart-count', () => 0)

const { data: categorias } = await useAsyncData('menu-categorias', () => {
  return queryCollection('categorias').order('orden', 'ASC').select('slug', 'nombre').all()
})
</script>

<template>
  <header class="encabezado">
    <div class="container barra">
      <NuxtLink to="/" class="logo">
        <img src="/favicon.svg" alt="" width="34" height="34">
        <span>Relojería <strong>Cronos</strong></span>
      </NuxtLink>
      <AppSearchInput class="buscador-encabezado" />
      <button class="snipcart-checkout boton-carrito" aria-label="Ver carrito de compras">
        🛒 Carrito
        <ClientOnly><span class="contador">{{ cartCount }}</span></ClientOnly>
      </button>
    </div>
    <nav class="menu" aria-label="Menú principal">
      <div class="container">
        <NuxtLink to="/">Inicio</NuxtLink>
        <NuxtLink to="/categorias">Categorías</NuxtLink>
        <NuxtLink
          v-for="cat in categorias"
          :key="cat.slug"
          :to="`/categorias/${cat.slug}`"
        >
          {{ cat.nombre }}
        </NuxtLink>
        <NuxtLink to="/politicas">Envíos y devoluciones</NuxtLink>
      </div>
    </nav>
  </header>
</template>
