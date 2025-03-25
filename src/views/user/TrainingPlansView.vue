<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Planes de Entrenamiento</h1>
        <p class="text-subtitle-1">Crea y gestiona tus planes personalizados de entrenamiento.</p>
      </v-col>
    </v-row>

    <!-- Tabs para alternar entre crear y ver entrenamientos -->
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" bg-color="primary">
          <v-tab value="create">Crear Entrenamiento</v-tab>
          <v-tab value="view">Mis Entrenamientos</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Pestaña de Crear Entrenamiento -->
          <v-window-item value="create">
            <v-row class="mt-4">
              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title>Selecciona Parte del Cuerpo</v-card-title>
                  <v-card-subtitle>Elige qué parte del cuerpo quieres entrenar hoy</v-card-subtitle>
                  <v-card-text>
                    <v-row>
                      <v-col v-for="part in bodyParts" :key="part.id" cols="6" sm="3">
                        <v-btn 
                          block 
                          :color="selectedBodyPart === part.id ? 'primary' : 'default'" 
                          variant="outlined"
                          class="py-4"
                          height="90"
                          @click="handleSelectBodyPart(part.id)"
                        >
                          <v-row class="d-flex flex-column align-center">
                            <v-col class="text-h5 pa-0">{{ part.icon }}</v-col>
                            <v-col class="text-subtitle-2 pa-0">{{ part.name }}</v-col>
                          </v-row>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6" v-if="selectedBodyPart">
                <v-card>
                  <v-card-title>Ejercicios para {{ selectedBodyPart }}</v-card-title>
                  <v-card-subtitle>Selecciona los ejercicios que quieres incluir</v-card-subtitle>
                  <v-card-text>
                    <div v-if="loading" class="d-flex justify-center">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <template v-else-if="exercises.length === 0">
                      <p>No hay ejercicios disponibles para esta parte del cuerpo.</p>
                    </template>
                    <template v-else>
                      <v-list>
                        <v-list-item v-for="exercise in exercises" :key="exercise.ID">
                          <template v-slot:prepend>
                            <v-checkbox 
                              v-model="selectedExercisesMap[exercise.ID]"
                              @update:model-value="updateSelectedExercises"
                              hide-details
                            ></v-checkbox>
                          </template>
                          <v-list-item-title>{{ exercise.Nombre }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row v-if="selectedExerciseIds.length > 0" class="mt-4">
              <v-col cols="12">
                <v-card>
                  <v-card-title>Tu Entrenamiento</v-card-title>
                  <v-card-subtitle>Revisa y guarda tu plan de entrenamiento</v-card-subtitle>
                  <v-card-text>
                    <p class="font-weight-medium">Ejercicios seleccionados:</p>
                    <v-list>
                      <v-list-item v-for="exerciseId in selectedExerciseIds" :key="exerciseId">
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-dumbbell</v-icon>
                        </template>
                        <v-list-item-title>{{ getExerciseName(exerciseId) }}</v-list-item-title>
                      </v-list-item>
                    </v-list>

                    <v-text-field
                      v-model="workoutName"
                      label="Nombre del entrenamiento"
                      placeholder="Ej: Día de Piernas"
                      variant="outlined"
                      class="mt-4"
                    ></v-text-field>
                    
                    <!-- Selector de fecha simple y compatible -->
                    <v-text-field
                      v-model="workoutDate"
                      label="Fecha del entrenamiento"
                      type="date"
                      variant="outlined"
                      class="mt-2"
                      prepend-icon="mdi-calendar"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn 
                      color="primary" 
                      :disabled="!workoutName || !workoutDate || isSaving" 
                      @click="handleSaveWorkout"
                      :loading="isSaving"
                    >
                      Guardar Entrenamiento
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Pestaña de Mis Entrenamientos -->
          <v-window-item value="view">
            <v-row class="mt-4">
              <v-col cols="12">
                <v-card>
                  <v-card-title>Mis Entrenamientos</v-card-title>
                  <v-card-subtitle v-if="loadingWorkouts">
                    Cargando entrenamientos...
                  </v-card-subtitle>
                  <v-card-subtitle v-else-if="savedWorkouts.length === 0">
                    Aún no has guardado ningún entrenamiento
                  </v-card-subtitle>
                  <v-card-subtitle v-else>
                    Aquí puedes ver todos tus entrenamientos guardados
                  </v-card-subtitle>
                  <v-card-text>
                    <div v-if="loadingWorkouts" class="d-flex justify-center py-8">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div v-else-if="savedWorkouts.length === 0" class="d-flex flex-column align-center py-8">
                      <v-icon color="grey" size="64">mdi-dumbbell</v-icon>
                      <h3 class="mt-4 text-h6 font-weight-bold">No hay entrenamientos</h3>
                      <p class="text-subtitle-2 text-grey">
                        Crea tu primer entrenamiento en la pestaña "Crear Entrenamiento"
                      </p>
                    </div>
                    <v-expansion-panels v-else>
                      <v-expansion-panel v-for="workout in savedWorkouts" :key="workout.ID">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center justify-space-between" style="width: 100%">
                            <div class="d-flex align-center">
                              <v-icon class="mr-2">mdi-dumbbell</v-icon>
                              <strong>{{ workout.Nombre }}</strong>
                            </div>
                            <div class="workout-date">
                              <v-chip color="primary" variant="outlined" size="small">
                                <v-icon start size="small">mdi-calendar</v-icon>
                                {{ formatDate(workout.Fecha) }}
                              </v-chip>
                            </div>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-list density="compact">
                            <v-list-item v-for="(ejercicio, i) in workout.ejercicios" :key="i">
                              <v-list-item-title>{{ ejercicio.Nombre }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                          <div class="d-flex justify-end mt-3">
                            <v-btn color="error" variant="text" @click.stop="handleDeleteWorkout(workout.ID)">
                              <v-icon>mdi-delete</v-icon> Eliminar
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
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
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

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://18.130.133.242:8000';

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
  color: 'success',
  timeout: 3000
});

// Estado para creación de entrenamientos
const selectedBodyPart = ref(null);
const selectedExercisesMap = ref({});
const exercises = ref([]);
const savedWorkouts = ref([]);
const workoutName = ref("");
const workoutDate = ref("");

// Obtener el usuario actual
const currentUser = computed(() => AuthService.getUser());

// Partes del cuerpo
const bodyParts = [
  { id: "piernas", name: "Piernas", icon: "⦿" },
  { id: "pecho", name: "Pecho", icon: "⦿" },
  { id: "espalda", name: "Espalda", icon: "⦿" },
  { id: "hombros", name: "Hombros", icon: "⦿" },
  { id: "brazos", name: "Brazos", icon: "⦿" },
  { id: "abdominales", name: "Abdominales", icon: "⦿" },
  { id: "cardio", name: "Cardio", icon: "⦿" },
  { id: "fullbody", name: "Full Body", icon: "⦿" },
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

// Función para formatear fechas (más compatible con navegadores)
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
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
// Obtener ejercicios por categoría
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
    
    // Resetear selección de ejercicios
    selectedExercisesMap.value = {};
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    exercises.value = [];
    showNotification('Error al cargar ejercicios', 'error');
  } finally {
    loading.value = false;
  }
};

// Obtener entrenamientos del usuario actual
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

// Guardar un nuevo entrenamiento
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
    
    const response = await axios.post(`${API_URL}/entrenamientos/`, nuevoEntrenamiento, {
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
    
    // Cambiar a la pestaña de ver entrenamientos
    activeTab.value = 'view';
  } catch (error) {
    console.error('Error al guardar entrenamiento:', error);
    showNotification('Error al guardar el entrenamiento', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Eliminar un entrenamiento
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
    
    // Actualizar la lista de entrenamientos
    savedWorkouts.value = savedWorkouts.value.filter(workout => workout.ID !== id);
    
    showNotification('Entrenamiento eliminado con éxito', 'success');
  } catch (error) {
    console.error('Error al eliminar entrenamiento:', error);
    showNotification('Error al eliminar el entrenamiento', 'error');
  }
};

// Mostrar notificación
const showNotification = (text, color = 'success', timeout = 3000) => {
  snackbar.value = {
    show: true,
    text,
    color,
    timeout
  };
};

// Métodos para UI
const handleSelectBodyPart = (bodyPart) => {
  selectedBodyPart.value = bodyPart;
  // Cargar ejercicios para esta parte del cuerpo
  fetchExercisesByCategory(bodyPart);
};

const updateSelectedExercises = () => {
  // No es necesario hacer nada más, usamos el computed selectedExerciseIds
};
</script>

<style scoped>
/* Estilos personalizados */
.v-list-item {
  border-bottom: 1px solid #e0e0e0;
}

.v-list-item:last-child {
  border-bottom: none;
}

.workout-date {
  font-size: 0.9rem;
  color: #666;
}
</style>