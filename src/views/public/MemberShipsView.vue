<template>
  <div class="memberships-view">
    <h1>Planes de Membresía</h1>
    <p>Elige el plan que mejor se adapte a tus necesidades.</p>
    <div v-for="(plan, index) in plans" :key="index" class="plan-card">
      <h3>{{ plan.name }}</h3>
      <p>{{ plan.description }}</p>
      <p>Precio: ${{ plan.price }}/mes</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const plans = [
  { name: 'Básico', description: 'Acceso ilimitado a equipos.', price: 500 },
  { name: 'Intermedio', description: 'Acceso ilimitado + clases grupales.', price: 800 },
  { name: 'Premium', description: 'Acceso total + entrenador personal.', price: 1200 },
];
</script>

<style scoped>
.memberships-view {
  text-align: center;
}

.plan-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin: 10px auto;
  max-width: 400px;
  text-align: left;
}

h3 {
  color: #4a6cf7;
}
</style>
