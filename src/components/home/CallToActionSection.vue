<template>
  <section class="call-to-action-section">
    <div class="content">
      <h2 class="title">{{ title }}</h2>
      <p class="description">{{ description }}</p>
      <button class="cta-button" @click="redirectToPlans">{{ buttonText }}</button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'; // Importa el router

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: '¡Comienza ahora!',
  },
});

// Instancia del router
const router = useRouter();

// Función para redirigir a la ruta /planes
const redirectToPlans = () => {
  router.push('/planes'); // Redirige al usuario a la ruta /planes
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;
@use '@/styles/_mixins.scss' as *;

.call-to-action-section {
  background-color: $color-rojo-vibrante; // Usamos el rojo vibrante como fondo
  color: $color-blanco;
  padding: $espaciado-extra-grande;
  text-align: center;
  margin-top: $espaciado-extra-grande; // Margen superior

  // Diseño responsivo
  @include media-query(small) {
    padding: $espaciado-base; // Ajusta el padding en pantallas pequeñas
    margin-top: $espaciado-grande; // Reduce el margen superior
  }

  .content {
    max-width: 800px;
    margin: 0 auto;

    .title {
      font-family: $fuente-titulo;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: $espaciado-base;

      // Ajuste responsivo para títulos
      @include media-query(small) {
        font-size: 1.5rem;
      }
    }

    .description {
      font-family: $fuente-principal;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: $espaciado-grande;

      // Ajuste responsivo para descripción
      @include media-query(small) {
        font-size: 0.9rem;
      }
    }

    .cta-button {
      background-color: $color-amarillo-dorado; // Amarillo dorado para el botón
      color: $color-negro; // Texto negro para contraste
      border: none;
      padding: $espaciado-pequeño $espaciado-grande;
      font-size: 1rem;
      font-weight: bold;
      border-radius: $radio-borde;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;

      &:hover {
        background-color: darken($color-amarillo-dorado, 10%); // Oscurecer el color al pasar el mouse
        transform: scale(1.05);
      }

      // Ajuste responsivo para el botón
      @include media-query(small) {
        font-size: 0.9rem;
        padding: $espaciado-pequeño $espaciado-base;
      }
    }
  }
}
</style>
