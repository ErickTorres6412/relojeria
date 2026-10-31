<script setup lang="ts">
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const { utterancesRepo } = useRuntimeConfig().public
const id = String(route.params.id)

const { data: reloj } = await useAsyncData(`reloj-${id}`, () => {
  return queryCollection('relojes').where('slug', '=', id).first()
})

if (!reloj.value) {
  throw createError({ statusCode: 404, statusMessage: 'Reloj no encontrado', fatal: true })
}

const { data: categoria } = await useAsyncData(`reloj-${id}-categoria`, () => {
  return queryCollection('categorias').where('slug', '=', reloj.value!.categoria).first()
})

const { data: relacionados } = await useAsyncData(`reloj-${id}-relacionados`, () => {
  return queryCollection('relojes')
    .where('categoria', '=', reloj.value!.categoria)
    .where('slug', '<>', id)
    .order('precio', 'ASC')
    .limit(3)
    .all()
})

const r = reloj.value
useHead({
  title: `${r.marca} ${r.nombre}`,
  meta: [{ name: 'description', content: r.descripcion }]
})

const especificaciones = [
  ['Marca', r.marca],
  ['Modelo', r.modelo],
  ['Género', r.genero],
  ['Movimiento', r.movimiento],
  ['Material de la caja', r.materialCaja],
  ['Correa', r.correa],
  ['Cristal', r.cristal],
  ['Diámetro', `${r.diametro} mm`],
  ['Resistencia al agua', r.resistenciaAgua > 0 ? `${r.resistenciaAgua} m` : 'No resistente al agua'],
  ['Garantía', `${r.garantia} ${r.garantia === 1 ? 'año' : 'años'}`]
]
</script>

<template>
  <div>
    <MigasPan
      :items="[
        { texto: 'Categorías', to: '/categorias' },
        { texto: categoria?.nombre || reloj!.categoria, to: `/categorias/${reloj!.categoria}` },
        { texto: reloj!.nombre }
      ]"
    />

    <div class="row detalle-producto">
      <div class="five columns">
        <img class="u-max-full-width imagen-detalle" :src="reloj!.imagen" :alt="`${reloj!.marca} ${reloj!.nombre}`">
      </div>
      <div class="seven columns">
        <p class="marca">{{ reloj!.marca }}</p>
        <h3>{{ reloj!.nombre }}</h3>
        <p class="detalle">Modelo {{ reloj!.modelo }} · {{ reloj!.movimiento }} · {{ reloj!.diametro }} mm</p>
        <p class="precio precio-grande">{{ formatoPrecio(reloj!.precio) }}</p>
        <p :class="reloj!.stock > 0 ? 'disponible' : 'agotado'">
          {{ reloj!.stock > 0 ? `✔ Disponible (${reloj!.stock} en inventario)` : '✖ Agotado temporalmente' }}
        </p>
        <BotonComprar :reloj="reloj!" />
        <ul class="beneficios">
          <li>🚚 Se envía en 2 a 4 días hábiles. Envío gratis en compras mayores a $200.</li>
          <li>🛡 Garantía oficial de {{ reloj!.garantia }} {{ reloj!.garantia === 1 ? 'año' : 'años' }}.</li>
          <li>↩ 30 días para devoluciones. <NuxtLink to="/politicas">Ver política de devoluciones</NuxtLink></li>
        </ul>
        <h5>Descripción</h5>
        <p>{{ reloj!.descripcion }}</p>
        <h5>Características</h5>
        <ul class="caracteristicas">
          <li v-for="c in reloj!.caracteristicas" :key="c">{{ c }}</li>
        </ul>
      </div>
    </div>

    <section>
      <h5>Especificaciones técnicas</h5>
      <table class="u-full-width especificaciones">
        <tbody>
          <tr v-for="[nombre, valor] in especificaciones" :key="nombre">
            <th>{{ nombre }}</th>
            <td>{{ valor }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="relacionados?.length">
      <h5>También te puede interesar</h5>
      <div class="rejilla-productos">
        <RelojCard v-for="otro in relacionados" :key="otro.slug" :reloj="otro" />
      </div>
    </section>

    <section class="seccion-comentarios">
      <h5>Comentarios de clientes</h5>
      <p class="subtitulo">Inicie sesión con su cuenta de GitHub para dejar su opinión sobre este reloj.</p>
      <CommentsUtterances :repo="utterancesRepo" />
    </section>
  </div>
</template>
