<template>
  <v-container class="feedback-view">
    <!-- Título de la vista -->
    <h1 class="feedback-title">Quejas, Comentarios y Sugerencias</h1>

    <!-- Formulario principal -->
    <v-form @submit.prevent="submitFeedback" class="feedback-form">
      <!-- Tipo de feedback (queja o comentario) -->
      <v-radio-group v-model="feedbackType" label="Tipo de Feedback" class="form-section">
        <v-radio label="Queja" value="complaint"></v-radio>
        <v-radio label="Comentario/Sugerencia" value="comment"></v-radio>
      </v-radio-group>

      <!-- Seleccionar entrenador (si es queja) -->
      <v-select v-if="feedbackType === 'complaint'" v-model="selectedTrainer" :items="trainers" item-title="name"
        item-value="id" label="Selecciona un Entrenador" variant="outlined" clearable class="form-section"></v-select>

      <!-- Seleccionar servicio (si es queja) -->
      <v-select v-if="feedbackType === 'complaint'" v-model="selectedService" :items="services" item-title="name"
        item-value="id" label="Selecciona un Servicio" variant="outlined" clearable class="form-section"></v-select>

      <!-- Calificación -->
      <v-rating v-model="rating" color="warning" background-color="grey-lighten-1" half-increments hover size="30"
        label="Calificación" class="form-section"></v-rating>

      <!-- Campo de texto para comentarios -->
      <v-textarea v-model="comments" label="Comentarios Adicionales" placeholder="Escribe aquí tus comentarios..."
        variant="outlined" rows="4" class="form-section"></v-textarea>

      <!-- Botón de envío -->
      <v-btn type="submit" color="primary" :loading="loading" :disabled="loading" block class="submit-button">
        {{ loading ? 'Enviando...' : 'Enviar Feedback' }}
      </v-btn>
    </v-form>

    <!-- Historial de feedbacks -->
    <div class="feedback-history">
      <h2 class="history-title">Historial de Feedback</h2>
      <v-alert v-if="feedbackHistory.length === 0" type="info">
        No hay historial disponible.
      </v-alert>
      <v-list v-else class="history-list">
        <v-list-item v-for="(item, index) in feedbackHistory" :key="index" class="history-item">
          <v-list-item-content>
            <v-list-item-title>
              <strong>Tipo:</strong> {{ item.type === 'complaint' ? 'Queja' : 'Comentario/Sugerencia' }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="item.trainer">
              <strong>Entrenador:</strong> {{ item.trainer }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="item.service">
              <strong>Servicio:</strong> {{ item.service }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <strong>Calificación:</strong> {{ item.rating }}/5
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <strong>Comentarios:</strong> {{ item.comments }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="item.type === 'complaint'">
              <strong>Resolución:</strong> {{ item.resolution || 'Pendiente' }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Estado del formulario
const feedbackType = ref<'complaint' | 'comment'>('complaint'); // Tipo de feedback
const selectedTrainer = ref<number | null>(null); // Entrenador seleccionado
const selectedService = ref<number | null>(null); // Servicio seleccionado
const rating = ref<number>(0); // Calificación
const comments = ref<string>(''); // Comentarios adicionales
const loading = ref<boolean>(false); // Estado de carga

// Datos simulados para entrenadores y servicios
const trainers = ref([
  { id: 1, name: 'Juan Pérez' },
  { id: 2, name: 'María López' },
  { id: 3, name: 'Carlos Ramírez' },
]);

const services = ref([
  { id: 1, name: 'Clases grupales' },
  { id: 2, name: 'Entrenamiento personalizado' },
  { id: 3, name: 'Spa y masajes' },
]);

// Historial de feedbacks (simulado)
const feedbackHistory = ref<
  {
    type: 'complaint' | 'comment';
    trainer?: string;
    service?: string;
    rating: number;
    comments: string;
    resolution?: string;
  }[]
>([]);

// Función para enviar el feedback
const submitFeedback = async () => {
  if (!rating.value) {
    alert('Por favor, proporciona una calificación.');
    return;
  }

  loading.value = true;

  try {
    const trainer = trainers.value.find((t) => t.id === selectedTrainer.value);
    const service = services.value.find((s) => s.id === selectedService.value);

    const newFeedback = {
      type: feedbackType.value,
      trainer: trainer?.name || null,
      service: service?.name || null,
      rating: rating.value,
      comments: comments.value,
      resolution: feedbackType.value === 'complaint' ? 'Pendiente' : undefined,
    };

    // Simulación de envío a la API
    // await axios.post('/api/feedback', newFeedback);

    // Agregar al historial local
    feedbackHistory.value.push(newFeedback);

    alert('¡Gracias por tu feedback!');
    resetForm();
  } catch (error) {
    console.error('Error al enviar feedback:', error);
    alert('Hubo un error al enviar tu feedback. Por favor, intenta nuevamente.');
  } finally {
    loading.value = false;
  }
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
