<template>
  <v-container class="gyms-view">
    <!-- Título y descripción -->
    <h1 class="text-center mb-4 title-text">Gimnasios</h1>
    <p class="text-center mb-6 description-text">Descubre nuestros gimnasios disponibles.</p>

    <!-- Cards de gimnasios en una sola fila -->
    <div class="gyms-grid">
      <div v-for="(gym, index) in gyms" :key="index" class="gym-card-wrapper">
        <v-card :class="`gym-card gym-card-${index}`" @mouseenter="onHover(index)" @mouseleave="onLeave(index)">
          <!-- Imagen con altura fija y borde inferior -->
          <div class="gym-image-container">
            <v-img :src="gym.image" height="200px" cover class="gym-image"></v-img>
          </div>
          <!-- Contenido de la card -->
          <v-card-title class="gym-name">{{ gym.name }}</v-card-title>
          <v-card-subtitle class="gym-location">{{ gym.location }}</v-card-subtitle>
          <v-card-text class="gym-description">{{ gym.description }}</v-card-text>
          <v-card-actions>
            <router-link to="/compra-membresia">
              <v-btn>Regístrate ya</v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';

// Datos de los gimnasios (3 sucursales)
const gyms = [
  {
    name: 'GYM BULLS Centro',
    location: 'Ciudad de México',
    description: 'Un gimnasio equipado con lo último en tecnología fitness.',
    image: 'https://pictures.smartfit.com.br/5719/big/smarfit_ejercicio_elevado.jpg?1706226754', // Imagen de ejemplo
  },
  {
    name: 'GYM BULLS Norte',
    location: 'Monterrey',
    description: 'Amplias instalaciones y entrenadores profesionales.',
    image: 'https://cdns3.fitfit.fitness/co/media/items/540x280/1030-Gimnasio-Smart-Fit-Las-Vegas-YRube.jpg', // Imagen de ejemplo
  },
  {
    name: 'GYM BULLS Sur',
    location: 'Guadalajara',
    description: 'Clases grupales y planes personalizados.',
    image: 'https://zeusfitness.net/wp-content/uploads/2024/03/AF1QipPbIrZiH-CoHWeMszA-Ia4Dl521DpGt982fJwFBw408-h272-k-no.jpeg', // Imagen de ejemplo
  },
];

// Animación al hacer hover
const onHover = (index: number) => {
  gsap.to(`.gym-card-${index}`, {
    scale: 1.05,
    boxShadow: '0 8px 16px rgba(255, 255, 255, 0.2)',
    duration: 0.3,
    ease: 'power2.out',
  });
};

// Animación al quitar el hover
const onLeave = (index: number) => {
  gsap.to(`.gym-card-${index}`, {
    scale: 1,
    boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1)',
    duration: 0.3,
    ease: 'power2.out',
  });
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;
@use '@/styles/_mixins.scss' as *;

.gyms-view {
  background-color: var(--color-fondo);
  padding-top: 64px;
  /* Espacio para el navbar */
  padding-bottom: 64px;
  /* Espacio para el footer */
}

.title-text {
  font-family: var(--fuente-titulo);
  color: var(--color-titulos);
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;

  @include media-query(small) {
    font-size: 2rem;
  }
}

.description-text {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  font-size: 1.25rem;
  text-align: center;

  @include media-query(small) {
    font-size: 1rem;
  }
}

.gyms-grid {
  display: flex;
  justify-content: center;
  /* Centra las tarjetas horizontalmente */
  gap: 24px;
  /* Espacio entre las tarjetas */
  margin: 0 auto;
  /* Centra el contenedor */
  max-width: 1200px;
  /* Ancho máximo para mantener consistencia */

  @include media-query(small) {
    flex-direction: column;
    /* Apila las tarjetas verticalmente en móviles */
    align-items: stretch;
    /* Asegura que las tarjetas ocupen todo el ancho disponible */
    gap: 16px;
    /* Reduce el espacio entre las tarjetas en móviles */
  }
}

.gym-card-wrapper {
  flex: 1;
  /* Hace que cada tarjeta ocupe el mismo ancho */
  max-width: calc(33.33% - 24px);
  /* Ajusta el ancho para 3 tarjetas por fila */

  @include media-query(small) {
    flex: 1 1 100%;
    /* Ocupa todo el ancho en móviles */
    max-width: 100% !important;
    /* Fuerza el ancho máximo en móviles */
  }
}

.gym-card {
  background-color: var(--color-gris-oscuro);
  color: var(--color-texto);
  border-radius: var(--radio-borde);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);

  /* Altura fija para todas las tarjetas */
  height: 450px;
  /* Altura suficiente para contener todo el contenido */
  display: flex;
  flex-direction: column;

  @include media-query(small) {
    width: 100% !important;
    /* Fuerza el ancho al 100% en móviles */
    min-height: 400px;
    /* Altura mínima en móviles */
    height: auto;
    /* Permite que la altura se ajuste según el contenido */
  }
}

.gym-image {
  border-bottom: 2px solid var(--color-botones);
  height: 200px;
  /* Altura fija para la imagen */
  flex-shrink: 0;
  /* Evita que la imagen se comprima */
}

.gym-name {
  font-family: var(--fuente-titulo);
  color: var(--color-titulos);
  font-size: 1.5rem;
  font-weight: bold;
  padding: 16px;
  min-height: 64px;
  /* Altura mínima para el título */
  display: flex;
  align-items: center;
  /* Centra verticalmente el texto */

  @include media-query(small) {
    font-size: 1.25rem;
  }
}

.gym-location {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  font-size: 1rem;
  padding: 0 16px;
  min-height: 32px;
  /* Altura mínima para el subtítulo */
  display: flex;
  align-items: center;
  /* Centra verticalmente el texto */

  @include media-query(small) {
    font-size: 0.9rem;
  }
}

.gym-description {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  font-size: 0.9rem;
  padding: 0 16px 16px;
  flex-grow: 1;
  /* Hace que la descripción ocupe el espacio restante */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* Limita el texto a 3 líneas */
  -webkit-box-orient: vertical;

  @include media-query(small) {
    font-size: 0.8rem;
    -webkit-line-clamp: 4;
    /* Aumenta el límite de líneas en móviles */
  }
}

.v-btn {
  background-color: var(--color-botones);
  color: var(--color-texto-botones);
  margin: 16px;
  align-self: flex-end;
  /* Alinea el botón al final de la tarjeta */
  min-height: 48px;
  /* Altura mínima para el botón */

  @include media-query(small) {
    font-size: 0.8rem;
    padding: 8px 16px;
  }
}
</style>
