<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Reports</h1>
      </v-col>
    </v-row>

    <!-- Gráfico de líneas con ApexCharts -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Monthly Progress</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="lineChartOptions" :series="lineChartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de donut con ApexCharts -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Client Distribution</v-card-title>
          <v-card-text>
            <apexchart type="donut" :options="donutChartOptions" :series="donutChartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de reportes con Vuetify -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Report Details</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="reports" :items-per-page="5" class="elevation-1"></v-data-table>
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
  name: 'ReportsView',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    // Datos para el gráfico de líneas
    const lineChartOptions = ref({
      chart: {
        type: 'line',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
    });

    const lineChartSeries = ref([
      {
        name: 'Clients',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 110, 120],
      },
    ]);

    // Datos para el gráfico de donut
    const donutChartOptions = ref({
      labels: ['Active Clients', 'Inactive Clients', 'New Clients'],
    });

    const donutChartSeries = ref([44, 55, 13]);

    // Datos para la tabla
    const headers = ref([
      { text: 'Report ID', value: 'id' },
      { text: 'Date', value: 'date' },
      { text: 'Type', value: 'type' },
      { text: 'Details', value: 'details' },
    ]);

    const reports = ref([
      { id: 1, date: '2023-10-01', type: 'Monthly', details: 'Client progress report' },
      { id: 2, date: '2023-10-15', type: 'Weekly', details: 'New clients report' },
      { id: 3, date: '2023-10-30', type: 'Custom', details: 'Inactive clients report' },
    ]);

    return {
      lineChartOptions,
      lineChartSeries,
      donutChartOptions,
      donutChartSeries,
      headers,
      reports,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>
