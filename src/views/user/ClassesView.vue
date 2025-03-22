<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Clases</h1>
        <p class="text-subtitle-1">Explora y reserva tus clases favoritas.</p>
      </v-col>
    </v-row>

    <!-- Lista de clases disponibles -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Clases Disponibles</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(classItem, index) in classes" :key="index" @click="selectClass(classItem)">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ classItem.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ classItem.time }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">
                    {{ classItem.instructor }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="primary" outlined @click.stop="bookClass(classItem)">
                    Reservar
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalles de la clase seleccionada -->
    <v-row v-if="selectedClass">
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ selectedClass.name }}</v-card-title>
          <v-card-subtitle>Instructor: {{ selectedClass.instructor }}</v-card-subtitle>
          <v-card-text>
            <p><strong>Horario:</strong> {{ selectedClass.time }}</p>
            <p><strong>Duración:</strong> {{ selectedClass.duration }} minutos</p>
            <p><strong>Descripción:</strong> {{ selectedClass.description }}</p>
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

<script setup>
import { ref } from 'vue';

// Datos de ejemplo para las clases
const classes = ref([
  {
    name: 'Yoga Matutino',
    time: 'Lunes y Miércoles, 8:00 AM - 9:00 AM',
    instructor: 'Ana López',
    duration: 60,
    description: 'Clase de yoga para mejorar la flexibilidad y relajación.',
  },
  {
    name: 'HIIT Intenso',
    time: 'Martes y Jueves, 6:00 PM - 7:00 PM',
    instructor: 'Carlos Martínez',
    duration: 60,
    description: 'Entrenamiento de alta intensidad para quemar calorías.',
  },
  {
    name: 'Spinning',
    time: 'Viernes, 5:30 PM - 6:30 PM',
    instructor: 'Laura Gómez',
    duration: 60,
    description: 'Clase de spinning para mejorar la resistencia cardiovascular.',
  },
]);

// Clase seleccionada
const selectedClass = ref(null);

// Función para seleccionar una clase
const selectClass = (classItem) => {
  selectedClass.value = classItem;
};

// Función para reservar una clase
const bookClass = (classItem) => {
  alert(`Clase reservada: ${classItem.name}`);
  selectedClass.value = null; // Limpiar selección después de reservar
};

// Función para cancelar una reserva
const cancelBooking = (classItem) => {
  alert(`Reserva cancelada: ${classItem.name}`);
  selectedClass.value = null; // Limpiar selección después de cancelar
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
