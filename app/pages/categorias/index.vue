<script setup lang="ts">
useHead({ title: 'Categorías' })

const { data: categorias } = await useAsyncData('categorias-lista', () => {
  return queryCollection('categorias').order('orden', 'ASC').all()
})

const { data: relojes } = await useAsyncData('categorias-conteo', () => {
  return queryCollection('relojes').select('categoria').all()
})
const cantidad = (id: string) => (relojes.value || []).filter(r => r.categoria === id).length
</script>

<template>
  <div>
    <MigasPan :items="[{ texto: 'Categorías' }]" />
    <h2>Categorías de relojes</h2>
    <p class="subtitulo">Seleccione una categoría para ver todos los relojes que pertenecen a ella.</p>
    <div class="rejilla-categorias">
      <NuxtLink
        v-for="cat in categorias"
        :key="cat.slug"
        :to="`/categorias/${cat.slug}`"
        class="tarjeta-categoria"
      >
        <img :src="cat.imagen" :alt="cat.nombre" loading="lazy">
        <div>
          <h5>{{ cat.nombre }} <small>({{ cantidad(cat.slug) }})</small></h5>
          <p>{{ cat.descripcion }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
