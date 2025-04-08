<template>
  <v-container class="feedback-view">
    <!-- Encabezado con diseño mejorado -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center justify-center mb-2">
          <Icon icon="solar:chat-round-like-bold" width="36" class="mr-3 text-primary" />
          <h1 class="text-h3 font-weight-bold text-gradient">Feedback y Opiniones</h1>
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
                  <v-radio label="Opinión" value="opinion" color="primary">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <Icon icon="solar:chat-round-like-bold" width="20" class="mr-2 text-green-darken-1" />
                        <span>Opinión</span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>

              <!-- Formulario para Quejas -->
              <div v-if="feedbackType === 'complaint'" class="feedback-complaint-form">
                <!-- Selección de entrenador/clase (solo para quejas) -->
                <div class="form-section">
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

                <!-- Calificación para Quejas -->
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

                <!-- Comentarios para Quejas -->
                <div class="form-section">
                  <div class="section-header mb-4">
                    <Icon icon="solar:chat-round-bold" width="24" class="mr-2 text-primary" />
                    <h2 class="text-h5 font-weight-bold">Comentarios</h2>
                  </div>
                  <v-textarea v-model="comments" label="Describe tu experiencia"
                    placeholder="Sé específico para ayudarnos a mejorar..." variant="outlined" rows="5" auto-grow
                    :rules="[requiredRule]"></v-textarea>
                </div>
              </div>

              <!-- Formulario para Opiniones -->
              <div v-else class="feedback-opinion-form">
                <!-- Tipo de opinión -->
                <div class="form-section">
                  <div class="section-header mb-4">
                    <Icon icon="solar:document-bold" width="24" class="mr-2 text-primary" />
                    <h2 class="text-h5 font-weight-bold">Tipo de Opinión</h2>
                  </div>
                  <v-select v-model="opinionType" :items="opinionTypes" label="Selecciona el tipo de opinión"
                    variant="outlined" density="comfortable" prepend-inner-icon="solar:chat-square-like-bold"
                    :rules="[requiredRule]"></v-select>
                </div>

                <!-- Comentarios para Opiniones -->
                <div class="form-section">
                  <div class="section-header mb-4">
                    <Icon icon="solar:chat-round-bold" width="24" class="mr-2 text-primary" />
                    <h2 class="text-h5 font-weight-bold">Tu Opinión</h2>
                  </div>
                  <v-textarea v-model="comments" label="Describe tu experiencia o sugerencia"
                    placeholder="Sé específico para ayudarnos a mejorar..." variant="outlined" rows="5" auto-grow
                    :rules="[requiredRule]"></v-textarea>
                </div>
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
              <v-tab value="opinions">
                <Icon icon="solar:chat-round-like-bold" width="20" class="mr-2" />
                Mis Opiniones
              </v-tab>
            </v-tabs>

            <!-- Cargando historial -->
            <div v-if="loadingHistory" class="d-flex justify-center align-center py-10">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </div>

            <!-- Sin historial de quejas -->
            <v-alert v-else-if="historyTab === 'complaints' && myComplaints.length === 0" type="info" variant="tonal"
              class="text-center py-6">
              <Icon icon="solar:inbox-line-duotone" width="48" class="mb-4 text-grey-lighten-1" />
              <p class="text-h6">No has realizado ninguna queja</p>
              <p class="text-body-1">Tus quejas aparecerán aquí cuando las envíes</p>
            </v-alert>

            <!-- Sin historial de opiniones -->
            <v-alert v-else-if="historyTab === 'opinions' && myOpinions.length === 0" type="info" variant="tonal"
              class="text-center py-6">
              <Icon icon="solar:inbox-line-duotone" width="48" class="mb-4 text-grey-lighten-1" />
              <p class="text-h6">No has compartido ninguna opinión</p>
              <p class="text-body-1">Tus opiniones aparecerán aquí cuando las envíes</p>
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

            <!-- Lista de opiniones -->
            <v-list v-else-if="historyTab === 'opinions'" class="history-list">
              <v-list-item v-for="item in myOpinions" :key="item.ID" class="history-item mb-4" data-aos="fade-up">
                <template v-slot:prepend>
                  <v-avatar :color="getOpinionTypeColor(item.Tipo)" size="48" class="mr-4">
                    <Icon :icon="getOpinionTypeIcon(item.Tipo)" width="24"
                      :class="getOpinionTypeTextColor(item.Tipo)" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-h6 d-flex align-center">
                  {{ item.Tipo }}
                  <v-chip size="small" :color="getOpinionStatusColor(item.Estatus)" label class="ml-2">
                    {{ item.Estatus ? 'Respondida' : 'Pendiente' }}
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle class="mt-2">
                  <div class="d-flex align-center mb-2">
                    <span class="text-caption text-medium-emphasis">{{ formatDate(item.Fecha_Registro) }}</span>
                  </div>
                  <p class="text-body-1">{{ item.Descripcion }}</p>

                  <!-- Mostrar respuesta si existe -->
                  <div v-if="item.Estatus === true" class="mt-3 pa-3 response-section">
                    <div class="d-flex align-center mb-2">
                      <Icon icon="solar:chat-square-like-bold" width="18" class="mr-2 text-primary" />
                      <span class="text-subtitle-2 font-weight-bold">Respuesta:</span>
                    </div>
                    <p class="text-body-1">{{ item.Respuesta || 'Sin respuesta detallada.' }}</p>
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn icon variant="text" :color="item.Estatus ? 'info' : 'primary'"
                    @click.stop="item.Estatus ? viewOpinionDetails(item) : editOpinion(item)"
                    :disabled="loadingItem === item.ID">
                    <Icon :icon="item.Estatus ? 'solar:eye-bold' : 'solar:pen-bold'" width="20" />
                  </v-btn>
                  <v-btn icon variant="text" color="error" @click.stop="deleteOpinion(item.ID)"
                    :loading="loadingItem === item.ID">
                    <Icon icon="solar:trash-bin-trash-bold" width="20" />
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Diálogo para editar opinión -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Editar Opinión</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateOpinion">
            <!-- Tipo de opinión -->
            <v-select v-model="editedOpinion.Tipo" :items="opinionTypes" label="Tipo de opinión" variant="outlined"
              density="comfortable" prepend-inner-icon="solar:chat-square-like-bold" :rules="[requiredRule]"
              class="mb-4"></v-select>

            <!-- Descripción -->
            <v-textarea v-model="editedOpinion.Descripcion" label="Tu opinión" variant="outlined" rows="5" auto-grow
              :rules="[requiredRule]"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="editDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" :loading="updating" @click="updateOpinion">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Diálogo para ver detalles de opinión -->
    <v-dialog v-model="viewDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 primary--text">
          Detalles de la Opinión
          <v-spacer></v-spacer>
          <v-btn icon @click="viewDialog = false">
            <Icon icon="solar:close-circle-bold" width="24" />
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <div v-if="currentOpinionDetails">
            <!-- Encabezado -->
            <div class="d-flex align-center mb-4">
              <v-avatar :color="getOpinionTypeColor(currentOpinionDetails.Tipo)" size="36" class="mr-3">
                <Icon :icon="getOpinionTypeIcon(currentOpinionDetails.Tipo)" width="20"
                  :class="getOpinionTypeTextColor(currentOpinionDetails.Tipo)" />
              </v-avatar>

              <div>
                <div class="d-flex align-center">
                  <span class="text-h6 font-weight-bold">{{ currentOpinionDetails.Tipo }}</span>
                  <v-chip size="small" :color="getOpinionStatusColor(currentOpinionDetails.Estatus)" label class="ml-2">
                    {{ currentOpinionDetails.Estatus ? 'Respondida' : 'Pendiente' }}
                  </v-chip>
                </div>
                <span class="text-caption text-medium-emphasis">
                  {{ formatDate(currentOpinionDetails.Fecha_Registro) }}
                </span>
              </div>
            </div>

            <!-- Contenido de la opinión -->
            <div class="mb-4">
              <p class="text-subtitle-2 font-weight-bold mb-1">Tu opinión:</p>
              <div class="pa-3 rounded-lg" style="background-color: rgba(0,0,0,0.03);">
                <p class="text-body-1">{{ currentOpinionDetails.Descripcion }}</p>
              </div>
            </div>

            <!-- Respuesta (si existe) -->
            <div v-if="currentOpinionDetails.Estatus && currentOpinionDetails.Respuesta">
              <p class="text-subtitle-2 font-weight-bold mb-1">Respuesta:</p>
              <div class="pa-3 response-section">
                <p class="text-body-1">{{ currentOpinionDetails.Respuesta }}</p>
                <p v-if="currentOpinionDetails.Fecha_Actualizacion" class="text-caption text-medium-emphasis mt-2">
                  Respondido el: {{ formatDate(currentOpinionDetails.Fecha_Actualizacion) }}
                </p>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="viewDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import FeedbackService, { Queja } from '@/services/FeedbackService';
import ClassesService from '@/services/ClassesService';
import OpinionClienteService, { OpinionCliente } from '@/services/OpinionClienteService';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Estado del formulario
const activeTab = ref<'new' | 'history'>('new');
const feedbackType = ref<'complaint' | 'opinion'>('complaint');
const selectedTrainer = ref<number | null>(null);
const selectedService = ref<number | null>(null);
const rating = ref(0);
const comments = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Estado para el tipo de opinión
const opinionType = ref<string>('Sugerencia');
const opinionTypes = [
  'Queja',
  'Sugerencia',
  'Felicitacion',
  'Recomendacion',
  'Otro'
];

// Estado para el historial
const historyTab = ref<'complaints' | 'opinions'>('complaints');
const myComplaints = ref<Queja[]>([]);
const myOpinions = ref<OpinionCliente[]>([]);
const loadingHistory = ref(false);
const deletingItem = ref<number | null>(null);
const loadingItem = ref<number | null>(null);

// Estado para edición de opiniones
const editDialog = ref(false);
const editedOpinion = ref<{ ID?: number, Tipo: string, Descripcion: string }>({
  Tipo: '',
  Descripcion: ''
});
const updating = ref(false);

// Estado para visualización de detalles
const viewDialog = ref(false);
const currentOpinionDetails = ref<OpinionCliente | null>(null);

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
  if (comments.value.trim().length === 0) return false;

  if (feedbackType.value === 'complaint') {
    if (rating.value === 0) return false;
    return !!selectedTrainer.value && !!selectedService.value;
  } else {
    return opinionType.value.trim().length > 0;
  }
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
      myOpinions.value = await OpinionClienteService.getMisOpiniones();
      console.log('Opiniones recibidas:', JSON.stringify(myOpinions.value, null, 2));
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
      historyTab.value = 'complaints';
    } else {
      await OpinionClienteService.createOpinion({
        Tipo: opinionType.value,
        Descripcion: comments.value
      });

      successMessage.value = '¡Tu opinión ha sido enviada con éxito!';
      historyTab.value = 'opinions';
    }

    resetForm();
    activeTab.value = 'history'; // Cambiar a la pestaña de historial
  } catch (err) {
    console.error('Error al enviar feedback:', err);
    error.value = 'No se pudo enviar tu feedback. Por favor, intenta nuevamente más tarde.';
  } finally {
    loading.value = false;
  }
};

// Funciones para manejo de quejas
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

// Funciones para manejo de opiniones
const editOpinion = (opinion: OpinionCliente) => {
  editedOpinion.value = {
    ID: opinion.ID,
    Tipo: opinion.Tipo,
    Descripcion: opinion.Descripcion
  };
  editDialog.value = true;
};

// Función para ver detalles de opinión
const viewOpinionDetails = (opinion: OpinionCliente) => {
  currentOpinionDetails.value = opinion;
  viewDialog.value = true;
};

const updateOpinion = async () => {
  if (!editedOpinion.value.ID) return;

  updating.value = true;
  error.value = null;

  try {
    await OpinionClienteService.updateOpinion(editedOpinion.value.ID, {
      Tipo: editedOpinion.value.Tipo,
      Descripcion: editedOpinion.value.Descripcion
    });

    editDialog.value = false;
    loadFeedbackHistory();
    successMessage.value = 'Opinión actualizada con éxito';
  } catch (err) {
    console.error('Error al actualizar opinión:', err);
    error.value = 'No se pudo actualizar la opinión. Por favor, intenta nuevamente más tarde.';
  } finally {
    updating.value = false;
  }
};

const deleteOpinion = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta opinión?')) return;

  loadingItem.value = id;
  error.value = null;

  try {
    await OpinionClienteService.deleteOpinion(id);
    loadFeedbackHistory();
    successMessage.value = 'Opinión eliminada con éxito';
  } catch (err) {
    console.error(`Error al eliminar opinión ${id}:`, err);
    error.value = 'No se pudo eliminar la opinión. Por favor, intenta nuevamente más tarde.';
  } finally {
    loadingItem.value = null;
  }
};

// Función para obtener color según el tipo de opinión
const getOpinionTypeColor = (type: string): string => {
  switch (type) {
    case 'Queja': return 'amber-lighten-5';
    case 'Sugerencia': return 'green-lighten-5';
    case 'Felicitacion': return 'blue-lighten-5';
    case 'Recomendacion': return 'purple-lighten-5';
    default: return 'grey-lighten-3';
  }
};

// Función para obtener icono según el tipo de opinión
const getOpinionTypeIcon = (type: string): string => {
  switch (type) {
    case 'Queja': return 'hugeicons:complaint';
    case 'Sugerencia': return 'solar:chat-round-like-bold';
    case 'Felicitacion': return 'solar:like-bold';
    case 'Recomendacion': return 'solar:stars-bold';
    default: return 'solar:chat-bold';
  }
};

// Función para obtener color de texto según el tipo de opinión
const getOpinionTypeTextColor = (type: string): string => {
  switch (type) {
    case 'Queja': return 'text-amber-darken-2';
    case 'Sugerencia': return 'text-green-darken-1';
    case 'Felicitacion': return 'text-blue-darken-1';
    case 'Recomendacion': return 'text-purple-darken-1';
    default: return 'text-grey-darken-1';
  }
};

// Función para obtener color según el estado de la opinión
const getOpinionStatusColor = (status: boolean): string => {
  return status ? 'success' : 'warning';
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
  opinionType.value = 'Sugerencia';
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

.response-section {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  border-left: 3px solid var(--v-theme-primary);
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