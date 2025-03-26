<template>
  <v-container fluid class="dashboard-content">
    <!-- Hero Section -->
    <v-row class="mb-2">
      <v-col cols="12">
        <div class="hero-header" data-aos="fade-down">
          <div class="hero-content">
            <h1 class="hero-title text-black">
              <Icon icon="solar:hand-heart-linear" width="42" class="mr-3 pulse-icon" />
              ¡Bienvenido de vuelta, {{ userName }}!
            </h1>
            <p class="hero-subtitle text-black">{{ welcomeMessage }}</p>
            <v-btn color="primary" large class="mt-4 hero-btn" @click="navigateToProgress">
              <Icon icon="solar:rocket-bold" class="mr-2" />
              Ver mi progreso completo
            </v-btn>
          </div>
          <div class="hero-stats">
            <div class="stat-badge" v-for="stat in userStats" :key="stat.label">
              <Icon :icon="stat.icon" width="24" class="stat-icon" />
              <span class="stat-text text-black">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Progress Cards -->
    <v-row class="mb-6 cards-row">
      <v-col v-for="(card, index) in progressCards" :key="card.title" cols="12" md="4" :data-aos="'fade-up'"
        :data-aos-delay="(index + 1) * 100">
        <v-card class="summary-card" :class="`neon-card-${card.color}`" elevation="0"
          @click="handleCardClick(card.action)">
          <v-card-text class="text-black">
            <div class="d-flex align-center mb-3">
              <v-avatar :color="card.color" size="56" class="mr-3 glow-avatar">
                <Icon :icon="card.icon" width="28" color="white" />
              </v-avatar>
              <div>
                <div class="summary-label">{{ card.title }}</div>
                <div class="summary-value">{{ card.value }}</div>
                <v-progress-linear :value="card.progress" height="8" color="white"
                  background-color="rgba(255,255,255,0.2)" rounded striped></v-progress-linear>
              </div>
            </div>
            <v-btn block text color="white" class="mt-2 card-action">
              Ver detalles
              <Icon icon="solar:arrow-right-bold" class="ml-2" />
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Featured Class - Versión Ajustada -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="zoom-in">
        <v-card class="featured-class-improved" elevation="10">
          <v-img :src="featuredClass.image" height="220"
            gradient="to right, rgba(12, 20, 69, 0.85) 0%, rgba(71, 18, 107, 0.6) 50%, transparent 100%"
            class="class-image-improved">
            <div class="class-content-improved">
              <div class="class-top-section">
                <v-chip color="primary" class="class-badge-improved" label small>
                  <Icon icon="solar:fire-bold" class="mr-1" />
                  Clase Destacada
                </v-chip>

                <h2 class="class-title-improved">{{ featuredClass.name }}</h2>

                <div class="class-info-improved">
                  <div class="info-item-improved" v-for="(info, i) in featuredClass.info" :key="i">
                    <Icon :icon="info.icon" width="18" class="mr-1" />
                    <span>{{ info.text }}</span>
                  </div>
                </div>
              </div>

              <div class="class-actions-improved">
                <v-btn color="white" dark class="action-btn-improved" @click.stop="navigateToClass(featuredClass.id)"
                  small>
                  <Icon icon="solar:eye-bold" class="mr-1" />
                  Detalles
                </v-btn>

                <v-btn color="primary" outlined class="action-btn-improved"
                  @click.stop="confirmAttendance(featuredClass.id)" small>
                  <Icon icon="solar:check-circle-bold" class="mr-1" />
                  Asistiré
                </v-btn>
              </div>
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <!-- Progreso Visual -->
    <v-row class="mb-4">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="progress-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:graph-up-bold" class="mr-2" width="24" />
            Evolución de peso
          </v-card-title>
          <v-card-text>
            <div class="chart-container">
              <apexchart type="area" height="300" :options="chartOptions" :series="chartSeries"></apexchart>
            </div>
            <div class="d-flex justify-space-between mt-4">
              <div class="text-center">
                <Icon icon="solar:flag-2-bold" width="24" class="mb-2" />
                <div class="stat-value">85 kg</div>
                <div class="stat-label">Inicio</div>
              </div>
              <div class="text-center">
                <Icon icon="solar:graph-up-bold" width="24" class="mb-2" />
                <div class="stat-value">81 kg</div>
                <div class="stat-label">Actual</div>
              </div>
              <div class="text-center">
                <Icon icon="solar:medal-star-bold" width="24" class="mb-2" />
                <div class="stat-value">75 kg</div>
                <div class="stat-label">Meta</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="progress-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <Icon icon="mynaui:calendar-solid" class="mr-2" width="24" />
            Tu plan semanal
          </v-card-title>
          <v-card-text>
            <v-timeline dense>
              <v-timeline-item v-for="(day, i) in weeklyPlan" :key="i" small
                :color="day.completed ? 'success' : 'primary'">
                <template #opposite>
                  <span :class="day.completed ? 'success--text' : ''">{{ day.day }}</span>
                </template>
                <v-card elevation="2" class="rounded-lg">
                  <v-card-text class="py-2">
                    <div class="d-flex align-center">
                      <Icon :icon="day.icon" class="mr-2" width="20" />
                      <strong>{{ day.workout }}</strong>
                      <v-spacer></v-spacer>
                      <v-chip x-small :color="day.completed ? 'success' : 'grey lighten-2'">
                        {{ day.completed ? 'Completado' : 'Pendiente' }}
                      </v-chip>
                    </div>
                    <div class="mt-1 ml-6 text-caption">{{ day.time }}</div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Acciones Rápidas Mejoradas -->
    <v-row data-aos="fade-up">
      <v-col cols="12">
        <v-card class="quick-actions-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:rocket-bold" width="28" class="mr-2 rocket-icon" />
            <span class="text-gradient">Acciones Express</span>
            <v-spacer></v-spacer>
            <v-chip small color="primary" class="pulse-chip">
              <Icon icon="solar:bolt-bold" width="16" class="mr-1" />
              ¡Más rápido que nunca!
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div class="actions-grid">
              <div v-for="(action, i) in quickActions" :key="i" class="action-item"
                :style="{ '--action-color': action.color }" @click="handleAction(action)" @mouseenter="hoverAction = i"
                @mouseleave="hoverAction = null">
                <div class="action-icon-wrapper">
                  <Icon :icon="action.icon" width="32" class="action-icon"
                    :class="{ 'bounce-icon': hoverAction === i }" />
                </div>
                <div class="action-label">{{ action.label }}</div>
                <div class="action-hover-text">Clic para ir</div>
                <div class="action-particles" v-if="hoverAction === i">
                  <span v-for="n in 12" :key="n" class="particle"></span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';
import VueApexCharts from 'vue3-apexcharts';

const router = useRouter();
const toast = useToast();
const hoverAction = ref(null);
// Initialize animations
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });
});

// User data - ahora con valores locales
const user = ref({
  name: 'María González',
  membership: 'Premium',
  streakDays: 5,
  goalsAchieved: 85,
  workoutHours: 12,
  weeklyWorkouts: 3,
  weightProgress: -4,
  monthlyAttendance: 12
});

const userName = computed(() => user.value.name);
const userMembership = computed(() => user.value.membership);

const welcomeMessage = computed(() => {
  const messages = [
    'Tu dedicación está dando resultados',
    'Sigue así, vas por buen camino',
    'Cada día eres más fuerte',
    'El éxito es la suma de pequeños esfuerzos'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
});

// User stats
const userStats = ref([
  { icon: 'solar:fire-bold', value: `${user.value.streakDays} días de racha`, label: 'streak' },
  { icon: 'solar:medal-star-bold', value: `${user.value.goalsAchieved}% de tus objetivos`, label: 'goals' },
  { icon: 'solar:clock-circle-bold', value: `${user.value.workoutHours} horas este mes`, label: 'hours' }
]);

// Progress cards
const progressCards = ref([
  {
    title: 'Entrenamientos semanales',
    value: `${user.value.weeklyWorkouts}/5`,
    progress: 60,
    icon: 'solar:dumbbell-bold',
    color: 'primary',
    action: 'workouts'
  },
  {
    title: 'Progreso de peso',
    value: `${user.value.weightProgress} kg`,
    progress: 40,
    icon: 'healthicons:weight',
    color: 'secondary',
    action: 'weight'
  },
  {
    title: 'Asistencia mensual',
    value: `${user.value.monthlyAttendance}/16`,
    progress: 75,
    icon: 'solar:calendar-mark-bold',
    color: 'teal',
    action: 'attendance'
  }
]);

// Featured class
const featuredClass = ref({
  id: 1,
  name: 'HIIT Intenso',
  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  info: [
    { icon: 'solar:clock-circle-bold', text: 'Hoy a las 18:00' },
    { icon: 'solar:map-point-bold', text: 'Sala 3' },
    { icon: 'solar:user-bold', text: 'Con Carlos' }
  ]
});

// Weekly plan
const weeklyPlan = ref([
  { day: 'Lunes', workout: 'Fuerza Superior', time: '18:00 - 19:00', icon: 'solar:dumbbell-bold', completed: true },
  { day: 'Martes', workout: 'Cardio Intenso', time: '08:00 - 08:45', icon: 'solar:running-bold', completed: true },
  { day: 'Miércoles', workout: 'Yoga', time: '19:00 - 20:00', icon: 'solar:meditation-round-bold', completed: false },
  { day: 'Jueves', workout: 'Piernas', time: '18:30 - 19:30', icon: 'game-icons:leg', completed: false },
  { day: 'Viernes', workout: 'HIIT', time: '17:00 - 18:00', icon: 'solar:fire-bold', completed: false },
  { day: 'Sábado', workout: 'Natación', time: '10:00 - 11:00', icon: 'solar:waterdrop-bold', completed: false },
  { day: 'Domingo', workout: 'Descanso', time: '', icon: 'solar:sleeping-bold', completed: false }
]);

// Quick actions
const quickActions = ref([
  { label: 'Reservar clase', icon: 'solar:calendar-add-bold', color: '#3B82F6', action: 'book' },
  { label: 'Mi progreso', icon: 'solar:graph-new-up-bold', color: '#10B981', action: 'progress' },
  { label: 'Plan nutricional', icon: 'fluent:food-16-filled', color: 'teal', action: 'nutrition' },
  { label: 'Entrenador', icon: 'solar:user-hand-up-bold', color: 'orange', action: 'trainer' },
  { label: 'Membresía', icon: 'solar:card-bold', color: 'purple', action: 'membership' },
  { label: 'Comunidad', icon: 'solar:users-group-two-rounded-bold', color: 'indigo', action: 'community' }
]);

// Progress highlights
const progressHighlights = ref([
  { icon: 'solar:target-linear', value: '-4 kg', label: 'Perdidos', action: 'weight' },
  { icon: 'solar:ruler-linear', value: '-5 cm', label: 'Cintura', action: 'measurements' },
  { icon: 'solar:heart-pulse-bold', value: '+15%', label: 'Resistencia', action: 'fitness' }
]);

// Configuración del gráfico
const chartOptions = ref({
  chart: {
    id: 'weight-chart',
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    lineCap: 'round',
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.9,
      opacityTo: 0.1, // Opacidad disminuye hacia el final
      stops: [0, 100],
      colors: ['var(--color-grafica-naranja-calido)', 'white'], // De ocre a blanco
    },
  },
  colors: ['var(--color-grafica-naranja-calido)'],
});

const chartSeries = ref([
  {
    name: 'Peso',
    data: [85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74],
  }
]);


// Methods
const isNextSession = (day) => {
  const today = new Date().getDay();
  const dayIndex = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].indexOf(day.day);
  return dayIndex === today && !day.completed;
};

const isActiveSession = (day) => {
  if (!day.time) return false;

  const today = new Date().getDay();
  const dayIndex = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].indexOf(day.day);

  if (dayIndex !== today) return false;

  const [startTime, endTime] = day.time.split(' - ');
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const currentTotal = currentHours * 60 + currentMinutes;
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;

  return currentTotal >= startTotal && currentTotal <= endTotal;
};

const getDayStatusColor = (day) => {
  if (day.completed) return 'success';
  if (isActiveSession(day)) return 'primary';
  if (isNextSession(day)) return 'primary';
  return 'grey lighten-2';
};

const getDayStatusText = (day) => {
  if (day.completed) return 'Completado';
  if (isActiveSession(day)) return 'En curso';
  if (isNextSession(day)) return 'Próximo';
  return 'Pendiente';
};

const handleQuickAction = (action) => {
  switch (action.action) {
    case 'book':
      router.push('/classes');
      break;
    case 'progress':
      router.push('/progress');
      break;
    case 'nutrition':
      router.push('/nutrition');
      break;
    case 'trainer':
      router.push('/trainers');
      break;
    case 'membership':
      router.push('/membership');
      break;
    case 'community':
      router.push('/community');
      break;
    default:
      showToast(`Acción: ${action.label}`, 'info');
  }
};

const handleCardClick = (action) => {
  switch (action) {
    case 'workouts':
      router.push('/workouts');
      break;
    case 'weight':
      router.push('/progress/weight');
      break;
    case 'attendance':
      router.push('/attendance');
      break;
    default:
      showToast(`Ver detalles de ${action}`, 'info');
  }
};

const navigateToProgress = () => {
  router.push('/progress');
};

const navigateToClass = (classId) => {
  router.push(`/classes/${classId}`);
};

const confirmAttendance = (classId) => {
  showToast('Asistencia confirmada', 'success');
};

const showWorkoutDetails = (day) => {
  if (day.workout === 'Descanso') return;
  showToast(`Detalles de ${day.workout}`, 'info');
};

const showStatDetails = (stat) => {
  showToast(`Ver detalles de ${stat.label}`, 'info');
};

// Métodos
const handleAction = (action) => {
  showToast(action.description, 'info');

  // Efecto de confirmación
  const clickedElement = event?.currentTarget;
  if (clickedElement) {
    clickedElement.classList.add('action-confirmed');
    setTimeout(() => {
      clickedElement.classList.remove('action-confirmed');
    }, 1000);
  }
};

const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'bottom-right',
    timeout: 3000,
  });
};

// Inicialización de animaciones
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad',
  });
});







</script>

<style scoped lang="scss">
.dashboard-content {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8fafc;
  color: #000000;
  /* Texto negro por defecto */
}

/* Asegurar que todo el texto sea negro */
.hero-title,
.hero-subtitle,
.stat-text,
.summary-label,
.summary-value,
.v-card-title,
.v-card-text,
.day-name,
.workout-name,
.workout-time,
.action-label,
.highlight-value,
.highlight-label {
  color: #000000 !important;
}

/* Hero Section */
.hero-header {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-secondary-base) 100%);
  border-radius: 16px;
  padding: 32px;
  color: #000000;
  /* Texto negro */
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 960px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    transform: rotate(30deg);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  line-height: 1.2;

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 16px;
}

.hero-btn {
  transform: translateY(0);
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;

  @media (min-width: 960px) {
    margin-top: 0;
  }
}

.stat-badge {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  padding: 8px 16px;
  border-radius: 24px;
  font-weight: 500;
  white-space: nowrap;
}

.stat-icon {
  margin-right: 8px;
}

/* Progress Cards */
.progress-card {
  border-radius: 12px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--v-primary-base);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--v-secondary-lighten1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}





.cards-row {
  margin-top: -40px;
  position: relative;
  z-index: 3;

  @media (max-width: 960px) {
    margin-top: 0;
  }
}

.summary-card {
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  height: 100%;
  color: #000000;
  /* Texto negro */
  position: relative;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
}

.neon-card-primary {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, #1565C0 100%);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3);
}

.neon-card-secondary {
  background: linear-gradient(135deg, var(--v-secondary-base) 0%, #7B1FA2 100%);
  box-shadow: 0 8px 20px rgba(123, 31, 162, 0.3);
}

.neon-card-teal {
  background: linear-gradient(135deg, var(--v-teal-base) 0%, #00796B 100%);
  box-shadow: 0 8px 20px rgba(0, 121, 107, 0.3);
}

.glow-avatar {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;

  .summary-card:hover & {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
}

.summary-label {
  font-size: 0.9rem;
  opacity: 0.9;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 4px 0;
}

.card-action {
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    letter-spacing: 0.5px;
  }
}

/* Estilos Mejorados para Featured Class */
.featured-class-improved {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
}

.class-image-improved {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.class-content-improved {
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.class-top-section {
  margin-bottom: 15px;
}

.class-badge-improved {
  font-weight: 500;
  backdrop-filter: blur(4px);
  background: rgba(236, 231, 229, 0.85) !important;
  margin-bottom: 12px;
}

.class-title-improved {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
}

.class-info-improved {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
}

.info-item-improved {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: white;
  font-weight: 400;

  .iconify {
    color: rgba(255, 255, 255, 0.9);
  }
}

.class-actions-improved {
  display: flex;
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 400px) {
    flex-direction: column;
  }
}

.action-btn-improved {
  transition: all 0.2s ease;
  font-weight: 500;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
}

/* Estilos para Acciones Rápidas Mejoradas */
.quick-actions-card {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #FF5252, #FF4081, #E040FB, #7C4DFF, #536DFE, #448AFF, #40C4FF, #18FFFF, #64FFDA, #69F0AE, #B2FF59, #EEFF41, #FFFF00, #FFD740, #FFAB40, #FF6E40);
    background-size: 1000% 100%;
    animation: rainbow 10s linear infinite;
  }
}

.rocket-icon {
  transform: rotate(-45deg);
  transition: all 0.3s ease;

  .quick-actions-card:hover & {
    transform: rotate(-45deg) translateY(-5px);
  }
}

.pulse-chip {
  animation: pulse 2s infinite;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  padding: 8px;
}

.action-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--action-color);
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    &::before {
      height: 6px;
    }

    .action-hover-text {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &.action-confirmed {
    animation: confirmAction 0.5s ease;
  }
}

.action-icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto 12px;
  background: rgba(var(--action-color-rgb), 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  .action-item:hover & {
    background: rgba(var(--action-color-rgb), 0.2);
    transform: scale(1.1);
  }
}

.bounce-icon {
  animation: bounce 0.5s ease infinite alternate;
}

.action-icon {
  color: var(--action-color);
  transition: all 0.3s ease;
}

.action-label {
  font-weight: 600;
  color: var(--v-primary-darken1);
  transition: all 0.3s ease;
  margin-bottom: 8px;

  .action-item:hover & {
    color: var(--action-color);
    font-weight: 700;
  }
}

.action-hover-text {
  font-size: 0.75rem;
  color: var(--v-secondary-lighten1);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.action-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background-color: var(--action-color);
  border-radius: 50%;
  opacity: 0;

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      $size: random(5) + 3 + px;
      width: $size;
      height: $size;
      top: 50%;
      left: 50%;
      animation: particle-#{$i} 1s ease-out;
    }
  }
}

/* Animaciones */
.pulse-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-5px);
  }
}

@keyframes confirmAction {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
}

// Generamos animaciones únicas para cada partícula
@for $i from 1 through 12 {
  @keyframes particle-#{$i} {
    0% {
      opacity: 1;
      transform: translate(0, 0);
    }

    100% {
      opacity: 0;
      transform: translate(random(100) - 50 + px, random(100) - 50 + px);
    }
  }
}

/* Responsivo */
@media (max-width: 960px) {
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .dashboard-content {
    padding: 16px;
  }

  .welcome-title {
    font-size: 1.4rem;
  }

  .featured-class .v-card__title {
    font-size: 1.1rem;
  }

  .featured-class .v-card__subtitle {
    font-size: 0.8rem;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions-card .v-card__title {
    flex-direction: column;
    align-items: flex-start;

    .pulse-chip {
      margin-top: 8px;
      align-self: flex-start;
    }
  }
}
</style>
