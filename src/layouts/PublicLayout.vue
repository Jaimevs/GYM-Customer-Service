<template>
  <div class="public-layout">
    <!-- Navbar Público -->
    <Navbar @toggle-sidebar="toggleSidebar">
      <template #sidebar>
        <Sidebar v-model="showSidebar" />
      </template>
    </Navbar>

    <!-- Contenido de la página -->
    <main class="public-main">
      <router-view />
    </main>

    <!-- Footer Público -->
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Navbar from '@/components/common/Navbar.vue';
import Sidebar from '@/components/common/Sidebar.vue';
import Footer from '@/components/common/Footer.vue';

// Estado del sidebar
const showSidebar = ref(false);

// Función para alternar el sidebar
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-fondo);
}

.public-main {
  flex: 1;
  padding: $espaciado-base;
  background-color: transparent;
}
</style>
