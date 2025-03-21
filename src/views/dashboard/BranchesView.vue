<template>
  <v-container fluid class="branches-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Gestión de Sucursales</h1>
    <p class="text-subtitle-1">Administra las sucursales del gimnasio y visualiza estadísticas clave.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-text-field v-model="filtroNombre" label="Buscar por Nombre o Dirección" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroEstado" :items="['Activo', 'Inactivo']" label="Filtrar por Estado"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Sucursales -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Sucursales</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-storefront</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Total de Sucursales Activas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenSucursales.totalActivas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="red">mdi-storefront-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Total de Sucursales Inactivas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenSucursales.totalInactivas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Clientes por Sucursal</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="distribucionClientes.options" :series="distribucionClientes.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Sucursales -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Sucursales</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasSucursales" :items="sucursalesFiltradas" :items-per-page="5"
              class="elevation-1">
              <!-- Columna de Estado (Editable) -->
              <template #item.estado="{ item }">
                <v-switch v-model="item.estado" :label="item.estado ? 'Activo' : 'Inactivo'" true-value="Activo"
                  false-value="Inactivo" @change="actualizarEstado(item)"></v-switch>
              </template>

              <!-- Acciones -->
              <template #item.acciones="{ item }">
                <v-btn icon small color="info" @click="editarSucursal(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarSucursal(item)">
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
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// Datos de ejemplo
const sucursales = ref([
  { id: 1, nombre: 'Sucursal A', direccion: 'Av. Principal 123', estado: 'Activo', clientes: 150 },
  { id: 2, nombre: 'Sucursal B', direccion: 'Calle Secundaria 456', estado: 'Inactivo', clientes: 80 },
  { id: 3, nombre: 'Sucursal C', direccion: 'Plaza Central 789', estado: 'Activo', clientes: 200 },
]);

const resumenSucursales = ref({
  totalActivas: 2,
  totalInactivas: 1,
});

const distribucionClientes = ref({
  options: {
    chart: { id: "distribucion-clientes" },
    xaxis: { categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'] },
  },
  series: [{ name: 'Clientes', data: [150, 80, 200] }],
});

const cabecerasSucursales = [
  { text: 'ID', value: 'id' },
  { text: 'Nombre', value: 'nombre' },
  { text: 'Dirección', value: 'direccion' },
  { text: 'Estado', value: 'estado' },
  { text: 'Clientes Registrados', value: 'clientes' },
  { text: 'Acciones', value: 'acciones', sortable: false },
];

const alertas = ref([
  { mensaje: 'La sucursal B ha sido marcada como inactiva.', tipo: 'warning' },
  { mensaje: 'La sucursal C tiene más de 100 clientes registrados.', tipo: 'info' },
]);

// Estados de filtros
const filtroNombre = ref('');
const filtroEstado = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroNombre.value, filtroEstado.value);
};

const actualizarEstado = (sucursal) => {
  console.log(`Estado actualizado para ${sucursal.nombre}:`, sucursal.estado);
  alertas.value.push({
    mensaje: `El estado de la sucursal ${sucursal.nombre} ha sido actualizado a "${sucursal.estado}".`,
    tipo: 'success',
  });
};

const editarSucursal = (sucursal) => {
  console.log('Editar sucursal:', sucursal.nombre);
  alertas.value.push({
    mensaje: `Editar información de la sucursal ${sucursal.nombre}.`,
    tipo: 'info',
  });
};

const eliminarSucursal = (sucursal) => {
  console.log('Eliminar sucursal:', sucursal.nombre);
  const index = sucursales.value.findIndex((s) => s.id === sucursal.id);
  if (index !== -1) {
    sucursales.value.splice(index, 1);
    alertas.value.push({
      mensaje: `La sucursal ${sucursal.nombre} ha sido eliminada.`,
      tipo: 'error',
    });
  }
};

// Computadas
const sucursalesFiltradas = computed(() => {
  return sucursales.value.filter(
    (s) =>
      (!filtroNombre.value ||
        s.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase()) ||
        s.direccion.toLowerCase().includes(filtroNombre.value.toLowerCase())) &&
      (!filtroEstado.value || s.estado === filtroEstado.value)
  );
});
</script>

<style scoped lang="scss">
.branches-content {
  padding: 2rem;
}
</style>
