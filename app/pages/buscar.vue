<!-- app/pages/buscar.vue -->
<!-- Búsqueda por palabras clave sobre el catálogo. El texto se recibe en ?q=
     y se compara (sin tildes ni mayúsculas) contra nombre, marca, modelo,
     descripción, categoría, movimiento, materiales y características. -->
<script setup lang="ts">
useHead({ title: 'Búsqueda' })

const route = useRoute()
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

const { data: relojes } = await useAsyncData('busqueda-relojes', () => {
  return queryCollection('relojes').order('nombre', 'ASC').all()
})

const { data: categorias } = await useAsyncData('busqueda-categorias', () => {
  return queryCollection('categorias').select('slug', 'nombre').all()
})

const nombreCategoria = (id: string) => categorias.value?.find(c => c.slug === id)?.nombre || id

const resultados = computed(() => {
  if (!q.value) return []
  // Cada palabra de la búsqueda debe aparecer en algún campo del reloj
  const palabras = normalizar(q.value).split(/\s+/).filter(Boolean)
  return (relojes.value || []).filter((r) => {
    const texto = normalizar([
      r.nombre, r.marca, r.modelo, r.descripcion, r.categoria, nombreCategoria(r.categoria),
      r.movimiento, r.materialCaja, r.correa, r.cristal, r.genero, ...r.caracteristicas
    ].join(' '))
    return palabras.every(p => texto.includes(p))
  })
})

const sugerencias = ['Seiko', 'automático', 'buceo', 'cuero', 'solar', 'GPS', 'oro', 'mujer']
</script>

<template>
  <div>
    <MigasPan :items="[{ texto: 'Búsqueda' }]" />
    <h2>Buscar relojes</h2>
    <AppSearchInput />

    <template v-if="q">
      <p class="resultados-info">
        {{ resultados.length }} {{ resultados.length === 1 ? 'resultado' : 'resultados' }} para
        <strong>“{{ q }}”</strong>
      </p>
      <div v-if="resultados.length" class="rejilla-productos">
        <RelojCard v-for="reloj in resultados" :key="reloj.slug" :reloj="reloj" />
      </div>
      <div v-else class="sin-resultados">
        <p>No encontramos relojes que coincidan con su búsqueda. Revise la ortografía o pruebe con otros términos.</p>
      </div>
    </template>

    <div class="sugerencias">
      <p>Búsquedas sugeridas:</p>
      <NuxtLink
        v-for="s in sugerencias"
        :key="s"
        :to="{ path: '/buscar', query: { q: s } }"
        class="button"
      >
        {{ s }}
      </NuxtLink>
    </div>
  </div>
</template>
