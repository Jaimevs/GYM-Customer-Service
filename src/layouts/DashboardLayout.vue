/* --- DashboardLayout.vue --- */
<template>
  <div class="dashboard-layout">
    <!-- Navbar -->
    <NavbarDashboard @toggle-sidebar="toggleSidebar" @toggle-expand="toggleSidebarExpand" />

    <div class="dashboard-container">
      <!-- Sidebar -->
      <SidebarDashboard :model-value="isSidebarVisible" :expanded="isSidebarExpanded"
        @update:model-value="updateSidebarVisibility" />

      <!-- Contenido principal -->
      <main class="dashboard-main" :class="{
        'sidebar-collapsed': !isSidebarExpanded,
        'sidebar-expanded': isSidebarExpanded && isSidebarVisible,
        'sidebar-hidden': !isSidebarVisible
      }">
        <slot></slot>
      </main>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SidebarDashboard from "@/components/dashboard/SidebarDashboard.vue";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard.vue";

// Estado para la visibilidad del sidebar
const isSidebarVisible = ref(true);

// Estado para el modo expandido/contraído del sidebar
const isSidebarExpanded = ref(true);

// Función para alternar la visibilidad del sidebar
const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};

// Función para alternar el modo expandido/contraído del sidebar
const toggleSidebarExpand = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};

// Función para actualizar la visibilidad del sidebar desde el componente hijo
const updateSidebarVisibility = (newValue: boolean) => {
  isSidebarVisible.value = newValue;
};
</script>

<style lang="scss">
@use "@/styles/dashboard/_dashboard-layout.scss";
</style>
