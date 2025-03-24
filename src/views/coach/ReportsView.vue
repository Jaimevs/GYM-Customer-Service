<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Reportes</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Gráfico de donut con ApexCharts -->
      <v-col cols="12" md="6">
        <v-card ref="donutChartCard">
          <v-card-title>Distribución de Clientes</v-card-title>
          <v-card-text>
            <apexchart type="donut" :options="donutChartOptions" :series="donutChartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Tabla de reportes con Vuetify -->
      <v-col cols="12" md="6">
        <v-card ref="reportTableCard">
          <v-card-title>Detalles de Reportes</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="reports" :items-per-page="5" class="elevation-1">
              <template v-slot:item.actions="{ item }">
                <v-btn color="primary" small @click="downloadReport(item)">
                  <v-icon left>mdi-download</v-icon>
                  Descargar
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import gsap from 'gsap';

export default defineComponent({
  name: 'ReportsView',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    // Datos para el gráfico de donut
    const donutChartOptions = ref({
      labels: ['Clientes Activos', 'Clientes Inactivos', 'Clientes Nuevos'],
    });

    const donutChartSeries = ref([44, 55, 13]);

    // Datos para la tabla
    const headers = ref([
      { text: 'ID del Reporte', value: 'id' },
      { text: 'Fecha', value: 'date' },
      { text: 'Tipo', value: 'type' },
      { text: 'Detalles', value: 'details' },
      { text: 'Acciones', value: 'actions', sortable: false }, // Columna de acciones
    ]);

    const reports = ref([
      { id: 1, date: '2023-10-01', type: 'Mensual', details: 'Reporte de progreso de clientes' },
      { id: 2, date: '2023-10-15', type: 'Semanal', details: 'Reporte de clientes nuevos' },
      { id: 3, date: '2023-10-30', type: 'Personalizado', details: 'Reporte de clientes inactivos' },
    ]);

    // Referencias para animaciones
    const donutChartCard = ref<HTMLElement | null>(null);
    const reportTableCard = ref<HTMLElement | null>(null);

    // Función para simular la descarga de un reporte
    const downloadReport = (report: any) => {
      alert(`Descargando reporte: ${report.type} - ${report.details}`);
      // Aquí podrías agregar la lógica real para descargar el archivo
    };

    // Animaciones con GSAP
    onMounted(() => {
      if (donutChartCard.value) {
        gsap.from(donutChartCard.value, {
          opacity: 0,
          y: 20,
          duration: 1,
          delay: 0.5,
        });
      }

      if (reportTableCard.value) {
        gsap.from(reportTableCard.value, {
          opacity: 0,
          y: 20,
          duration: 1,
          delay: 1,
        });
      }
    });

    return {
      donutChartOptions,
      donutChartSeries,
      headers,
      reports,
      donutChartCard,
      reportTableCard,
      downloadReport,
    };
  },
});
</script>
<style scoped>
/* Estilos personalizados */
.v-card {
  border-radius: 10px;
  overflow: hidden;
}

.v-card-title {
  background-color: #075e54;
  /* Verde oscuro de WhatsApp */
  color: white;
  font-weight: bold;
  padding: 16px;
}

.v-card-text {
  padding: 16px;
}

.v-data-table {
  margin-top: 16px;
}

/* Estilo para el botón de descarga */
.v-btn {
  text-transform: none;
  /* Evita que el texto se ponga en mayúsculas */
}
</style>
