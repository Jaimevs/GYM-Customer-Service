<template>
  <div class="home">
    <HeroSection /> <!-- Se integra el HeroSection reutilizable -->

    <main class="main-content">
      <v-container fluid>
        <v-row class="features" justify="center">
          <v-col cols="12" md="4" v-for="(feature, index) in features" :key="index">
            <FeatureCard :icon="feature.icon" :title="feature.title" :description="feature.description" />
          </v-col>
        </v-row>
      </v-container>
    </main>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import HeroSection from '@/components/HeroSection.vue';
import Footer from '@/components/Footer.vue';
import FeatureCard from '@/components/FeatureCard.vue';

const features = [
  { icon: 'mdi-email', title: 'Mensajes Directos', description: 'Recibe y responde consultas de tus clientes.' },
  { icon: 'mdi-chart-bar', title: 'Estadísticas Detalladas', description: 'Analiza el rendimiento de tu servicio.' },
  { icon: 'mdi-comment-multiple', title: 'Comentarios y Sugerencias', description: 'Recopila feedback valioso para mejorar.' }
];
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

.hero-container {
  margin-top: 3rem;
  text-align: center;
}

.hero {
  background-color: $color-rojo-vibrante;
  color: $color-blanco;
  border-radius: $radio-borde;
  padding: $espaciado-extra-grande;
  box-shadow: $sombra-fuerte;
}

.headline {
  font-family: $fuente-principal;
  font-size: 2rem;
  font-weight: bold;
}

.subheading {
  font-family: $fuente-secundaria;
  font-size: 1.2rem;
  color: $color-gris-claro;
  margin-bottom: 2rem;
}

.features {
  margin-top: 3rem;
}
</style>
