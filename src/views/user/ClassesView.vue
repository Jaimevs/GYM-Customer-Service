<template>
  <v-container class="reservations-view">
    <!-- Título de la página con animación -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <Icon icon="solar:calendar-mark-bold" width="36" class="mr-3 text-primary" />
          <h1 class="text-h3 font-weight-bold text-gradient">Mis Reservaciones</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis">
          Gestiona tus clases reservadas y haz nuevas reservaciones
        </p>
      </v-col>
    </v-row>

    <!-- Alertas para mostrar mensajes -->
    <v-row v-if="error || successMessage" class="mb-4" data-aos="fade-up">
      <v-col cols="12">
        <v-alert v-if="error" type="error" dismissible elevation="2" border="start">
          {{ error }}
        </v-alert>
        <v-alert v-if="successMessage" type="success" dismissible elevation="2" border="start">
          {{ successMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Pestañas para navegación -->
    <v-row class="mb-6" data-aos="fade-up">
      <v-col cols="12">
        <v-tabs v-model="activeTab" color="primary" grow>
          <v-tab value="active" class="text-capitalize">
            <Icon icon="solar:calendar-check-bold" width="20" class="mr-2" />
            Activas
          </v-tab>
          <v-tab value="history" class="text-capitalize">
            <Icon icon="solar:clock-circle-bold" width="20" class="mr-2" />
            Historial
          </v-tab>
          <v-tab value="new" class="text-capitalize">
            <Icon icon="solar:calendar-add-bold" width="20" class="mr-2" />
            Nueva
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Sección de cargando -->
    <v-row v-if="loading" class="my-10" data-aos="fade-up">
      <v-col cols="12" class="d-flex justify-center align-center">
        <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Contenido de las pestañas -->
    <v-window v-model="activeTab" v-else>
      <!-- Pestaña de reservaciones activas -->
      <v-window-item value="active">
        <v-card class="h-100" elevation="4" data-aos="fade-up">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:calendar-check-bold" width="24" class="mr-2" />
            <span>Reservaciones Activas</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined" :loading="refreshing" @click="loadReservations('Confirmada')">
              <Icon icon="solar:refresh-bold" width="18" class="mr-1" />
              Actualizar
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <div v-if="activeReservations.length === 0" class="text-center py-10" data-aos="fade-up">
              <Icon icon="solar:calendar-search-bold" width="80" class="mb-4 text-grey" />
              <p class="text-h6 mb-2">No tienes reservaciones activas</p>
              <p class="text-body-1 text-medium-emphasis">Explora nuestras clases y haz una reservación</p>
              <v-btn color="primary" class="mt-4" @click="activeTab = 'new'">
                <Icon icon="solar:calendar-add-bold" width="18" class="mr-1" />
                Nueva Reservación
              </v-btn>
            </div>

            <v-list v-else class="py-0">
              <v-list-item v-for="reservation in activeReservations" :key="reservation.ID" class="px-0 mb-4"
                data-aos="fade-up">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="48" class="mr-4">
                    <Icon icon="solar:calendar-mark-bold" width="24" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-h6">
                  {{ reservation.Nombre_Clase || `Clase #${reservation.Clase_ID}` }}
                </v-list-item-title>

                <v-list-item-subtitle class="mt-2">
                  <div class="d-flex align-center mb-1">
                    <Icon icon="solar:calendar-linear" width="16" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ formatDate(reservation.Fecha_Reservacion) }}</span>
                  </div>
                  <div class="d-flex align-center mb-1">
                    <Icon icon="solar:clock-circle-linear" width="16" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ reservation.Dia_Clase }}, {{ formatTime(reservation.Hora_Inicio) }} -
                      {{
                        formatTime(reservation.Hora_Fin) }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <Icon icon="solar:user-linear" width="16" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ reservation.Entrenador_Nombre || 'Sin asignar' }}</span>
                  </div>
                  <v-chip :color="getStatusColor(reservation.Estatus)" size="small" label>
                    {{ reservation.Estatus }}
                  </v-chip>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn color="error" variant="outlined" :loading="cancellingId === reservation.ID"
                    :disabled="cancellingId !== null" @click="cancelReservation(reservation.ID)" class="ml-2">
                    <Icon icon="solar:trash-bin-trash-bold" width="16" class="mr-1" />
                    Cancelar
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Pestaña de historial de reservaciones -->
      <v-window-item value="history">
        <v-card class="h-100" elevation="4" data-aos="fade-up">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:clock-circle-bold" width="24" class="mr-2" />
            <span>Historial de Reservaciones</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined" :loading="refreshing" @click="loadHistoricalReservations">
              <Icon icon="solar:refresh-bold" width="18" class="mr-1" />
              Actualizar
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <!-- Filtros de búsqueda -->
            <v-row class="mb-4">
              <v-col cols="12" sm="4" data-aos="fade-up" data-aos-delay="100">
                <v-menu v-model="startDateMenu" :close-on-content-click="false" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-model="filters.startDate" label="Desde" prepend-inner-icon="solar:calendar-linear"
                      readonly v-bind="props" clearable variant="outlined" density="comfortable"
                      @click:clear="filters.startDate = null"></v-text-field>
                  </template>
                  <v-date-picker v-model="filters.startDate"
                    @update:model-value="startDateMenu = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="4" data-aos="fade-up" data-aos-delay="150">
                <v-menu v-model="endDateMenu" :close-on-content-click="false" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-model="filters.endDate" label="Hasta" prepend-inner-icon="solar:calendar-linear"
                      readonly v-bind="props" cleaHistorial de Reservaciones
rable variant="outlined" density="comfortable"
                      @click:clear="filters.endDate = null"></v-text-field>
                  </template>
                  <v-date-picker v-model="filters.endDate" @update:model-value="endDateMenu = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="4" data-aos="fade-up" data-aos-delay="200">
                <v-select v-model="filters.status" :items="statusOptions" label="Estatus"
                  prepend-inner-icon="solar:filter-linear" clearable variant="outlined"
                  density="comfortable"></v-select>
              </v-col>

              <v-col cols="12" class="d-flex justify-end" data-aos="fade-up" data-aos-delay="250">
                <v-btn color="secondary" class="mr-2" variant="outlined" @click="resetFilters">
                  <Icon icon="solar:close-circle-bold" width="18" class="mr-1" />
                  Limpiar
                </v-btn>
                <v-btn color="primary" variant="flat" @click="applyFilters">
                  <Icon icon="solar:filter-bold" width="18" class="mr-1" />
                  Filtrar
                </v-btn>
              </v-col>
            </v-row>

            <div v-if="historicalReservations.length === 0" class="text-center py-10" data-aos="fade-up">
              <Icon icon="solar:calendar-search-bold" width="80" class="mb-4 text-grey" />
              <p class="text-h6 mb-2">No hay historial disponible</p>
              <p class="text-body-1 text-medium-emphasis">No se encontraron reservaciones con los filtros actuales</p>
            </div>

            <v-list v-else class="py-0">
              <v-list-item v-for="reservation in historicalReservations" :key="reservation.ID" class="px-0 mb-4"
                data-aos="fade-up">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(reservation.Estatus)" size="48" class="mr-4">
                    <Icon :icon="getStatusIcon(reservation.Estatus)" width="24" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-h6">
                  {{ reservation.Nombre_Clase || `Clase #${reservation.Clase_ID}` }}
                </v-list-item-title>

                <v-list-item-subtitle class="mt-2">
                  <div class="d-flex align-center mb-1">
                    <Icon icon="solar:calendar-linear" width="16" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ formatDate(reservation.Fecha_Reservacion) }}</span>
                  </div>
                  <div class="d-flex align-center mb-1">
                    <Icon icon="solar:clock-circle-linear" width="16" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ reservation.Dia_Clase }}, {{ formatTime(reservation.Hora_Inicio) }} -
                      {{
                        formatTime(reservation.Hora_Fin) }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <Icon icon="solar:user-linear" width="16" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ reservation.Entrenador_Nombre || 'Sin asignar' }}</span>
                  </div>
                  <v-chip :color="getStatusColor(reservation.Estatus)" size="small" label>
                    {{ reservation.Estatus }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Pestaña para nueva reservación -->
      <v-window-item value="new">
        <v-card class="h-100" elevation="4" data-aos="fade-up">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:calendar-add-bold" width="24" class="mr-2" />
            <span>Reservar Nueva Clase</span>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <!-- Step 1: Selección de clase -->
            <v-row data-aos="fade-up">
              <v-col cols="12">
                <v-select v-model="selectedClass" :items="availableClasses" item-title="Nombre" item-value="ID"
                  label="Selecciona una clase" return-object :loading="loadingClasses" :disabled="loadingClasses"
                  variant="outlined" density="comfortable" prepend-inner-icon="solar:menu-dots-bold"></v-select>
              </v-col>
            </v-row>

            <!-- Detalles de la clase seleccionada -->
            <v-row v-if="selectedClass" data-aos="fade-up">
              <v-col cols="12">
                <v-card variant="outlined" class="pa-4">
                  <h3 class="text-h6 font-weight-bold primary--text">{{ selectedClass.Nombre }}</h3>
                  <p v-if="selectedClass.Descripcion" class="mt-2 text-body-1">{{ selectedClass.Descripcion }}</p>
                  <div class="d-flex align-center mt-3">
                    <Icon icon="solar:calendar-range-linear" width="18" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ selectedClass.Dia_Inicio }} a {{ selectedClass.Dia_Fin }}</span>
                  </div>
                  <div class="d-flex align-center mt-2">
                    <Icon icon="solar:clock-circle-linear" width="18" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ formatTime(selectedClass.Hora_Inicio) }} - {{
                      formatTime(selectedClass.Hora_Fin) }}</span>
                  </div>
                  <div class="d-flex align-center mt-2">
                    <Icon icon="solar:user-linear" width="18" class="mr-2 text-medium-emphasis" />
                    <span class="text-body-1">{{ selectedClass.Entrenador_Nombre || 'Sin nombre' }} {{
                      selectedClass.Entrenador_Apellido || '' }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Step 2: Selección de fecha -->
            <v-row v-if="selectedClass" class="mt-4" data-aos="fade-up">
              <v-col cols="12" sm="6">
                <v-menu v-model="reservationDateMenu" :close-on-content-click="false" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-model="reservationDate" label="Fecha de la clase"
                      prepend-inner-icon="solar:calendar-linear" readonly required v-bind="props" variant="outlined"
                      density="comfortable"></v-text-field>
                  </template>
                  <v-date-picker v-model="reservationDate" :allowed-dates="allowedDates"
                    @update:model-value="reservationDateMenu = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6">
                <v-textarea v-model="reservationComment" label="Comentarios (opcional)" rows="2"
                  placeholder="Agrega algún comentario o requisito especial..." variant="outlined" density="comfortable"
                  prepend-inner-icon="solar:chat-round-linear"></v-textarea>
              </v-col>
            </v-row>

            <!-- Botón de reserva -->
            <v-row v-if="selectedClass && reservationDate" class="mt-4" data-aos="fade-up">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="primary" size="large" :loading="submitting" :disabled="submitting || !isFormValid"
                  @click="createReservation" variant="flat">
                  <Icon icon="solar:calendar-check-bold" width="20" class="mr-2" />
                  Confirmar Reservación
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';
import ReservationService, { ReservacionWithDetails } from '../../services/ReservationService';
import ClassesService, { ClaseWithEntrenador } from '../../services/ClassesService';

// Inicializar animaciones
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });
});

// Estados principales
const activeTab = ref('active');
const loading = ref(false);
const refreshing = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const cancellingId = ref<number | null>(null);
const submitting = ref(false);

// Estados para reservaciones
const activeReservations = ref<ReservacionWithDetails[]>([]);
const historicalReservations = ref<ReservacionWithDetails[]>([]);

// Estados para filtros de historial
const filters = ref({
  startDate: null as string | null,
  endDate: null as string | null,
  status: null as string | null
});
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const statusOptions = [
  { title: 'Confirmada', value: 'Confirmada' },
  { title: 'Cancelada', value: 'Cancelada' },
  { title: 'Asistida', value: 'Asistida' },
  { title: 'No Asistida', value: 'No Asistida' }
];

// Estados para nueva reservación
const availableClasses = ref<ClaseWithEntrenador[]>([]);
const selectedClass = ref<ClaseWithEntrenador | null>(null);
const reservationDate = ref<string | null>(null);
const reservationComment = ref('');
const reservationDateMenu = ref(false);
const loadingClasses = ref(false);

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([
    loadReservations('Confirmada'),
    loadAvailableClasses()
  ]);
});

// Watch para cambios de pestaña
watch(activeTab, (newTab) => {
  if (newTab === 'active') {
    loadReservations('Confirmada');
  } else if (newTab === 'history') {
    loadHistoricalReservations();
  } else if (newTab === 'new') {
    loadAvailableClasses();
  }
});

// Cargar reservaciones activas
const loadReservations = async (status: string) => {
  loading.value = true;
  error.value = null;

  try {
    activeReservations.value = await ReservationService.getMyReservations(undefined, undefined, status);
  } catch (err) {
    console.error('Error al cargar reservaciones:', err);
    error.value = 'No se pudieron cargar tus reservaciones. Por favor, intenta nuevamente más tarde.';
  } finally {
    loading.value = false;
  }
};

// Cargar historial de reservaciones
const loadHistoricalReservations = async () => {
  loading.value = true;
  error.value = null;

  try {
    historicalReservations.value = await ReservationService.getMyReservations(
      filters.value.startDate || undefined,
      filters.value.endDate || undefined,
      filters.value.status || undefined
    );
  } catch (err) {
    console.error('Error al cargar historial de reservaciones:', err);
    error.value = 'No se pudo cargar tu historial de reservaciones. Por favor, intenta nuevamente más tarde.';
  } finally {
    loading.value = false;
  }
};

// Aplicar filtros al historial
const applyFilters = () => {
  loadHistoricalReservations();
};

// Resetear filtros
const resetFilters = () => {
  filters.value = {
    startDate: null,
    endDate: null,
    status: null
  };
  loadHistoricalReservations();
};

// Cancelar una reservación
const cancelReservation = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas cancelar esta reservación?')) return;

  cancellingId.value = id;
  error.value = null;
  successMessage.value = null;

  try {
    await ReservationService.cancelReservation(id);
    successMessage.value = 'Reservación cancelada exitosamente';

    // Actualizar la lista de reservaciones activas
    await loadReservations('Confirmada');
  } catch (err) {
    console.error('Error al cancelar la reservación:', err);
    error.value = 'No se pudo cancelar la reservación. Por favor, intenta nuevamente más tarde.';
  } finally {
    cancellingId.value = null;
  }
};

// Cargar clases disponibles
const loadAvailableClasses = async () => {
  loadingClasses.value = true;
  error.value = null;

  try {
    const classes = await ClassesService.getAllClasses();
    availableClasses.value = classes.filter(classItem => classItem.Estatus);
  } catch (err) {
    console.error('Error al cargar clases disponibles:', err);
    error.value = 'No se pudieron cargar las clases disponibles. Por favor, intenta nuevamente más tarde.';
  } finally {
    loadingClasses.value = false;
  }
};

// Validar días permitidos para la reservación
const allowedDates = (date: string) => {
  if (!selectedClass.value) return false;

  const dateObj = new Date(date);
  const day = dateObj.getDay();

  const dayMap: { [key: string]: number } = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Miercoles': 3, 'Jueves': 4,
    'Viernes': 5, 'Sábado': 6, 'Sabado': 6, 'Domingo': 0
  };

  const diaInicio = dayMap[selectedClass.value.Dia_Inicio] ?? -1;
  const diaFin = dayMap[selectedClass.value.Dia_Fin] ?? -1;

  if (diaInicio <= diaFin) {
    return day >= diaInicio && day <= diaFin;
  } else {
    return day >= diaInicio || day <= diaFin;
  }
};

// Verificar si el formulario es válido
const isFormValid = computed(() => {
  return !!selectedClass.value && !!reservationDate.value;
});

// Función para crear nueva reservación
const createReservation = async () => {
  if (!isFormValid.value) return;

  submitting.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    if (!selectedClass.value || !reservationDate.value) {
      throw new Error("Fecha o clase no seleccionada");
    }

    const selectedDate = new Date(reservationDate.value);
    const año = selectedDate.getFullYear();
    const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dia = String(selectedDate.getDate()).padStart(2, '0');
    const fechaFormateada = `${año}-${mes}-${dia}`;

    let horaStr = selectedClass.value.Hora_Inicio;

    if (horaStr.includes('T')) {
      horaStr = horaStr.split('T')[1];
    }

    if (horaStr.length < 8) {
      horaStr = horaStr.padEnd(8, '0');
    }

    const fechaHora = `${fechaFormateada}T${horaStr}`;

    const result = await ReservationService.createReservation({
      Clase_ID: selectedClass.value.ID,
      Fecha_Reservacion: fechaHora,
      Comentario: reservationComment.value || null
    });

    successMessage.value = 'Reservación creada exitosamente';
    selectedClass.value = null;
    reservationDate.value = null;
    reservationComment.value = '';
    activeTab.value = 'active';
    await loadReservations('Confirmada');
  } catch (err) {
    console.error('Error al crear la reservación:', err);

    if (axios.isAxiosError(err) && err.response?.data?.detail) {
      error.value = `Error: ${JSON.stringify(err.response.data.detail)}`;
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'No se pudo crear la reservación. Por favor, intenta nuevamente más tarde.';
    }
  } finally {
    submitting.value = false;
  }
};

// Formatear fecha para mostrar
const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (e) {
    console.error('Error al formatear fecha:', e);
    return dateString;
  }
};

// Formatear hora para mostrar
const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return '';

  try {
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString.substring(0, 5);
  } catch (e) {
    console.error('Error al formatear hora:', e);
    return timeString;
  }
};

// Obtener color según el estatus
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Confirmada': return 'primary';
    case 'Cancelada': return 'error';
    case 'Asistida': return 'success';
    case 'No Asistida': return 'warning';
    default: return 'grey';
  }
};

// Obtener icono según el estatus
const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'Confirmada': return 'tdesign:calendar-2-filled';
    case 'Cancelada': return 'bx:calendar-x';
    case 'Asistida': return 'solar:calendar-mark-bold';
    case 'No Asistida': return 'solar:calendar-cancel-bold';
    default: return 'solar:calendar-linear';
  }
};

// Obtener color del icono según el estatus
const getStatusIconColor = (status: string): string => {
  switch (status) {
    case 'Confirmada': return 'primary';
    case 'Cancelada': return 'error';
    case 'Asistida': return 'success';
    case 'No Asistida': return 'warning';
    default: return 'grey';
  }
};
</script>

<style scoped lang="scss">
.reservations-view {
  max-width: 1200px;
  margin: 0 auto;
}

.text-gradient {
  background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.v-card {
  transition: all 0.3s ease;
  border-radius: 12px;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }
}

.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 16px 24px;
}

.v-card-text {
  padding: 16px 24px;
}

.v-list-item {
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 16px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    transform: translateX(4px);
  }
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.v-tab {
  font-weight: 500;
}

.v-avatar {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
