<!-- app/layouts/default.vue -->
<template>
  <div class="sitio">
    <HeaderView />
    <main class="container contenido">
      <slot />
    </main>
    <FooterView />
  </div>
</template>
