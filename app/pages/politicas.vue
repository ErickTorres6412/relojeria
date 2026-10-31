<script setup lang="ts">
useHead({ title: 'Envíos, devoluciones y privacidad' })
</script>

<template>
  <div class="politicas">
    <MigasPan :items="[{ texto: 'Envíos y devoluciones' }]" />
    <h2>Envíos, devoluciones y privacidad</h2>

    <h4>Envíos</h4>
    <table class="u-full-width">
      <thead>
        <tr><th>Método</th><th>Plazo de entrega</th><th>Costo</th></tr>
      </thead>
      <tbody>
        <tr><td>Estándar (Correos de Costa Rica)</td><td>2 a 4 días hábiles</td><td>$5 (gratis en compras mayores a $200)</td></tr>
        <tr><td>Express (mensajería)</td><td>24 horas en el GAM</td><td>$12</td></tr>
        <tr><td>Retiro en tienda</td><td>Mismo día</td><td>Gratis</td></tr>
      </tbody>
    </table>
    <p>Los relojes de la categoría Lujo se envían asegurados y requieren la firma del destinatario al momento de la entrega.</p>

    <h4>Devoluciones</h4>
    <ul>
      <li>Dispone de <strong>30 días naturales</strong> desde la entrega para devolver un reloj.</li>
      <li>El reloj debe estar sin uso, con sus etiquetas, estuche, manuales y tarjeta de garantía.</li>
      <li>El costo del envío de devolución es cubierto por Relojería Cronos si el producto llegó dañado o no corresponde a lo solicitado.</li>
      <li>El reembolso se realiza al mismo medio de pago en un plazo de 5 a 10 días hábiles.</li>
    </ul>

    <h4>Garantía</h4>
    <p>Todos los relojes cuentan con garantía oficial del fabricante. El plazo de garantía de cada modelo se indica en su página de detalle.</p>

    <h4>Seguridad y privacidad</h4>
    <p>
      Los pagos se procesan mediante Snipcart sobre una conexión cifrada (HTTPS). Relojería Cronos no almacena
      los datos de su tarjeta. La información de envío se utiliza únicamente para entregar su pedido, de acuerdo
      con la Ley N.º 7472 de Promoción de la competencia y defensa efectiva del consumidor.
    </p>
  </div>
</template>
