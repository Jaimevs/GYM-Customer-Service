<template>
  <div class="facilities-view">
    <h1>Instalaciones</h1>
    <p>Conoce nuestras instalaciones de primer nivel.</p>
    <div v-for="(facility, index) in facilities" :key="index" class="facility-card">
      <h3>{{ facility.name }}</h3>
      <p>{{ facility.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const facilities = [
  { name: 'Área de Pesas', description: 'Equipos de última generación.' },
  { name: 'Zona Cardio', description: 'Cintas, bicicletas y elípticas.' },
  { name: 'Clases Grupales', description: 'Yoga, spinning y más.' },
];
</script>

<style scoped>
.facilities-view {
  text-align: center;
}

.facility-card {
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
