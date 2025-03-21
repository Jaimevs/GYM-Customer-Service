<template>
  <v-container fluid class="appointments-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Gestión de Citas</h1>
    <p class="text-subtitle-1">Administra las citas programadas por los clientes en el gimnasio.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select v-model="filtroServicio" :items="serviciosDisponibles" label="Filtrar por Servicio"
          clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtroCliente" label="Buscar Cliente" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-menu v-model="menuFecha" :close-on-content-click="false" transition="scale-transition" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="filtroFecha" label="Filtrar por Fecha" prepend-icon="mdi-calendar" readonly
              v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="filtroFecha" no-title @input="menuFecha = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Citas -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Citas</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-calendar-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Citas Programadas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenCitas.totalProgramadas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-calendar-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Citas Pendientes</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenCitas.totalPendientes }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="red">mdi-calendar-remove</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Citas Canceladas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenCitas.totalCanceladas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Citas por Servicio</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="distribucionCitas.options" :series="distribucionCitas.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Citas -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Citas</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasCitas" :items="citasFiltradas" :items-per-page="5" class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="confirmarCita(item)">
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="cancelarCita(item)">
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
          <v-card-title>Evolución de Citas en el Tiempo</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="evolucionCitas.options" :series="evolucionCitas.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Comparación de Citas por Sucursal</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="comparacionCitas.options" :series="comparacionCitas.series" height="300">
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
const serviciosDisponibles = ['Clase de Yoga', 'Entrenamiento Personalizado', 'Spa', 'Zona de Pesas'];
const citas = ref([
  { id: 1, cliente: 'Juan Pérez', servicio: 'Clase de Yoga', fecha: '2023-10-01', estado: 'Programada', sucursal: 'Sucursal A' },
  { id: 2, cliente: 'María López', servicio: 'Entrenamiento Personalizado', fecha: '2023-10-02', estado: 'Cancelada', sucursal: 'Sucursal B' },
]);

const resumenCitas = ref({
  totalProgramadas: 5,
  totalPendientes: 2,
  totalCanceladas: 1,
});

const distribucionCitas = ref({
  options: {
    labels: ['Clase de Yoga', 'Entrenamiento Personalizado', 'Spa', 'Zona de Pesas'],
    colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
  },
  series: [3, 2, 1, 0],
});

const cabecerasCitas = [
  { text: 'Cliente', value: 'cliente' },
  { text: 'Servicio', value: 'servicio' },
  { text: 'Fecha', value: 'fecha' },
  { text: 'Estado', value: 'estado' },
  { text: 'Sucursal', value: 'sucursal' },
  { text: 'Acciones', value: 'acciones' },
];

const evolucionCitas = ref({
  options: {
    chart: { id: "evolucion-citas" },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [{ name: 'Citas Totales', data: [50, 60, 70, 80, 90] }],
});

const comparacionCitas = ref({
  options: {
    chart: { id: "comparacion-citas" },
    xaxis: { categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'] },
  },
  series: [{ name: 'Citas Totales', data: [50, 30, 20] }],
});

const alertas = ref([
  { mensaje: 'El cliente Juan Pérez tiene una cita pendiente para hoy.', tipo: 'warning' },
  { mensaje: 'La clase de Yoga del 1 de octubre está completa.', tipo: 'info' },
]);

// Estados de filtros
const filtroServicio = ref('');
const filtroCliente = ref('');
const filtroFecha = ref('');
const menuFecha = ref(false);

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroServicio.value, filtroCliente.value, filtroFecha.value);
};

const confirmarCita = (item) => {
  console.log('Confirmar cita para:', item.cliente);
  const index = citas.value.findIndex((c) => c.id === item.id);
  if (index !== -1) {
    citas.value[index].estado = 'Programada';
  }
};

const cancelarCita = (item) => {
  console.log('Cancelar cita para:', item.cliente);
  const index = citas.value.findIndex((c) => c.id === item.id);
  if (index !== -1) {
    citas.value[index].estado = 'Cancelada';
  }
};

// Computadas
const citasFiltradas = computed(() => {
  return citas.value.filter(
    (c) =>
      (!filtroServicio.value || c.servicio === filtroServicio.value) &&
      (!filtroCliente.value || c.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase())) &&
      (!filtroFecha.value || c.fecha === filtroFecha.value)
  );
});
</script>

<style scoped lang="scss">
.appointments-content {
  padding: 2rem;
}
</style>
