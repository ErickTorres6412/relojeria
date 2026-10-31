<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number, statusMessage?: string } }>()
useHead({ title: props.error.statusCode === 404 ? 'Página no encontrada' : 'Error' })
</script>

<template>
  <NuxtLayout>
    <div class="pagina-error">
      <h1>{{ error.statusCode }}</h1>
      <p>{{ error.statusCode === 404 ? 'Lo sentimos, la página que busca no existe.' : (error.statusMessage || 'Ocurrió un error inesperado.') }}</p>
      <button class="button-primary" @click="clearError({ redirect: '/' })">Volver al inicio</button>
      <p><NuxtLink to="/categorias">Ver todas las categorías</NuxtLink></p>
    </div>
  </NuxtLayout>
</template>
