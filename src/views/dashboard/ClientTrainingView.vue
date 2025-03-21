<template>
  <v-container fluid class="client-training-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Capacitación al Cliente</h1>
    <p class="text-subtitle-1">Administra y ofrece recursos de capacitación para los clientes del gimnasio.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select v-model="filtroCategoria" :items="categoriasCapacitacion" label="Filtrar por Categoría"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtroNombre" label="Buscar por Nombre" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroEstado" :items="['Disponible', 'En Proceso', 'Completado']" label="Filtrar por Estado"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Capacitación -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Capacitación</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-book-open-page-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Total de Recursos Disponibles</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenCapacitacion.totalRecursos }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-progress-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Recursos en Proceso</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenCapacitacion.enProceso }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Recursos Completados</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenCapacitacion.completados }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Recursos por Categoría</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="distribucionRecursos.options" :series="distribucionRecursos.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Recursos -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Recursos de Capacitación</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasRecursos" :items="recursosFiltrados" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="completarRecurso(item)">
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
                <v-btn icon small color="info" @click="editarRecurso(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarRecurso(item)">
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
          <v-card-title>Progreso de Capacitación en el Tiempo</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="progresoCapacitacion.options" :series="progresoCapacitacion.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Comparación de Uso de Recursos por Sucursal</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="comparacionUsoRecursos.options" :series="comparacionUsoRecursos.series"
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
const categoriasCapacitacion = ['Nutrición', 'Entrenamiento', 'Bienestar', 'Tecnología'];
const recursos = ref([
  { id: 1, nombre: 'Guía de Nutrición Básica', categoria: 'Nutrición', estado: 'Disponible', fechaCreacion: '2023-09-01' },
  { id: 2, nombre: 'Rutina de Entrenamiento Avanzada', categoria: 'Entrenamiento', estado: 'En Proceso', fechaCreacion: '2023-09-15' },
  { id: 3, nombre: 'Meditación Guiada para Principiantes', categoria: 'Bienestar', estado: 'Completado', fechaCreacion: '2023-08-20' },
]);

const resumenCapacitacion = ref({
  totalRecursos: 3,
  enProceso: 1,
  completados: 1,
});

const distribucionRecursos = ref({
  options: {
    labels: ['Nutrición', 'Entrenamiento', 'Bienestar', 'Tecnología'],
    colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
  },
  series: [1, 1, 1, 0],
});

const cabecerasRecursos = [
  { text: 'Nombre', value: 'nombre' },
  { text: 'Categoría', value: 'categoria' },
  { text: 'Estado', value: 'estado' },
  { text: 'Fecha de Creación', value: 'fechaCreacion' },
  { text: 'Acciones', value: 'acciones' },
];

const progresoCapacitacion = ref({
  options: {
    chart: { id: "progreso-capacitacion" },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [{ name: 'Recursos Completados', data: [5, 10, 15, 20, 25] }],
});

const comparacionUsoRecursos = ref({
  options: {
    chart: { id: "comparacion-uso-recursos" },
    xaxis: { categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'] },
  },
  series: [{ name: 'Recursos Usados', data: [50, 30, 20] }],
});

const alertas = ref([
  { mensaje: 'El recurso "Rutina de Entrenamiento Avanzada" está en proceso.', tipo: 'warning' },
  { mensaje: 'El cliente Juan Pérez ha completado la guía de nutrición básica.', tipo: 'info' },
]);

// Estados de filtros
const filtroCategoria = ref('');
const filtroNombre = ref('');
const filtroEstado = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroCategoria.value, filtroNombre.value, filtroEstado.value);
};

const completarRecurso = (item) => {
  console.log('Marcar como completado:', item.nombre);
  const index = recursos.value.findIndex((r) => r.id === item.id);
  if (index !== -1) {
    recursos.value[index].estado = 'Completado';
  }
};

const editarRecurso = (item) => {
  console.log('Editar recurso:', item.nombre);
};

const eliminarRecurso = (item) => {
  console.log('Eliminar recurso:', item.nombre);
  const index = recursos.value.findIndex((r) => r.id === item.id);
  if (index !== -1) {
    recursos.value.splice(index, 1);
  }
};

// Computadas
const recursosFiltrados = computed(() => {
  return recursos.value.filter(
    (r) =>
      (!filtroCategoria.value || r.categoria === filtroCategoria.value) &&
      (!filtroNombre.value || r.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase())) &&
      (!filtroEstado.value || r.estado === filtroEstado.value)
  );
});
</script>

<style scoped lang="scss">
.client-training-content {
  padding: 2rem;
}
</style>
