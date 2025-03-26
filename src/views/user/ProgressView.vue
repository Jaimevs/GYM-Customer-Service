<template>
  <v-container class="progress-view">
    <!-- Título de la página con animación -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <Icon icon="solar:graph-up-bold" width="36" class="mr-3 text-primary" />
          <h1 class="text-h3 font-weight-bold text-gradient">Mi Progreso</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis">
          Visualiza tu evolución y logros en el gimnasio
        </p>
      </v-col>
    </v-row>

    <!-- Gráficas de progreso con animaciones -->
    <v-row class="mb-6">
      <!-- Gráfica de Peso -->
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="h-100" elevation="4">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:weight-bold" width="24" class="mr-2" />
            <span>Progreso de Peso</span>
            <v-spacer></v-spacer>
            <v-chip small color="primary">
              Últimos 6 meses
            </v-chip>
          </v-card-title>
          <v-card-text>
            <apexchart type="line" height="300" :options="weightChartOptions" :series="weightSeries"></apexchart>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="showWeightDetails">
              Ver detalles
              <Icon icon="solar:arrow-right-bold" class="ml-1" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Gráfica de Actividad -->
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="h-100" elevation="4">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:fire-bold" width="24" class="mr-2" />
            <span>Intensidad Semanal</span>
            <v-spacer></v-spacer>
            <v-chip small color="secondary">
              Esta semana
            </v-chip>
          </v-card-title>
          <v-card-text>
            <apexchart type="bar" height="300" :options="activityChartOptions" :series="activitySeries"></apexchart>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="secondary" @click="showActivityDetails">
              Ver detalles
              <Icon icon="solar:arrow-right-bold" class="ml-1" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resumen de Métricas con animaciones escalonadas -->
    <v-row>
      <v-col cols="12" md="4" data-aos="fade-up" data-aos-delay="100">
        <v-card class="metric-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:scale-bold" width="24" class="mr-2" />
            <span>Peso Actual</span>
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-end mb-1">
              <p class="text-h3 font-weight-bold mr-2">81</p>
              <p class="text-h6 text-medium-emphasis">kg</p>
            </div>
            <v-progress-linear :model-value="75" height="8" color="primary" rounded striped></v-progress-linear>
            <div class="d-flex justify-space-between mt-2">
              <span class="text-caption">Objetivo: 75 kg</span>
              <span class="text-caption">-6 kg</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="fade-up" data-aos-delay="200">
        <v-card class="metric-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:calendar-mark-bold" width="24" class="mr-2" />
            <span>Visitas Mensuales</span>
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-end mb-1">
              <p class="text-h3 font-weight-bold mr-2">12</p>
              <p class="text-h6 text-medium-emphasis">sesiones</p>
            </div>
            <v-progress-linear :model-value="75" height="8" color="secondary" rounded striped></v-progress-linear>
            <div class="d-flex justify-space-between mt-2">
              <span class="text-caption">Meta: 16</span>
              <span class="text-caption">75%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="fade-up" data-aos-delay="300">
        <v-card class="metric-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:clock-circle-bold" width="24" class="mr-2" />
            <span>Duración Promedio</span>
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-end mb-1">
              <p class="text-h3 font-weight-bold mr-2">65</p>
              <p class="text-h6 text-medium-emphasis">minutos</p>
            </div>
            <v-progress-linear :model-value="80" height="8" color="teal" rounded striped></v-progress-linear>
            <div class="d-flex justify-space-between mt-2">
              <span class="text-caption">Por sesión</span>
              <span class="text-caption">+15%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de logros -->
    <v-row class="mt-6" data-aos="fade-up">
      <v-col cols="12">
        <v-card elevation="4">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:medal-star-bold" width="24" class="mr-2" />
            <span>Tus Logros</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6" md="3" v-for="(achievement, i) in achievements" :key="i">
                <v-card class="achievement-card" :color="achievement.completed ? 'primary' : 'grey-lighten-3'">
                  <v-card-text class="text-center">
                    <Icon :icon="achievement.icon" width="32" class="mb-2" />
                    <div class="text-subtitle-1 font-weight-medium">{{ achievement.title }}</div>
                    <v-chip small :color="achievement.completed ? 'white' : 'grey'" class="mt-2">
                      {{ achievement.completed ? 'Completado' : 'En progreso' }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useToast } from 'vue-toastification';
import { Icon } from '@iconify/vue';

const toast = useToast();

// Inicializar animaciones
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });
});

// Configuración de la gráfica de peso
const weightChartOptions = ref({
  chart: {
    id: 'weight-chart',
    toolbar: { show: false },
    sparkline: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: { enabled: true, delay: 150 },
      dynamicAnimation: { enabled: true, speed: 350 }
    }
  },
  colors: ['var(--color-grafica-rojo-fuego)'],
  stroke: {
    width: 3,
    curve: 'smooth',
    lineCap: 'round'
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['var(--color-grafica-naranja-calido)'],
      shadeIntensity: 1,
      type: 'vertical',
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  markers: {
    size: 5,
    colors: ['var(--color-grafica-rojo-granate)'],
    strokeWidth: 2,
    strokeColors: '#fff',
    hover: { size: 7 }
  },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    labels: { style: { colors: 'var(--color-texto)', fontFamily: 'var(--fuente-principal)' } }
  },
  yaxis: {
    title: { text: 'Peso (kg)', style: { color: 'var(--color-texto)' } },
    labels: { style: { colors: 'var(--color-texto)' } },
    min: 70,
    max: 90
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: { fontFamily: 'var(--fuente-principal)' },
    y: { formatter: (val) => `${val} kg` }
  },
  grid: {
    borderColor: 'var(--color-grafica-gris-plata)',
    strokeDashArray: 4
  }
});

const weightSeries = ref([{
  name: 'Peso',
  data: [85, 83, 82, 81, 80, 79]
}]);

// Configuración de la gráfica de actividad
const activityChartOptions = ref({
  chart: {
    id: 'activity-chart',
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  colors: ['var(--color-grafica-amarillo-dorado)'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
      distributed: true,
      dataLabels: { position: 'top' }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1,
    colors: ['var(--color-grafica-gris-carbon)']
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    labels: { style: { colors: 'var(--color-texto)', fontFamily: 'var(--fuente-principal)' } }
  },
  yaxis: {
    title: { text: 'Minutos', style: { color: 'var(--color-texto)' } },
    labels: { style: { colors: 'var(--color-texto)' } }
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: { fontFamily: 'var(--fuente-principal)' },
    y: { formatter: (val) => `${val} minutos` }
  },
  grid: {
    borderColor: 'var(--color-grafica-gris-plata)',
    strokeDashArray: 4
  }
});

const activitySeries = ref([{
  name: 'Actividad',
  data: [60, 75, 50, 80, 90, 70, 85]
}]);

// Logros del usuario
const achievements = ref([
  { icon: 'solar:fire-bold', title: 'Racha de 7 días', completed: true },
  { icon: 'solar:medal-star-bold', title: 'Meta de peso', completed: false },
  { icon: 'solar:dumbbell-bold', title: '100 sesiones', completed: true },
  { icon: 'solar:cup-star-bold', title: 'Reto HIIT', completed: false }
]);

// Métodos
const showWeightDetails = () => {
  toast.info('Mostrando detalles de progreso de peso');
};

const showActivityDetails = () => {
  toast.info('Mostrando detalles de actividad semanal');
};
</script>

<style scoped lang="scss">
.progress-view {
  max-width: 1200px;
  margin: 0 auto;
}

.text-gradient {
  background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.metric-card {
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
  }
}

.achievement-card {
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
}

.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 12px;
}

.v-card-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
