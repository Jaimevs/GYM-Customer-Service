<template>
  <div class="home-view">
    <HeroSection /> <!-- Se integra el HeroSection reutilizable -->

    <main class="main-content">
      <div class="features">
        <FeatureCard icon="mdi-message" title="Mensajes Directos"
          description="Recibe y responde consultas de tus clientes." />
        <FeatureCard icon="mdi-chart-pie" title="Estadísticas Detalladas"
          description="Analiza el rendimiento de tu servicio." />
        <FeatureCard icon="mdi-comment-text" title="Comentarios y Sugerencias"
          description="Recopila feedback valioso para mejorar." />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import HeroSection from '@/components/HeroSection.vue';
import Footer from '@/components/Footer.vue';
import FeatureCard from '@/components/FeatureCard.vue';
</script>

<style scoped>
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $espaciado-grande;
  margin-top: $espaciado-extra-grande;
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

.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Hace que el contenedor ocupe toda la pantalla */
}

.main-content {
  flex: 1;
  /* Permite que el contenido crezca y empuje el footer hacia abajo */
  padding: 2rem;
}
</style>
