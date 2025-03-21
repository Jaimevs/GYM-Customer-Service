/* --- DashboardView.vue --- */
<template>
  <div class="dashboard-content">
    <!-- Título del Dashboard -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Dashboard General</h1>
        <p class="text-subtitle-1">Vista general del estado de la cadena de gimnasios.</p>
      </v-col>
    </v-row>

    <!-- Resumen General -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="pa-4" color="primary" dark>
          <v-card-title class="text-h6">
            <Icon icon="solar:shop-outline" class="mr-2" /> Sucursales Activas
          </v-card-title>
          <v-card-text class="text-h4">15</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4" color="secondary" dark>
          <v-card-title class="text-h6">
            <Icon icon="solar:users-group-two-rounded-outline" class="mr-2" /> Miembros Activos
          </v-card-title>
          <v-card-text class="text-h4">1,250</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4" color="success" dark>
          <v-card-title class="text-h6">
            <Icon icon="solar:user-plus-outline" class="mr-2" /> Nuevos Ingresos
          </v-card-title>
          <v-card-text class="text-h4">120</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-4" color="warning" dark>
          <v-card-title class="text-h6">
            <Icon icon="solar:users-group-rounded-outline" class="mr-2" /> Empleados
          </v-card-title>
          <v-card-text class="text-h4">85</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos Interactivos -->
    <v-row class="mb-6">
      <!-- Gráfico de Ingresos Mensuales (Line Chart) -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <Icon icon="lucide:chart-line" class="mr-2" /> Ingresos Mensuales
          </v-card-title>
          <v-card-text>
            <apexchart type="line" :options="ingresosMensuales.options" :series="ingresosMensuales.series"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de Nuevas Inscripciones (Bar Chart) -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <Icon icon="ion:bar-chart-outline" class="mr-2" /> Nuevas Inscripciones
          </v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="nuevasInscripciones.options" :series="nuevasInscripciones.series">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos adicionales -->
    <v-row class="mb-6">
      <!-- Gráfico de Distribución de Membresías (Pie Chart) -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <Icon icon="solar:pie-chart-outline" class="mr-2" /> Distribución de Membresías
          </v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="distribucionMembresias.options" :series="distribucionMembresias.series">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de Actividad por Sucursal (Radar Chart) -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <Icon icon="solar:radar-outline" class="mr-2" /> Actividad por Sucursal
          </v-card-title>
          <v-card-text>
            <apexchart type="radar" :options="actividadSucursal.options" :series="actividadSucursal.series"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de Stock (Heatmap Chart) -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <Icon icon="solar:layers-outline" class="mr-2" /> Stock de Productos
          </v-card-title>
          <v-card-text>
            <apexchart type="heatmap" :options="stockProductos.options" :series="stockProductos.series"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actividad Reciente -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <Icon icon="solar:clock-circle-outline" class="mr-2" /> Actividad Reciente
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="actividadRecienteHeaders" :items="actividadReciente" :items-per-page="5"
              class="elevation-1"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas y Recordatorios -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <Icon icon="solar:bell-bing-outline" class="mr-2" /> Alertas y Recordatorios
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(alerta, index) in alertas" :key="index">
                <v-list-item-icon>
                  <Icon icon="solar:alert-circle-outline" class="mr-2" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ alerta.titulo }}</v-list-item-title>
                  <v-list-item-subtitle>{{ alerta.descripcion }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Atajos Rápidos -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <Icon icon="solar:rocket-outline" class="mr-2" /> Atajos Rápidos
          </v-card-title>
          <v-card-text>
            <v-btn color="primary" class="mr-2" @click="nuevoCliente">
              <Icon icon="solar:user-plus-outline" class="mr-2" /> Nuevo Cliente
            </v-btn>
            <v-btn color="secondary" class="mr-2" @click="nuevoPago">
              <Icon icon="solar:dollar-outline" class="mr-2" /> Nuevo Pago
            </v-btn>
            <v-btn color="success" @click="agendarCita">
              <Icon icon="solar:calendar-outline" class="mr-2" /> Agendar Cita
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

// Datos para gráficos
const ingresosMensuales = ref({
  options: {
    chart: {
      id: 'ingresos-mensuales',
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    },
  },
  series: [
    {
      name: 'Ingresos',
      data: [3000, 4000, 3500, 5000, 4900, 6000, 7000, 9000, 8500, 8000, 7500, 10000],
    },
  ],
});

const nuevasInscripciones = ref({
  options: {
    chart: {
      id: 'nuevas-inscripciones',
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    },
  },
  series: [
    {
      name: 'Inscripciones',
      data: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
    },
  ],
});

const distribucionMembresias = ref({
  options: {
    labels: ['Básica', 'Premium', 'VIP'],
  },
  series: [45, 30, 25],
});

const actividadSucursal = ref({
  options: {
    chart: {
      id: 'actividad-sucursal',
    },
    xaxis: {
      categories: ['Sucursal A', 'Sucursal B', 'Sucursal C', 'Sucursal D'],
    },
  },
  series: [
    {
      name: 'Actividad',
      data: [80, 50, 30, 70],
    },
  ],
});

const stockProductos = ref({
  options: {
    chart: {
      id: 'stock-productos',
    },
    xaxis: {
      categories: ['Agua', 'Proteína', 'Vitaminas', 'Snacks'],
    },
  },
  series: [
    {
      name: 'Stock',
      data: [10, 20, 15, 5],
    },
  ],
});

// Datos para la tabla de actividad reciente
const actividadRecienteHeaders = ref([
  { text: 'Fecha', value: 'fecha' },
  { text: 'Acción', value: 'accion' },
  { text: 'Detalles', value: 'detalles' },
]);

const actividadReciente = ref([
  { fecha: '2023-10-01', accion: 'Pago', detalles: 'Membresía mensual' },
  { fecha: '2023-10-02', accion: 'Inscripción', detalles: 'Nuevo miembro' },
  { fecha: '2023-10-03', accion: 'Cita', detalles: 'Entrenamiento personalizado' },
]);

// Datos para alertas y recordatorios
const alertas = ref([
  { titulo: 'Membresía próxima a vencer', descripcion: 'Juan Pérez - Vence el 15/10/2023' },
  { titulo: 'Stock bajo', descripcion: 'Agua embotellada - Solo 10 unidades' },
  { titulo: 'Pago pendiente', descripcion: 'María Gómez - $50.00' },
]);

// Funciones para atajos rápidos
const nuevoCliente = () => {
  console.log('Registrar nuevo cliente');
};

const nuevoPago = () => {
  console.log('Generar nuevo pago');
};

const agendarCita = () => {
  console.log('Agendar nueva cita');
};
</script>

<style scoped>
.dashboard-content {
  padding: 20px;
}
</style>
