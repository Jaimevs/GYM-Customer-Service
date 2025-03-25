<!-- PublicLayout.vue -->
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

    <!-- Script de Chatbase -->
    <div id="chatbase-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/common/Navbar.vue';
import Sidebar from '@/components/common/Sidebar.vue';
import Footer from '@/components/common/Footer.vue';

// Estado del sidebar
const showSidebar = ref(false);

// Función para alternar el sidebar
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Cargar el script de Chatbase
onMounted(() => {
  const loadChatbaseScript = () => {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args) => { // Cambio aquí
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args); // Cambio aquí
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args) => target(prop, ...args); // Cambio aquí
        },
      });

      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "LtNpYW1I8YpLrOXuPVEym";
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    }
  };

  // Verificar si el DOM está completamente cargado
  if (document.readyState === "complete") {
    loadChatbaseScript();
  } else {
    window.addEventListener("load", loadChatbaseScript);
  }
});
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
  /* Ocupa el espacio restante */
  padding: 0;
  /* Elimina cualquier padding que pueda interferir */
  background-color: transparent;
}
</style>
