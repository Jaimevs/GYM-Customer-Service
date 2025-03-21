<template>
  <v-container fluid class="support-resolution-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Atención y Resolución</h1>
    <p class="text-subtitle-1">Gestiona las solicitudes de soporte, consultas y reclamos de los clientes.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select v-model="filtroTipo" :items="tiposSolicitud" label="Filtrar por Tipo" clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtroCliente" label="Buscar Cliente" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroEstado" :items="['Abierto', 'En Proceso', 'Resuelto']" label="Filtrar por Estado"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Solicitudes -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Solicitudes</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-help-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Total de Solicitudes Abiertas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenSolicitudes.totalAbiertas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-progress-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Solicitudes en Proceso</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenSolicitudes.enProceso }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Solicitudes Resueltas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenSolicitudes.resueltas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Solicitudes por Tipo</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="distribucionSolicitudes.options" :series="distribucionSolicitudes.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Solicitudes -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Solicitudes</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasSolicitudes" :items="solicitudesFiltradas" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="resolverSolicitud(item)">
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
                <v-btn icon small color="info" @click="editarSolicitud(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarSolicitud(item)">
                  <v-icon small>mdi-delete</v-icon>
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
          <v-card-title>Tiempos de Resolución en el Tiempo</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="tiemposResolucion.options" :series="tiemposResolucion.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Comparación de Solicitudes por Sucursal</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="comparacionSolicitudes.options" :series="comparacionSolicitudes.series"
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
const tiposSolicitud = ['Consulta', 'Reclamo', 'Sugerencia', 'Soporte Técnico'];
const solicitudes = ref([
  { id: 1, cliente: 'Juan Pérez', tipo: 'Consulta', estado: 'Abierto', fecha: '2023-10-01', sucursal: 'Sucursal A' },
  { id: 2, cliente: 'María López', tipo: 'Reclamo', estado: 'En Proceso', fecha: '2023-10-02', sucursal: 'Sucursal B' },
  { id: 3, cliente: 'Pedro Ramírez', tipo: 'Sugerencia', estado: 'Resuelto', fecha: '2023-09-28', sucursal: 'Sucursal C' },
]);

const resumenSolicitudes = ref({
  totalAbiertas: 1,
  enProceso: 1,
  resueltas: 1,
});

const distribucionSolicitudes = ref({
  options: {
    labels: ['Consulta', 'Reclamo', 'Sugerencia', 'Soporte Técnico'],
    colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
  },
  series: [1, 1, 1, 0],
});

const cabecerasSolicitudes = [
  { text: 'Cliente', value: 'cliente' },
  { text: 'Tipo', value: 'tipo' },
  { text: 'Estado', value: 'estado' },
  { text: 'Fecha', value: 'fecha' },
  { text: 'Sucursal', value: 'sucursal' },
  { text: 'Acciones', value: 'acciones' },
];

const tiemposResolucion = ref({
  options: {
    chart: { id: "tiempos-resolucion" },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [{ name: 'Tiempos Promedio (días)', data: [2, 3, 1, 4, 2] }],
});

const comparacionSolicitudes = ref({
  options: {
    chart: { id: "comparacion-solicitudes" },
    xaxis: { categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'] },
  },
  series: [{ name: 'Solicitudes Totales', data: [5, 3, 2] }],
});

const alertas = ref([
  { mensaje: 'La solicitud de Juan Pérez está sin resolver.', tipo: 'warning' },
  { mensaje: 'La solicitud de Pedro Ramírez ha sido resuelta.', tipo: 'info' },
]);

// Estados de filtros
const filtroTipo = ref('');
const filtroCliente = ref('');
const filtroEstado = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroTipo.value, filtroCliente.value, filtroEstado.value);
};

const resolverSolicitud = (item) => {
  console.log('Resolver solicitud para:', item.cliente);
  const index = solicitudes.value.findIndex((s) => s.id === item.id);
  if (index !== -1) {
    solicitudes.value[index].estado = 'Resuelto';
  }
};

const editarSolicitud = (item) => {
  console.log('Editar solicitud para:', item.cliente);
};

const eliminarSolicitud = (item) => {
  console.log('Eliminar solicitud para:', item.cliente);
  const index = solicitudes.value.findIndex((s) => s.id === item.id);
  if (index !== -1) {
    solicitudes.value.splice(index, 1);
  }
};

// Computadas
const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter(
    (s) =>
      (!filtroTipo.value || s.tipo === filtroTipo.value) &&
      (!filtroCliente.value || s.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase())) &&
      (!filtroEstado.value || s.estado === filtroEstado.value)
  );
});
</script>

<style scoped lang="scss">
.support-resolution-content {
  padding: 2rem;
}
</style>
