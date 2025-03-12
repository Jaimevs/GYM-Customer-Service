<template>
  <v-card class="feature-card">
    <v-row class="feature-card-content" align="center">
      <v-col class="d-flex justify-center">
        <v-icon class="feature-icon" size="60">{{ icon }}</v-icon>
      </v-col>
      <v-col>
        <v-card-title class="title">{{ title }}</v-card-title>
        <v-card-subtitle class="description">{{ description }}</v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
defineProps({
  icon: String,
  title: String,
  description: String
});
</script>

<style scoped>
.feature-card {
  width: 100%;
  max-width: 350px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  padding: 16px;
  background-color: $color-blanco;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.feature-card-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.feature-icon {
  color: $color-rojo-vibrante;
  transition: transform 0.3s ease-in-out;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.title {
  font-family: 'Lexend', sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  color: $color-gris-oscuro;
  margin-top: 8px;
  margin-bottom: 4px;
}

.description {
  font-family: 'Noto Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: $color-gris-claro;
  line-height: 1.4;
}
</style>
