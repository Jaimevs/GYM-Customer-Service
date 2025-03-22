<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Training Plans</h1>
      </v-col>
    </v-row>

    <!-- Ejemplo de gráfico con ApexCharts -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Progress by Plan</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="chartOptions" :series="chartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Plan Distribution</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="pieChartOptions" :series="pieChartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ejemplo de tabla con Vuetify -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Training Plans List</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="plans" :items-per-page="5" class="elevation-1"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'TrainingPlansCoachView',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    // Datos para el gráfico de barras
    const chartOptions = ref({
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: ['Plan 1', 'Plan 2', 'Plan 3', 'Plan 4'],
      },
    });

    const chartSeries = ref([
      {
        name: 'Progress',
        data: [30, 40, 45, 50],
      },
    ]);

    // Datos para el gráfico de pie
    const pieChartOptions = ref({
      labels: ['Plan 1', 'Plan 2', 'Plan 3', 'Plan 4'],
    });

    const pieChartSeries = ref([44, 55, 13, 33]);

    // Datos para la tabla
    const headers = ref([
      { text: 'Plan Name', value: 'name' },
      { text: 'Duration (weeks)', value: 'duration' },
      { text: 'Clients Assigned', value: 'clients' },
      { text: 'Status', value: 'status' },
    ]);

    const plans = ref([
      { name: 'Beginner Plan', duration: 8, clients: 15, status: 'Active' },
      { name: 'Intermediate Plan', duration: 12, clients: 10, status: 'Active' },
      { name: 'Advanced Plan', duration: 16, clients: 5, status: 'Inactive' },
    ]);

    return {
      chartOptions,
      chartSeries,
      pieChartOptions,
      pieChartSeries,
      headers,
      plans,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>
