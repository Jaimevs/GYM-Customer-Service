<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <SidebarDashboard :isVisible="isSidebarVisible" @update:isVisible="updateSidebarVisibility" />

    <!-- Contenido principal -->
    <main class="dashboard-main" :class="{ 'sidebar-visible': isSidebarVisible }">
      <!-- Navbar -->
      <NavbarDashboard @toggle-sidebar="toggleSidebar" />

      <!-- Slot para el contenido específico de cada vista -->
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SidebarDashboard from '@/components/dashboard/SidebarDashboard.vue';
import NavbarDashboard from '@/components/dashboard/NavbarDashboard.vue';

// Estado para la visibilidad del sidebar
const isSidebarVisible = ref(true);

// Función para alternar la visibilidad del sidebar
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

// Función para actualizar la visibilidad del sidebar desde el componente hijo
const updateSidebarVisibility = (newValue: boolean) => {
  isSidebarVisible.value = newValue;
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.dashboard-layout {
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
  margin-left: 250px; // Ancho del sidebar
}

@include media-query(small) {
  .dashboard-main {
    margin-left: 0;
    padding: $espaciado-base;
  }
}
</style>
