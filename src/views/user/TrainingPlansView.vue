<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Planes de Entrenamiento</h1>
        <p class="text-subtitle-1">Aquí puedes ver y gestionar tus planes de entrenamiento.</p>
      </v-col>
    </v-row>

    <!-- Lista de planes de entrenamiento -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Mis Planes</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(plan, index) in trainingPlans" :key="index">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-dumbbell</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ plan.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ plan.schedule }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-btn outlined color="primary">Ver Detalles</v-btn>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Agregar Nuevo Plan</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalles del plan seleccionado -->
    <v-row v-if="selectedPlan">
      <v-col cols="12">
        <v-card>
          <v-card-title>Detalles del Plan</v-card-title>
          <v-card-text>
            <p><strong>Nombre:</strong> {{ selectedPlan.name }}</p>
            <p><strong>Horario:</strong> {{ selectedPlan.schedule }}</p>
            <p><strong>Descripción:</strong> {{ selectedPlan.description }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="primary">Editar Plan</v-btn>
            <v-btn color="error">Eliminar Plan</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// Datos de ejemplo para los planes de entrenamiento
const trainingPlans = ref([
  {
    name: 'Fuerza Superior',
    schedule: 'Lunes y Jueves',
    description: 'Enfoque en ejercicios de fuerza para brazos, pecho y espalda.',
  },
  {
    name: 'Enfoque en Piernas',
    schedule: 'Martes y Viernes',
    description: 'Ejercicios intensos para fortalecer piernas y glúteos.',
  },
  {
    name: 'Cardio y Core',
    schedule: 'Miércoles y Sábado',
    description: 'Rutina combinada de cardio y ejercicios para el core.',
  },
]);

// Plan seleccionado
const selectedPlan = ref(null);

// Función para seleccionar un plan
const selectPlan = (plan) => {
  selectedPlan.value = plan;
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
</style>
