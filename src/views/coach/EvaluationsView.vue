<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Evaluations</h1>
      </v-col>
    </v-row>

    <!-- Gráfico de barras con ApexCharts -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Evaluation Results</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="barChartOptions" :series="barChartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de radar con ApexCharts -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Skill Assessment</v-card-title>
          <v-card-text>
            <apexchart type="radar" :options="radarChartOptions" :series="radarChartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de evaluaciones con Vuetify -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Evaluation Details</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="evaluations" :items-per-page="5"
              class="elevation-1"></v-data-table>
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
  name: 'EvaluationsView',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    // Datos para el gráfico de barras
    const barChartOptions = ref({
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: ['Client 1', 'Client 2', 'Client 3', 'Client 4', 'Client 5'],
      },
    });

    const barChartSeries = ref([
      {
        name: 'Progress',
        data: [30, 40, 35, 50, 49],
      },
    ]);

    // Datos para el gráfico de radar
    const radarChartOptions = ref({
      chart: {
        type: 'radar',
      },
      labels: ['Strength', 'Endurance', 'Flexibility', 'Speed', 'Coordination'],
    });

    const radarChartSeries = ref([
      {
        name: 'Client 1',
        data: [80, 50, 30, 40, 60],
      },
    ]);

    // Datos para la tabla
    const headers = ref([
      { text: 'Client', value: 'client' },
      { text: 'Date', value: 'date' },
      { text: 'Type', value: 'type' },
      { text: 'Score', value: 'score' },
      { text: 'Comments', value: 'comments' },
    ]);

    const evaluations = ref([
      { client: 'John Doe', date: '2023-10-01', type: 'Initial', score: 85, comments: 'Good progress' },
      { client: 'Jane Smith', date: '2023-10-05', type: 'Follow-up', score: 90, comments: 'Excellent performance' },
      { client: 'Mike Johnson', date: '2023-10-10', type: 'Initial', score: 70, comments: 'Needs improvement' },
    ]);

    return {
      barChartOptions,
      barChartSeries,
      radarChartOptions,
      radarChartSeries,
      headers,
      evaluations,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>
