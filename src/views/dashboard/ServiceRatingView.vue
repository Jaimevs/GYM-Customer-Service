<template>
  <v-container fluid class="admin-dashboard-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Panel de Evaluaciones</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Gestiona y analiza las valoraciones de los entrenadores del gimnasio.
      <v-chip v-if="loading" color="var(--color-grafica-amarillo-dorado)" small class="ml-2" dark>
        <v-icon left small>mdi-refresh</v-icon>
        Cargando datos
      </v-chip>
    </p>

    <!-- Resumen General de Valoraciones -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="card-title">Calificación Promedio</v-card-title>
          <v-card-text>
            <apexchart type="radialBar" :options="calificacionPromedio.options" :series="calificacionPromedio.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="card-title">Distribución de Calificaciones</v-card-title>
          <v-card-text>
            <apexchart type="donut" :options="distribucionCalificaciones.options"
              :series="distribucionCalificaciones.series" height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estadísticas por entrenador -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="zoom-in">
        <v-card class="pa-4 trainers-card" elevation="2">
          <v-card-title class="card-title d-flex align-center">
            <v-icon large left color="var(--color-grafica-naranja-calido)">mdi-account-group</v-icon>
            <span>Top Entrenadores</span>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="trainers-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Entrenador</th>
                    <th class="text-center">Promedio</th>
                    <th class="text-center">Evaluaciones</th>
                    <th class="text-left">Distribución</th>
                    <th class="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(entrenador, index) in estadisticasPorEntrenador" :key="index"
                    :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'" :data-aos-delay="100 * index">
                    <td class="name-cell">
                      <div class="d-flex align-center">
                        <v-avatar size="36" class="mr-2">
                          <v-icon>mdi-account</v-icon>
                        </v-avatar>
                        <span class="trainer-name">{{ entrenador.nombre }}</span>
                      </div>
                    </td>
                    <td class="text-center rating-cell">
                      <v-rating :value="entrenador.promedio_calificacion" half-increments readonly dense
                        color="var(--color-grafica-amarillo-dorado)" background-color="var(--color-gris-claro)">
                      </v-rating>
                      <span class="rating-value">{{ entrenador.promedio_calificacion }}</span>
                    </td>
                    <td class="text-center">
                      <v-chip small color="var(--color-grafica-ocre)" dark>
                        {{ entrenador.total_quejas }}
                      </v-chip>
                    </td>
                    <td class="distribution-cell">
                      <div class="distribution-bars">
                        <div v-for="(value, key) in entrenador.distribucion_calificaciones" :key="key"
                          class="distribution-bar-container">
                          <div class="distribution-bar" :style="{
                            width: value + '%',
                            backgroundColor: evaluationsService.getColorForRating(evaluationsService.getRatingValue(key))
                          }"></div>
                        </div>
                      </div>
                    </td>
                    <td class="text-center action-cell">
                      <v-btn small outlined color="var(--color-grafica-rojo-fuego)"
                        @click="verDetalleEntrenador(entrenador.entrenador_id)">
                        Ver Detalle
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal para detalle de un entrenador -->
    <v-dialog v-model="detalleEntrenadorDialog" max-width="800">
      <v-card class="pa-4" v-if="entrenadorSeleccionado">
        <v-card-title class="headline">
          Detalle de {{ entrenadorSeleccionado.nombre }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-4">
                <h3 class="mr-2">Calificación promedio:</h3>
                <v-rating :value="entrenadorSeleccionado.promedio_calificacion" readonly half-increments
                  color="var(--color-grafica-amarillo-dorado)"></v-rating>
                <span class="ml-2 font-weight-bold">{{ entrenadorSeleccionado.promedio_calificacion }}</span>
              </div>
              <div class="mb-4">
                <h3>Distribución de calificaciones</h3>
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>Estrellas</th>
                        <th>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(value, key) in entrenadorSeleccionado.distribucion_calificaciones" :key="key">
                        <td>{{ key.replace('_', ' ') }}</td>
                        <td>{{ value.toFixed(1) }}%</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="mb-2">Último mes</h3>
              <apexchart type="bar" :options="entrenadorGrafica.options" :series="entrenadorGrafica.series" height="200">
              </apexchart>
            </v-col>
          </v-row>

          <h3 class="mt-4 mb-2">Comentarios recientes</h3>
          <v-list>
            <v-list-item v-for="(queja, index) in ultimasQuejas" :key="index" class="mb-2 rounded-lg"
              :class="'bg-rating-' + queja.calificacion">
              <v-list-item-avatar>
                <v-avatar color="grey lighten-2">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ queja.usuario_nombre }}
                  <v-rating :value="queja.calificacion" dense readonly size="16"
                    color="var(--color-grafica-amarillo-dorado)" background-color="var(--color-gris-claro)"
                    class="d-inline-block ml-2"></v-rating>
                </v-list-item-title>
                <v-list-item-subtitle>{{ evaluationsService.formatDate(queja.fecha) }} | Clase: {{ queja.clase_nombre }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="mt-1 font-italic">
                  "{{ queja.comentario || 'Sin comentario' }}"
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--color-grafica-rojo-fuego)" text @click="detalleEntrenadorDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import EvaluationsService from '@/services/EvaluationsService';

export default defineComponent({
  name: 'ServiceRatingView',
  setup() {
    // Estados
    const loading = ref(false);
    const estadisticas = ref(null);
    const estadisticasPorEntrenador = ref([]);
    const entrenadorSeleccionado = ref(null);
    const detalleEntrenadorDialog = ref(false);
    const ultimasQuejas = ref([]);
    const evaluationsService = EvaluationsService;

    // Inicializar AOS
    onMounted(() => {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true
      });

      // Cargar datos al montar el componente
      fetchEstadisticas();
    });

    // Obtener estadísticas del servidor
    const fetchEstadisticas = async () => {
      loading.value = true;
      try {
        const data = await evaluationsService.getEstadisticasGenerales();
        estadisticas.value = data;
        estadisticasPorEntrenador.value = data.estadisticas_por_entrenador || [];
        loading.value = false;
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        loading.value = false;
      }
    };

    // Ver detalle de un entrenador
    const verDetalleEntrenador = async (entrenadorId) => {
      loading.value = true;
      try {
        const data = await evaluationsService.getDetalleEntrenador(entrenadorId);
        entrenadorSeleccionado.value = data;
        ultimasQuejas.value = data.ultimas_quejas || [];
        detalleEntrenadorDialog.value = true;
        loading.value = false;
      } catch (error) {
        console.error('Error al obtener detalle del entrenador:', error);
        loading.value = false;
      }
    };

    // Calcular la cantidad en base al porcentaje y total
    const calcularCantidad = (porcentaje) => {
      if (!estadisticas.value) return 0;
      return evaluationsService.calcularCantidadPorPorcentaje(porcentaje, estadisticas.value.total_quejas);
    };

    // Preparar datos para calificación promedio
    const calificacionPromedio = computed(() => {
      const promedio = estadisticas.value ? estadisticas.value.promedio_calificacion * 20 : 0; // Convertir a porcentaje (0-100)

      return {
        options: {
          chart: {
            id: "calificacion-promedio",
            foreColor: 'var(--color-texto-principal)'
          },
          plotOptions: {
            radialBar: {
              startAngle: -135,
              endAngle: 135,
              hollow: {
                margin: 0,
                size: '70%',
              },
              dataLabels: {
                name: {
                  show: false,
                },
                value: {
                  fontSize: '30px',
                  show: true,
                  formatter: function (val) {
                    return (val / 20).toFixed(1); // Convertir de vuelta a escala 0-5
                  },
                  color: 'var(--color-texto-principal)'
                }
              }
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: 'horizontal',
              gradientToColors: ['var(--color-grafica-rojo-fuego)'],
              stops: [0, 100]
            }
          },
          stroke: {
            lineCap: 'round'
          },
          labels: ["Promedio"],
        },
        series: [promedio], // Promedio en porcentaje (0-100)
      };
    });

    // Preparar datos para distribución de calificaciones
    const distribucionCalificaciones = computed(() => {
      const distribucion = estadisticas.value ? estadisticas.value.distribucion_calificaciones : {
        "5_estrellas": 0,
        "4_estrellas": 0,
        "3_estrellas": 0,
        "2_estrellas": 0,
        "1_estrella": 0
      };

      const labels = Object.keys(distribucion).map(key => {
        return key.replace('_', ' ');
      });

      const series = Object.values(distribucion).map(value => {
        return calcularCantidad(value);
      });

      return {
        options: {
          chart: {
            foreColor: 'var(--color-texto-principal)'
          },
          labels: labels,
          colors: [
            'var(--color-grafica-ocre)',
            'var(--color-grafica-naranja-calido)',
            'var(--color-grafica-amarillo-dorado)',
            'var(--color-grafica-rojo-fuego)',
            'var(--color-grafica-rojo-granate)'
          ],
          legend: {
            position: 'bottom',
            labels: {
              colors: 'var(--color-texto-principal)'
            }
          },
          tooltip: {
            y: {
              formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                const porcentaje = Object.values(distribucion)[dataPointIndex];
                return `${val} (${porcentaje.toFixed(2)}%)`;
              }
            }
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Total',
                    formatter: function () {
                      return estadisticas.value ? estadisticas.value.total_quejas : 0;
                    }
                  }
                }
              }
            }
          }
        },
        series: series,
      };
    });

    // Gráfica para el detalle de un entrenador
    const entrenadorGrafica = computed(() => {
      if (!entrenadorSeleccionado.value || !entrenadorSeleccionado.value.tendencia_calificaciones) {
        return {
          options: {
            chart: {
              type: 'bar',
              height: 200,
              foreColor: 'var(--color-texto-principal)',
            },
            xaxis: {
              categories: [],
            },
            yaxis: {
              min: 0,
              max: 5,
            },
            colors: ['var(--color-grafica-amarillo-dorado)'],
            plotOptions: {
              bar: {
                borderRadius: 4,
              }
            }
          },
          series: [{
            name: 'Calificación',
            data: []
          }]
        };
      }

      const tendencia = entrenadorSeleccionado.value.tendencia_calificaciones;
      const categorias = tendencia.map(item => {
        const [year, month] = item.periodo.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('es-ES', { month: 'short' });
      });

      return {
        options: {
          chart: {
            type: 'bar',
            height: 200,
            foreColor: 'var(--color-texto-principal)',
          },
          xaxis: {
            categories: categorias,
          },
          yaxis: {
            min: 0,
            max: 5,
            labels: {
              formatter: function (value) {
                return value.toFixed(1);
              }
            }
          },
          colors: ['var(--color-grafica-amarillo-dorado)'],
          plotOptions: {
            bar: {
              borderRadius: 4,
              columnWidth: '50%',
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toFixed(1);
            },
            style: {
              fontSize: '12px',
              colors: ['#333']
            }
          },
          tooltip: {
            y: {
              formatter: function (value) {
                return value.toFixed(1) + ' / 5';
              }
            }
          }
        },
        series: [{
          name: 'Calificación',
          data: tendencia.map(item => item.promedio_calificacion)
        }]
      };
    });

    return {
      loading,
      estadisticas,
      estadisticasPorEntrenador,
      calificacionPromedio,
      distribucionCalificaciones,
      entrenadorSeleccionado,
      detalleEntrenadorDialog,
      ultimasQuejas,
      entrenadorGrafica,
      verDetalleEntrenador,
      calcularCantidad,
      evaluationsService
    };
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.admin-dashboard-content {
  padding: 2rem;
}

.dashboard-title {
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
}

.text-subtitle-1 {
  color: var(--color-texto);
  font-family: var(--fuente-principal);
  margin-bottom: 24px;
}

.v-card {
  border-radius: 12px;
  margin-bottom: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }

  &__title {
    font-weight: 600;
    color: var(--color-texto-principal);
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-gris-medio);
    font-family: var(--fuente-titulo);
    font-size: 1.25rem;
  }
}

.trainers-card {
  .v-card__title {
    border-bottom: 2px solid var(--color-grafica-amarillo-dorado);
  }
}

.trainers-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;

  th {
    background-color: var(--color-gris-claro) !important;
    color: var(--color-texto-principal) !important;
    font-family: var(--fuente-titulo);
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    padding: 16px;
    border: none;
  }

  td {
    color: var(--color-texto-principal) !important;
    font-family: var(--fuente-principal);
    padding: 12px 16px;
    background: var(--color-fondo-tabla) !important;
    border: none;
    vertical-align: middle;

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }

  tr {
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.01);
    }
  }
}

.name-cell {
  .trainer-name {
    font-weight: 500;
  }
}

.rating-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .rating-value {
    font-weight: 600;
    color: var(--color-texto-principal);
  }
}

.distribution-cell {
  .distribution-bars {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;

    .distribution-bar-container {
      height: 4px;
      background-color: var(--color-gris-claro);
      border-radius: 2px;
      overflow: hidden;

      .distribution-bar {
        height: 100%;
        border-radius: 2px;
      }
    }
  }
}

// Colores para los distintos niveles de calificación en el modal
.bg-rating-5 {
  background-color: rgba(var(--color-grafica-ocre-rgb), 0.1) !important;
}

.bg-rating-4 {
  background-color: rgba(var(--color-grafica-naranja-calido-rgb), 0.1) !important;
}

.bg-rating-3 {
  background-color: rgba(var(--color-grafica-amarillo-dorado-rgb), 0.1) !important;
}

.bg-rating-2 {
  background-color: rgba(var(--color-grafica-rojo-fuego-rgb), 0.1) !important;
}

.bg-rating-1 {
  background-color: rgba(var(--color-grafica-rojo-granate-rgb), 0.1) !important;
}

@media (max-width: 960px) {
  .dashboard-title {
    .title-text {
      font-size: 1.75rem;
    }

    .title-highlight {
      height: 8px;
      bottom: 3px;
    }
  }

  .admin-dashboard-content {
    padding: 1rem;
  }

  .trainers-table {
    border-spacing: 0 8px;

    th,
    td {
      padding: 10px 12px;
    }
  }
}

@media (max-width: 600px) {
  .trainers-table {
    display: block;
    overflow-x: auto;

    th,
    td {
      white-space: nowrap;
    }
  }
}
</style>