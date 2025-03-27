<template>
  <div class="reports-content">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="reports-title">
          <span class="title-text">Reportes Analíticos</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="text-subtitle-1">Visualización detallada de métricas y datos de clientes</p>
      </v-col>
    </v-row>

    <!-- Tarjetas de resumen -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="(card, index) in summaryCards" :key="index" :data-aos="'fade-up'"
        :data-aos-delay="index * 100">
        <v-card class="summary-card" :class="`card-${index}`" elevation="4">
          <div class="card-icon">
            <Icon :icon="card.icon" width="32" />
          </div>
          <v-card-title class="text-h6 font-weight-medium">{{ card.title }}</v-card-title>
          <v-card-text class="text-h3 font-weight-bold">{{ card.value }}</v-card-text>
          <div class="card-decoration"></div>
          <div class="card-wave"></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos principales -->
    <v-row class="mb-6">
      <v-col cols="12" md="8" data-aos="fade-right" data-aos-delay="200">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="lucide:pie-chart" width="24" />
            </div>
            <h3 class="text-h6">Distribución de Clientes</h3>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small text v-bind="attrs" v-on="on" class="period-selector">
                  Últimos 30 días
                  <Icon icon="solar:alt-arrow-down-outline" class="ml-1" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in timePeriods" :key="index" @click="changeTimePeriod(item.value)">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-card-text>
            <apexchart type="donut" :options="donutChartOptions" :series="donutChartSeries" height="350"></apexchart>
            <div class="d-flex justify-space-around mt-2">
              <v-chip v-for="(label, index) in donutChartOptions.labels" :key="index" :color="getChartColor(index)"
                text-color="white" small class="px-3">
                {{ label }}: {{ donutChartSeries[index] }}%
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="fade-left" data-aos-delay="200">
        <v-card class="stats-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:documents-outline" width="24" />
            </div>
            <h3 class="text-h6">Reportes Recientes</h3>
          </div>
          <v-card-text>
            <v-list dense class="transparent">
              <v-list-item v-for="(report, index) in recentReports" :key="index" :class="`report-item-${index}`">
                <v-list-item-icon>
                  <v-icon :color="getReportColor(report.type)">{{ report.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{ report.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ report.date }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click="downloadReport(report)">
                    <v-icon small>mdi-download</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn block color="primary" class="mt-4" @click="generateNewReport">
              <Icon icon="solar:document-add-outline" class="mr-2" />
              Generar Nuevo Reporte
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de reportes -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up" data-aos-delay="100">
        <v-card class="table-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:document-text-outline" width="24" />
            </div>
            <h3 class="text-h6">Historial de Reportes</h3>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar reportes..." single-line hide-details
              class="search-field"></v-text-field>
          </div>
          <v-card-text class="pa-0">
            <v-data-table :headers="headers" :items="reports" :items-per-page="10" :search="search"
              class="elevation-0 report-table" :footer-props="{
                itemsPerPageOptions: [5, 10, 20, -1],
                showFirstLastPage: true
              }">
              <template v-slot:item.date="{ item }">
                <v-chip small :color="getDateColor(item.date)" text-color="white">
                  {{ formatDate(item.date) }}
                </v-chip>
              </template>
              <template v-slot:item.type="{ item }">
                <v-chip :color="getTypeColor(item.type)" small dark>
                  {{ item.type }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" icon v-bind="attrs" v-on="on" @click="downloadReport(item)">
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar {{ item.type }}</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="secondary" icon class="ml-2" v-bind="attrs" v-on="on" @click="previewReport(item)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Vista previa</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Exportar datos -->
    <v-row data-aos="fade-up" data-aos-delay="100">
      <v-col cols="12">
        <v-card class="export-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:export-outline" width="24" />
            </div>
            <h3 class="text-h6">Exportar Datos</h3>
          </div>
          <v-card-text class="export-actions">
            <v-btn v-for="(action, index) in exportActions" :key="index" :color="action.color" variant="flat"
              class="action-btn" @click="action.handler" :data-aos="'zoom-in'" :data-aos-delay="index * 50">
              <v-avatar :color="action.color" size="36" class="mr-3">
                <Icon :icon="action.icon" width="20" />
              </v-avatar>
              <div class="btn-content">
                <div class="btn-label">{{ action.label }}</div>
                <div class="btn-hint">{{ action.format }}</div>
              </div>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';

export default defineComponent({
  name: 'ReportsView',
  components: {
    apexchart: VueApexCharts,
    Icon
  },
  setup() {
    // Inicializar animaciones
    onMounted(() => {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-in-out-quad'
      });
    });

    const search = ref('');
    const timePeriod = ref('30d');

    // Periodos de tiempo para filtrado
    const timePeriods = ref([
      { text: 'Últimos 7 días', value: '7d' },
      { text: 'Últimos 30 días', value: '30d' },
      { text: 'Últimos 90 días', value: '90d' },
      { text: 'Este año', value: 'ytd' },
      { text: 'Año completo', value: 'full' }
    ]);

    // Tarjetas de resumen
    const summaryCards = ref([
      { icon: 'solar:users-group-two-rounded-outline', title: 'Clientes Activos', value: '1,024' },
      { icon: 'solar:user-block-outline', title: 'Clientes Inactivos', value: '156' },
      { icon: 'solar:user-plus-outline', title: 'Nuevos Clientes', value: '87' },
      { icon: 'solar:user-heart-outline', title: 'Clientes VIP', value: '42' }
    ]);

    // Datos para el gráfico de donut
    const donutChartOptions = ref({
      labels: ['Clientes Activos', 'Clientes Inactivos', 'Clientes Nuevos', 'Clientes VIP'],
      colors: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0'],
      legend: {
        position: 'bottom',
        fontFamily: 'inherit',
        labels: {
          colors: '#333'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Clientes',
                color: '#333',
                fontFamily: 'inherit',
                formatter: () => '1,309'
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}%`,
        style: {
          fontFamily: 'inherit'
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        enabled: true,
        style: {
          fontFamily: 'inherit'
        }
      }
    });

    const donutChartSeries = ref([44, 12, 25, 19]);

    // Reportes recientes
    const recentReports = ref([
      { id: 1, name: 'Reporte Mensual', date: 'Hoy', type: 'monthly', icon: 'mdi-calendar-month' },
      { id: 2, name: 'Análisis de Ventas', date: 'Ayer', type: 'sales', icon: 'mdi-chart-bar' },
      { id: 3, name: 'Clientes Inactivos', date: 'Hace 2 días', type: 'inactive', icon: 'mdi-account-off' }
    ]);

    // Datos para la tabla
    const headers = ref([
      { text: 'ID', value: 'id', width: '80px' },
      { text: 'Fecha', value: 'date', width: '120px' },
      { text: 'Tipo', value: 'type', width: '130px' },
      { text: 'Nombre del Reporte', value: 'name' },
      { text: 'Generado por', value: 'author' },
      { text: 'Acciones', value: 'actions', sortable: false, width: '150px', align: 'center' },
    ]);

    const reports = ref([
      { id: 1, date: '2023-10-01', type: 'Mensual', name: 'Reporte de progreso octubre', author: 'Admin' },
      { id: 2, date: '2023-10-15', type: 'Semanal', name: 'Análisis semana 42', author: 'Sistema' },
      { id: 3, date: '2023-10-30', type: 'Personalizado', name: 'Clientes inactivos Q4', author: 'Marketing' },
      { id: 4, date: '2023-09-30', type: 'Mensual', name: 'Reporte de progreso septiembre', author: 'Admin' },
      { id: 5, date: '2023-09-15', type: 'Semanal', name: 'Análisis semana 37', author: 'Sistema' },
      { id: 6, date: '2023-08-30', type: 'Trimestral', name: 'Resumen Q3 2023', author: 'Gerencia' },
      { id: 7, date: '2023-08-01', type: 'Mensual', name: 'Reporte de progreso agosto', author: 'Admin' },
      { id: 8, date: '2023-07-15', type: 'Semanal', name: 'Análisis semana 28', author: 'Sistema' },
    ]);


    const exportToPDF = () => alert('Exportando a PDF...');
    const exportToExcel = () => alert('Exportando a Excel...');
    const exportToWord = () => alert('Exportando a Word...');
    const exportCharts = () => alert('Exportando gráficos...');

    // Acciones de exportación
    const exportActions = ref([
      { icon: 'vscode-icons:file-type-pdf2', label: 'Exportar a PDF', format: 'PDF', color: '#F44336', handler: exportToPDF },
      { icon: 'vscode-icons:file-type-excel', label: 'Exportar a Excel', format: 'XLSX', color: '#4CAF50', handler: exportToExcel },
      { icon: 'vscode-icons:file-type-word', label: 'Exportar a Word', format: 'DOCX', color: '#2196F3', handler: exportToWord },
      { icon: 'flat-color-icons:pie-chart', label: 'Exportar gráficos', format: 'PNG', color: '#9C27B0', handler: exportCharts }
    ]);

    // Funciones de ayuda
    const getChartColor = (index: number) => {
      const colors = ['#FF7043', '#FFB74D', '#D84315', '#FF8A65']; // Tonos cálidos (naranja, ámbar, rojo tierra)
      return colors[index % colors.length];
    };


    const getReportColor = (type: string) => {
      const typeColors: Record<string, string> = {
        'monthly': '#2196F3',
        'sales': '#4CAF50',
        'inactive': '#FF9800'
      };
      return typeColors[type] || '#9E9E9E';
    };

    const getTypeColor = (type: string) => {
      const typeColors: Record<string, string> = {
        'Mensual': '#2196F3',
        'Semanal': '#4CAF50',
        'Trimestral': '#FF9800',
        'Personalizado': '#9C27B0'
      };
      return typeColors[type] || '#9E9E9E';
    };

    const getDateColor = (date: string) => {
      const reportDate = new Date(date);
      const today = new Date();
      const diffTime = today.getTime() - reportDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) return '#4CAF50';
      if (diffDays <= 30) return '#FF9800';
      return '#F44336';
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Funciones de acción
    const changeTimePeriod = (period: string) => {
      timePeriod.value = period;
      // Aquí iría la lógica para actualizar los datos según el periodo seleccionado
    };

    const downloadReport = (report: any) => {
      // Simular descarga
      const link = document.createElement('a');
      link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`Reporte ${report.type} - ${report.name}`)}`;
      link.download = `reporte_${report.id}.txt`;
      link.click();
    };

    const previewReport = (report: any) => {
      alert(`Vista previa del reporte: ${report.name}\nTipo: ${report.type}\nFecha: ${report.date}`);
    };

    const generateNewReport = () => {
      alert('Generando nuevo reporte...');
      // Lógica para generar nuevo reporte
    };


    return {
      search,
      timePeriod,
      timePeriods,
      summaryCards,
      donutChartOptions,
      donutChartSeries,
      recentReports,
      headers,
      reports,
      exportActions,
      changeTimePeriod,
      downloadReport,
      previewReport,
      generateNewReport,
      getChartColor,
      getReportColor,
      getTypeColor,
      getDateColor,
      formatDate
    };
  },
});
</script>

<style scoped lang="scss">
.reports-content {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

.reports-title {
  position: relative;
    display: inline-block;
    margin-bottom: 8px;

    .title-text {
      position: relative;
      z-index: 2;
      font-size: 2.25rem;
      font-weight: 700;
      background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-family: var(--fuente-titulo);
    }

    .title-highlight {
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 12px;
      background: rgba(255, 69, 0, 0.2);
      border-radius: 4px;
      z-index: 1;
      transform: rotate(-1deg);
    }

    .text-subtitle-1 {
      color: var(--color-texto);
      font-family: var(--fuente-principal);
    }
}

/* Tarjetas de resumen */
.summary-card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;

    .card-wave {
      transform: translateX(0);
    }
  }

  .card-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.2);
    transition: transform 0.3s;
    color: white;
  }

  .card-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    border-radius: 0 0 0 100%;
    opacity: 0.1;
    transition: opacity 0.3s;
  }

  .card-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-50%);
    transition: transform 1.5s ease-in-out;
    z-index: 1;
  }

  .v-card-title {
    padding: 0;
    margin-bottom: 8px;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
    color: white;
  }

  .v-card-text {
    padding: 0;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
    color: white;
  }

  &:hover {
    .card-icon {
      transform: scale(1.1);
    }

    .card-decoration {
      opacity: 0.2;
    }

    .v-card-title {
      letter-spacing: 0.5px;
    }

    .v-card-text {
      transform: scale(1.05);
    }
  }
}

/* Estilos individuales para cada tarjeta */
.card-0 {
  background: linear-gradient(135deg, $color-rojo-vibrante, $color-rojo-granate);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-1 {
  background: linear-gradient(135deg, #FF9800, #EF6C00);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-2 {
  background: linear-gradient(135deg, $color-rojo-calido, $color-rojo-botones);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-3 {
  background: linear-gradient(135deg, $color-rojo-granate, $color-rojo-vibrante);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

/* Tarjetas de gráficos */
.chart-card,
.stats-card,
.table-card,
.export-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e0e0e0;

    h3 {
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .chart-icon-bg {
      width: 40px;
      height: 40px;
      background: rgba(33, 150, 243, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #2196F3;
    }

    .period-selector {
      text-transform: none;
      letter-spacing: normal;
      color: #2196F3;
    }
  }
}

/* Tabla de reportes */
.report-table {
  border-radius: 0 0 16px 16px;

  :deep(thead tr th) {
    background-color: #f5f7fa !important;
    color: #333 !important;
    font-weight: 600;
  }

  :deep(tbody tr:nth-of-type(even)) {
    background-color: #f8fafc;
  }

  :deep(tbody tr:hover) {
    background-color: #ebf4ff !important;
  }
}

/* Campo de búsqueda */
.search-field {
  max-width: 300px;

  :deep(.v-input__control) {
    background-color: white !important;
    border-radius: 24px;
    padding: 0 12px !important;
    border: 1px solid #e0e0e0;
  }

  :deep(.v-input__control:before) {
    display: none;
  }
}
/* Acciones de exportación */
.export-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 16px;

  .action-btn {
    height: auto;
    padding: 16px;
    border-radius: 12px;
    text-transform: none;
    letter-spacing: normal;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    background-color: white !important;
    border: 1px solid #e0e0e0;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
    }

    .btn-content {
      text-align: left;

      .btn-label {
        font-weight: 500;
        font-size: 1rem;
        color: #333;
      }

      .btn-hint {
        font-size: 0.75rem;
        opacity: 0.8;
        margin-top: 2px;
        color: #616161;
      }
    }
  }
}

/* Responsive */
@media (max-width: 960px) {
  .reports-title {
    .title-text {
      font-size: 1.75rem;
    }

    .title-highlight {
      height: 8px;
      bottom: 3px;
    }
  }

  .summary-card {
    padding: 16px;

    .card-icon {
      width: 48px;
      height: 48px;
    }
  }

  .export-actions {
    grid-template-columns: 1fr 1fr !important;
  }
}

@media (max-width: 600px) {
  .export-actions {
    grid-template-columns: 1fr !important;
  }
}
</style>
