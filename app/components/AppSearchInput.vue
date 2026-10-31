<!-- app/components/AppSearchInput.vue -->
<script setup lang="ts">
const route = useRoute()
const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')

// Mantener el campo sincronizado si la búsqueda cambia desde otra parte
watch(() => route.query.q, (q) => {
  searchQuery.value = typeof q === 'string' ? q : ''
})

function buscar() {
  const q = searchQuery.value.trim()
  navigateTo({ path: '/buscar', query: q ? { q } : {} })
}
</script>

<template>
  <form class="buscador" role="search" @submit.prevent="buscar">
    <input
      v-model="searchQuery"
      type="search"
      autocomplete="off"
      placeholder="Buscar por marca, modelo, tipo…"
      aria-label="Buscar relojes"
    >
    <button type="submit" class="button-primary">Buscar</button>
  </form>
</template>
