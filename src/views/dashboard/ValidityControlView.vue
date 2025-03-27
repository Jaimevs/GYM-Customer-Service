<template>
  <v-container fluid class="validity-control-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Control de Vigencia de Membresías</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Monitorea el estado de vigencia de las membresías y gestiona renovaciones y
      cancelaciones.
    </p>

    <!-- Panel de Estado de Vigencias -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="200">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:pie-chart-outline" width="24" />
            </div>
            <h3 class="text-h6">Estado de Vigencias</h3>
          </div>
          <v-card-text>
            <apexchart type="pie" :options="estadoVigencias.options" :series="estadoVigencias.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="300">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:list-check-outline" width="24" />
            </div>
            <h3 class="text-h6">Resumen de Vigencias</h3>
          </div>
          <v-card-text>
            <v-list>
              <v-list-item data-aos="fade-up" data-aos-delay="100">
                <v-list-item-icon>
                  <Icon icon="mdi:check-circle" color="blue" width="24" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Membresías Activas</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenVigencias.activas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="200">
                <v-list-item-icon>
                  <Icon icon="mdi:alert-circle" color="orange" width="24" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Membresías por Expirar (30 días)</v-list-item-title>
                  <v-list-item-subtitle>{{ resumenVigencias.porExpirar }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="300">
                <v-list-item-icon>
                  <Icon icon="mdi:close-circle" color="red" width="24" />
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
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:clock-circle-outline" width="24" />
            </div>
            <h3 class="text-h6">Listado de Membresías Próximas a Vencer</h3>
          </div>
          <v-card-text>
            <v-data-table :headers="cabecerasMembresias" :items="membresiasPorExpirar" :items-per-page="5"
              class="elevation-0 recent-table" data-aos="fade-up" data-aos-delay="100">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="enviarRecordatorio(item)" data-aos="zoom-in"
                  data-aos-delay="100">
                  <Icon icon="mdi:email" width="18" />
                </v-btn>
                <v-btn icon small color="success" @click="renovarManualmente(item)" data-aos="zoom-in"
                  data-aos-delay="200">
                  <Icon icon="mdi:refresh" width="18" />
                </v-btn>
                <v-btn icon small color="error" @click="cancelarMembresia(item)" data-aos="zoom-in"
                  data-aos-delay="300">
                  <Icon icon="mdi:cancel" width="18" />
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
              <Icon icon="solar:bell-outline" width="24" />
            </div>
            <h3 class="text-h6">Alertas y Notificaciones</h3>
          </div>
          <v-card-text>
            <v-alert type="info" dense outlined data-aos="fade-up" data-aos-delay="100">
              Configuración de recordatorios: 7 días antes del vencimiento.
            </v-alert>
            <v-list>
              <v-list-item v-for="(alerta, index) in alertas" :key="index"
                :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'" :data-aos-delay="100 * (index + 1)">
                <v-list-item-avatar>
                  <Icon :icon="alerta.icono" :color="alerta.color" width="24" />
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
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="100">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:chart-outline" width="24" />
            </div>
            <h3 class="text-h6">Tasa de Renovación vs Cancelación</h3>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="tasaRenovacion.options" :series="tasaRenovacion.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="200">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="ant-design:fund-projection-screen-outlined" width="24" />
            </div>
            <h3 class="text-h6">Proyecciones de Ingresos Futuros</h3>
          </div>
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
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
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
const estadoVigencias = ref({
  options: {
    labels: ['Activas', 'Por Expirar', 'Vencidas'],
    colors: ['#FFD700', '#FFA500', '#FF4500'],
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
  { mensaje: 'Recordatorio enviado a Juan Pérez', detalle: 'Su membresía vence en 7 días.', icono: 'mdi:email', color: 'blue' },
  { mensaje: 'Membresía vencida de Pedro Ramírez', detalle: 'Sin renovación desde hace 15 días.', icono: 'mdi:alert', color: 'red' },
]);

const tasaRenovacion = ref({
  options: {
    chart: { id: 'tasa-renovacion' },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
    colors: ['#FFD700', '#FF4500'],
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
    colors: ['#FFD700'],
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
@import "@/styles/_variables.scss";

.validity-control-content {
  padding: 24px;
  background-color: #FFFFFF;
  color: #333333;
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

/* Estilos para tarjetas */
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

/* Estilos para tablas */
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

/* Responsive */
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
}
</style>
