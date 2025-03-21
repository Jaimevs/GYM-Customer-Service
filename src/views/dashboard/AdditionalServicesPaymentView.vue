<template>
  <v-container fluid class="additional-services-payment-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Cobro de Servicios Adicionales</h1>
    <p class="text-subtitle-1">Gestiona los pagos de servicios adicionales ofrecidos por el gimnasio.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select v-model="filtroSucursal" :items="sucursales" label="Filtrar por Sucursal" clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroServicio" :items="serviciosDisponibles" label="Filtrar por Servicio"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtroCliente" label="Buscar Cliente" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Pagos -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Cobros</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-cash-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Total Recaudado</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenPagos.totalRecaudado }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-account-cash</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Pagos Pendientes</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenPagos.pagosPendientes }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Pagos Retrasados</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenPagos.pagosRetrasados }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Pagos por Servicio</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="distribucionPagos.options" :series="distribucionPagos.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Pagos -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Pagos</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasPagos" :items="pagosFiltrados" :items-per-page="5" class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="registrarPago(item)">
                  <v-icon small>mdi-cash-check</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="cancelarPago(item)">
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
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Alertas y Notificaciones</v-card-title>
          <v-card-text>
            <v-alert v-for="(alerta, index) in alertas" :key="index" :type="alerta.tipo" dense outlined>
              {{ alerta.mensaje }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reportes y Estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Evolución de Pagos</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="evolucionPagos.options" :series="evolucionPagos.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Comparación de Pagos por Sucursal</v-card-title>
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
import { ref, computed } from 'vue';

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
  },
  series: [50, 100, 0],
});

const cabecerasPagos = [
  { text: 'Cliente', value: 'cliente' },
  { text: 'Servicio', value: 'servicio' },
  { text: 'Sucursal', value: 'sucursal' },
  { text: 'Monto', value: 'monto' },
  { text: 'Estado', value: 'estado' },
  { text: 'Fecha', value: 'fecha' },
  { text: 'Acciones', value: 'acciones' },
];

const evolucionPagos = ref({
  options: {
    chart: { id: "evolucion-pagos" },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [{ name: 'Pagos Totales', data: [500, 600, 700, 800, 900] }],
});

const comparacionPagos = ref({
  options: {
    chart: { id: "comparacion-pagos" },
    xaxis: { categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'] },
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
.additional-services-payment-content {
  padding: 2rem;
}
</style>
