<template>
  <div class="feature-card">
    <div class="feature-icon-container">
      <v-icon class="feature-icon" size="60">{{ icon }}</v-icon>
    </div>
    <h2 class="custom-title">{{ title }}</h2>
    <p class="custom-description">{{ description }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  icon: String,
  title: String,
  description: String
});
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/_variables.scss' as *; // Importa las variables SCSS
@use '@/styles/_mixins.scss' as *; // Importa los mixins

.feature-card {
  width: 100%;
  max-width: 350px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: $radio-borde;
  padding: $espaciado-base;
  background-color: $color-blanco;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: $sombra-suave;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $sombra-fuerte;
  }
}

.feature-icon-container {
  margin-bottom: $espaciado-base;
}

.feature-icon {
  color: $color-rojo-vibrante;
  transition: transform 0.3s ease-in-out;

  .feature-card:hover & {
    transform: scale(1.2);
  }
}

.custom-title {
  font-family: $fuente-titulo;
  font-size: 1.5rem;
  font-weight: bold;
  color: $color-negro;
  margin-bottom: $espaciado-base;
}

.custom-description {
  font-family: $fuente-principal;
  font-size: 1rem;
  font-weight: 500;
  color: $color-texto-secundario;
  line-height: 1.6;
  text-align: center;
}
</style>
