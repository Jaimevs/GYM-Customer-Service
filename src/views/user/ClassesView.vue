<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Clases</h1>
        <p class="text-subtitle-1">Explora y reserva tus clases favoritas.</p>
      </v-col>
    </v-row>

    <!-- Cargando -->
    <v-row v-if="loading">
      <v-col cols="12" class="d-flex justify-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Error -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Lista de clases disponibles -->
    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-title>Clases Disponibles</v-card-title>
          <v-card-text>
            <v-list v-if="classes.length > 0">
              <v-list-item v-for="classItem in classes" :key="classItem.ID" @click="selectClass(classItem)">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ classItem.Nombre }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ classItem.Dia_Inicio }} a {{ classItem.Dia_Fin }}, 
                    {{ formatTime(classItem.Hora_Inicio) }} - {{ formatTime(classItem.Hora_Fin) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">
                    Entrenador: {{ classItem.Entrenador_Nombre || 'Sin nombre' }} 
                    {{ classItem.Entrenador_Apellido || '' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="primary" outlined @click.stop="bookClass(classItem)">
                    Reservar
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info">
              No hay clases disponibles en este momento.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalles de la clase seleccionada -->
    <v-row v-if="selectedClass">
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ selectedClass.Nombre }}</v-card-title>
          <v-card-subtitle>
            Entrenador: {{ selectedClass.Entrenador_Nombre || 'Sin nombre' }} 
            {{ selectedClass.Entrenador_Apellido || '' }}
          </v-card-subtitle>
          <v-card-text>
            <p><strong>Horario:</strong> {{ selectedClass.Dia_Inicio }} a {{ selectedClass.Dia_Fin }}, 
              {{ formatTime(selectedClass.Hora_Inicio) }} - {{ formatTime(selectedClass.Hora_Fin) }}</p>
            <p><strong>Duración:</strong> {{ selectedClass.Duracion_Minutos }} minutos</p>
            <p v-if="selectedClass.Descripcion"><strong>Descripción:</strong> {{ selectedClass.Descripcion }}</p>
            <p v-else><strong>Descripción:</strong> No hay descripción disponible.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="primary" @click="cancelBooking(selectedClass)">
              Cancelar Reserva
            </v-btn>
            <v-btn color="primary" @click="bookClass(selectedClass)">
              Confirmar Reserva
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ClassesService, { ClaseWithEntrenador } from '../../services/ClassesService';

// Estado para clases
const classes = ref<ClaseWithEntrenador[]>([]);
const selectedClass = ref<ClaseWithEntrenador | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// Cargar clases cuando se monta el componente
onMounted(async () => {
  await loadClasses();
});

// Función para cargar las clases desde la API
const loadClasses = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    classes.value = await ClassesService.getAllClasses();
  } catch (err) {
    console.error('Error al cargar clases:', err);
    error.value = 'No se pudieron cargar las clases. Por favor, intenta nuevamente más tarde.';
  } finally {
    loading.value = false;
  }
};

// Función para seleccionar una clase
const selectClass = (classItem: ClaseWithEntrenador) => {
  selectedClass.value = classItem;
};

// Función para reservar una clase
const bookClass = (classItem: ClaseWithEntrenador) => {
  // Aquí podrías implementar la lógica para reservar (si tienes un endpoint para ello)
  // Por ahora, solo mostraremos una alerta
  alert(`Clase reservada: ${classItem.Nombre}`);
  selectedClass.value = null; // Limpiar selección después de reservar
};

// Función para cancelar una reserva
const cancelBooking = (classItem: ClaseWithEntrenador) => {
  // Aquí podrías implementar la lógica para cancelar (si tienes un endpoint para ello)
  // Por ahora, solo mostraremos una alerta
  alert(`Reserva cancelada: ${classItem.Nombre}`);
  selectedClass.value = null; // Limpiar selección después de cancelar
};

// Función para formatear la hora
const formatTime = (timeString: string): string => {
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
    console.error('Error al formatear la hora:', e);
    return timeString;
  }
};
</script>

<style scoped>
/* Estilos personalizados */
.v-list-item {
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
}

.v-list-item:last-child {
  border-bottom: none;
}
</style>