/* --- DashboardView.vue --- */
<template>
  <div class="dashboard-content">
    <h1>Bienvenido al Dashboard</h1>
    <p>Este es un ejemplo de contenido dentro del layout.</p>

    <div class="dashboard-widgets">
      <v-card class="widget" v-for="(widget, index) in widgets" :key="index">
        <v-card-title>{{ widget.title }}</v-card-title>
        <v-card-text>{{ widget.content }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const widgets = ref([
  { title: 'Usuarios Activos', content: '150' },
  { title: 'Membresías Vendidas', content: '25' },
  { title: 'Ingresos Mensuales', content: '$12,000' },
  { title: 'Reservas de Citas', content: '45' },
]);
</script>

<style scoped lang="scss">
@use '@/styles/dashboard/_dashboard-view.scss';
</style>
