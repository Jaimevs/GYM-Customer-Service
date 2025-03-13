<template>
  <v-container class="hero-container">
    <v-row align="center" justify="center" class="fill-height">
      <!-- Columna de texto -->
      <v-col cols="12" md="6" class="text-left">
        <h1 class="hero-title">Transforma tu cuerpo en GYM BULLS</h1>
        <p class="hero-subtitle">
          Alcanza tus metas fitness con nuestro equipo de expertos y un espacio diseñado para inspirarte.
        </p>
        <div class="hero-buttons d-flex gap-5">
          <v-btn color="primary" class="white--text font-weight-bold hero-btn" @click="scrollToPlans">
            Únete Ahora
          </v-btn>
          <v-btn outlined color="secondary" class="font-weight-bold hero-btn" @click="scrollToAbout">
            Conoce Más
          </v-btn>
        </div>
      </v-col>

      <!-- Columna del carousel -->
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-carousel cycle height="400" hide-delimiters show-arrows="hover"
          class="rounded-lg shadow-image hero-carousel">
          <v-carousel-item v-for="(image, index) in carouselImages" :key="index" :src="image.src"
            :alt="image.alt"></v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
// Funciones para desplazarse a otras secciones
const scrollToPlans = () => {
  window.scrollTo({ top: document.getElementById('plans')?.offsetTop, behavior: 'smooth' });
};

const scrollToAbout = () => {
  window.scrollTo({ top: document.getElementById('about')?.offsetTop, behavior: 'smooth' });
};

// Array de imágenes para el carousel
const carouselImages = [
  { src: new URL('@/assets/image1.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 1' },
  { src: new URL('@/assets/image2.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 2' },
  { src: new URL('@/assets/image3.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 3' },
];
</script>
<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/_variables.scss' as *; // Importa las variables SCSS
@use '@/styles/_mixins.scss' as *; // Importa los mixins

.hero-container {
  padding: 128px 16px 64px;
  background-color: var(--background);
}

.hero-title {
  font-family: $fuente-titulo;
  font-size: 3rem;
  font-weight: bold;
  color: $color-negro;
  margin-bottom: 16px;
  animation: fadeInUp 1s ease-in-out;

  @include media-query(small) {
    font-size: 2rem;
  }
}

.hero-subtitle {
  font-family: $fuente-principal;
  font-size: 1.25rem;
  color: $color-gris-oscuro;
  line-height: 1.6;
  margin-bottom: 32px;
  animation: fadeInUp 1.5s ease-in-out;

  @include media-query(small) {
    font-size: 1rem;
  }
}

.hero-buttons {
  gap: 32px;

  .hero-btn {
    padding: 12px 24px;
    font-size: 1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
}

.hero-carousel {
  border-radius: 16px;
  /* Borde redondeado */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  /* Sombra visible */
  width: 700px;
  /* Ancho fijo */
  max-width: 100%;
  /* Ajuste responsivo */

  @include media-query(small) {
    width: 100%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@include media-query(small) {
  .hero-container {
    padding: 96px 16px 32px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
