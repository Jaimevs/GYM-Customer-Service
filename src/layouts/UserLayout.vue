/* --- UserLayout.vue --- */
<template>
  <div class="dashboard-layout">
    <!-- Navbar -->
    <NavbarUser @toggle-sidebar="toggleSidebar" @toggle-expand="toggleSidebarExpand" />

    <div class="dashboard-container">
      <!-- Sidebar -->
      <SidebarUser :model-value="isSidebarVisible" :expanded="isSidebarExpanded"
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

<script setup lang="ts">
import { ref } from "vue";
import NavbarUser from "@/components/common/NavbarUser.vue";
import SidebarUser from "@/components/common/SidebarUser.vue";

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
