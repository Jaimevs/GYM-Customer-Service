<template>
  <div class="classes-content">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="classes-title">
          <span class="title-text">Mis Clases</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="text-subtitle-1">Gestiona el horario de tus entrenamientos</p>
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

    <!-- Alertas -->
    <v-row>
      <v-col cols="12">
        <v-alert v-if="error" type="error" class="alert-message" data-aos="zoom-in">
          {{ error }}
        </v-alert>
        <v-alert v-if="successMessage" type="success" class="alert-message" data-aos="zoom-in">
          {{ successMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Contenido principal -->
    <v-row class="mb-6">
      <v-col cols="12" md="8" data-aos="fade-right">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:calendar-outline" width="24" />
            </div>
            <h3 class="text-h6">Distribución de Clases</h3>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small text v-bind="attrs" v-on="on" class="period-selector">
                  Esta semana
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
            <apexchart type="bar" :options="barChartOptions" :series="barChartSeries" height="350"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="fade-left">
        <v-card class="stats-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:clock-circle-outline" width="24" />
            </div>
            <h3 class="text-h6">Próximas Clases</h3>
          </div>
          <v-card-text>
            <v-list dense class="transparent">
              <v-list-item v-for="(cls, index) in upcomingClasses" :key="index" :class="`class-item-${index}`">
                <v-list-item-icon>
                  <v-icon :color="getClassColor(cls.type)">{{ cls.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{ cls.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ cls.date }} - {{ cls.time }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click="viewClassDetails(cls)">
                    <v-icon small>mdi-eye</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn block color="primary" class="mt-4" @click="openAddClassDialog">
              <Icon icon="solar:calendar-add-outline" class="mr-2" />
              Agregar Nueva Clase
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de clases -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="table-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:document-text-outline" width="24" />
            </div>
            <h3 class="text-h6">Todas mis clases</h3>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar clases..." single-line hide-details
              class="search-field"></v-text-field>
          </div>
          <v-card-text class="pa-0">
            <v-data-table :headers="headers" :items="classes" :items-per-page="10" :search="search"
              class="elevation-0 classes-table" :footer-props="{
                itemsPerPageOptions: [5, 10, 20, -1],
                showFirstLastPage: true
              }">
              <template v-slot:item.Horario="{ item }">
                <v-chip small :color="getScheduleColor(item.Dia_Inicio)" text-color="white">
                  {{ item.Dia_Inicio }} a {{ item.Dia_Fin }}, {{ formatTime(item.Hora_Inicio) }} - {{
                    formatTime(item.Hora_Fin) }}
                </v-chip>
              </template>
              <template v-slot:item.Duracion_Minutos="{ item }">
                <v-chip :color="getDurationColor(item.Duracion_Minutos)" small dark>
                  {{ item.Duracion_Minutos }} min
                </v-chip>
              </template>
              <template v-slot:item.Estatus="{ item }">
                <v-chip :color="item.Estatus ? 'success' : 'error'" small>
                  {{ item.Estatus ? 'Activa' : 'Inactiva' }}
                </v-chip>
              </template>
              <template v-slot:item.Acciones="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" icon v-bind="attrs" v-on="on" @click="editClass(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar clase</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="error" icon class="ml-2" v-bind="attrs" v-on="on" @click="confirmDeleteClass(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar clase</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogos (se mantienen igual que en tu versión original) -->
    <v-dialog v-model="classDialog" max-width="600px" persistent>
      <!-- ... contenido del diálogo ... -->
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <!-- ... contenido del diálogo de confirmación ... -->
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';
import CoachClassesService from '../../services/CoachClassesService';

export default defineComponent({
  name: 'CoachClassesView',
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
    const timePeriod = ref('week');
    const error = ref(null);
    const successMessage = ref(null);
    const classDialog = ref(false);
    const deleteDialog = ref(false);
    const isEditing = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const classToDelete = ref(null);

    // Periodos de tiempo para filtrado
    const timePeriods = ref([
      { text: 'Hoy', value: 'today' },
      { text: 'Esta semana', value: 'week' },
      { text: 'Este mes', value: 'month' },
      { text: 'Próximas 2 semanas', value: '2weeks' }
    ]);

    // Tarjetas de resumen
    const summaryCards = ref([
      { icon: 'solar:clock-circle-outline', title: 'Clases esta semana', value: '8' },
      { icon: 'solar:users-group-two-rounded-outline', title: 'Alumnos inscritos', value: '42' },
      { icon: 'solar:clock-square-outline', title: 'Horas de clase', value: '12' },
      { icon: 'solar:user-heart-outline', title: 'Clases VIP', value: '3' }
    ]);

    // Datos para el gráfico de barras
    const barChartOptions = ref({
      chart: {
        type: 'bar',
        fontFamily: 'inherit',
        toolbar: {
          show: false
        }
      },
      colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      },
      yaxis: {
        title: {
          text: 'N° de Clases'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " clases";
          }
        }
      }
    });

    const barChartSeries = ref([{
      name: 'Clases',
      data: [3, 2, 4, 5, 3, 1, 0]
    }]);

    // Clases próximas
    const upcomingClasses = ref([
      { id: 1, name: 'Yoga Avanzado', date: 'Hoy', time: '18:00 - 19:30', type: 'yoga', icon: 'mdi-yoga' },
      { id: 2, name: 'CrossFit', date: 'Mañana', time: '07:00 - 08:00', type: 'crossfit', icon: 'mdi-dumbbell' },
      { id: 3, name: 'Pilates', date: 'Miércoles', time: '09:00 - 10:00', type: 'pilates', icon: 'mdi-yoga' }
    ]);

    // Datos para la tabla
    const headers = ref([
      { text: 'Nombre', value: 'Nombre', sortable: true },
      { text: 'Horario', value: 'Horario', sortable: false },
      { text: 'Duración', value: 'Duracion_Minutos', sortable: true },
      { text: 'Estado', value: 'Estatus', sortable: true },
      { text: 'Acciones', value: 'Acciones', sortable: false, width: '120px', align: 'center' },
    ]);

    const classes = ref([
      { id: 1, Nombre: 'Yoga Matutino', Dia_Inicio: 'Lunes', Dia_Fin: 'Viernes', Hora_Inicio: '08:00', Hora_Fin: '09:00', Duracion_Minutos: 60, Estatus: true },
      { id: 2, Nombre: 'CrossFit', Dia_Inicio: 'Martes', Dia_Fin: 'Jueves', Hora_Inicio: '18:00', Hora_Fin: '19:00', Duracion_Minutos: 60, Estatus: true },
      { id: 3, Nombre: 'Pilates', Dia_Inicio: 'Miércoles', Dia_Fin: 'Miércoles', Hora_Inicio: '10:00', Hora_Fin: '11:00', Duracion_Minutos: 60, Estatus: false },
      // ... más clases
    ]);

    // Funciones de ayuda
    const getClassColor = (type: string) => {
      const typeColors: Record<string, string> = {
        'yoga': '#4CAF50',
        'crossfit': '#FF9800',
        'pilates': '#2196F3'
      };
      return typeColors[type] || '#9E9E9E';
    };

    const getScheduleColor = (day: string) => {
      const dayColors: Record<string, string> = {
        'Lunes': '#4CAF50',
        'Martes': '#2196F3',
        'Miércoles': '#FF9800',
        'Jueves': '#9C27B0',
        'Viernes': '#F44336',
        'Sábado': '#00BCD4',
        'Domingo': '#607D8B'
      };
      return dayColors[day] || '#9E9E9E';
    };

    const getDurationColor = (minutes: number) => {
      if (minutes < 30) return '#FF9800';
      if (minutes < 60) return '#4CAF50';
      return '#2196F3';
    };

    const formatTime = (timeString: string) => {
      if (!timeString) return '';
      return timeString.substring(0, 5);
    };

    // Funciones de acción (se mantienen igual que en tu versión original)
    const changeTimePeriod = (period: string) => {
      timePeriod.value = period;
      // Actualizar datos según el periodo
    };

    const viewClassDetails = (cls: any) => {
      // Lógica para ver detalles
    };

    const openAddClassDialog = () => {
      // Lógica para abrir diálogo
    };

    const editClass = (cls: any) => {
      // Lógica para editar
    };

    const confirmDeleteClass = (cls: any) => {
      // Lógica para confirmar eliminación
    };

    return {
      search,
      timePeriod,
      timePeriods,
      summaryCards,
      barChartOptions,
      barChartSeries,
      upcomingClasses,
      headers,
      classes,
      error,
      successMessage,
      classDialog,
      deleteDialog,
      isEditing,
      saving,
      deleting,
      classToDelete,
      changeTimePeriod,
      viewClassDetails,
      openAddClassDialog,
      editClass,
      confirmDeleteClass,
      getClassColor,
      getScheduleColor,
      getDurationColor,
      formatTime
    };
  },
});
</script>

<style scoped lang="scss">
.classes-content {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

.classes-title {
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

/* Tarjetas de resumen - Mantenemos los mismos estilos que en ReportsView */
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
  background: linear-gradient(135deg, #2196F3, #1976D2);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-1 {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-2 {
  background: linear-gradient(135deg, #FF9800, #EF6C00);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-3 {
  background: linear-gradient(135deg, #9C27B0, #6A1B9A);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

/* Alertas mejoradas */
.alert-message {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Mantenemos los mismos estilos para chart-card, stats-card, table-card que en ReportsView */
.chart-card,
.stats-card,
.table-card {
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

/* Tabla de clases */
.classes-table {
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

/* Responsive */
@media (max-width: 960px) {
  .classes-title {
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
}
</style>
