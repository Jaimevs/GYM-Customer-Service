<template>
  <div class="home-view">
    <HeroSection /> <!-- Se integra el HeroSection reutilizable -->

    <main class="main-content">
      <div class="features">
        <FeatureCard v-for="(feature, index) in features" :key="index" :icon="feature.icon" :title="feature.title"
          :description="feature.description" />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import HeroSection from '@/components/HeroSection.vue';
import Footer from '@/components/Footer.vue';
import FeatureCard from '@/components/FeatureCard.vue';

const features = [
  {
    icon: 'mdi-dumbbell',
    title: 'Entrenamiento Personalizado',
    description: 'Rutinas diseñadas por expertos para alcanzar tus metas.',
  },
  {
    icon: 'mdi-account-group',
    title: 'Clases Grupales',
    description: 'Disfruta de clases dinámicas con instructores certificados.',
  },
  {
    icon: 'mdi-trophy',
    title: 'Logros y Retos',
    description: 'Supera tus límites y celebra tus progresos.',
  },
  {
    icon: 'mdi-heart-pulse',
    title: 'Bienestar Integral',
    description: 'Mejora tu salud física y mental con nuestros programas especializados.',
  },
];

// Función para cargar el chatbot
onMounted(() => {
  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...args: any[]) => { // Renombramos 'arguments' a 'args'
      if (!window.chatbase.q) {
        window.chatbase.q = [];
      }
      window.chatbase.q.push(args);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") {
          return target.q;
        }
        return (...args: any[]) => target(prop, ...args); // Usamos 'args' aquí también
      },
    });
  }

  const script = document.createElement("script");
  script.src = "https://www.chatbase.co/embed.min.js";
  script.id = "RCDxoeYPao7TUIWL8cbxn";
  script.domain = "www.chatbase.co";
  document.body.appendChild(script);

  // Limpia el script cuando el componente se desmonta
  onUnmounted(() => {
    document.body.removeChild(script);
  });
});
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/_variables.scss' as *; // Importa las variables SCSS
@use '@/styles/_mixins.scss' as *; // Importa los mixins

.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: $espaciado-extra-grande;

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $espaciado-grande;
    margin-top: $espaciado-extra-grande;
    text-align: center;
    /* Centra el contenido de las tarjetas */
  }
}

.fade-enter-active {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
