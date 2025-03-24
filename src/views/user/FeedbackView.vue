<template>
  <v-container class="feedback-view">
    <!-- Título de la vista -->
    <h1 class="feedback-title">Quejas, Comentarios y Sugerencias</h1>

    <!-- Alertas -->
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>
    <v-alert v-if="successMessage" type="success" class="mb-4">
      {{ successMessage }}
    </v-alert>

    <!-- Formulario principal -->
    <v-form @submit.prevent="submitFeedback" class="feedback-form">
      <!-- Tipo de feedback (queja o comentario) -->
      <v-radio-group v-model="feedbackType" label="Tipo de Feedback" class="form-section">
        <v-radio label="Queja de la Clase del Entrenador" value="complaint"></v-radio>
        <v-radio label="Comentario/Sugerencia" value="comment"></v-radio>
      </v-radio-group>

      <!-- Seleccionar entrenador (si es queja) -->
      <v-select
        v-if="feedbackType === 'complaint'"
        v-model="selectedTrainer"
        :items="trainers"
        item-title="name"
        item-value="id"
        label="Selecciona un Entrenador"
        variant="outlined"
        clearable
        :loading="loadingTrainers"
        :disabled="loadingTrainers"
        class="form-section"
        @update:model-value="loadTrainerClasses"
      ></v-select>

      <!-- Seleccionar clase (si es queja) -->
      <v-select
        v-if="feedbackType === 'complaint' && selectedTrainer"
        v-model="selectedService"
        :items="trainerClasses"
        item-title="name"
        item-value="id"
        label="Selecciona una Clase"
        variant="outlined"
        clearable
        :loading="loadingClasses"
        :disabled="loadingClasses || trainerClasses.length === 0"
        class="form-section"
      ></v-select>

      <!-- Mensaje si no hay clases -->
      <v-alert v-if="feedbackType === 'complaint' && selectedTrainer && !loadingClasses && trainerClasses.length === 0" type="info" class="form-section">
        Este entrenador no tiene clases asignadas actualmente.
      </v-alert>

      <!-- Calificación -->
      <div class="form-section">
        <label class="mb-2 d-block">Calificación</label>
        <v-rating
          v-model="rating"
          color="warning"
          background-color="grey-lighten-1"
          hover
          size="30"
        ></v-rating>
      </div>

      <!-- Campo de texto para comentarios -->
      <v-textarea
        v-model="comments"
        label="Comentarios Adicionales"
        placeholder="Escribe aquí tus comentarios..."
        variant="outlined"
        rows="4"
        class="form-section"
      ></v-textarea>

      <!-- Botón de envío -->
      <v-btn
        type="submit"
        color="primary"
        :loading="loading"
        :disabled="loading || !isFormValid"
        block
        class="submit-button"
      >
        {{ loading ? 'Enviando...' : 'Enviar Feedback' }}
      </v-btn>
    </v-form>

    <!-- Historial de feedbacks -->
    <div class="feedback-history">
      <h2 class="history-title">Historial de Feedback</h2>

      <!-- Pestañas para cambiar entre quejas y sugerencias -->
      <v-tabs v-model="historyTab" color="primary" grow class="mb-4">
        <v-tab value="complaints">Mis Quejas</v-tab>
        <v-tab value="suggestions">Mis Sugerencias</v-tab>
      </v-tabs>

      <!-- Cargando historial -->
      <div v-if="loadingHistory" class="d-flex justify-center align-center py-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      
      <!-- Sin historial -->
      <v-alert v-else-if="historyTab === 'complaints' && myComplaints.length === 0" type="info">
        No has realizado ninguna queja todavía.
      </v-alert>
      <v-alert v-else-if="historyTab === 'suggestions' && mySuggestions.length === 0" type="info">
        No has realizado ninguna sugerencia todavía.
      </v-alert>
      
      <!-- Lista de quejas -->
      <v-list v-else-if="historyTab === 'complaints'" class="history-list">
        <v-list-item v-for="item in myComplaints" :key="item.ID" class="history-item">
          <v-list-item-content>
            <v-list-item-title>
              <strong>Entrenador:</strong> {{ getTrainerName(item.Entrenador_ID) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <strong>Calificación:</strong> {{ item.Calificacion }}/5
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="item.Comentario">
              <strong>Comentarios:</strong> {{ item.Comentario }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <strong>Fecha:</strong> {{ formatDate(item.Fecha_Registro) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn 
              icon="mdi-delete" 
              color="error" 
              variant="text" 
              @click="deleteComplaint(item.ID)"
              :disabled="deletingItem === item.ID"
            ></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      
      <!-- Lista de sugerencias -->
      <v-list v-else-if="historyTab === 'suggestions'" class="history-list">
        <v-list-item v-for="item in mySuggestions" :key="item.ID" class="history-item">
          <v-list-item-content>
            <v-list-item-title>
              <strong>Tipo:</strong> {{ item.Tipo || 'Comentario/Sugerencia' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <strong>Calificación:</strong> {{ item.Calificacion }}/5
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <strong>Comentarios:</strong> {{ item.Comentario }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <strong>Fecha:</strong> {{ formatDate(item.Fecha_Registro) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn 
              icon="mdi-delete" 
              color="error" 
              variant="text" 
              @click="deleteSuggestion(item.ID)"
              :disabled="deletingItem === item.ID"
            ></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import FeedbackService, { Queja, Sugerencia } from '../../services/FeedbackService';
import ClassesService from '../../services/ClassesService';

// Estado del formulario
const feedbackType = ref<'complaint' | 'comment'>('complaint');
const selectedTrainer = ref<number | null>(null);
const selectedService = ref<number | null>(null);
const rating = ref<number>(0);
const comments = ref<string>('');
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Estado para el historial
const historyTab = ref<'complaints' | 'suggestions'>('complaints');
const myComplaints = ref<Queja[]>([]);
const mySuggestions = ref<Sugerencia[]>([]);
const loadingHistory = ref<boolean>(false);
const deletingItem = ref<number | null>(null);

// Estado para entrenadores y clases
const trainers = ref<{ id: number; name: string }[]>([]);
const trainerClasses = ref<{ id: number; name: string }[]>([]);
const loadingTrainers = ref<boolean>(false);
const loadingClasses = ref<boolean>(false);

// Datos para mapeo
const trainerMap = ref<Map<number, string>>(new Map());
const classMap = ref<Map<number, string>>(new Map());

// Computados
const isFormValid = computed(() => {
  if (rating.value === 0) return false;
  
  if (feedbackType.value === 'complaint') {
    return !!selectedTrainer.value && !!selectedService.value;
  } else {
    return comments.value.trim().length > 0;
  }
});

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    loadTrainers(),
    loadFeedbackHistory()
  ]);
});

// Watch para recargar el historial cuando cambia la pestaña
watch(historyTab, () => {
  loadFeedbackHistory();
});

// Función para cargar entrenadores
const loadTrainers = async () => {
  loadingTrainers.value = true;
  
  try {
    // Obtener las clases para extraer entrenadores únicos
    const classes = await ClassesService.getAllClasses();
    
    // Extraer entrenadores únicos
    const uniqueTrainers = new Map();
    classes.forEach(classItem => {
      if (!uniqueTrainers.has(classItem.Entrenador_ID)) {
        const trainerName = `${classItem.Entrenador_Nombre || ''} ${classItem.Entrenador_Apellido || ''}`.trim() || 'Entrenador sin nombre';
        uniqueTrainers.set(classItem.Entrenador_ID, {
          id: classItem.Entrenador_ID,
          name: trainerName
        });
        
        // Guardar el mapeo de ID a nombre
        trainerMap.value.set(classItem.Entrenador_ID, trainerName);
      }
      
      // Guardar el mapeo de clase ID a nombre
      classMap.value.set(classItem.ID, classItem.Nombre);
    });
    
    trainers.value = Array.from(uniqueTrainers.values());
  } catch (err) {
    console.error('Error al cargar entrenadores:', err);
    error.value = 'No se pudieron cargar los entrenadores. Por favor, intenta nuevamente más tarde.';
  } finally {
    loadingTrainers.value = false;
  }
};

// Función para cargar clases del entrenador seleccionado
const loadTrainerClasses = async () => {
  if (!selectedTrainer.value) {
    trainerClasses.value = [];
    return;
  }
  
  loadingClasses.value = true;
  selectedService.value = null;
  
  try {
    const classes = await ClassesService.getClassesByTrainer(selectedTrainer.value);
    
    trainerClasses.value = classes.map(classItem => ({
      id: classItem.ID,
      name: classItem.Nombre
    }));
  } catch (err) {
    console.error(`Error al cargar clases del entrenador ${selectedTrainer.value}:`, err);
    error.value = 'No se pudieron cargar las clases. Por favor, intenta nuevamente más tarde.';
  } finally {
    loadingClasses.value = false;
  }
};

// Función para cargar historial de feedback
const loadFeedbackHistory = async () => {
  loadingHistory.value = true;
  error.value = null;
  
  try {
    if (historyTab.value === 'complaints') {
      myComplaints.value = await FeedbackService.getMyComplaints();
    } else {
      mySuggestions.value = await FeedbackService.getMySuggestions();
    }
  } catch (err) {
    console.error('Error al cargar historial de feedback:', err);
    error.value = 'No se pudo cargar tu historial de feedback. Por favor, intenta nuevamente más tarde.';
  } finally {
    loadingHistory.value = false;
  }
};

// Función para enviar feedback
const submitFeedback = async () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  error.value = null;
  successMessage.value = null;
  
  try {
    if (feedbackType.value === 'complaint') {
      await FeedbackService.createComplaint({
        Entrenador_ID: selectedTrainer.value!,
        Clase_ID: selectedService.value!,
        Calificacion: rating.value,
        Comentario: comments.value || null
      });
      
      successMessage.value = '¡Tu queja ha sido enviada con éxito!';
    } else {
      await FeedbackService.createSuggestion({
        Calificacion: rating.value,
        Comentario: comments.value,
        Tipo: 'Sugerencia'
      });
      
      successMessage.value = '¡Tu sugerencia ha sido enviada con éxito!';
    }
    
    // Reiniciar el formulario
    resetForm();
    
    // Recargar el historial
    loadFeedbackHistory();
  } catch (err) {
    console.error('Error al enviar feedback:', err);
    error.value = 'No se pudo enviar tu feedback. Por favor, intenta nuevamente más tarde.';
  } finally {
    loading.value = false;
  }
};

// Función para eliminar una queja
const deleteComplaint = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta queja?')) return;
  
  deletingItem.value = id;
  error.value = null;
  
  try {
    await FeedbackService.deleteComplaint(id);
    
    // Recargar el historial
    loadFeedbackHistory();
    
    successMessage.value = 'Queja eliminada con éxito';
  } catch (err) {
    console.error(`Error al eliminar queja ${id}:`, err);
    error.value = 'No se pudo eliminar la queja. Por favor, intenta nuevamente más tarde.';
  } finally {
    deletingItem.value = null;
  }
};

// Función para eliminar una sugerencia
const deleteSuggestion = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta sugerencia?')) return;
  
  deletingItem.value = id;
  error.value = null;
  
  try {
    await FeedbackService.deleteSuggestion(id);
    
    // Recargar el historial
    loadFeedbackHistory();
    
    successMessage.value = 'Sugerencia eliminada con éxito';
  } catch (err) {
    console.error(`Error al eliminar sugerencia ${id}:`, err);
    error.value = 'No se pudo eliminar la sugerencia. Por favor, intenta nuevamente más tarde.';
  } finally {
    deletingItem.value = null;
  }
};

// Obtener nombre de entrenador por ID
const getTrainerName = (id: number): string => {
  return trainerMap.value.get(id) || `Entrenador #${id}`;
};

// Obtener nombre de clase por ID
const getClassName = (id: number): string => {
  return classMap.value.get(id) || `Clase #${id}`;
};

// Función para formatear fecha
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Función para reiniciar el formulario
const resetForm = () => {
  feedbackType.value = 'complaint';
  selectedTrainer.value = null;
  selectedService.value = null;
  rating.value = 0;
  comments.value = '';
};
</script>

<style scoped lang="scss">
.feedback-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feedback-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.form-section {
  margin-bottom: 1.5rem;
}

.submit-button {
  margin-top: 1.5rem;
}

.feedback-history {
  margin-top: 3rem;
}

.history-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.history-item {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
}
</style>