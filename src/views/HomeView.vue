<template>
  <div class="home-view">
    <main class="main-content">
      <div class="hero">
        <h2>Atención al cliente para tu gimnasio</h2>
        <p>Gestiona las consultas de tus clientes de forma eficiente y mejora su experiencia</p>
      </div>
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
import Footer from '../components/Footer.vue';
import FeatureCard from '../components/FeatureCard.vue';
</script>

<style scoped>
.features {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
