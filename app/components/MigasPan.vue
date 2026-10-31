<script setup lang="ts">
defineProps<{
  items: { texto: string, to?: string }[]
}>()
</script>

<template>
  <nav class="migas" aria-label="Ruta de navegación">
    <NuxtLink to="/">Inicio</NuxtLink>
    <template v-for="(item, i) in items" :key="i">
      <span class="separador">›</span>
      <NuxtLink v-if="item.to" :to="item.to">{{ item.texto }}</NuxtLink>
      <span v-else aria-current="page">{{ item.texto }}</span>
    </template>
  </nav>
</template>
