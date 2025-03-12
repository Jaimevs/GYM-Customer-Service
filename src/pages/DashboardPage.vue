<template>
  <div class="dashboard-page">
    <p>Aquí va el contenido específico del dashboard...</p>
  </div>
</template>

<script setup lang="ts">
// No necesitas importar el Sidebar aquí, ya que lo gestionas en DashboardView.vue
</script>

<style scoped>
.dashboard-page {
  @include centrar-flex;
  /* Centra el contenido */
  flex-direction: column;
  padding: $espaciado-grande;
  text-align: center;
  /* Centra el texto */
}

p {
  font-size: 1.25rem;
  color: $color-gris-oscuro;
  line-height: 1.5;
  /* Mejor legibilidad del texto */
}
</style>
