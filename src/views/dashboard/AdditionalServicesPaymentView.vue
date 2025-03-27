<template>
  <v-container fluid class="additional-services-payment-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Cobro de Servicios Adicionales</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Gestiona los pagos de servicios adicionales ofrecidos por el gimnasio.
    </p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6" data-aos="fade-up">
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="100">
        <v-select v-model="filtroSucursal" :items="sucursales" label="Filtrar por Sucursal" clearable outlined
          dense></v-select>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="200">
        <v-select v-model="filtroServicio" :items="serviciosDisponibles" label="Filtrar por Servicio" clearable outlined
          dense></v-select>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="300">
        <v-text-field v-model="filtroCliente" label="Buscar Cliente" clearable outlined dense></v-text-field>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-left" data-aos-delay="400">
        <v-btn color="primary" @click="aplicarFiltros" class="filter-btn" block>
          <v-icon left>mdi-filter</v-icon>
          Aplicar Filtros
        </v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Pagos -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-cash-multiple</v-icon>
            </div>
            <h3 class="text-h6">Resumen de Cobros</h3>
          </div>
          <v-card-text>
            <v-list>
              <v-list-item data-aos="fade-up" data-aos-delay="100">
                <v-list-item-icon>
                  <v-icon color="green">mdi-cash-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Total Recaudado</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenPagos.totalRecaudado }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="200">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Pagos Pendientes</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenPagos.pagosPendientes }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="300">
                <v-list-item-icon>
                  <v-icon color="orange">mdi-alert</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Pagos Retrasados</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenPagos.pagosRetrasados }}</v-list-item-subtitle>
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
            <h3 class="text-h6">Distribución de Pagos por Servicio</h3>
          </div>
          <v-card-text>
            <apexchart type="pie" :options="distribucionPagos.options" :series="distribucionPagos.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Pagos -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-format-list-bulleted</v-icon>
            </div>
            <h3 class="text-h6">Listado de Pagos</h3>
          </div>
          <v-card-text>
            <v-data-table :headers="cabecerasPagos" :items="pagosFiltrados" :items-per-page="5"
              class="elevation-0 recent-table" data-aos="fade-up">
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="registrarPago(item)" data-aos="zoom-in" data-aos-delay="100">
                  <v-icon small>mdi-cash-check</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="cancelarPago(item)" data-aos="zoom-in" data-aos-delay="200">
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
            <h3 class="text-h6">Evolución de Pagos</h3>
          </div>
          <v-card-text>
            <apexchart type="line" :options="evolucionPagos.options" :series="evolucionPagos.series" height="300">
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
            <h3 class="text-h6">Comparación de Pagos por Sucursal</h3>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="comparacionPagos.options" :series="comparacionPagos.series" height="300">
            </apexchart>
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
const sucursales = ['Sucursal A', 'Sucursal B', 'Sucursal C'];
const serviciosDisponibles = ['Clase de Yoga', 'Entrenamiento Personalizado', 'Spa', 'Zona de Pesas'];

const pagos = ref([
  { id: 1, cliente: 'Juan Pérez', servicio: 'Clase de Yoga', sucursal: 'Sucursal A', monto: 50, estado: 'Pagado', fecha: '2023-10-01' },
  { id: 2, cliente: 'María López', servicio: 'Entrenamiento Personalizado', sucursal: 'Sucursal B', monto: 100, estado: 'Pendiente', fecha: '2023-10-02' },
]);

const resumenPagos = ref({
  totalRecaudado: '$150',
  pagosPendientes: 1,
  pagosRetrasados: 0,
});

const distribucionPagos = ref({
  options: {
    labels: ['Clase de Yoga', 'Entrenamiento Personalizado', 'Spa'],
    colors: ['#4caf50', '#2196f3', '#ff9800'],
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
  series: [50, 100, 0],
});

const cabecerasPagos = [
  { text: 'Cliente', value: 'cliente', class: 'table-header' },
  { text: 'Servicio', value: 'servicio', class: 'table-header' },
  { text: 'Sucursal', value: 'sucursal', class: 'table-header' },
  { text: 'Monto', value: 'monto', class: 'table-header' },
  { text: 'Estado', value: 'estado', class: 'table-header' },
  { text: 'Fecha', value: 'fecha', class: 'table-header' },
  { text: 'Acciones', value: 'acciones', class: 'table-header', sortable: false },
];

const evolucionPagos = ref({
  options: {
    chart: {
      id: "evolucion-pagos",
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
  series: [{ name: 'Pagos Totales', data: [500, 600, 700, 800, 900] }],
});

const comparacionPagos = ref({
  options: {
    chart: {
      id: "comparacion-pagos",
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
  series: [{ name: 'Pagos Totales', data: [500, 300, 200] }],
});

const alertas = ref([
  { mensaje: 'El cliente María López tiene un pago pendiente desde el 2 de octubre.', tipo: 'warning' },
  { mensaje: 'No hay pagos retrasados actualmente.', tipo: 'info' },
]);

// Estados de filtros
const filtroSucursal = ref('');
const filtroServicio = ref('');
const filtroCliente = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroSucursal.value, filtroServicio.value, filtroCliente.value);
};

const registrarPago = (item) => {
  console.log('Registrar pago para:', item.cliente);
};

const cancelarPago = (item) => {
  console.log('Cancelar pago para:', item.cliente);
};

// Computadas
const pagosFiltrados = computed(() => {
  return pagos.value.filter(
    (p) =>
      (!filtroSucursal.value || p.sucursal === filtroSucursal.value) &&
      (!filtroServicio.value || p.servicio === filtroServicio.value) &&
      (!filtroCliente.value || p.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase()))
  );
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.additional-services-payment-content {
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
