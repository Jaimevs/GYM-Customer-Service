<template>
  <v-app-bar app color="white" flat elevation="4" class="fixed-navbar px-4 px-md-10">
    <div class="logo-container d-flex align-center gap-4">
      <v-icon size="32" color="primary">mdi-dumbbell</v-icon>
      <h2 class="logo-title">GYM BULLS</h2>
    </div>
    <v-spacer></v-spacer>
    <div class="nav-links d-none d-md-flex align-center gap-6">
      <a href="#" class="nav-link">Inicio</a>
      <a href="#" class="nav-link">Miembros</a>
      <a href="#" class="nav-link">Clases</a>
      <a href="#" class="nav-link">Planes</a>
      <a href="#" class="nav-link">Instalaciones</a>
    </div>
    <v-btn color="primary" class="ml-4 white--text font-weight-bold d-none d-md-block">Iniciar Sesión</v-btn>
    <v-btn icon @click="toggleSidebar">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Sidebar que se muestra según la página -->
  <SidebarHome v-if="isHomePage" v-model="showSidebar" />
  <SidebarDashboard v-if="!isHomePage" v-model="showSidebar" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import SidebarHome from '@/components/SidebarHome.vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';

const showSidebar = ref(false);
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
</script>

<style scoped>
.fixed-navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: white !important;
}

body {
  padding-top: 64px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-title {
  font-family: 'Lexend', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000000;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-family: 'Noto Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000000;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #FF0000;
}

.v-btn {
  font-weight: 600;
}
</style>
