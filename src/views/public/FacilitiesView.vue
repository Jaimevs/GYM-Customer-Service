<template>
  <v-container class="facilities-view">
    <!-- Título y descripción -->
    <h1 class="text-center mb-4 title-text">Instalaciones</h1>
    <p class="text-center mb-6 description-text">
      Conoce nuestras instalaciones de primer nivel diseñadas para tu comodidad y rendimiento.
    </p>

    <!-- Tarjetas de instalaciones -->
    <div class="facilities-grid">
      <div v-for="(facility, index) in facilities" :key="index" class="facility-card-wrapper">
        <v-card :class="`facility-card facility-card-${index}`" @mouseenter="onHover(index)"
          @mouseleave="onLeave(index)">
          <v-img :src="facility.image" height="200px" cover class="facility-image"></v-img>
          <v-card-title class="facility-name">{{ facility.name }}</v-card-title>
          <v-card-text class="facility-description">{{ facility.description }}</v-card-text>
          <v-card-actions class="facility-actions">
            <v-btn>Explorar</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';

// Datos de las instalaciones
const facilities = [
  {
    name: 'Área de Pesas',
    description: 'Equipos de última generación para entrenamientos intensivos.',
    image: 'https://agendapro.com/blog/wp-content/uploads/sites/2/2024/06/areas20de20un20gimnasio.webp',
  },
  {
    name: 'Zona Cardio',
    description: 'Cintas, bicicletas y elípticas para mejorar tu resistencia.',
    image: 'https://www.cmdsport.com/app/uploads/2017/01/zona-cardio-gimnasio-go-fit.jpg',
  },
  {
    name: 'Clases Grupales',
    description: 'Yoga, spinning y más para mantenerte motivado.',
    image: 'https://i0.wp.com/blog.smartfit.com.mx/wp-content/uploads/2017/11/preguntas-frecuentes-smart-fit-clases.jpg?fit=1200%2C675&ssl=1',
  },
  {
    name: 'Sala de CrossFit',
    description: 'Espacio dedicado al entrenamiento funcional y WODs.',
    image: 'https://phantom-marca.unidadeditorial.es/891a70bafeb2834a69ed9bd337a65c22/resize/828/f/jpg/assets/multimedia/imagenes/2023/05/30/16854328329701.jpg',
  },
  {
    name: 'Sauna y Spa',
    description: 'Relájate después de tu entrenamiento en nuestro spa.',
    image: 'https://13c691c772dde5725438-38060db131919a164441ab7fe86cefe0.ssl.cf1.rackcdn.com/u/new-folder-1/delight-with-our-extensive-spa-treatments.jpg',
  },
  {
    name: 'Tienda de Suplementos',
    description: 'Compra suplementos y accesorios deportivos.',
    image: 'https://vipgymibiza.com/wp-content/uploads/2023/05/vip-gym-ibiza-nutricion-deportiva.jpg',
  },
];

// Animación al hacer hover
const onHover = (index: number) => {
  gsap.to(`.facility-card-${index}`, {
    scale: 1.05,
    boxShadow: '0 8px 16px rgba(255, 255, 255, 0.2)',
    duration: 0.3,
    ease: 'power2.out',
  });
};

// Animación al quitar el hover
const onLeave = (index: number) => {
  gsap.to(`.facility-card-${index}`, {
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

.facilities-view {
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
    /* Reduce el tamaño del título en móviles */
  }
}

.description-text {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  font-size: 1.25rem;
  text-align: center;

  @include media-query(small) {
    font-size: 1rem;
    /* Reduce el tamaño del texto en móviles */
  }
}

.facilities-grid {
  display: flex;
  flex-wrap: wrap;
  /* Permite que las tarjetas se ajusten en múltiples filas */
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

.facility-card-wrapper {
  flex: 1 1 calc(33.33% - 24px);
  /* Ajusta el ancho para 3 tarjetas por fila */
  max-width: calc(33.33% - 24px) !important;
  /* Fuerza el ancho máximo */
  box-sizing: border-box;
  /* Incluye padding y border en el cálculo del ancho */

  @include media-query(small) {
    flex: 1 1 100%;
    /* Ocupa todo el ancho en móviles */
    max-width: 100% !important;
    /* Fuerza el ancho máximo en móviles */
  }
}

.facility-card {
  background-color: var(--color-gris-oscuro);
  color: var(--color-texto);
  border-radius: var(--radio-borde);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);

  /* Altura fija para todas las tarjetas */
  height: 450px !important;
  /* Altura fija aplicada con !important */
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

.facility-image {
  height: 200px;
  /* Altura fija para la imagen */
  flex-shrink: 0;
  /* Evita que la imagen se comprima */
}

.facility-name {
  font-family: var(--fuente-titulo);
  color: var(--color-titulos);
  font-size: 1.5rem;
  font-weight: bold;
  padding: 16px;
  text-align: center;

  @include media-query(small) {
    font-size: 1.25rem;
    /* Reduce el tamaño del título en móviles */
  }
}

.facility-description {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  font-size: 0.9rem;
  padding: 0 16px;
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
    /* Reduce el tamaño del texto en móviles */
    -webkit-line-clamp: 4;
    /* Aumenta el límite de líneas en móviles */
  }
}

.facility-actions {
  display: flex;
  justify-content: center;
  /* Centra el botón horizontalmente */
  padding-bottom: 16px;
}

.v-btn {
  background-color: var(--color-botones);
  color: var(--color-texto-botones);
  margin: 16px;
  min-height: 48px;
  /* Altura mínima para el botón */

  @include media-query(small) {
    font-size: 0.8rem;
    /* Reduce el tamaño del texto del botón en móviles */
    padding: 8px 16px;
    /* Reduce el padding del botón en móviles */
  }
}
</style>
