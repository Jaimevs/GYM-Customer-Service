<template>
  <v-container class="coach-dashboard">
    <!-- Título -->
    <h1 class="text-h4 font-weight-bold mb-4">Dashboard de Entrenador</h1>
    <p class="text-body-1 mb-6">Bienvenido al panel de entrenador.</p>

    <!-- Estadísticas -->
    <v-row class="mb-6">
      <v-col v-for="(stat, index) in stats" :key="index" cols="12" sm="4">
        <v-card class="stats-card pa-4" elevation="2">
          <v-icon size="40" :color="stat.color" class="mb-3">{{ stat.icon }}</v-icon>
          <h3 class="text-h6 font-weight-medium">{{ stat.title }}</h3>
          <p class="stat text-h5" :class="`${stat.color}--text`">{{ stat.value }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lista de Próximas Sesiones -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">Próximas Sesiones</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="(session, index) in upcomingSessions" :key="index">
            <v-list-item-icon>
              <v-icon color="primary">mdi-clock-time-eight-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ session.student }}</v-list-item-title>
              <v-list-item-subtitle>{{ session.time }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Botones de Acción -->
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn block color="primary" large @click="scheduleSession">Programar Sesión</v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn block color="secondary" large @click="viewStudents">Ver Estudiantes</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Datos de las estadísticas
const stats = ref([
  {
    icon: "mdi-account-group",
    title: "Tus Estudiantes",
    value: "12 activos",
    color: "primary",
  },
  {
    icon: "mdi-calendar-clock",
    title: "Sesiones Programadas",
    value: "5 para hoy",
    color: "success",
  },
  {
    icon: "mdi-star-outline",
    title: "Rendimiento",
    value: "98% satisfacción",
    color: "info",
  },
]);

// Datos de próximas sesiones
const upcomingSessions = ref([
  { student: "Estudiante 1", time: "10:00 AM" },
  { student: "Estudiante 2", time: "11:30 AM" },
  { student: "Estudiante 3", time: "2:00 PM" },
]);

// Redirigir a /clases-coach
const scheduleSession = () => {
  console.log("Redirigiendo a /clases-coach");
  router.push("/clases-coach");
};

// Redirigir a /clientes
const viewStudents = () => {
  console.log("Redirigiendo a /clientes");
  router.push("/clientes");
};
</script>

<style scoped>
.coach-dashboard {
  padding: 20px;
}

.stats-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  /* Asegura que todas las tarjetas tengan la misma altura */
}

.stat {
  font-size: 24px;
  font-weight: bold;
}
</style>
