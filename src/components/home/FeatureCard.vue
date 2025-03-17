<template>
  <div class="feature-card">
    <div class="feature-icon-container">
      <Icon :icon="icon" class="feature-icon" />
    </div>
    <h2 class="custom-title">{{ title }}</h2>
    <p class="custom-description">{{ description }}</p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';

defineProps({
  icon: String,
  title: String,
  description: String,
});
</script>

<style scoped lang="scss">
@use '@/styles/home/_feature-card.scss'; // Importa los estilos desde el archivo SCSS
</style>
