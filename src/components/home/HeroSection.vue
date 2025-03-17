<template>
  <v-container class="hero-container">
    <v-row align="center" justify="space-between" class="fill-height">
      <!-- Columna de texto -->
      <v-col cols="12" md="6" class="text-left">
        <h1 class="hero-title">
          <span class="animated-text">Transforma tu cuerpo en</span>
          <br />
          <span class="gymbulls-text">GYM BULLS</span>
        </h1>
        <p class="hero-subtitle">
          Accede a equipos de alta tecnología, clases grupales y planes personalizados diseñados para inspirarte.
        </p>
        <p class="hero-secondary-subtitle">
          Únete a nuestra comunidad fitness hoy y empieza tu transformación.
        </p>

        <!-- Botón Mejorado -->
        <div class="hero-button-wrapper">
          <button class="cta-button" @click="scrollToPlans">
            ÚNETE HOY Y TRANSFORMA TU CUERPO
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

      <!-- Columna del Carousel de Imágenes -->
      <v-col cols="12" md="6" class="d-flex justify-center justify-md-end">
        <v-carousel cycle hide-delimiters show-arrows="hover" height="400"
          class="hero-carousel rounded-lg shadow-image">
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
  { src: new URL('@/assets/img/gymbulls.png', import.meta.url).href, alt: 'GYM BULLS Hero Image' },
  { src: new URL('@/assets/img/image1.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 1' },
  { src: new URL('@/assets/img/image2.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 2' },
  { src: new URL('@/assets/img/image3.png', import.meta.url).href, alt: 'GYM BULLS Hero Image 3' },
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
  // Animación del subtítulo secundario
  gsap.from('.hero-secondary-subtitle', {
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
    duration: 1,
    ease: 'elastic.out(1, 0.7)',
    delay: 1,
    onComplete: () => {
      gsap.set('.cta-button', { clearProps: 'all' }); // Limpia las propiedades después de la animación
    },
  });

  // Animación del carousel
  gsap.from('.hero-carousel', {
    opacity: 0,
    x: -100,
    duration: 0.9,
    ease: 'back.out(1)',
    delay: 0.5,
    onComplete: () => {
      gsap.set('.hero-carousel', { clearProps: 'opacity' }); // Restaura la opacidad después de la animación
    },
  });
});
</script>

<style lang="scss">
@use '@/styles/home/_hero-section.scss';
</style>
