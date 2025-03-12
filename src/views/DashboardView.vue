<template>
  <div class="dashboard-view">
    <SidebarDashboard />
    <main class="dashboard-main">
      <h1>Bienvenido al Dashboard</h1>
      <DashboardPage />
    </main>
  </div>
</template>

<script lang="ts" setup>
import SidebarDashboard from '@/components/SidebarDashboard.vue'; // Sidebar específico para el Dashboard
import DashboardPage from '@/pages/DashboardPage.vue'; // Página del dashboard
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  /* Asegura que cubra toda la altura de la ventana */
}

.dashboard-main {
  flex: 1;
  padding: $espaciado-grande;
  margin-left: 250px;
  /* Deja espacio para el sidebar */
  background-color: #f9f9f9;
  /* Fondo para el área de contenido */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombra suave para dar profundidad */
}

h1 {
  font-size: 2.5rem;
  color: $color-gris-oscuro;
  margin-bottom: $espaciado-grande;
  /* Espacio debajo del título */
}

@include media-query(small) {
  .dashboard-view {
    flex-direction: column;
    /* En pantallas pequeñas, el sidebar se mueve arriba o se oculta */
  }

  .dashboard-main {
    margin-left: 0;
    padding: $espaciado-base;
  }
}
</style>
