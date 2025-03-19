<template>
  <!-- Contenido específico de la vista -->
  <h1>Bienvenido al Dashboard</h1>
</template>

<script lang="ts" setup>
// No necesitas importar DashboardLayout aquí
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

h1 {
  font-size: 2rem;
  color: var(--color-titulos); // Usa el color gris claro brillante para los títulos
  margin-bottom: $espaciado-grande;
}
</style>
