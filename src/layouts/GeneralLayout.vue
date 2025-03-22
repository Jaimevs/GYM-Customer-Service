<template>
  <div class="dashboard-layout">
    <!-- Navbar -->
    <NavbarGeneral @toggle-sidebar="toggleSidebar" @toggle-expand="toggleSidebarExpand" />

    <div class="dashboard-container">
      <!-- Sidebar -->
      <SidebarGeneral :model-value="isSidebarVisible" :expanded="isSidebarExpanded"
        @update:model-value="updateSidebarVisibility" :menuItems="getMenuItemsByRole" />

      <!-- Contenido principal -->
      <main class="dashboard-main" :class="{
        'sidebar-collapsed': !isSidebarExpanded,
        'sidebar-expanded': isSidebarExpanded && isSidebarVisible,
        'sidebar-hidden': !isSidebarVisible,
      }">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore"; // Importar el store de Pinia
import SidebarGeneral from "@/components/common/SidebarGeneral.vue";
import NavbarGeneral from "@/components/common/NavbarGeneral.vue";
import { adminMenuItems, userMenuItems, coachMenuItems } from "@/data/menuItems";

// Estado para la visibilidad del sidebar
const isSidebarVisible = ref(true);

// Estado para el modo expandido/contraído del sidebar
const isSidebarExpanded = ref(true);

// Obtener el store de autenticación de Pinia
const authStore = useAuthStore();

// Obtener el rol del usuario desde el store de Pinia
const userRole = computed(() => authStore.role);

// Determinar la lista de menú según el rol
const getMenuItemsByRole = computed(() => {
  if (userRole.value === "admin") return adminMenuItems;
  if (userRole.value === "usuario") return userMenuItems;
  if (userRole.value === "entrenador") return coachMenuItems;
  return [];
});

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
