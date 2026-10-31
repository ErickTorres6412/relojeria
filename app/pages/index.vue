<!-- app/pages/index.vue -->
<script setup lang="ts">
useHead({ title: 'Inicio' })

const { data: categorias } = await useAsyncData('inicio-categorias', () => {
  return queryCollection('categorias').order('orden', 'ASC').all()
})

// Productos destacados (patrón de comercio electrónico avanzado, Cap. 15)
const { data: destacados } = await useAsyncData('inicio-destacados', () => {
  return queryCollection('relojes')
    .where('destacado', '=', true)
    .order('precio', 'ASC')
    .limit(8)
    .all()
})
</script>

<template>
  <div>
    <section class="portada">
      <div class="portada-texto">
        <h1>El tiempo, a tu estilo</h1>
        <p>
          Descubre nuestra colección de relojes deportivos, de vestir, de buceo, smartwatches,
          clásicos y de lujo. Envío a todo el país y 30 días para devoluciones.
        </p>
        <AppSearchInput />
      </div>
      <img src="/images/relojes/rolex-datejust-41.svg" alt="Reloj Rolex Datejust 41" class="portada-imagen">
    </section>

    <section>
      <h3 class="titulo-seccion">Categorías</h3>
      <div class="rejilla-categorias">
        <NuxtLink
          v-for="cat in categorias"
          :key="cat.slug"
          :to="`/categorias/${cat.slug}`"
          class="tarjeta-categoria"
        >
          <img :src="cat.imagen" :alt="cat.nombre" loading="lazy">
          <div>
            <h5>{{ cat.nombre }}</h5>
            <p>{{ cat.descripcion }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section>
      <h3 class="titulo-seccion">Relojes destacados</h3>
      <p class="subtitulo">Selección del equipo de Relojería Cronos: los más vendidos y nuestros favoritos de cada categoría.</p>
      <div class="rejilla-productos">
        <RelojCard v-for="reloj in destacados" :key="reloj.slug" :reloj="reloj" />
      </div>
    </section>
  </div>
</template>
