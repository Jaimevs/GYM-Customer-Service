<template>
  <div class="client-training-view">
    <h1>Capacitación al Cliente</h1>
    <p>Aquí puedes gestionar la capacitación y formación de los clientes.</p>

    <!-- Ejemplo de una lista de programas de capacitación -->
    <div class="training-programs">
      <div v-for="program in trainingPrograms" :key="program.id" class="training-item">
        <h3>{{ program.title }}</h3>
        <p><strong>Descripción:</strong> {{ program.description }}</p>
        <p><strong>Duración:</strong> {{ program.duration }} horas</p>
        <button @click="startTraining(program.id)" class="start-btn">Iniciar Capacitación</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de programas de capacitación
const trainingPrograms = ref([
  { id: 1, title: "Introducción al Gimnasio", description: "Aprende a usar correctamente los equipos.", duration: 2 },
  { id: 2, title: "Nutrición Básica", description: "Conoce los principios básicos de una dieta equilibrada.", duration: 1 },
  { id: 3, title: "Entrenamiento Cardiovascular", description: "Mejora tu resistencia cardiovascular.", duration: 3 },
]);

// Función para iniciar un programa de capacitación
const startTraining = (programId: number) => {
  console.log(`Iniciando capacitación con ID: ${programId}`);
};
</script>

<style scoped lang="scss">
.client-training-view {
  padding: 20px;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
  }

  p {
    font-size: 1rem;
    margin-bottom: 20px;
    color: #666;
  }

  .training-programs {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .training-item {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;

    h3 {
      margin: 0 0 10px;
      color: #333;
    }

    p {
      margin: 5px 0;
      color: #555;
    }

    .start-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>
