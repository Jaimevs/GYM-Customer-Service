<template>
  <div class="coach-content">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="coach-title">
          <span class="title-text">Mi Panel de Entrenador</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="text-subtitle-1">Gestiona tus actividades y alumnos</p>
      </v-col>
    </v-row>

    <!-- Tarjetas de resumen con colores cálidos -->
    <v-row class="mb-6">
      <v-col cols="12" md="4" v-for="(card, index) in summaryCards" :key="index" :data-aos="'fade-up'"
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

    <!-- Contenido principal -->
    <v-row class="mb-6">
      <!-- Agenda de sesiones -->
      <v-col cols="12" md="8" data-aos="fade-right" data-aos-delay="200">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:calendar-outline" width="24" />
            </div>
            <h3 class="text-h6">Agenda de Hoy</h3>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small text v-bind="attrs" v-on="on" class="period-selector">
                  Hoy
                  <Icon icon="solar:alt-arrow-down-outline" class="ml-1" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in timeFilters" :key="index" @click="changeTimeFilter(item.value)">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-card-text>
            <v-list class="transparent">
              <v-list-item v-for="(session, index) in upcomingSessions" :key="index" :class="`session-item-${index}`"
                @click="viewSessionDetails(session)">
                <v-list-item-avatar>
                  <v-avatar :color="getSessionColor(session.type)" size="40">
                    <span class="white--text">{{ session.student.charAt(0) }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{ session.student }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip x-small :color="getSessionColor(session.type)" text-color="white" class="mr-1">
                      {{ session.type }}
                    </v-chip>
                    {{ session.time }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small>
                    <v-icon small>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Acciones rápidas -->
      <v-col cols="12" md="4" data-aos="fade-left" data-aos-delay="200">
        <v-card class="stats-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:bolt-outline" width="24" />
            </div>
            <h3 class="text-h6">Acciones Rápidas</h3>
          </div>
          <v-card-text>
            <v-list dense class="transparent">
              <v-list-item v-for="(action, index) in quickActions" :key="index" :class="`action-item-${index}`"
                @click="action.handler">
                <v-list-item-icon>
                  <v-icon :color="actionColors[index]">{{ action.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{ action.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ action.subtitle }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small>
                    <v-icon small>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn block color="primary" class="mt-4" @click="scheduleSession">
              <Icon icon="solar:calendar-add-outline" class="mr-2" />
              Nueva Sesión
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estadísticas semanales -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up" data-aos-delay="100">
        <v-card class="table-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:chart-2-outline" width="24" />
            </div>
            <h3 class="text-h6">Estadísticas Semanales</h3>
          </div>
          <v-card-text>
            <apexchart type="radialBar" height="300" :options="weeklyStats.options" :series="weeklyStats.series">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import VueApexCharts from 'vue3-apexcharts';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: 'CoachDashboardView',
  components: {
    apexchart: VueApexCharts,
    Icon
  },
  setup() {
    const router = useRouter();

    // Inicializar animaciones
    onMounted(() => {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-in-out-quad'
      });
    });

    // Tarjetas de resumen con colores cálidos
    const summaryCards = ref([
      {
        icon: 'solar:users-group-two-rounded-outline',
        title: 'Alumnos Activos',
        value: '12'
      },
      {
        icon: 'tdesign:calendar-2',
        title: 'Sesiones Hoy',
        value: '5'
      },
      {
        icon: 'solar:star-outline',
        title: 'Rating Promedio',
        value: '4.9/5'
      }
    ]);

    // Filtros de tiempo
    const timeFilters = ref([
      { text: 'Hoy', value: 'today' },
      { text: 'Esta semana', value: 'week' },
      { text: 'Este mes', value: 'month' },
      { text: 'Próximas', value: 'upcoming' }
    ]);

    // Sesiones próximas
    const upcomingSessions = ref([
      {
        student: "María González",
        time: "10:00 - 11:00 AM",
        type: "Personalizada",
        progress: 75
      },
      {
        student: "Carlos Rodríguez",
        time: "11:30 - 12:30 PM",
        type: "Grupal",
        progress: 40
      },
      {
        student: "Ana Martínez",
        time: "2:00 - 3:00 PM",
        type: "Evaluación",
        progress: 20
      },
    ]);

    // Acciones rápidas
    const quickActions = ref([
      {
        icon: "mdi-account-plus",
        title: "Agregar Alumno",
        subtitle: "Registrar nuevo cliente",
        handler: () => router.push("/clientes/nuevo")
      },
      {
        icon: "mdi-note-plus",
        title: "Crear Plan",
        subtitle: "Diseñar nuevo plan",
        handler: () => router.push("/planes/nuevo")
      },
      {
        icon: "mdi-chart-box",
        title: "Generar Reporte",
        subtitle: "Crear reporte personalizado",
        handler: () => router.push("/reportes/nuevo")
      }
    ]);

    const actionColors = ['#FF7043', '#FFB74D', '#D84315'];

    // Estadísticas semanales
    const weeklyStats = ref({
      options: {
        chart: {
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '14px',
                color: '#333',
              },
              value: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#333',
              },
              total: {
                show: true,
                label: 'Sesiones',
                color: '#333',
                formatter: () => '17/20'
              }
            }
          }
        },
        labels: ['Completadas', 'Asistencia', 'Evaluaciones'],
        colors: ['#FF7043', '#FFB74D', '#D84315'],
      },
      series: [85, 72, 65]
    });

    // Métodos
    const scheduleSession = () => router.push("/clases-coach");
    const viewSessionDetails = (session: any) => {
      console.log("Ver detalles de sesión:", session);
    };

    const changeTimeFilter = (filter: string) => {
      console.log("Cambiar filtro de tiempo:", filter);
    };

    const getSessionColor = (type: string) => {
      const typeColors: Record<string, string> = {
        'Personalizada': '#FF7043',
        'Grupal': '#FFB74D',
        'Evaluación': '#D84315'
      };
      return typeColors[type] || '#8D6E63';
    };

    return {
      summaryCards,
      timeFilters,
      upcomingSessions,
      quickActions,
      actionColors,
      weeklyStats,
      scheduleSession,
      viewSessionDetails,
      changeTimeFilter,
      getSessionColor
    };
  },
});
</script>

<style scoped lang="scss">
.coach-content {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

.coach-title {
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

/* Tarjetas de resumen con colores cálidos */
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

/* Estilos individuales para cada tarjeta con colores cálidos */
.card-0 {
  background: linear-gradient(135deg, #FF7043, #E64A19);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-1 {
  background: linear-gradient(135deg, #FFB74D, #FB8C00);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-2 {
  background: linear-gradient(135deg, #D84315, #BF360C);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
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
      background: rgba(255, 112, 67, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #FF7043;
    }

    .period-selector {
      text-transform: none;
      letter-spacing: normal;
      color: #FF7043;
    }
  }
}

/* Responsive */
@media (max-width: 960px) {
  .coach-title {
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
