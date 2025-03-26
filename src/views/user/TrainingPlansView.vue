<template>
  <v-container class="training-plans-view">
    <!-- Título de la página con animación -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <Icon icon="solar:dumbbell-bold" width="36" class="mr-3 text-primary" />
          <h1 class="text-h3 font-weight-bold text-gradient">Planes de Entrenamiento</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis">
          Crea y gestiona tus planes personalizados de entrenamiento
        </p>
      </v-col>
    </v-row>

    <!-- Tabs para alternar entre crear y ver entrenamientos -->
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" bg-color="transparent" color="primary" data-aos="fade-up">
          <v-tab value="create" class="font-weight-bold">Crear Entrenamiento</v-tab>
          <v-tab value="view" class="font-weight-bold">Mis Entrenamientos</v-tab>
        </v-tabs>

        <v-divider class="mb-4"></v-divider>

        <v-window v-model="activeTab">
          <!-- Pestaña de Crear Entrenamiento -->
          <v-window-item value="create">
            <v-row>
              <!-- Selección de parte del cuerpo -->
              <v-col cols="12" md="6" data-aos="fade-right">
                <v-card elevation="2" class="h-100">
                  <v-card-title class="d-flex align-center">
                    <Icon icon="solar:body-bold" width="24" class="mr-2" />
                    <span>Parte del Cuerpo</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col v-for="part in bodyParts" :key="part.id" cols="6" sm="4" data-aos="zoom-in"
                        :data-aos-delay="100 * bodyParts.indexOf(part)">
                        <v-btn block :color="selectedBodyPart === part.id ? 'primary' : 'grey-lighten-3'"
                          variant="elevated" class="py-4 body-part-btn" height="100"
                          @click="handleSelectBodyPart(part.id)">
                          <v-row class="d-flex flex-column align-center">
                            <v-col class="text-h5 pa-0 mb-1">{{ part.icon }}</v-col>
                            <v-col class="text-subtitle-2 pa-0">{{ part.name }}</v-col>
                          </v-row>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Lista de ejercicios -->
              <v-col cols="12" md="6" v-if="selectedBodyPart" data-aos="fade-left" data-aos-delay="200">
                <v-card elevation="2" class="h-100">
                  <v-card-title class="d-flex align-center">
                    <Icon icon="solar:exercise-bold" width="24" class="mr-2" />
                    <span>Ejercicios Disponibles</span>
                    <v-spacer></v-spacer>
                    <v-chip small color="primary">
                      {{ selectedBodyPart }}
                    </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <div v-if="loading" class="d-flex justify-center py-8">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <template v-else-if="exercises.length === 0">
                      <p class="text-medium-emphasis">No hay ejercicios disponibles para esta parte del cuerpo.</p>
                    </template>
                    <template v-else>
                      <v-list class="exercise-list">
                        <v-list-item v-for="exercise in exercises" :key="exercise.ID" data-aos="fade-up"
                          :data-aos-delay="50 * exercises.indexOf(exercise)">
                          <template v-slot:prepend>
                            <v-checkbox v-model="selectedExercisesMap[exercise.ID]"
                              @update:model-value="updateSelectedExercises" hide-details color="primary"></v-checkbox>
                          </template>
                          <v-list-item-title>{{ exercise.Nombre }}</v-list-item-title>
                          <template v-slot:append>
                            <Icon icon="solar:info-circle-bold" width="20" class="text-medium-emphasis" />
                          </template>
                        </v-list-item>
                      </v-list>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Resumen del entrenamiento -->
            <v-row v-if="selectedExerciseIds.length > 0" class="mt-4" data-aos="fade-up" data-aos-delay="300">
              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title class="d-flex align-center">
                    <Icon icon="solar:clipboard-list-bold" width="24" class="mr-2" />
                    <span>Resumen del Entrenamiento</span>
                    <v-spacer></v-spacer>
                    <v-chip small color="primary">
                      {{ selectedExerciseIds.length }} ejercicios
                    </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <v-list class="selected-exercises-list">
                      <v-list-item v-for="exerciseId in selectedExerciseIds" :key="exerciseId">
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-dumbbell</v-icon>
                        </template>
                        <v-list-item-title>{{ getExerciseName(exerciseId) }}</v-list-item-title>
                      </v-list-item>
                    </v-list>

                    <v-row class="mt-4">
                      <v-col cols="12" md="6">
                        <v-text-field v-model="workoutName" label="Nombre del entrenamiento"
                          placeholder="Ej: Día de Piernas" variant="outlined" color="primary"
                          prepend-inner-icon="solar:pen-bold"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="workoutDate" label="Fecha del entrenamiento" type="date"
                          variant="outlined" color="primary" prepend-inner-icon="solar:calendar-bold"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn color="primary" :disabled="!workoutName || !workoutDate || isSaving"
                      @click="handleSaveWorkout" :loading="isSaving" prepend-icon="solar:save-bold">
                      Guardar Entrenamiento
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Pestaña de Mis Entrenamientos -->
          <v-window-item value="view">
            <v-row>
              <v-col cols="12">
                <v-card elevation="2" data-aos="fade-up">
                  <!-- ... (encabezado igual) ... -->
                  <v-card-text>
                    <div v-if="loadingWorkouts" class="d-flex justify-center py-8">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div v-else-if="savedWorkouts.length === 0" class="d-flex flex-column align-center py-8">
                      <!-- ... (contenido cuando no hay entrenamientos) ... -->
                    </div>
                    <v-expansion-panels v-else class="workout-panels" v-model="expandedPanels">
                      <v-expansion-panel v-for="workout in savedWorkouts" :key="workout.ID" class="workout-panel">
                        <v-expansion-panel-title class="workout-panel-title" @click="handlePanelClick(workout.ID)">
                          <div class="d-flex align-center">
                            <Icon icon="solar:dumbbell-bold" width="20" class="mr-2" />
                            <span class="font-weight-medium">{{ workout.Nombre }}</span>
                            <v-spacer></v-spacer>
                            <span class="text-caption text-medium-emphasis mr-2">
                              {{ formatDate(workout.Fecha) }}
                            </span>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="workout-panel-content">
                          <v-list density="compact" class="workout-exercises-list">
                            <v-list-item v-for="(ejercicio, i) in workout.ejercicios" :key="i">
                              <template v-slot:prepend>
                                <v-icon color="primary" size="small">mdi-dumbbell</v-icon>
                              </template>
                              <v-list-item-title>{{ ejercicio.Nombre }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                          <div class="d-flex justify-end mt-3">
                            <v-btn color="error" variant="text" @click.stop="handleDeleteWorkout(workout.ID)"
                              prepend-icon="solar:trash-bin-trash-bold">
                              Eliminar
                            </v-btn>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <!-- Alerta de notificación -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import AuthService from '@/services/AuthService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';

// Inicializar AOS
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
});

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://gymtoday1243.com';

// Estado para las pestañas
const activeTab = ref('create');

// Estado para la carga y guardado
const loading = ref(false);
const loadingWorkouts = ref(false);
const isSaving = ref(false);

// Notificaciones
const snackbar = ref({
  show: false,
  text: '',
  color: 'primary',
  timeout: 3000
});


// Estado para los paneles expandidos
const expandedPanels = ref([]);

// Manejar clic en el panel
const handlePanelClick = (workoutId) => {
  // Forzar re-renderizado del panel eliminando y agregando AOS
  const index = expandedPanels.value.indexOf(workoutId);
  if (index === -1) {
    // Cuando se expande
    expandedPanels.value.push(workoutId);
  } else {
    // Cuando se contrae
    expandedPanels.value.splice(index, 1);
  }
};


// Estado para creación de entrenamientos
const selectedBodyPart = ref(null);
const selectedExercisesMap = ref({});
const exercises = ref([]);
const savedWorkouts = ref([]);
const workoutName = ref("");
const workoutDate = ref("");

// Obtener el usuario actual
const currentUser = computed(() => AuthService.getUser());

// Partes del cuerpo con mejores iconos
const bodyParts = [
  { id: "piernas", name: "Piernas", icon: "🦵" },
  { id: "pecho", name: "Pecho", icon: "🏋️" },
  { id: "espalda", name: "Espalda", icon: "🧘" },
  { id: "hombros", name: "Hombros", icon: "💪" },
  { id: "brazos", name: "Brazos", icon: "💪" },
  { id: "abdominales", name: "Abdominales", icon: "🩲" },
  { id: "cardio", name: "Cardio", icon: "🏃" },
  { id: "fullbody", name: "Full Body", icon: "👤" },
];

// Computado para obtener los IDs de ejercicios seleccionados
const selectedExerciseIds = computed(() => {
  return Object.keys(selectedExercisesMap.value)
    .filter(id => selectedExercisesMap.value[id])
    .map(id => parseInt(id));
});

// Establecer la fecha predeterminada al cargar el componente
onMounted(() => {
  setDefaultDate();
  if (AuthService.isAuthenticated()) {
    fetchUserWorkouts();
  }
});

// Watch para cambiar a la pestaña de ver después de guardar
watch(activeTab, (newTab) => {
  if (newTab === 'view' && AuthService.isAuthenticated()) {
    fetchUserWorkouts();
  }
});

// Función para establecer la fecha actual
const setDefaultDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  workoutDate.value = `${year}-${month}-${day}`;
};

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString; // Fallback en caso de error
  }
};

// Obtener nombre de ejercicio por ID
const getExerciseName = (id) => {
  const exercise = exercises.value.find(ex => ex.ID === parseInt(id));
  return exercise ? exercise.Nombre : `Ejercicio #${id}`;
};

// Métodos para interactuar con la API
const fetchExercisesByCategory = async (categoria) => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/ejercicios/categoria/${categoria}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    exercises.value = response.data;
    selectedExercisesMap.value = {};
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    exercises.value = [];
    showNotification('Error al cargar ejercicios', 'error');
  } finally {
    loading.value = false;
  }
};

const fetchUserWorkouts = async () => {
  if (!AuthService.isAuthenticated()) return;

  loadingWorkouts.value = true;
  try {
    const userId = currentUser.value.id;
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/entrenamientos/usuario/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    savedWorkouts.value = response.data;
  } catch (error) {
    console.error('Error al obtener entrenamientos:', error);
    savedWorkouts.value = [];
    showNotification('Error al cargar entrenamientos', 'error');
  } finally {
    loadingWorkouts.value = false;
  }
};

const handleSaveWorkout = async () => {
  if (!AuthService.isAuthenticated()) {
    showNotification('Debes iniciar sesión para guardar un entrenamiento', 'error');
    return;
  }

  if (selectedExerciseIds.value.length === 0 || !workoutName.value || !workoutDate.value) {
    showNotification('Por favor completa todos los campos', 'warning');
    return;
  }

  isSaving.value = true;
  try {
    const userId = currentUser.value.id;
    const token = localStorage.getItem('token');

    const nuevoEntrenamiento = {
      Nombre: workoutName.value,
      Fecha: workoutDate.value,
      ID_Usuario: userId,
      ejercicios_ids: selectedExerciseIds.value
    };

    await axios.post(`${API_URL}/entrenamientos/`, nuevoEntrenamiento, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Resetear formulario
    workoutName.value = "";
    selectedExercisesMap.value = {};
    selectedBodyPart.value = null;
    setDefaultDate();

    showNotification('Entrenamiento guardado con éxito', 'success');
    activeTab.value = 'view';
  } catch (error) {
    console.error('Error al guardar entrenamiento:', error);
    showNotification('Error al guardar el entrenamiento', 'error');
  } finally {
    isSaving.value = false;
  }
};

const handleDeleteWorkout = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este entrenamiento?')) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/entrenamientos/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    savedWorkouts.value = savedWorkouts.value.filter(workout => workout.ID !== id);
    showNotification('Entrenamiento eliminado con éxito', 'success');
  } catch (error) {
    console.error('Error al eliminar entrenamiento:', error);
    showNotification('Error al eliminar el entrenamiento', 'error');
  }
};

const showNotification = (text, color = 'success', timeout = 3000) => {
  snackbar.value = {
    show: true,
    text,
    color,
    timeout
  };
};

const handleSelectBodyPart = (bodyPart) => {
  selectedBodyPart.value = bodyPart;
  fetchExercisesByCategory(bodyPart);
};

const updateSelectedExercises = () => {};
</script>

<style scoped lang="scss">
.training-plans-view {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 32px;
}

.text-gradient {
  background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.body-part-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }
}

.exercise-list {
  .v-list-item {
    border-radius: 8px;
    margin-bottom: 4px;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.05);
    }
  }
}

.selected-exercises-list {
  max-height: 300px;
  overflow-y: auto;

  .v-list-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    &:last-child {
      border-bottom: none;
    }
  }
}

/* Estilos modificados para los paneles */
.workout-panels {
  .workout-panel {
    margin-bottom: 8px;
    border-radius: 8px !important;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.3s ease !important;

    &-title {
      background-color: rgba(var(--v-theme-primary), 0.05);
      font-weight: 500;
      padding: 0 16px !important;
      min-height: 56px !important;

      &:hover {
        background-color: rgba(var(--v-theme-primary), 0.08) !important;
      }
    }

    &-content {
      background-color: rgba(255, 255, 255, 0.7);
      padding: 16px !important;
      transition: all 0.3s ease !important;
    }
  }
}

/* Eliminar animaciones AOS para el contenido de los paneles */
.workout-panel-content {
  [data-aos] {
    opacity: 1 !important;
    transform: none !important;
  }
}

.workout-exercises-list {
  .v-list-item {
    border-radius: 6px;
    margin-bottom: 4px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
}

.v-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
  }
}

.v-card-title {
  padding: 16px 20px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-card-text {
  padding: 16px 20px !important;
}

.v-card-actions {
  padding: 12px 20px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.v-tab {
  letter-spacing: 0.5px;
  font-size: 0.95rem !important;
}

.v-expansion-panel-title {
  min-height: 56px !important;
  padding: 0 20px !important;
}

.v-expansion-panel-text__wrapper {
  padding: 12px 20px !important;
}
</style>
