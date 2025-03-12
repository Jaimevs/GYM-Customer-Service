<template>
  <VApp>
    <!-- Mostrar el Navbar solo si estamos en la ruta '/' -->
    <Navbar v-if="isHomePage" />
    <!-- El contenido de las vistas se renderiza aquí -->
    <RouterView />
  </VApp>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';  // Asegúrate de que la ruta sea correcta

// Obtener la ruta actual
const route = useRoute();

// Mostrar el Navbar solo en la ruta '/'
const isHomePage = computed(() => route.path === '/');
</script>
