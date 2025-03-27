<template>
  <v-container fluid class="materials-loans-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Préstamos de Materiales</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Gestiona los préstamos y devoluciones de materiales del gimnasio.
    </p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6" data-aos="fade-up">
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="100">
        <v-select v-model="filtroMaterial" :items="materialesDisponibles" label="Filtrar por Material" clearable
          outlined dense></v-select>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="200">
        <v-text-field v-model="filtroCliente" label="Buscar Cliente" clearable outlined dense></v-text-field>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="300">
        <v-select v-model="filtroEstado" :items="['Prestado', 'Devuelto']" label="Filtrar por Estado" clearable outlined
          dense></v-select>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-left" data-aos-delay="400">
        <v-btn color="primary" @click="aplicarFiltros" class="filter-btn" block>
          <v-icon left>mdi-filter</v-icon>
          Aplicar Filtros
        </v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Préstamos -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-package-variant-closed</v-icon>
            </div>
            <h3 class="text-h6">Resumen de Préstamos</h3>
          </div>
          <v-card-text>
            <v-list>
              <v-list-item data-aos="fade-up" data-aos-delay="100">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-package-variant-closed</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Total de Materiales Prestados</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenPrestamos.totalPrestados
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="200">
                <v-list-item-icon>
                  <v-icon color="green">mdi-package-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Materiales Devueltos</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenPrestamos.totalDevueltos
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="300">
                <v-list-item-icon>
                  <v-icon color="orange">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Materiales Pendientes</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenPrestamos.totalPendientes
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-chart-pie</v-icon>
            </div>
            <h3 class="text-h6">Distribución de Préstamos por Material</h3>
          </div>
          <v-card-text>
            <apexchart type="pie" :options="distribucionPrestamos.options" :series="distribucionPrestamos.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Préstamos -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-format-list-bulleted</v-icon>
            </div>
            <h3 class="text-h6">Listado de Préstamos</h3>
          </div>
          <v-card-text>
            <v-data-table :headers="cabecerasPrestamos" :items="prestamosFiltrados" :items-per-page="5"
              class="elevation-0 recent-table" data-aos="fade-up">
              <template #item.estado="{ item }">
                <v-chip small :color="getEstadoColor(item.estado)" dark>
                  {{ item.estado }}
                </v-chip>
              </template>
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="registrarDevolucion(item)"
                  :disabled="item.estado === 'Devuelto'" data-aos="zoom-in" data-aos-delay="100">
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="cancelarPrestamo(item)" data-aos="zoom-in" data-aos-delay="200">
                  <v-icon small>mdi-cancel</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas y Notificaciones -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-bell</v-icon>
            </div>
            <h3 class="text-h6">Alertas y Notificaciones</h3>
          </div>
          <v-card-text>
            <v-alert v-for="(alerta, index) in alertas" :key="index" :type="alerta.tipo" dense outlined
              :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'" :data-aos-delay="100 * (index + 1)">
              {{ alerta.mensaje }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reportes y Estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="100">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-chart-line</v-icon>
            </div>
            <h3 class="text-h6">Evolución de Préstamos</h3>
          </div>
          <v-card-text>
            <apexchart type="line" :options="evolucionPrestamos.options" :series="evolucionPrestamos.series"
              height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="200">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-chart-bar</v-icon>
            </div>
            <h3 class="text-h6">Comparación de Préstamos por Sucursal</h3>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="comparacionPrestamos.options" :series="comparacionPrestamos.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Inicializar AOS
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out-quad',
    once: true,
    offset: 50
  });
});

// Datos de ejemplo
const materialesDisponibles = ['Pesas', 'Colchoneta', 'Banda Elástica', 'Mancuernas', 'Pelota Suiza'];
const prestamos = ref([
  { id: 1, cliente: 'Juan Pérez', material: 'Pesas', sucursal: 'Sucursal A', estado: 'Prestado', fechaPrestamo: '2023-10-01', fechaDevolucion: '' },
  { id: 2, cliente: 'María López', material: 'Colchoneta', sucursal: 'Sucursal B', estado: 'Devuelto', fechaPrestamo: '2023-10-02', fechaDevolucion: '2023-10-03' },
]);

const resumenPrestamos = ref({
  totalPrestados: 5,
  totalDevueltos: 3,
  totalPendientes: 2,
});

const distribucionPrestamos = ref({
  options: {
    labels: ['Pesas', 'Colchoneta', 'Banda Elástica', 'Mancuernas'],
    colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
    chart: {
      foreColor: 'var(--color-texto-principal)'
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: 'var(--color-texto-principal)'
      }
    }
  },
  series: [30, 20, 15, 10],
});

const cabecerasPrestamos = [
  { text: 'Cliente', value: 'cliente', class: 'table-header' },
  { text: 'Material', value: 'material', class: 'table-header' },
  { text: 'Sucursal', value: 'sucursal', class: 'table-header' },
  { text: 'Estado', value: 'estado', class: 'table-header' },
  { text: 'Fecha de Préstamo', value: 'fechaPrestamo', class: 'table-header' },
  { text: 'Fecha de Devolución', value: 'fechaDevolucion', class: 'table-header' },
  { text: 'Acciones', value: 'acciones', class: 'table-header', sortable: false },
];

const evolucionPrestamos = ref({
  options: {
    chart: {
      id: "evolucion-prestamos",
      foreColor: 'var(--color-texto-principal)'
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    colors: ['var(--color-grafica-rojo-fuego)'],
    tooltip: {
      theme: 'dark'
    }
  },
  series: [{ name: 'Préstamos Totales', data: [50, 60, 70, 80, 90] }],
});

const comparacionPrestamos = ref({
  options: {
    chart: {
      id: "comparacion-prestamos",
      foreColor: 'var(--color-texto-principal)'
    },
    xaxis: {
      categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'],
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    colors: ['var(--color-grafica-rojo-fuego)'],
    tooltip: {
      theme: 'dark'
    }
  },
  series: [{ name: 'Préstamos Totales', data: [50, 30, 20] }],
});

const alertas = ref([
  { mensaje: 'El cliente Juan Pérez tiene un material pendiente de devolución.', tipo: 'warning' },
  { mensaje: 'No hay préstamos pendientes actualmente.', tipo: 'info' },
]);

// Estados de filtros
const filtroMaterial = ref('');
const filtroCliente = ref('');
const filtroEstado = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroMaterial.value, filtroCliente.value, filtroEstado.value);
};

const registrarDevolucion = (item) => {
  console.log('Registrar devolución para:', item.cliente);
  const index = prestamos.value.findIndex((p) => p.id === item.id);
  if (index !== -1) {
    prestamos.value[index].estado = 'Devuelto';
    prestamos.value[index].fechaDevolucion = new Date().toISOString().split('T')[0];
  }
};

const cancelarPrestamo = (item) => {
  console.log('Cancelar préstamo para:', item.cliente);
  const index = prestamos.value.findIndex((p) => p.id === item.id);
  if (index !== -1) {
    prestamos.value.splice(index, 1);
  }
};

const getEstadoColor = (estado) => {
  return estado === 'Prestado' ? 'orange' : 'green';
};

// Computadas
const prestamosFiltrados = computed(() => {
  return prestamos.value.filter(
    (p) =>
      (!filtroMaterial.value || p.material === filtroMaterial.value) &&
      (!filtroCliente.value || p.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase())) &&
      (!filtroEstado.value || p.estado === filtroEstado.value)
  );
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.materials-loans-content {
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

.filter-btn {
  height: 40px;
}

.chart-card {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #E0E0E0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .chart-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 8px;

    h3 {
      margin: 0;
      color: #333333;
      font-weight: 600;
      font-family: var(--fuente-titulo);
    }

    .chart-icon-bg {
      width: 40px;
      height: 40px;
      background: rgba(255, 43, 0, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: var(--color-grafica-rojo-fuego);
    }
  }
}

.summary-title {
  font-weight: 600;
  font-family: var(--fuente-titulo);
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-texto-principal);
}

.recent-table {
  th {
    background-color: #F5F5F5 !important;
    color: #333333 !important;
    font-family: var(--fuente-titulo);
  }

  td {
    background-color: #FFFFFF !important;
    color: #333333 !important;
    font-family: var(--fuente-principal);
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

  .chart-card {
    .chart-header {
      flex-direction: column;
      align-items: flex-start;

      .chart-icon-bg {
        margin-bottom: 8px;
        margin-right: 0;
      }
    }
  }
}
</style>
