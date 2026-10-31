<script setup lang="ts">
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const idCategoria = String(route.params.categoria)
const pagina = Number(route.params.pagina || 1)

const { data: categoria } = await useAsyncData(`categoria-${idCategoria}`, () => {
  return queryCollection('categorias').where('slug', '=', idCategoria).first()
})

if (!categoria.value) {
  throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada', fatal: true })
}

const { data: total } = await useAsyncData(`categoria-${idCategoria}-total`, () => {
  return queryCollection('relojes').where('categoria', '=', idCategoria).count()
})

const totalPaginas = Math.max(1, Math.ceil((total.value || 0) / RELOJES_POR_PAGINA))

if (!Number.isInteger(pagina) || pagina < 1 || pagina > totalPaginas) {
  throw createError({ statusCode: 404, statusMessage: 'Página no encontrada', fatal: true })
}

const { data: relojes } = await useAsyncData(`categoria-${idCategoria}-pagina-${pagina}`, () => {
  return queryCollection('relojes')
    .where('categoria', '=', idCategoria)
    .order('precio', 'ASC')
    .skip((pagina - 1) * RELOJES_POR_PAGINA)
    .limit(RELOJES_POR_PAGINA)
    .all()
})

useHead({ title: pagina > 1 ? `${categoria.value.nombre} - Página ${pagina}` : categoria.value.nombre })
</script>

<template>
  <div>
    <MigasPan :items="[{ texto: 'Categorías', to: '/categorias' }, { texto: categoria!.nombre }]" />
    <h2>{{ categoria!.nombre }}</h2>
    <p class="subtitulo">{{ categoria!.descripcion }}</p>
    <p class="resultados-info">
      Mostrando {{ (pagina - 1) * RELOJES_POR_PAGINA + 1 }}–{{ (pagina - 1) * RELOJES_POR_PAGINA + (relojes?.length || 0) }}
      de {{ total }} relojes, ordenados por precio.
    </p>
    <div class="rejilla-productos">
      <RelojCard v-for="reloj in relojes" :key="reloj.slug" :reloj="reloj" />
    </div>
    <PaginacionView :pagina="pagina" :total-paginas="totalPaginas" :base="`/categorias/${idCategoria}`" />
  </div>
</template>
