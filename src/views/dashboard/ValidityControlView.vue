<template>
  <v-container fluid class="validity-control-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Control de Vigencia de Membresías</h1>
    <p class="text-subtitle-1">Monitorea el estado de vigencia de las membresías y gestiona renovaciones y
      cancelaciones.</p>

    <!-- Panel de Estado de Vigencias -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Estado de Vigencias</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="estadoVigencias.options" :series="estadoVigencias.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Resumen de Vigencias</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Membresías Activas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenVigencias.activas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Membresías por Expirar (30 días)</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenVigencias.porExpirar }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="red">mdi-close-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Membresías Vencidas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenVigencias.vencidas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Membresías Próximas a Vencer -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Membresías Próximas a Vencer</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasMembresias" :items="membresiasPorExpirar" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="enviarRecordatorio(item)">
                  <v-icon small>mdi-email</v-icon>
                </v-btn>
                <v-btn icon small color="success" @click="renovarManualmente(item)">
                  <v-icon small>mdi-refresh</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="cancelarMembresia(item)">
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
            <v-alert type="info" dense outlined>
              Configuración de recordatorios: 7 días antes del vencimiento.
            </v-alert>
            <v-list>
              <v-list-item v-for="(alerta, index) in alertas" :key="index">
                <v-list-item-avatar>
                  <v-icon :color="alerta.color">{{ alerta.icono }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ alerta.mensaje }}</v-list-item-title>
                  <v-list-item-subtitle>{{ alerta.detalle }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reportes y Estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Tasa de Renovación vs Cancelación</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="tasaRenovacion.options" :series="tasaRenovacion.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Proyecciones de Ingresos Futuros</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="proyeccionesIngresos.options" :series="proyeccionesIngresos.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// Datos de ejemplo
const estadoVigencias = ref({
  options: {
    labels: ['Activas', 'Por Expirar', 'Vencidas'],
    colors: ['#4caf50', '#ff9800', '#f44336'],
  },
  series: [70, 20, 10],
});

const resumenVigencias = ref({
  activas: 70,
  porExpirar: 20,
  vencidas: 10,
});

const cabecerasMembresias = ref([
  { text: 'Cliente', value: 'cliente' },
  { text: 'Fecha de Vencimiento', value: 'fechaVencimiento' },
  { text: 'Contacto', value: 'contacto' },
  { text: 'Estado de Renovación', value: 'estadoRenovacion' },
  { text: 'Último Pago', value: 'ultimoPago' },
  { text: 'Notificación Enviada', value: 'notificacionEnviada' },
  { text: 'Acciones', value: 'acciones' },
]);

const membresiasPorExpirar = ref([
  { cliente: 'Juan Pérez', fechaVencimiento: '2023-11-15', contacto: '123456789', estadoRenovacion: 'Manual', ultimoPago: '$50', notificacionEnviada: 'No' },
  { cliente: 'María López', fechaVencimiento: '2023-11-20', contacto: '987654321', estadoRenovacion: 'Automática', ultimoPago: '$100', notificacionEnviada: 'Sí' },
]);

const alertas = ref([
  { mensaje: 'Recordatorio enviado a Juan Pérez', detalle: 'Su membresía vence en 7 días.', icono: 'mdi-email', color: 'blue' },
  { mensaje: 'Membresía vencida de Pedro Ramírez', detalle: 'Sin renovación desde hace 15 días.', icono: 'mdi-alert', color: 'red' },
]);

const tasaRenovacion = ref({
  options: {
    chart: { id: 'tasa-renovacion' },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [
    { name: 'Renovaciones', data: [50, 60, 70, 80, 90] },
    { name: 'Cancelaciones', data: [10, 15, 20, 25, 30] },
  ],
});

const proyeccionesIngresos = ref({
  options: {
    chart: { id: 'proyecciones-ingresos' },
    xaxis: { categories: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct'] },
  },
  series: [{ name: 'Ingresos Proyectados', data: [5000, 5500, 6000, 6500, 7000] }],
});

// Métodos
const enviarRecordatorio = (item) => {
  console.log('Enviar recordatorio a:', item.cliente);
};

const renovarManualmente = (item) => {
  console.log('Renovar manualmente la membresía de:', item.cliente);
};

const cancelarMembresia = (item) => {
  console.log('Cancelar membresía de:', item.cliente);
};
</script>

<style scoped lang="scss">
.validity-control-content {
  padding: 2rem;
}
</style>
