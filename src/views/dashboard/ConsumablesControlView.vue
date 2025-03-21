<template>
  <v-container fluid class="consumables-control-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Control de Consumibles</h1>
    <p class="text-subtitle-1">Gestiona el inventario y el uso de consumibles del gimnasio.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select v-model="filtroCategoria" :items="categoriasConsumibles" label="Filtrar por Categoría"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtroNombre" label="Buscar por Nombre" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroEstado" :items="['En Stock', 'Por Agotarse', 'Agotado']" label="Filtrar por Estado"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Inventario -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Inventario</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-package-variant-closed</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Total de Consumibles en Stock</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenInventario.totalEnStock }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Consumibles Por Agotarse</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenInventario.porAgotarse }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="red">mdi-close-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Consumibles Agotados</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenInventario.agotados }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Consumibles por Categoría</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="distribucionConsumibles.options" :series="distribucionConsumibles.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Consumibles -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Consumibles</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasConsumibles" :items="consumiblesFiltrados" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="agregarStock(item)">
                  <v-icon small>mdi-plus-box</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="reducirStock(item)">
                  <v-icon small>mdi-minus-box</v-icon>
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
          <v-card-title>Uso de Consumibles en el Tiempo</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="usoConsumibles.options" :series="usoConsumibles.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Comparación de Consumibles por Sucursal</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="comparacionConsumibles.options" :series="comparacionConsumibles.series"
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
const categoriasConsumibles = ['Toallas', 'Botellas de Agua', 'Suplementos', 'Otros'];
const consumibles = ref([
  { id: 1, nombre: 'Toalla Pequeña', categoria: 'Toallas', stock: 50, estado: 'En Stock' },
  { id: 2, nombre: 'Botella de Agua 500ml', categoria: 'Botellas de Agua', stock: 20, estado: 'Por Agotarse' },
  { id: 3, nombre: 'Proteína Whey', categoria: 'Suplementos', stock: 0, estado: 'Agotado' },
]);

const resumenInventario = ref({
  totalEnStock: 70,
  porAgotarse: 10,
  agotados: 5,
});

const distribucionConsumibles = ref({
  options: {
    labels: ['Toallas', 'Botellas de Agua', 'Suplementos', 'Otros'],
    colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
  },
  series: [50, 20, 10, 5],
});

const cabecerasConsumibles = [
  { text: 'Nombre', value: 'nombre' },
  { text: 'Categoría', value: 'categoria' },
  { text: 'Stock', value: 'stock' },
  { text: 'Estado', value: 'estado' },
  { text: 'Acciones', value: 'acciones' },
];

const usoConsumibles = ref({
  options: {
    chart: { id: "uso-consumibles" },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [{ name: 'Uso Total', data: [50, 60, 70, 80, 90] }],
});

const comparacionConsumibles = ref({
  options: {
    chart: { id: "comparacion-consumibles" },
    xaxis: { categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'] },
  },
  series: [{ name: 'Consumibles Usados', data: [50, 30, 20] }],
});

const alertas = ref([
  { mensaje: 'El producto "Botella de Agua 500ml" está por agotarse.', tipo: 'warning' },
  { mensaje: 'El producto "Proteína Whey" está agotado.', tipo: 'error' },
]);

// Estados de filtros
const filtroCategoria = ref('');
const filtroNombre = ref('');
const filtroEstado = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroCategoria.value, filtroNombre.value, filtroEstado.value);
};

const agregarStock = (item) => {
  console.log('Agregar stock para:', item.nombre);
  const index = consumibles.value.findIndex((c) => c.id === item.id);
  if (index !== -1) {
    consumibles.value[index].stock += 10; // Incrementar stock en 10 unidades
    actualizarEstado(consumibles.value[index]);
  }
};

const reducirStock = (item) => {
  console.log('Reducir stock para:', item.nombre);
  const index = consumibles.value.findIndex((c) => c.id === item.id);
  if (index !== -1) {
    consumibles.value[index].stock -= 10; // Reducir stock en 10 unidades
    actualizarEstado(consumibles.value[index]);
  }
};

const actualizarEstado = (item) => {
  if (item.stock > 10) {
    item.estado = 'En Stock';
  } else if (item.stock > 0) {
    item.estado = 'Por Agotarse';
  } else {
    item.estado = 'Agotado';
  }
};

// Computadas
const consumiblesFiltrados = computed(() => {
  return consumibles.value.filter(
    (c) =>
      (!filtroCategoria.value || c.categoria === filtroCategoria.value) &&
      (!filtroNombre.value || c.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase())) &&
      (!filtroEstado.value || c.estado === filtroEstado.value)
  );
});
</script>

<style scoped lang="scss">
.consumables-control-content {
  padding: 2rem;
}
</style>
