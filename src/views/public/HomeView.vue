<template>
  <div class="home-view">
    <!-- Fondo con diagonal -->
    <div class="home-background"></div>

    <!-- Sección Hero -->
    <HeroSection />

    <main class="main-content">
      <div class="features">
        <FeatureCard v-for="(feature, index) in features" :key="index" :icon="feature.icon" :title="feature.title"
          :description="feature.description" />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import HeroSection from '@/components/home/HeroSection.vue';
import FeatureCard from '@/components/home/FeatureCard.vue';

// Datos de las características
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

// Cargar script del chatbot
onMounted(() => {
  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...args: any[]) => {
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
        return (...args: any[]) => target(prop, ...args);
      },
    });
  }

  const script = document.createElement("script");
  script.src = "https://www.chatbase.co/embed.min.js";
  script.id = "RCDxoeYPao7TUIWL8cbxn";
  script.domain = "www.chatbase.co";
  document.body.appendChild(script);

  onUnmounted(() => {
    document.body.removeChild(script);
  });
});
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1; // Asegura que el contenido esté sobre el fondo
}

.main-content {
  flex: 1;
  padding: $espaciado-extra-grande;
  z-index: 1;

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $espaciado-grande;
    margin-top: $espaciado-extra-grande;
    text-align: center;
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
