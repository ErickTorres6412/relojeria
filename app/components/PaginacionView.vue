<script setup lang="ts">
const props = defineProps<{
  pagina: number
  totalPaginas: number
  base: string
}>()

const enlace = (n: number) => (n <= 1 ? props.base : `${props.base}/${n}`)
const paginas = computed(() => Array.from({ length: props.totalPaginas }, (_, i) => i + 1))
</script>

<template>
  <nav v-if="totalPaginas > 1" class="paginacion" aria-label="Paginación">
    <NuxtLink v-if="pagina > 1" :to="enlace(pagina - 1)" class="button" rel="prev">← Anterior</NuxtLink>
    <span v-else class="button deshabilitado" aria-disabled="true">← Anterior</span>

    <NuxtLink
      v-for="n in paginas"
      :key="n"
      :to="enlace(n)"
      class="button numero"
      :class="{ 'button-primary': n === pagina }"
      :aria-current="n === pagina ? 'page' : undefined"
    >
      {{ n }}
    </NuxtLink>

    <NuxtLink v-if="pagina < totalPaginas" :to="enlace(pagina + 1)" class="button" rel="next">Siguiente →</NuxtLink>
    <span v-else class="button deshabilitado" aria-disabled="true">Siguiente →</span>

    <p class="paginacion-info">Página {{ pagina }} de {{ totalPaginas }}</p>
  </nav>
</template>
