<template>
  <v-container fluid class="dashboard-content">
    <!-- Hero Section -->
    <v-row class="mb-2">
      <v-col cols="12">
        <div class="hero-header" data-aos="fade-down">
          <div class="hero-content">
            <h1 class="hero-title text-black">
              <Icon icon="solar:hand-heart-linear" width="42" class="mr-3 pulse-icon" />
              ¡Bienvenido de vuelta, {{ userProfile.Nombre_Completo }}!
            </h1>
            <p class="hero-subtitle text-black">{{ welcomeMessage }}</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Información de Peso -->
    <v-row class="mb-6 cards-row">
      <v-col cols="12" md="4" data-aos="fade-up">
        <v-card class="summary-card neon-card-secondary" elevation="0">
          <v-card-text class="text-black">
            <div class="d-flex align-center mb-3">
              <v-avatar color="secondary" size="56" class="mr-3 glow-avatar">
                <Icon icon="healthicons:weight" width="28" color="white" />
              </v-avatar>
              <div>
                <div class="summary-label">Peso actual</div>
                <div class="summary-value">{{ userProfile.Peso ? `${userProfile.Peso} kg` : 'No disponible' }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reservaciones del Usuario -->
    <v-row>
      <v-col cols="12" data-aos="fade-up">
        <v-card>
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:calendar-mark-bold" class="mr-2" width="24" />
            Mis Reservaciones
          </v-card-title>
          
          <v-card-text v-if="userProfile.Reservaciones && userProfile.Reservaciones.length > 0">
            <v-list>
              <v-list-item v-for="reservacion in userProfile.Reservaciones" :key="reservacion.ID">
                <v-list-item-avatar>
                  <v-avatar color="primary">
                    <Icon icon="solar:calendar-bold" width="24" color="white" />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ reservacion.Nombre_Clase || `Clase ID: ${reservacion.Clase_ID}` }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Fecha: {{ formatDate(reservacion.Fecha_Reservacion) }} - Estado: {{ reservacion.Estatus }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip :color="getStatusColor(reservacion.Estatus)" small>
                    {{ reservacion.Estatus }}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
          
          <v-card-text v-else>
            <div class="text-center py-4">
              <Icon icon="solar:calendar-minimalistic-linear" width="48" class="mb-2 text-grey" />
              <p class="text-subtitle-1 text-medium-emphasis">No tienes reservaciones actualmente</p>
              <v-btn color="primary" class="mt-2" to="/classes">
                Reservar una clase
              </v-btn>
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
import UserProfileService from '@/services/UserProfileService';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

// Datos del perfil de usuario
const userProfile = ref({
  Nombre_Completo: '',
  Peso: null,
  Reservaciones: []
});

// Mensajes de bienvenida
const welcomeMessage = computed(() => {
  const messages = [
    'Tu dedicación está dando resultados',
    'Sigue así, vas por buen camino',
    'Cada día eres más fuerte',
    'El éxito es la suma de pequeños esfuerzos'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
});

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};

// Obtener color según el estado de la reservación
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmada':
      return 'success';
    case 'cancelada':
      return 'error';
    case 'asistida':
      return 'info';
    case 'no asistida':
      return 'warning';
    default:
      return 'grey';
  }
};

// Cargar datos del perfil
const loadUserProfile = async () => {
  try {
    loading.value = true;
    const data = await UserProfileService.getUserProfileInfo();
    userProfile.value = data;
  } catch (error) {
    console.error('Error al cargar información del perfil:', error);
    toast.error('No se pudo cargar la información del perfil');
  } finally {
    loading.value = false;
  }
};

// Inicialización
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });
  
  loadUserProfile();
});
</script>

<style scoped lang="scss">
.dashboard-content {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8fafc;
  color: #000000;
}

/* Hero Section */
.hero-header {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-secondary-base) 100%);
  border-radius: 16px;
  padding: 32px;
  color: #000000;
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

/* Cards Section */
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
  position: relative;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
}

.neon-card-secondary {
  background: linear-gradient(135deg, var(--v-secondary-base) 0%, #7B1FA2 100%);
  box-shadow: 0 8px 20px rgba(123, 31, 162, 0.3);
}

.glow-avatar {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
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

/* Responsivo */
@media (max-width: 600px) {
  .dashboard-content {
    padding: 16px;
  }
  
  .hero-title {
    font-size: 1.4rem;
  }
}
</style>