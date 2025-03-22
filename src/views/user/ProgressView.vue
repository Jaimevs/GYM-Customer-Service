<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Mi Progreso</h1>
        <p class="text-subtitle-1">Visualiza tu progreso en el gimnasio.</p>
      </v-col>
    </v-row>

    <!-- Gráficas de progreso -->
    <v-row>
      <!-- Gráfica de Peso -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Progreso de Peso</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="weightChartOptions" :series="weightSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfica de Actividad -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Actividad Semanal</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="activityChartOptions" :series="activitySeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resumen de Métricas -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Peso Actual</v-card-title>
          <v-card-text>
            <p class="text-h5">81 kg</p>
            <p class="text-caption">Objetivo: 75 kg</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Visitas este Mes</v-card-title>
          <v-card-text>
            <p class="text-h5">12</p>
            <p class="text-caption">Meta: 16</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Duración Promedio</v-card-title>
          <v-card-text>
            <p class="text-h5">65 min</p>
            <p class="text-caption">Por visita</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// Configuración de la gráfica de peso
const weightChartOptions = ref({
  chart: {
    id: 'weight-chart',
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  },
  yaxis: {
    title: {
      text: 'Peso (kg)',
    },
  },
});

const weightSeries = ref([
  {
    name: 'Peso',
    data: [85, 83, 82, 81, 80, 79],
  },
]);

// Configuración de la gráfica de actividad
const activityChartOptions = ref({
  chart: {
    id: 'activity-chart',
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  },
  yaxis: {
    title: {
      text: 'Minutos',
    },
  },
});

const activitySeries = ref([
  {
    name: 'Actividad',
    data: [60, 75, 50, 80, 90, 70, 85],
  },
]);
</script>

<style scoped>
/* Estilos personalizados */
.v-card {
  margin-bottom: 16px;
}
</style>
