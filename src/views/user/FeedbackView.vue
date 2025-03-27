<template>
  <v-container class="feedback-view">
    <!-- Encabezado con diseño mejorado -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center justify-center mb-2">
          <Icon icon="solar:chat-round-like-bold" width="36" class="mr-3 text-primary" />
          <h1 class="text-h3 font-weight-bold text-gradient">Feedback y Sugerencias</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis text-center">
          Comparte tus comentarios para ayudarnos a mejorar
        </p>
      </v-col>
    </v-row>

    <!-- Alerta flotante -->
    <v-alert v-if="error || successMessage" :type="error ? 'error' : 'success'" :text="error || successMessage"
      class="floating-alert" closable @click:close="error = null; successMessage = null"></v-alert>

    <!-- Contenedor principal con pestañas -->
    <v-card class="elevation-4 mx-auto" max-width="1000" data-aos="fade-up">
      <v-tabs v-model="activeTab" color="primary" grow>
        <v-tab value="new">
          <Icon icon="solar:pen-new-square-bold" width="20" class="mr-2" />
          Nuevo Feedback
        </v-tab>
        <v-tab value="history">
          <Icon icon="solar:clock-circle-bold" width="20" class="mr-2" />
          Mi Historial
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <v-window v-model="activeTab">
        <!-- Pestaña de nuevo feedback -->
        <v-window-item value="new">
          <v-card-text class="pa-6">
            <v-form @submit.prevent="submitFeedback" class="feedback-form">
              <!-- Tipo de feedback -->
              <div class="form-section">
                <div class="section-header mb-4">
                  <Icon icon="solar:document-bold" width="24" class="mr-2 text-primary" />
                  <h2 class="text-h5 font-weight-bold">Tipo de Feedback</h2>
                </div>
                <v-radio-group v-model="feedbackType" inline>
                  <v-radio label="Queja sobre clase/entrenador" value="complaint" color="primary">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <Icon icon="hugeicons:complaint" width="20" class="mr-2 text-amber-darken-2" />
                        <span>Queja</span>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio label="Sugerencia o comentario" value="comment" color="primary">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <Icon icon="solar:chat-round-like-bold" width="20" class="mr-2 text-green-darken-1" />
                        <span>Sugerencia</span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>

              <!-- Selección de entrenador/clase (solo para quejas) -->
              <div v-if="feedbackType === 'complaint'" class="form-section">
                <div class="section-header mb-4">
                  <Icon icon="solar:dumbbell-bold" width="24" class="mr-2 text-primary" />
                  <h2 class="text-h5 font-weight-bold">Detalles de la Clase</h2>
                </div>

                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-select v-model="selectedTrainer" :items="trainers" item-title="name" item-value="id"
                      label="Entrenador" variant="outlined" density="comfortable" clearable :loading="loadingTrainers"
                      :disabled="loadingTrainers" prepend-inner-icon="solar:user-bold"
                      @update:model-value="loadTrainerClasses"></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="selectedService" :items="trainerClasses" item-title="name" item-value="id"
                      label="Clase" variant="outlined" density="comfortable" clearable :loading="loadingClasses"
                      :disabled="loadingClasses || !selectedTrainer"
                      prepend-inner-icon="solar:calendar-mark-bold"></v-select>
                  </v-col>
                </v-row>

                <v-alert v-if="selectedTrainer && !loadingClasses && trainerClasses.length === 0" type="info"
                  variant="tonal" class="mt-2">
                  Este entrenador no tiene clases asignadas actualmente.
                </v-alert>
              </div>

              <!-- Calificación -->
              <div class="form-section">
                <div class="section-header mb-4">
                  <Icon icon="solar:star-bold" width="24" class="mr-2 text-primary" />
                  <h2 class="text-h5 font-weight-bold">Calificación</h2>
                </div>
                <div class="d-flex align-center justify-center">


                  <v-rating v-model="rating" color="amber" background-color="amber-lighten-4" size="40"
                    empty-icon="mdi-star-outline" full-icon="mdi-star" clearable></v-rating>


                  <span class="text-h6 ml-4">{{ ratingText }}</span>
                </div>
              </div>

              <!-- Comentarios -->
              <div class="form-section">
                <div class="section-header mb-4">
                  <Icon icon="solar:chat-round-bold" width="24" class="mr-2 text-primary" />
                  <h2 class="text-h5 font-weight-bold">Comentarios</h2>
                </div>
                <v-textarea v-model="comments" label="Describe tu experiencia o sugerencia"
                  placeholder="Sé específico para ayudarnos a mejorar..." variant="outlined" rows="5" auto-grow
                  :rules="[requiredRule]"></v-textarea>
              </div>

              <!-- Botones de acción -->
              <v-row class="mt-6">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="secondary" variant="outlined" class="mr-3" @click="resetForm" :disabled="loading">
                    <Icon icon="solar:close-circle-bold" width="18" class="mr-1" />
                    Cancelar
                  </v-btn>
                  <v-btn type="submit" color="primary" variant="flat" :loading="loading"
                    :disabled="loading || !isFormValid">
                    <Icon icon="solar:check-circle-bold" width="18" class="mr-1" />
                    Enviar Feedback
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-window-item>

        <!-- Pestaña de historial -->
        <v-window-item value="history">
          <v-card-text class="pa-6">
            <!-- Pestañas internas para historial -->
            <v-tabs v-model="historyTab" color="primary" grow class="mb-6">
              <v-tab value="complaints">
                <Icon icon="hugeicons:complaint" width="20" class="mr-2" />
                Mis Quejas
              </v-tab>
              <v-tab value="suggestions">
                <Icon icon="solar:chat-round-like-bold" width="20" class="mr-2" />
                Mis Sugerencias
              </v-tab>
            </v-tabs>

            <!-- Cargando historial -->
            <div v-if="loadingHistory" class="d-flex justify-center align-center py-10">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </div>

            <!-- Sin historial -->
            <v-alert v-else-if="historyTab === 'complaints' && myComplaints.length === 0" type="info" variant="tonal"
              class="text-center py-6">
              <Icon icon="solar:inbox-line-duotone" width="48" class="mb-4 text-grey-lighten-1" />
              <p class="text-h6">No has realizado ninguna queja</p>
              <p class="text-body-1">Tus quejas aparecerán aquí cuando las envíes</p>
            </v-alert>

            <v-alert v-else-if="historyTab === 'suggestions' && mySuggestions.length === 0" type="info" variant="tonal"
              class="text-center py-6">
              <Icon icon="solar:inbox-line-duotone" width="48" class="mb-4 text-grey-lighten-1" />
              <p class="text-h6">No has realizado ninguna sugerencia</p>
              <p class="text-body-1">Tus sugerencias aparecerán aquí cuando las envíes</p>
            </v-alert>

            <!-- Lista de quejas -->
            <v-list v-else-if="historyTab === 'complaints'" class="history-list">
              <v-list-item v-for="item in myComplaints" :key="item.ID" class="history-item mb-4" data-aos="fade-up">
                <template v-slot:prepend>
                  <v-avatar color="amber-lighten-5" size="48" class="mr-4">
                    <Icon icon="solar:angry-bold" width="24" class="text-amber-darken-2" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-h6">
                  {{ getTrainerName(item.Entrenador_ID) }}
                  <v-chip size="small" color="amber" label class="ml-2">
                    {{ getClassName(item.Clase_ID) }}
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle class="mt-2">
                  <div class="d-flex align-center mb-2">
                    <v-rating :model-value="item.Calificacion" readonly color="amber" size="20" density="compact"
                      class="mr-2"></v-rating>
                    <span class="text-caption text-medium-emphasis">{{ formatDate(item.Fecha_Registro) }}</span>
                  </div>
                  <p class="text-body-1">{{ item.Comentario }}</p>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn icon variant="text" color="error" @click.stop="deleteComplaint(item.ID)"
                    :loading="deletingItem === item.ID">
                    <Icon icon="solar:trash-bin-trash-bold" width="20" />
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <!-- Lista de sugerencias -->
            <v-list v-else-if="historyTab === 'suggestions'" class="history-list">
              <v-list-item v-for="item in mySuggestions" :key="item.ID" class="history-item mb-4" data-aos="fade-up">
                <template v-slot:prepend>
                  <v-avatar color="green-lighten-5" size="48" class="mr-4">
                    <Icon icon="solar:chat-round-like-bold" width="24" class="text-green-darken-1" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-h6">
                  {{ item.Tipo || 'Sugerencia' }}
                </v-list-item-title>

                <v-list-item-subtitle class="mt-2">
                  <div class="d-flex align-center mb-2">
                    <v-rating :model-value="item.Calificacion" readonly color="amber" size="20" density="compact"
                      class="mr-2"></v-rating>
                    <span class="text-caption text-medium-emphasis">{{ formatDate(item.Fecha_Registro) }}</span>
                  </div>
                  <p class="text-body-1">{{ item.Comentario }}</p>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn icon variant="text" color="error" @click.stop="deleteSuggestion(item.ID)"
                    :loading="deletingItem === item.ID">
                    <Icon icon="solar:trash-bin-trash-bold" width="20" />
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import FeedbackService, { Queja, Sugerencia } from '@/services/FeedbackService';
import ClassesService from '@/services/ClassesService';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Estado del formulario
const activeTab = ref<'new' | 'history'>('new');
const feedbackType = ref<'complaint' | 'comment'>('complaint');
const selectedTrainer = ref<number | null>(null);
const selectedService = ref<number | null>(null);
const rating = ref(0);
const comments = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Estado para el historial
const historyTab = ref<'complaints' | 'suggestions'>('complaints');
const myComplaints = ref<Queja[]>([]);
const mySuggestions = ref<Sugerencia[]>([]);
const loadingHistory = ref(false);
const deletingItem = ref<number | null>(null);

// Estado para entrenadores y clases
const trainers = ref<{ id: number; name: string }[]>([]);
const trainerClasses = ref<{ id: number; name: string }[]>([]);
const loadingTrainers = ref(false);
const loadingClasses = ref(false);

// Datos para mapeo
const trainerMap = ref<Map<number, string>>(new Map());
const classMap = ref<Map<number, string>>(new Map());

// Reglas de validación
const requiredRule = (v: string) => !!v || 'Este campo es requerido';

// Computados
const isFormValid = computed(() => {
  if (rating.value === 0) return false;
  if (comments.value.trim().length === 0) return false;

  if (feedbackType.value === 'complaint') {
    return !!selectedTrainer.value && !!selectedService.value;
  }
  return true;
});

const ratingText = computed(() => {
  const texts = [
    'No calificado',
    'Muy malo',
    'Malo',
    'Regular',
    'Bueno',
    'Excelente'
  ];
  return texts[rating.value];
});

// Cargar datos al montar el componente
onMounted(async () => {
  AOS.init({ duration: 800, once: true });
  await loadTrainers();
});

// Watch para recargar el historial cuando cambia la pestaña
watch(historyTab, () => {
  if (activeTab.value === 'history') {
    loadFeedbackHistory();
  }
});

watch(activeTab, (newVal) => {
  if (newVal === 'history') {
    loadFeedbackHistory();
  }
});

// Función para cargar entrenadores
const loadTrainers = async () => {
  loadingTrainers.value = true;

  try {
    const classes = await ClassesService.getAllClasses();

    const uniqueTrainers = new Map();
    classes.forEach(classItem => {
      if (!uniqueTrainers.has(classItem.Entrenador_ID)) {
        const trainerName = `${classItem.Entrenador_Nombre || ''} ${classItem.Entrenador_Apellido || ''}`.trim() || 'Entrenador sin nombre';
        uniqueTrainers.set(classItem.Entrenador_ID, {
          id: classItem.Entrenador_ID,
          name: trainerName
        });

        trainerMap.value.set(classItem.Entrenador_ID, trainerName);
      }

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

    resetForm();
    activeTab.value = 'history'; // Cambiar a la pestaña de historial
    historyTab.value = feedbackType.value === 'complaint' ? 'complaints' : 'suggestions';
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
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.text-gradient {
  background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.floating-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.form-section {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.2);
}

.history-list {
  padding: 0;
}

.history-item {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

@media (max-width: 960px) {
  .feedback-view {
    padding: 16px;
  }

  .floating-alert {
    left: 16px;
    right: 16px;
    max-width: none;
  }
}
</style>
