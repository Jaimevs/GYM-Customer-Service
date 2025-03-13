<template>
  <v-app-bar app color="white" flat elevation="4" class="fixed-navbar px-4 px-md-10">
    <div class="logo-container d-flex align-center gap-4">
      <v-icon size="32" color="primary">mdi-dumbbell</v-icon>
      <h2 class="logo-title">GYM BULLS</h2>
    </div>
    <v-spacer></v-spacer>
    <div class="nav-links d-none d-md-flex align-center gap-6">
      <router-link to="/" class="nav-link">Inicio</router-link>
      <router-link to="/miembros" class="nav-link">Miembros</router-link>
      <router-link to="/clases" class="nav-link">Clases</router-link>
      <router-link to="/planes" class="nav-link">Planes</router-link>
      <router-link to="/instalaciones" class="nav-link">Instalaciones</router-link>
    </div>
    <v-btn color="primary" class="ml-4 white--text font-weight-bold d-none d-md-block" @click="navigateToLogin">
      Iniciar Sesión
    </v-btn>
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
import { useRouter, useRoute } from 'vue-router'; // Importa useRoute y useRouter
import SidebarHome from '@/components/SidebarHome.vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';

const router = useRouter();
const route = useRoute(); // Usa useRoute aquí
const showSidebar = ref(false);

// Función para redirigir al login
const navigateToLogin = () => {
  router.push('/login');
};

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const isHomePage = computed(() => route.path === '/');
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/_variables.scss' as vars; // Usa @use en lugar de @import

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
  color: vars.$color-negro; // Usa vars.$variable
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: vars.$color-negro; // Usa vars.$variable
  font-family: vars.$fuente-principal; // Usa vars.$variable
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:link,
  &:visited {
    color: vars.$color-negro; // Usa vars.$variable
  }

  &:hover {
    color: vars.$color-rojo-vibrante; // Usa vars.$variable
  }

  &:active {
    color: color.adjust(vars.$color-rojo-vibrante, $lightness: -10%); // Usa color.adjust
  }
}

.v-btn {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}
</style>
