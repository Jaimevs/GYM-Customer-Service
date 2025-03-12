<template>
  <div class="dashboard-view">
    <Sidebar />
    <main class="dashboard-main">
      <h1>Bienvenido al Dashboard</h1>
      <DashboardPage />
    </main>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from '../components/Sidebar.vue'; // Puedes tener un sidebar o menú lateral
import DashboardPage from '../pages/DashboardPage.vue'; // Página del dashboard
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: row;
}

.dashboard-main {
  flex: 1;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #333;
}
</style>
