<template>
  <v-container class="memberships-view">
    <!-- Título y descripción -->
    <h1 class="text-center mb-4 title-text">Membresías</h1>
    <p class="text-center mb-6 description-text">
      Descubre nuestras opciones de membresía y encuentra la que mejor se adapte a tus necesidades.
    </p>

    <!-- Tarjetas de membresías -->
    <div class="memberships-grid">
      <div v-for="(membership, index) in memberships" :key="index" class="membership-card-wrapper">
        <v-card :class="`membership-card membership-card-${index}`" @mouseenter="onHover(index)"
          @mouseleave="onLeave(index)">
          <v-card-title class="membership-name">{{ membership.name }}</v-card-title>
          <v-card-subtitle class="membership-price">{{ membership.price }}</v-card-subtitle>
          <v-card-text class="membership-benefits">
            <ul>
              <li v-for="(benefit, idx) in membership.benefits" :key="idx">{{ benefit }}</li>
            </ul>
          </v-card-text>
          <v-card-actions class="membership-actions">
            <v-btn>Comprar ahora</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';

// Datos de las membresías
const memberships = [
  {
    name: 'Básica',
    price: '$99/mes',
    benefits: [
      'Acceso ilimitado a equipos cardiovasculares',
      'Clases grupales básicas',
      'Wi-Fi gratuito',
    ],
  },
  {
    name: 'Premium',
    price: '$199/mes',
    benefits: [
      'Acceso ilimitado a todas las instalaciones',
      'Clases grupales avanzadas',
      'Entrenador personal incluido',
      'Descuentos en suplementos',
    ],
  },
  {
    name: 'VIP',
    price: '$299/mes',
    benefits: [
      'Acceso exclusivo a áreas VIP',
      'Entrenador personal dedicado',
      'Clases privadas',
      'Acceso a eventos exclusivos',
      'Locker personalizado',
    ],
  },
];

// Animación al hacer hover
const onHover = (index: number) => {
  gsap.to(`.membership-card-${index}`, {
    scale: 1.05,
    boxShadow: '0 8px 16px rgba(255, 255, 255, 0.2)',
    duration: 0.3,
    ease: 'power2.out',
  });
};

// Animación al quitar el hover
const onLeave = (index: number) => {
  gsap.to(`.membership-card-${index}`, {
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

.memberships-view {
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

.memberships-grid {
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

.membership-card-wrapper {
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

.membership-card {
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

.membership-name {
  font-family: var(--fuente-titulo);
  color: var(--color-titulos);
  font-size: 1.5rem;
  font-weight: bold;
  padding: 16px;
  text-align: center;

  @include media-query(small) {
    font-size: 1.25rem;
  }
}

.membership-price {
  font-family: var(--fuente-principal);
  color: var(--color-botones);
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  padding-bottom: 16px;
}

.membership-benefits {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  font-size: 0.9rem;
  padding: 0 16px;
  flex-grow: 1;
  /* Hace que los beneficios ocupen el espacio restante */
  overflow: hidden;

  ul {
    list-style-type: disc;
    /* Usa viñetas para los beneficios */
    padding-left: 20px;
    /* Espaciado para las viñetas */
  }

  li {
    margin-bottom: 8px;
    /* Espaciado entre los beneficios */
  }

  @include media-query(small) {
    font-size: 0.8rem;
    -webkit-line-clamp: 5;
    /* Limita el texto a 5 líneas en móviles */
    -webkit-box-orient: vertical;
  }
}

.membership-actions {
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
    padding: 8px 16px;
  }
}
</style>
