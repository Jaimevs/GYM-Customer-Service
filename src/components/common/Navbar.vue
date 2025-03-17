<template>
  <v-app-bar app color="transparent" flat elevation="4" class="fixed-navbar px-4 px-md-10">
    <div class="navbar-container d-flex align-center">
      <!-- Logo (Izquierda) -->
      <div class="logo-container d-flex align-center gap-4" @click="navigateToHome">
        <img src="@/assets/img/gymbulls.png" alt="GYM BULLS Logo" class="logo-image" />
      </div>

      <!-- Enlaces de Navegación (Centro) -->
      <div class="nav-links d-none d-sm-flex align-center gap-6">
        <router-link to="/gimnasios" class="nav-link">Gimnasios</router-link>
        <router-link to="/planes" class="nav-link">Planes</router-link>
        <router-link to="/instalaciones" class="nav-link">Instalaciones</router-link>
      </div>

      <!-- Contenedor del botón de sesión y menú hamburguesa -->
      <div class="d-flex align-center gap-3 ml-auto">
        <v-btn class="font-weight-bold v-btn--login" @click="navigateToLogin">
          <v-icon left>mdi-login</v-icon>
          Iniciar Sesión
        </v-btn>

        <v-btn icon class="v-btn--menu" @click="toggleSidebar">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>
    </div>
  </v-app-bar>

  <!-- Sidebar Dinámico -->
  <Sidebar v-model="isSidebarOpen" />
</template>

<script setup lang="ts">
import Sidebar from "@/components/common/Sidebar.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Estado del sidebar
const isSidebarOpen = ref(false);

// Funciones para navegar
const navigateToHome = () => {
  router.push("/");
};

const navigateToLogin = () => {
  router.push("/login");
};

// Función para alternar el sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped lang="scss">
@use "@/styles/common/_navbar.scss";
</style>
