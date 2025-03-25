<template>
  <v-container fluid class="service-rating-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Valoración de Servicios</h1>
    <p class="text-subtitle-1">Monitorea y analiza las valoraciones de los clientes sobre los servicios del gimnasio.
      <v-chip v-if="isConnected" color="success" small class="ml-2">
        <v-icon left small>mdi-check-circle</v-icon>
        Conectado en tiempo real
      </v-chip>
    </p>

    <!-- Resumen General de Valoraciones -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Calificación Promedio</v-card-title>
          <v-card-text>
            <apexchart type="radialBar" :options="calificacionPromedio.options" :series="calificacionPromedio.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Calificaciones</v-card-title>
          <v-card-text>
            <apexchart type="donut" :options="distribucionCalificaciones.options"
              :series="distribucionCalificaciones.series" height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalles de Calificaciones -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Detalles de Calificaciones</v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Estrellas</th>
                    <th class="text-left">Cantidad</th>
                    <th class="text-left">Porcentaje</th>
                    <th class="text-left">Visualización</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in calificacionesDetalle" :key="index">
                    <td>
                      <v-rating :value="item.valor" dense readonly size="18" color="amber"></v-rating>
                    </td>
                    <td>{{ item.cantidad }}</td>
                    <td>{{ item.porcentaje.toFixed(2) }}%</td>
                    <td>
                      <v-progress-linear :value="item.porcentaje" :color="getColorForRating(item.valor)" height="10"
                        rounded></v-progress-linear>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import axios from 'axios';

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
      chart: { id: "calificacion-promedio" },
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
              formatter: function(val) {
                return (val / 20).toFixed(1); // Convertir de vuelta a escala 0-5
              }
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          gradientToColors: ['#4CAF50'],
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
      labels: calificacionesStats.value.calificaciones.map(c => `${c.valor} Estrellas`),
      colors: ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50'],
      legend: {
        position: 'bottom'
      },
      tooltip: {
        y: {
          formatter: function(val, { seriesIndex, dataPointIndex, w }) {
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
                formatter: function() {
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
    1: '#f44336', // Rojo
    2: '#ff9800', // Naranja
    3: '#ffeb3b', // Amarillo
    4: '#8bc34a', // Verde claro
    5: '#4caf50'  // Verde
  };
  return colors[rating] || '#9e9e9e';
};

// Conectar al WebSocket
const connectWebSocket = () => {
  // Define la URL del WebSocket
  const wsUrl = 'wss://gymtoday1243.com/api/estadisticas/ws/calificaciones';
  
  // Para desarrollo local puedes usar:
  // const wsUrl = 'ws://localhost:8000/api/estadisticas/ws/calificaciones';
  
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
.service-rating-content {
  padding: 2rem;
}
</style>