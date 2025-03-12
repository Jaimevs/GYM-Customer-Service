<template>
  <div class="home">
    <Navbar />
    <main class="main-content">
      <div class="hero">
        <h2>Atención al cliente para tu gimnasio</h2>
        <p>Gestiona las consultas de tus clientes de forma eficiente y mejora su experiencia</p>
        <router-link to="/register" class="cta-button">Comenzar Ahora</router-link>
      </div>
      <div class="features">
        <FeatureCard icon="📩" title="Mensajes Directos" description="Recibe y responde consultas de tus clientes." />
        <FeatureCard icon="📊" title="Estadísticas Detalladas" description="Analiza el rendimiento de tu servicio." />
        <FeatureCard icon="🔄" title="Comentarios y Sugerencias"
          description="Recopila feedback valioso para mejorar." />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import FeatureCard from '../components/FeatureCard.vue';
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>
