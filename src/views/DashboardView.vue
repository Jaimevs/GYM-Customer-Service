<template>
  <div class="dashboard-view">
    <!-- Sidebar -->
    <SidebarDashboard :isVisible="isSidebarVisible" @update:isVisible="updateSidebarVisibility" />

    <!-- Contenido principal -->
    <main class="dashboard-main" :class="{ 'sidebar-visible': isSidebarVisible }">
      <!-- Navbar -->
      <NavbarDashboard @toggle-sidebar="toggleSidebar" />

      <!-- Título y contenido -->
      <h1>Bienvenido al Dashboard</h1>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import NavbarDashboard from '@/components/NavbarDashboard.vue';

// Estado para la visibilidad del sidebar
const isSidebarVisible = ref(true);

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const updateSidebarVisibility = (newValue: boolean) => {
  isSidebarVisible.value = newValue;
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.dashboard-view {
  display: flex;
  min-height: 100vh;
}

.dashboard-main {
  flex: 1;
  padding: $espaciado-grande;
  margin-top: 64px; // Espacio para el navbar
  background-color: #f9f9f9;
  box-shadow: $sombra-suave;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.sidebar-visible {
  margin-left: 250px;
}

@include media-query(small) {
  .dashboard-main {
    margin-left: 0;
    padding: $espaciado-base;
  }
}
</style>
