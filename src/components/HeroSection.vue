<template>
  <v-container class="hero-container">
    <v-row align="center" justify="center" class="fill-height">
      <!-- Columna de texto -->
      <v-col cols="12" md="6" class="text-left">
        <h1 class="hero-title">Transforma tu cuerpo en GYM BULLS</h1>
        <p class="hero-subtitle">
          Alcanza tus metas fitness con nuestro equipo de expertos y un espacio diseñado para inspirarte.
        </p>
        <div class="hero-buttons d-flex gap-3">
          <v-btn color="primary" class="white--text font-weight-bold hero-btn">Únete Ahora</v-btn>
          <v-btn outlined color="secondary" class="font-weight-bold hero-btn">Conoce Más</v-btn>
        </div>
      </v-col>

      <!-- Columna de imagen -->
      <v-col cols="12" md="6" class="d-flex justify-center">
        <!-- Aumentamos el ancho y mantenemos una proporción adecuada -->
        <v-img :src="heroImage" alt="GYM BULLS Hero Image" width="700" height="400"
          class="rounded-lg shadow-image"></v-img>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import heroImage from '@/assets/image.png';
</script>

<style scoped>
.hero-container {
  padding: 64px 16px;
  background-color: var(--background);
  /* Fondo blanco (#FFFFFF) */
}

.hero-title {
  animation: fadeInUp 1s ease-in-out;
}

.hero-subtitle {
  animation: fadeInUp 1.5s ease-in-out;
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
    padding: 2rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 0.875rem;
  }
}
</style>
