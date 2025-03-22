<template>
  <v-container class="coach-dashboard">
    <!-- Título -->
    <h1 class="text-h4 font-weight-bold mb-4">Dashboard de Entrenador</h1>
    <p class="text-body-1 mb-6">Bienvenido al panel de entrenador.</p>

    <!-- Estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card class="stats-card pa-4" elevation="2">
          <v-icon size="40" color="primary" class="mb-3">mdi-account-group</v-icon>
          <h3 class="text-h6 font-weight-medium">Tus Estudiantes</h3>
          <p class="stat text-h5 primary--text">12 activos</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="stats-card pa-4" elevation="2">
          <v-icon size="40" color="success" class="mb-3">mdi-calendar-clock</v-icon>
          <h3 class="text-h6 font-weight-medium">Sesiones Programadas</h3>
          <p class="stat text-h5 success--text">5 para hoy</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="stats-card pa-4" elevation="2">
          <v-icon size="40" color="info" class="mb-3">mdi-star-outline</v-icon>
          <h3 class="text-h6 font-weight-medium">Rendimiento</h3>
          <p class="stat text-h5 info--text">98% satisfacción</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráfica de Rendimiento -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">Rendimiento de Estudiantes</v-card-title>
      <v-card-text>
        <apexchart type="bar" height="350" :options="chartOptions" :series="chartSeries"></apexchart>
      </v-card-text>
    </v-card>

    <!-- Botones de Acción -->
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn block color="primary" large @click="scheduleSession">Programar Sesión</v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn block color="secondary" large @click="viewStudents">Ver Estudiantes</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

// Datos de la gráfica
const chartSeries = ref([
  {
    name: "Progreso",
    data: [75, 80, 85, 90, 95, 100],
  },
]);

const chartOptions = ref({
  chart: {
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: ["Estudiante 1", "Estudiante 2", "Estudiante 3", "Estudiante 4", "Estudiante 5", "Estudiante 6"],
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  colors: ["#4a6cf7"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  fill: {
    opacity: 1,
  },
});

// Funciones para los botones
const scheduleSession = () => {
  alert("Programar sesión clicado");
};

const viewStudents = () => {
  alert("Ver estudiantes clicado");
};
</script>

<style scoped>
.coach-dashboard {
  padding: 20px;
}

.stats-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.stat {
  font-size: 24px;
  font-weight: bold;
}
</style>
