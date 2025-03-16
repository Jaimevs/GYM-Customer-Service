<template>
  <v-app>
    <component :is="currentLayout">
      <router-view />
    </component>
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Determinar el layout basado en la ruta actual
const currentLayout = computed(() => {
  console.log('Ruta actual:', route.path); // Depuración: Mostrar la ruta actual
  console.log('Meta layout:', route.meta.layout); // Depuración: Mostrar el layout asignado
  return route.meta.layout || 'div'; // Fallback a 'div' si no hay layout
});
</script>
