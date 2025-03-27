<template>
  <div class="dashboard-content">
    <!-- Título del Dashboard con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="dashboard-title">
          <span class="title-text">Dashboard General</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="text-subtitle-1">Vista general del estado de la cadena de gimnasios</p>
      </v-col>
    </v-row>

    <!-- Resumen General - Tarjetas Modernas con animaciones -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="(card, index) in summaryCards" :key="index" :data-aos="'fade-up'"
        :data-aos-delay="index * 100">
        <v-card class="summary-card" :class="`card-${index}`" elevation="4">
          <div class="card-icon">
            <Icon :icon="card.icon" width="32" />
          </div>
          <v-card-title class="text-h6 font-weight-medium">{{ card.title }}</v-card-title>
          <v-card-text class="text-h3 font-weight-bold">{{ card.value }}</v-card-text>
          <div class="card-decoration"></div>
          <div class="card-wave"></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos Interactivos -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right" data-aos-delay="200">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="lucide:chart-line" width="24" />
            </div>
            <h3 class="text-h6">Ingresos Mensuales</h3>
            <v-spacer></v-spacer>
            <v-chip color="primary" variant="outlined" small>Últimos 12 meses</v-chip>
          </div>
          <v-card-text>
            <apexchart type="line" :options="ingresosMensuales.options" :series="ingresosMensuales.series"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" data-aos="fade-left" data-aos-delay="200">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="ion:bar-chart-outline" width="24" />
            </div>
            <h3 class="text-h6">Nuevas Inscripciones</h3>
            <v-spacer></v-spacer>
            <v-chip color="secondary" variant="outlined" small>+15% vs año pasado</v-chip>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="nuevasInscripciones.options" :series="nuevasInscripciones.series">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos adicionales -->
    <v-row class="mb-6">
      <v-col cols="12" md="4" data-aos="zoom-in" data-aos-delay="100">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:pie-chart-outline" width="24" />
            </div>
            <h3 class="text-h6">Distribución de Membresías</h3>
          </div>
          <v-card-text>
            <apexchart type="donut" :options="distribucionMembresias.options" :series="distribucionMembresias.series">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="zoom-in" data-aos-delay="200">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:radar-outline" width="24" />
            </div>
            <h3 class="text-h6">Actividad por Sucursal</h3>
          </div>
          <v-card-text>
            <apexchart type="radar" :options="actividadSucursal.options" :series="actividadSucursal.series"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="zoom-in" data-aos-delay="300">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:layers-outline" width="24" />
            </div>
            <h3 class="text-h6">Stock de Productos</h3>
          </div>
          <v-card-text>
            <apexchart type="heatmap" :options="stockProductos.options" :series="stockProductos.series"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actividad Reciente y Alertas -->
    <v-row class="mb-6">
      <v-col cols="12" md="8" data-aos="fade-right" data-aos-delay="100">
        <v-card class="recent-activity-card" elevation="4">
          <div class="card-header">
            <div class="header-icon">
              <Icon icon="solar:clock-circle-outline" width="24" />
            </div>
            <h3 class="text-h6">Actividad Reciente</h3>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" class="see-all-btn">
              Ver todo
              <Icon icon="solar:arrow-right-outline" class="ml-1" />
            </v-btn>
          </div>
          <v-card-text>
            <v-data-table :headers="actividadRecienteHeaders" :items="actividadReciente" :items-per-page="5"
              class="elevation-0 recent-table" hide-default-footer>
              <template v-slot:item.fecha="{ item }">
                <span class="date-cell">{{ item.fecha }}</span>
              </template>
              <template v-slot:item.accion="{ item }">
                <v-chip :color="getActionColor(item.accion)" small>
                  {{ item.accion }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="fade-left" data-aos-delay="100">
        <v-card class="alerts-card" elevation="4">
          <div class="card-header">
            <div class="header-icon alert-icon">
              <Icon icon="solar:bell-bing-outline" width="24" />
            </div>
            <h3 class="text-h6">Alertas Importantes</h3>
            <v-badge color="error" content="3" inline class="ml-2"></v-badge>
          </div>
          <v-card-text>
            <v-list lines="two" class="alerts-list">
              <v-list-item v-for="(alerta, index) in alertas" :key="index" :class="`alert-item-${index}`"
                data-aos="fade-up" :data-aos-delay="index * 50">
                <template v-slot:prepend>
                  <v-avatar :color="alertColors[index]" size="40" class="alert-avatar">
                    <Icon :icon="alerta.icon" width="20" />
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ alerta.titulo }}</v-list-item-title>
                <v-list-item-subtitle>{{ alerta.descripcion }}</v-list-item-subtitle>
                <template v-slot:append>
                  <Icon icon="solar:arrow-right-outline" width="16" class="alert-arrow" />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Atajos Rápidos -->
    <v-row class="mb-6" data-aos="fade-up" data-aos-delay="100">
      <v-col cols="12">
        <v-card class="quick-actions-card" elevation="4">
          <div class="card-header">
            <div class="header-icon">
              <Icon icon="solar:rocket-outline" width="24" />
            </div>
            <h3 class="text-h6">Atajos Rápidos</h3>
          </div>
          <v-card-text class="quick-actions">
            <v-btn v-for="(action, index) in quickActions" :key="index" :color="action.color" variant="flat"
              class="action-btn" @click="action.handler" :data-aos="'zoom-in'" :data-aos-delay="index * 50">
              <v-avatar :color="action.color" size="36" class="mr-3">
                <Icon :icon="action.icon" width="20" />
              </v-avatar>
              <div class="btn-content">
                <div class="btn-label">{{ action.label }}</div>
                <div class="btn-hint">Acceso directo</div>
              </div>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Inicializar AOS al montar el componente
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });
});

// Funciones para atajos rápidos
const nuevoCliente = () => console.log('Registrar nuevo cliente');
const nuevoPago = () => console.log('Generar nuevo pago');
const agendarCita = () => console.log('Agendar nueva cita');

// Función para colores de acciones
const getActionColor = (action) => {
  const colors = {
    'Pago': 'var(--color-grafica-amarillo-dorado)',
    'Inscripción': 'var(--color-grafica-rojo-fuego)',
    'Cita': 'var(--color-grafica-ocre)'
  };
  return colors[action] || 'var(--color-grafica-gris-plata)';
};

// Configuración de gráficos actualizada para versión clara
const ingresosMensuales = ref({
  options: {
    chart: {
      id: 'ingresos-mensuales',
      foreColor: '#333',
      toolbar: { show: true },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#FF2B00'], // Rojo vibrante
    stroke: { width: 3, curve: 'smooth' },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      labels: { style: { colors: '#333' } },
      axisBorder: { show: true, color: '#E0E0E0' },
      axisTicks: { color: '#E0E0E0' }
    },
    yaxis: {
      labels: { style: { colors: '#333' } },
      formatter: (value) => '$' + value.toLocaleString()
    },
    grid: { borderColor: '#E0E0E0', strokeDashArray: 4 },
    tooltip: { theme: 'light' },
    markers: { size: 6, colors: ['#FF2B00'], strokeWidth: 0 }
  },
  series: [{ name: 'Ingresos', data: [3000, 4000, 3500, 5000, 4900, 6000, 7000, 9000, 8500, 8000, 7500, 10000] }]
});

const nuevasInscripciones = ref({
  options: {
    chart: {
      id: 'nuevas-inscripciones',
      foreColor: '#333',
      toolbar: { show: true }
    },
    colors: ['#FF2B00'], // Cambiado a rojo vibrante
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      labels: { style: { colors: '#333' } }
    },
    yaxis: {
      labels: { style: { colors: '#333' } }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false
      }
    }
  },
  series: [{ name: 'Inscripciones', data: [25, 30, 45, 50, 49, 60, 70, 91, 85, 80, 75, 90] }]
});


const distribucionMembresias = ref({
  options: {
    chart: {
      type: 'donut',
      foreColor: 'var(--color-texto)',
      background: 'var(--color-gris-oscuro)'
    },
    labels: ['Básica', 'Premium', 'Familiar', 'Estudiante'],
    colors: [
      'var(--color-grafica-rojo-fuego)',
      'var(--color-grafica-amarillo-dorado)',
      'var(--color-grafica-ocre)',
      'var(--color-grafica-cafe-oscuro)'
    ],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      theme: 'dark',
      style: {
        background: 'var(--color-gris-oscuro)',
        color: 'var(--color-texto)'
      }
    }
  },
  series: [44, 55, 41, 17]
});

const actividadSucursal = ref({
  options: {
    chart: {
      type: 'radar',
      foreColor: '#333'
    },
    labels: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
    colors: ['#FF4500'],
    markers: {
      size: 5
    },
    yaxis: {
      show: false
    }
  },
  series: [{
    name: 'Actividad',
    data: [80, 50, 30, 40, 70]
  }]
});

const stockProductos = ref({
  options: {
    chart: {
      id: 'stock-productos',
      foreColor: '#333',
      toolbar: { show: true }
    },
    colors: ['#FF4500', '#FFA500', '#FFD700', '#D2691E'],
    dataLabels: { enabled: true, style: { colors: ['#fff'] } },
    xaxis: {
      categories: ['Agua', 'Proteína', 'Vitaminas', 'Snacks'],
      labels: { style: { colors: '#666' } },
      axisBorder: { show: true, color: '#E0E0E0' },
      axisTicks: { color: '#E0E0E0' }
    },
    yaxis: { labels: { style: { colors: '#666' } } },
    grid: { borderColor: '#E0E0E0', strokeDashArray: 4 },
    tooltip: { theme: 'light' },
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: true,
        shadeIntensity: 0.5,
        reverseNegativeShade: true,
        distributed: true
      }
    }
  },
  series: [{ name: 'Stock', data: [10, 20, 15, 5] }]
});

// Tarjetas de resumen
const summaryCards = ref([
  { icon: 'solar:shop-outline', title: 'Sucursales Activas', value: '15' },
  { icon: 'solar:users-group-two-rounded-outline', title: 'Miembros Activos', value: '1,250' },
  { icon: 'solar:user-plus-outline', title: 'Nuevos Ingresos', value: '120' },
  { icon: 'solar:users-group-rounded-outline', title: 'Empleados', value: '85' }
]);

// Atajos rápidos
const quickActions = ref([
  { icon: 'solar:user-plus-outline', label: 'Nuevo Cliente', color: 'var(--color-grafica-rojo-fuego)', handler: nuevoCliente },
  { icon: 'solar:dollar-outline', label: 'Nuevo Pago', color: 'var(--color-grafica-amarillo-dorado)', handler: nuevoPago },
  { icon: 'solar:calendar-outline', label: 'Agendar Cita', color: 'var(--color-grafica-ocre)', handler: agendarCita },
  { icon: 'solar:document-add-outline', label: 'Nueva Clase', color: 'var(--color-grafica-cafe-oscuro)', handler: () => console.log('Nueva Clase') }
]);

// Datos para la tabla de actividad reciente
const actividadRecienteHeaders = ref([
  { title: 'Fecha', key: 'fecha', width: '120px' },
  { title: 'Acción', key: 'accion', width: '150px' },
  { title: 'Detalles', key: 'detalles' }
]);

const actividadReciente = ref([
  { fecha: '2023-10-01', accion: 'Pago', detalles: 'Membresía mensual' },
  { fecha: '2023-10-02', accion: 'Inscripción', detalles: 'Nuevo miembro' },
  { fecha: '2023-10-03', accion: 'Cita', detalles: 'Entrenamiento personalizado' }
]);

// Alertas y recordatorios
const alertas = ref([
  { icon: 'solar:clock-circle-outline', titulo: 'Membresía próxima a vencer', descripcion: 'Juan Pérez - Vence el 15/10/2023' },
  { icon: 'solar:box-minimalistic-outline', titulo: 'Stock bajo', descripcion: 'Agua embotellada - Solo 10 unidades' },
  { icon: 'solar:dollar-outline', titulo: 'Pago pendiente', descripcion: 'María Gómez - $50.00' }
]);

const alertColors = [
  'var(--color-grafica-rojo-fuego)',
  'var(--color-grafica-amarillo-dorado)',
  'var(--color-grafica-ocre)'
];
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.dashboard-content {
  padding: 24px;
  background-color: #FFFFFF;

  max-width: 1600px;
  margin: 0 auto;
  color: var(--color-texto);
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

  .text-subtitle-1 {
    color: var(--color-texto);
    font-family: var(--fuente-principal);
  }
}

/* Tarjetas de resumen mejoradas */
.summary-card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;

    .card-wave {
      transform: translateX(0);
    }
  }

  .card-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.2);
    transition: transform 0.3s;
  }

  .card-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    border-radius: 0 0 0 100%;
    opacity: 0.1;
    transition: opacity 0.3s;
  }

  .card-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-50%);
    transition: transform 1.5s ease-in-out;
    z-index: 1;
  }

  .v-card-title {
    padding: 0;
    margin-bottom: 8px;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
    color: white;
    font-family: var(--fuente-principal);
  }

  .v-card-text {
    padding: 0;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
    color: white;
    font-family: var(--fuente-principal);
  }

  &:hover {
    .card-icon {
      transform: scale(1.1);
    }

    .card-decoration {
      opacity: 0.2;
    }

    .v-card-title {
      letter-spacing: 0.5px;
    }

    .v-card-text {
      transform: scale(1.05);
    }
  }
}

/* Estilos individuales para cada tarjeta */
.card-0 {
  background: linear-gradient(135deg, var(--color-grafica-rojo-fuego), var(--color-grafica-naranja-calido));

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .v-card-title,
  .v-card-text {
    color: white;
  }

  .card-decoration {
    background: white;
  }
}

.card-1 {
  background: linear-gradient(135deg, var(--color-grafica-amarillo-dorado), var(--color-grafica-ocre));

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .card-decoration {
    background: white;
  }
}

.card-2 {
  background: linear-gradient(135deg, var(--color-grafica-ocre), var(--color-grafica-cafe-oscuro));

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
    color: white !important;
  }

  .v-card-title,
  .v-card-text {
    color: white;
  }

  .card-decoration {
    background: white;
  }
}

.card-3 {
  background: linear-gradient(135deg, var(--color-rojo-granate), var(--color-grafica-rojo-fuego));

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .v-card-title,
  .v-card-text {
    color: white;
  }

  .card-decoration {
    background: white;
  }
}

/* Tarjetas de gráficos mejoradas */
.chart-card {
  background-color: var(--color-gris-oscuro);
  border-radius: 16px;
  padding: 16px;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid var(--color-gris-medio);

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
      color: var(--color-gris-oscuro);
      font-weight: 600;
      font-family: var(--fuente-titulo);
    }

    .chart-icon-bg {
      width: 40px;
      height: 40px;
      background: rgba(255, 69, 0, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: var(--color-grafica-rojo-fuego);
    }

    .v-chip {
      background-color: var(--color-gris-carbon) !important;
      color: var(--color-texto) !important;
      border-color: var(--color-grafica-rojo-fuego) !important;
    }
  }
}

/* Tarjeta de actividad reciente mejorada */
.recent-activity-card {
  border-radius: 16px;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-gris-oscuro);
  border: 1px solid var(--color-gris-medio);

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background: var(--color-gris-carbon);

    h3 {
      margin: 0;
      color: var(--color-gris-oscuro);
      font-weight: 600;
      font-family: var(--fuente-titulo);
    }

    .header-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 69, 0, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: var(--color-grafica-rojo-fuego);
    }

    .see-all-btn {
      font-weight: 500;
      letter-spacing: 0.5px;
      color: var(--color-grafica-rojo-fuego) !important;
    }
  }

  .recent-table {
    background-color: transparent;

    .date-cell {
      font-weight: 500;
      color: var(--color-texto);
      font-family: var(--fuente-principal);
    }

    th {
      background-color: var(--color-gris-carbon) !important;
      color: var(--color-gris-oscuro) !important;
      font-family: var(--fuente-titulo);
    }

    td {
      background-color: var(--color-gris-oscuro) !important;
      color: var(--color-texto) !important;
      font-family: var(--fuente-principal);
    }
  }
}

/* Tarjeta de alertas mejorada */
.alerts-card {
  border-radius: 16px;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-gris-oscuro);
  border: 1px solid var(--color-gris-medio);

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background: var(--color-gris-carbon);

    h3 {
      margin: 0;
      color: var(--color-gris-oscuro);
      font-weight: 600;
      font-family: var(--fuente-titulo);
    }

    .alert-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 69, 0, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: var(--color-grafica-rojo-fuego);
    }

    .v-badge {
      color: var(--color-grafica-rojo-fuego) !important;
    }
  }

  .alerts-list {
    padding: 0;
    background-color: transparent;

    .v-list-item {
      padding: 16px;
      border-bottom: 1px solid var(--color-gris-medio);
      transition: all 0.3s;
      background-color: transparent;

      &:hover {
        background-color: var(--color-gris-carbon) !important;
        transform: translateX(5px);

        .alert-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      }

      &:last-child {
        border-bottom: none;
      }

      .alert-avatar {
        transition: transform 0.3s;
      }

      .alert-arrow {
        opacity: 0;
        transform: translateX(-5px);
        transition: all 0.3s;
        color: var(--color-texto);
      }

      &:hover .alert-avatar {
        transform: scale(1.1);
      }

      .v-list-item-title {
        color: var(--color-gris-oscuro);
        font-family: var(--fuente-titulo);
      }

      .v-list-item-subtitle {
        color: var(--color-texto);
        font-family: var(--fuente-principal);
      }
    }
  }
}

/* Tarjeta de atajos rápidos mejorada */
.quick-actions-card {
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--color-gris-oscuro);
  border: 1px solid var(--color-gris-medio);

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background: var(--color-gris-carbon);

    h3 {
      margin: 0;
      color: var(--color-gris-oscuro) !important;
      font-weight: 600;
      font-family: var(--fuente-titulo);
    }

    .header-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 69, 0, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: var(--color-grafica-rojo-fuego);
    }
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;

    .action-btn {
      height: auto;
      padding: 16px;
      border-radius: 12px;
      text-transform: none;
      letter-spacing: normal;
      display: flex;
      align-items: center;
      transition: all 0.3s;
      background-color: var(--color-gris-carbon) !important;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
      }

      .btn-content {
        text-align: left;

        .btn-label {
          font-weight: 500;
          font-size: 1rem;
          color: var(--color-gris-oscuro);
          font-family: var(--fuente-titulo);
        }

        .btn-hint {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 2px;
          color: var(--color-texto);
          font-family: var(--fuente-principal);
        }
      }
    }
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

  .summary-card {
    padding: 16px;

    .card-icon {
      width: 48px;
      height: 48px;
    }
  }

  .quick-actions {
    grid-template-columns: 1fr 1fr !important;
  }
}

@media (max-width: 600px) {
  .quick-actions {
    grid-template-columns: 1fr !important;
  }
}
</style>
