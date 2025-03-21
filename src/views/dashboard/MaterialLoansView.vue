<template>
  <v-container fluid class="materials-loans-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Préstamos de Materiales</h1>
    <p class="text-subtitle-1">Gestiona los préstamos y devoluciones de materiales del gimnasio.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select v-model="filtroMaterial" :items="materialesDisponibles" label="Filtrar por Material"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtroCliente" label="Buscar Cliente" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroEstado" :items="['Prestado', 'Devuelto']" label="Filtrar por Estado"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Préstamos -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Préstamos</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-package-variant-closed</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Total de Materiales Prestados</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenPrestamos.totalPrestados }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-package-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Materiales Devueltos</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenPrestamos.totalDevueltos }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Materiales Pendientes</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenPrestamos.totalPendientes }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Préstamos por Material</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="distribucionPrestamos.options" :series="distribucionPrestamos.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Préstamos -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Préstamos</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasPrestamos" :items="prestamosFiltrados" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="registrarDevolucion(item)"
                  :disabled="item.estado === 'Devuelto'">
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="cancelarPrestamo(item)">
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
          <v-card-title>Evolución de Préstamos</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="evolucionPrestamos.options" :series="evolucionPrestamos.series"
              height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Comparación de Préstamos por Sucursal</v-card-title>
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
import { ref, computed } from 'vue';

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
  },
  series: [30, 20, 15, 10],
});

const cabecerasPrestamos = [
  { text: 'Cliente', value: 'cliente' },
  { text: 'Material', value: 'material' },
  { text: 'Sucursal', value: 'sucursal' },
  { text: 'Estado', value: 'estado' },
  { text: 'Fecha de Préstamo', value: 'fechaPrestamo' },
  { text: 'Fecha de Devolución', value: 'fechaDevolucion' },
  { text: 'Acciones', value: 'acciones' },
];

const evolucionPrestamos = ref({
  options: {
    chart: { id: "evolucion-prestamos" },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [{ name: 'Préstamos Totales', data: [50, 60, 70, 80, 90] }],
});

const comparacionPrestamos = ref({
  options: {
    chart: { id: "comparacion-prestamos" },
    xaxis: { categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'] },
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
.materials-loans-content {
  padding: 2rem;
}
</style>
