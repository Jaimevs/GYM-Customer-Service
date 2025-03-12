<template>
  <div class="dashboard-page">
    <section class="summary">
      <h2>Resumen de Actividad</h2>
      <p>Estadísticas e información importante del gimnasio.</p>
    </section>
    <section class="recent-activity">
      <h2>Actividad Reciente</h2>
      <ul>
        <li>Nuevo mensaje recibido.</li>
        <li>Un cliente se registró.</li>
        <li>Se actualizó el plan de membresía.</li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.dashboard-page {
  margin-top: 2rem;
}

section {
  margin-bottom: 2rem;
}

h2 {
  color: #4CAF50;
  font-size: 1.8rem;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  padding: 0.5rem;
  background-color: #f5f5f5;
  margin: 0.5rem 0;
  border-radius: 4px;
}
</style>
