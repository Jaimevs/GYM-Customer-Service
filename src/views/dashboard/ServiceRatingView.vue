<template>
  <v-container fluid class="service-rating-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Valoración de Servicios</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Monitorea y analiza las valoraciones de los clientes sobre los servicios del gimnasio.
      <v-chip v-if="isConnected" color="var(--color-grafica-rojo-fuego)" small class="ml-2" dark>
        <v-icon left small>mdi-check-circle</v-icon>
        Conectado en tiempo real
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

    <!-- Detalles de Calificaciones -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="zoom-in">
        <v-card class="pa-4 rating-card" elevation="2">
          <v-card-title class="card-title d-flex align-center">
            <v-icon large left color="var(--color-grafica-amarillo-dorado)">mdi-star-box</v-icon>
            <span>Detalles de Calificaciones</span>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="rating-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Estrellas</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">Porcentaje</th>
                    <th class="text-left">Distribución</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in calificacionesDetalle" :key="index"
                    :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'" :data-aos-delay="100 * index">
                    <td class="star-cell">
                      <v-rating :value="item.valor" dense readonly size="20" :color="getColorForRating(item.valor)"
                        class="rating-stars"></v-rating>
                      <span class="star-text">{{ item.valor }} estrella{{ item.valor !== 1 ? 's' : '' }}</span>
                    </td>
                    <td class="text-center amount-cell">
                      <v-chip small :color="getColorForRating(item.valor)" dark class="amount-chip">
                        {{ item.cantidad }}
                      </v-chip>
                    </td>
                    <td class="text-center percentage-cell">
                      <span class="percentage-value">{{ item.porcentaje.toFixed(1) }}%</span>
                    </td>
                    <td class="progress-cell">
                      <v-progress-linear :value="item.porcentaje" :color="getColorForRating(item.valor)" height="16"
                        rounded striped>
                        <template v-slot:default="{ value }">
                          <strong class="progress-text">{{ Math.ceil(value) }}%</strong>
                        </template>
                      </v-progress-linear>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Inicializar AOS
onMounted(() => {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true
  });
});

// Variables para la conexión WebSocket
const isConnected = ref(false);
const socket = ref(null);
const calificacionesStats = ref({
  calificaciones: [],
  total: 0
});

// Obtener calificaciones detalladas
const calificacionesDetalle = computed(() => {
  return calificacionesStats.value.calificaciones;
});

// Calcular el promedio de calificación
const promedioCalificacion = computed(() => {
  if (calificacionesStats.value.total === 0) return 0;

  const suma = calificacionesStats.value.calificaciones.reduce((acc, cal) => {
    return acc + (cal.valor * cal.cantidad);
  }, 0);

  return ((suma / calificacionesStats.value.total) * 20).toFixed(1); // Convertir a porcentaje para el radialBar
});

// Calificación promedio para la gráfica
const calificacionPromedio = computed(() => {
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
    series: [promedioCalificacion.value], // Promedio en porcentaje (0-100)
  };
});

// Distribución de calificaciones para la gráfica
const distribucionCalificaciones = computed(() => {
  return {
    options: {
      chart: {
        foreColor: 'var(--color-texto-principal)'
      },
      labels: calificacionesStats.value.calificaciones.map(c => `${c.valor} Estrellas`),
      colors: [
        'var(--color-grafica-rojo-granate)',
        'var(--color-grafica-rojo-fuego)',
        'var(--color-grafica-amarillo-dorado)',
        'var(--color-grafica-naranja-calido)',
        'var(--color-grafica-ocre)'
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
            const porcentaje = calificacionesStats.value.calificaciones[dataPointIndex].porcentaje.toFixed(2);
            return `${val} (${porcentaje}%)`;
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
                  return calificacionesStats.value.total;
                }
              }
            }
          }
        }
      }
    },
    series: calificacionesStats.value.calificaciones.map(c => c.cantidad),
  };
});

// Método para obtener color basado en calificación
const getColorForRating = (rating) => {
  const colors = {
    1: 'var(--color-grafica-rojo-granate)', // Rojo granate
    2: 'var(--color-grafica-rojo-fuego)',   // Rojo fuego
    3: 'var(--color-grafica-amarillo-dorado)', // Amarillo dorado
    4: 'var(--color-grafica-naranja-calido)',  // Naranja cálido
    5: 'var(--color-grafica-ocre)'          // Ocre
  };
  return colors[rating] || 'var(--color-grafica-gris-plata)';
};

// Conectar al WebSocket
const connectWebSocket = () => {
  // Define la URL del WebSocket
  const wsUrl = 'wss://gymtoday1243.com/api/estadisticas/ws/calificaciones';

  // Crea la conexión WebSocket
  socket.value = new WebSocket(wsUrl);

  // Evento cuando se abre la conexión
  socket.value.onopen = () => {
    console.log('Conexión WebSocket establecida');
    isConnected.value = true;
  };

  // Evento cuando se reciben datos
  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Datos recibidos:', data);
    calificacionesStats.value = data;
  };

  // Evento cuando se cierra la conexión
  socket.value.onclose = () => {
    console.log('Conexión WebSocket cerrada');
    isConnected.value = false;

    // Intentar reconectar después de 3 segundos
    setTimeout(() => {
      connectWebSocket();
    }, 3000);
  };

  // Evento en caso de error
  socket.value.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error);
    isConnected.value = false;
  };
};

// Obtener datos iniciales (REST API)
const fetchInitialData = async () => {
  try {
    // Obtener estadísticas de calificaciones
    const statsResponse = await axios.get('https://gymtoday1243.com/api/estadisticas/calificaciones');
    calificacionesStats.value = statsResponse.data;
  } catch (error) {
    console.error('Error al obtener datos iniciales:', error);
    // Si falla la obtención de datos, usar datos de ejemplo
    if (calificacionesStats.value.calificaciones.length === 0) {
      calificacionesStats.value = {
        calificaciones: [
          { valor: 1, cantidad: 5, porcentaje: 5 },
          { valor: 2, cantidad: 10, porcentaje: 10 },
          { valor: 3, cantidad: 20, porcentaje: 20 },
          { valor: 4, cantidad: 30, porcentaje: 30 },
          { valor: 5, cantidad: 35, porcentaje: 35 }
        ],
        total: 100
      };
    }
  }
};

// Solicitar actualización cada 30 segundos como respaldo
let updateInterval;

onMounted(() => {
  // Obtener datos iniciales
  fetchInitialData();

  // Conectar al WebSocket
  connectWebSocket();

  // Establecer intervalo para solicitar actualizaciones
  updateInterval = setInterval(() => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send('update');
    }
  }, 30000);
});

onUnmounted(() => {
  // Limpiar recursos al desmontar el componente
  if (socket.value) {
    socket.value.close();
  }

  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.service-rating-content {
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

.rating-card {
  .v-card__title {
    border-bottom: 2px solid var(--color-grafica-amarillo-dorado);
  }
}

.rating-table {
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

  .star-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    .rating-stars {
      flex-shrink: 0;
    }

    .star-text {
      font-weight: 500;
      color: var(--color-texto-secundario);
    }
  }

  .amount-chip {
    font-weight: 600;
    min-width: 40px;
    justify-content: center;
  }

  .percentage-value {
    font-weight: 600;
    color: var(--color-texto-principal);
  }

  .progress-text {
    color: white;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    font-size: 0.75rem;
  }
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

  .service-rating-content {
    padding: 1rem;
  }

  .rating-table {
    border-spacing: 0 8px;

    th,
    td {
      padding: 10px 12px;
    }

    .star-cell {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
}

@media (max-width: 600px) {
  .rating-table {
    display: block;
    overflow-x: auto;

    th,
    td {
      white-space: nowrap;
    }
  }
}
</style>
