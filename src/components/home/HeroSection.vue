<template>
  <v-container class="hero-container">
    <v-row align="center" justify="center" class="fill-height">
      <!-- Columna de texto -->
      <v-col cols="12" md="6" class="text-left">
        <h1 class="hero-title">
          <span class="animated-text">Transforma tu cuerpo en</span>
          <br />
          <span class="gymbulls-text">GYM BULLS</span>
        </h1>
        <p class="hero-subtitle">
          Alcanza tus metas fitness con nuestro equipo de expertos y un espacio diseñado para inspirarte.
        </p>

        <!-- Botón Mejorado -->
        <div class="hero-button-wrapper">
          <button class="cta-button" @click="scrollToPlans">
            EMPEZAR AHORA!
          </button>
        </div>

        <!-- Redes Sociales -->
        <div class="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="fa6-brands:x-twitter" class="social-icon social-icon-twitter" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="mdi:facebook" class="social-icon social-icon-facebook" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="mdi:instagram" class="social-icon social-icon-instagram" />
          </a>
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
import { onMounted } from 'vue';
import { gsap } from 'gsap';
import { Icon } from '@iconify/vue';

// Función para desplazarse a la sección de planes
const scrollToPlans = () => {
  window.scrollTo({ top: document.getElementById('plans')?.offsetTop, behavior: 'smooth' });
};

// Array de imágenes para el carousel
const carouselImages = [
  { src: new URL('@/assets/image1.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 1' },
  { src: new URL('@/assets/image2.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 2' },
  { src: new URL('@/assets/image3.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 3' },
];

// Animaciones con GSAP
onMounted(() => {
  // Animación del título
  gsap.from('.hero-title', {
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: 'power3.out',
    delay: 0.5,
  });

  // Animación del subtítulo
  gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: 'power3.out',
    delay: 1,
  });

  // Animación del botón
  gsap.from('.cta-button', {
    opacity: 0,
    scale: 0.8,
    duration: 1.5,
    ease: 'elastic.out(1, 0.7)',
    delay: 1.5,
    onComplete: () => {
      gsap.set('.cta-button', { clearProps: 'all' }); // Limpia las propiedades después de la animación
    },
  });

  // Animación del carousel
  gsap.from('.hero-carousel', {
    opacity: 0,
    x: -100,
    duration: 2,
    ease: 'back.out(1.7)',
    delay: 2,
  });
});
</script>

<style lang="scss">
@use '@/styles/public/_hero-section.scss';
</style>
