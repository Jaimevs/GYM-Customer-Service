<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Mis Reservaciones</h1>
        <p class="text-subtitle-1">Gestiona tus clases reservadas y haz nuevas reservaciones.</p>
      </v-col>
    </v-row>

    <!-- Alertas para mostrar mensajes -->
    <v-row v-if="error || successMessage">
      <v-col cols="12">
        <v-alert v-if="error" type="error" dismissible>
          {{ error }}
        </v-alert>
        <v-alert v-if="successMessage" type="success" dismissible>
          {{ successMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Pestañas para navegación -->
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" color="primary" grow>
          <v-tab value="active">Reservaciones Activas</v-tab>
          <v-tab value="new">Nueva Reservación</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Sección de cargando -->
    <v-row v-if="loading">
      <v-col cols="12" class="d-flex justify-center align-center my-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Contenido de las pestañas -->
    <v-window v-model="activeTab" v-else>
      <!-- Pestaña de reservaciones activas -->
      <v-window-item value="active">
        <v-card class="mt-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Reservaciones Actuales</span>
            <v-btn color="primary" variant="text" :loading="refreshing" @click="loadReservations('Confirmada')">
              <v-icon left>mdi-refresh</v-icon>
              Actualizar
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <div v-if="activeReservations.length === 0" class="text-center my-5">
              <v-icon size="64" color="grey">mdi-calendar-blank</v-icon>
              <p class="text-h6 mt-3">No tienes reservaciones activas</p>
              <p class="text-body-1">Explora nuestras clases y haz una reservación.</p>
            </div>
            
            <v-list v-else>
              <v-list-item v-for="reservation in activeReservations" :key="reservation.ID">
                <template v-slot:prepend>
                  <v-icon color="primary" class="mr-3">mdi-calendar-check</v-icon>
                </template>
                
                <v-list-item-title class="font-weight-bold">
                  {{ reservation.Nombre_Clase || `Clase #${reservation.Clase_ID}` }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  <div>
                    <strong>Fecha:</strong> {{ formatDate(reservation.Fecha_Reservacion) }}
                  </div>
                  <div>
                    <strong>Horario:</strong> {{ reservation.Dia_Clase }}, 
                    {{ formatTime(reservation.Hora_Inicio) }} - {{ formatTime(reservation.Hora_Fin) }}
                  </div>
                  <div>
                    <strong>Entrenador:</strong> {{ reservation.Entrenador_Nombre || 'Sin asignar' }}
                  </div>
                  <div class="mt-1">
                    <v-chip :color="getStatusColor(reservation.Estatus)" size="small">
                      {{ reservation.Estatus }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-btn 
                    color="error" 
                    variant="outlined"
                    size="small"
                    :loading="cancellingId === reservation.ID"
                    :disabled="cancellingId !== null"
                    @click="cancelReservation(reservation.ID)">
                    Cancelar
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Pestaña para nueva reservación -->
      <v-window-item value="new">
        <v-card class="mt-4">
          <v-card-title>Reservar Nueva Clase</v-card-title>
          
          <v-card-text>
            <!-- Step 1: Selección de clase -->
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="selectedClass"
                  :items="availableClasses"
                  item-title="Nombre"
                  item-value="ID"
                  label="Selecciona una clase"
                  return-object
                  :loading="loadingClasses"
                  :disabled="loadingClasses"
                ></v-select>
              </v-col>
            </v-row>
            
            <!-- Detalles de la clase seleccionada -->
            <v-row v-if="selectedClass">
              <v-col cols="12">
                <v-card variant="outlined" class="pa-3">
                  <h3 class="text-h6">{{ selectedClass.Nombre }}</h3>
                  <p v-if="selectedClass.Descripcion">{{ selectedClass.Descripcion }}</p>
                  <p class="mb-0"><strong>Días:</strong> {{ selectedClass.Dia_Inicio }} a {{ selectedClass.Dia_Fin }}</p>
                  <p class="mb-0">
                    <strong>Horario:</strong> 
                    {{ formatTime(selectedClass.Hora_Inicio) }} - {{ formatTime(selectedClass.Hora_Fin) }}
                  </p>
                  <p class="mb-0">
                    <strong>Entrenador:</strong> 
                    {{ selectedClass.Entrenador_Nombre || 'Sin nombre' }} 
                    {{ selectedClass.Entrenador_Apellido || '' }}
                  </p>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Step 2: Selección de fecha -->
            <v-row v-if="selectedClass">
              <v-col cols="12" sm="6">
                <v-menu
                  v-model="reservationDateMenu"
                  :close-on-content-click="false"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="reservationDate"
                      label="Fecha de la clase"
                      prepend-icon="mdi-calendar"
                      readonly
                      required
                      v-bind="props"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="reservationDate"
                    :allowed-dates="allowedDates"
                    @update:model-value="reservationDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="reservationComment"
                  label="Comentarios (opcional)"
                  rows="2"
                  placeholder="Agrega algún comentario o requisito especial..."
                ></v-textarea>
              </v-col>
            </v-row>
            
            <!-- Botón de reserva -->
            <v-row v-if="selectedClass && reservationDate">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn 
                  color="primary" 
                  size="large"
                  :loading="submitting"
                  :disabled="submitting || !isFormValid"
                  @click="createReservation">
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
import ReservationService, { ReservacionWithDetails } from '../../services/ReservationService';
import ClassesService, { ClaseWithEntrenador } from '../../services/ClassesService';

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
  } else if (newTab === 'new') {
    loadAvailableClasses();
  }
});

// Cargar reservaciones activas
const loadReservations = async (status: string) => {
  loading.value = true;
  error.value = null;
  
  try {
    const reservaciones = await ReservationService.getMyReservations(undefined, undefined, status);
    
    // Verificar que el usuario actual sea el dueño
    const currentUserId = ReservationService.getUserId();
    
    // Filtrar para mostrar solo las reservaciones del usuario actual
    activeReservations.value = reservaciones.filter(res => res.Usuario_ID === currentUserId);
    
    // Si hay discrepancias, mostrar advertencia
    if (reservaciones.length !== activeReservations.value.length) {
      console.warn(`Se filtraron ${reservaciones.length - activeReservations.value.length} reservaciones que no pertenecen al usuario actual`);
    }
  } catch (err) {
    console.error('Error al cargar reservaciones:', err);
    error.value = 'No se pudieron cargar tus reservaciones. Por favor, intenta nuevamente más tarde.';
  } finally {
    loading.value = false;
  }
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
    // Obtener todas las clases activas
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
  const day = dateObj.getDay(); // 0 = Domingo, 1 = Lunes, ...
  
  // Mapear los nombres de días a sus índices
  const dayMap: {[key: string]: number} = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Miercoles': 3, 'Jueves': 4, 
    'Viernes': 5, 'Sábado': 6, 'Sabado': 6, 'Domingo': 0
  };
  
  const diaInicio = dayMap[selectedClass.value.Dia_Inicio] ?? -1;
  const diaFin = dayMap[selectedClass.value.Dia_Fin] ?? -1;
  
  // Comprobar si el día está dentro del rango permitido
  if (diaInicio <= diaFin) {
    return day >= diaInicio && day <= diaFin;
  } else {
    // Si el rango cruza el fin de semana (ej. Viernes a Lunes)
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
    
    // Convertir la fecha a un objeto Date
    const selectedDate = new Date(reservationDate.value);
    
    // Formatear manualmente para asegurar un formato YYYY-MM-DD correcto
    const año = selectedDate.getFullYear();
    const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dia = String(selectedDate.getDate()).padStart(2, '0');
    const fechaFormateada = `${año}-${mes}-${dia}`;
    
    // Obtener la hora de inicio
    let horaStr = selectedClass.value.Hora_Inicio;
    
    // Si la hora incluye fecha ISO, extraemos solo la parte de tiempo
    if (horaStr.includes('T')) {
      horaStr = horaStr.split('T')[1];
    }
    
    // Asegurarnos de que la hora tenga el formato correcto (HH:MM:SS)
    if (horaStr.length < 8) {
      horaStr = horaStr.padEnd(8, '0');
    }
    
    // Crear fecha combinada en formato: YYYY-MM-DDTHH:MM:SS
    const fechaHora = `${fechaFormateada}T${horaStr}`;
    
    console.log("Enviando fecha:", fechaHora);
    
    // Enviar reservación
    const result = await ReservationService.createReservation({
      Clase_ID: selectedClass.value.ID,
      Fecha_Reservacion: fechaHora,
      Comentario: reservationComment.value || null
    });
    
    console.log("Reservación creada con éxito:", result);
    successMessage.value = 'Reservación creada exitosamente';
    
    // Resetear formulario
    selectedClass.value = null;
    reservationDate.value = null;
    reservationComment.value = '';
    
    // Cambiar a la pestaña de reservaciones activas
    activeTab.value = 'active';
    
    // Actualizar la lista de reservaciones activas
    await loadReservations('Confirmada');
  } catch (err) {
    console.error('Error al crear la reservación:', err);
    
    // Mostrar mensaje más detallado si está disponible
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
    // Si es un string de tiempo en formato ISO
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Si es solo la hora (HH:MM:SS)
    return timeString.substring(0, 5);
  } catch (e) {
    console.error('Error al formatear hora:', e);
    return timeString;
  }
};

// Obtener color según el estatus
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Confirmada': return 'success';
    case 'Cancelada': return 'error';
    case 'Asistida': return 'primary';
    case 'No Asistida': return 'warning';
    default: return 'grey';
  }
};

// Obtener icono según el estatus
const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'Confirmada': return 'mdi-calendar-check';
    case 'Cancelada': return 'mdi-calendar-remove';
    case 'Asistida': return 'mdi-calendar-check-outline';
    case 'No Asistida': return 'mdi-calendar-alert';
    default: return 'mdi-calendar';
  }
};

// Obtener color del icono según el estatus
const getStatusIconColor = (status: string): string => {
  switch (status) {
    case 'Confirmada': return 'success';
    case 'Cancelada': return 'error';
    case 'Asistida': return 'primary';
    case 'No Asistida': return 'warning';
    default: return 'grey';
  }
};
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 8px;
}

.v-window-item {
  min-height: 200px;
}
</style>