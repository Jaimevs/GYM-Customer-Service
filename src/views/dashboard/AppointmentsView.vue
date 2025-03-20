<template>
  <div class="appointments-view">
    <h1>Gestión de Citas</h1>
    <p>Aquí puedes administrar las citas del sistema.</p>

    <!-- Ejemplo de una lista de citas -->
    <div class="appointments-list">
      <div v-for="appointment in appointments" :key="appointment.id" class="appointment-item">
        <h3>{{ appointment.title }}</h3>
        <p><strong>Cliente:</strong> {{ appointment.client }}</p>
        <p><strong>Fecha:</strong> {{ appointment.date }}</p>
        <p><strong>Hora:</strong> {{ appointment.time }}</p>
        <button @click="editAppointment(appointment.id)" class="edit-btn">Editar</button>
        <button @click="deleteAppointment(appointment.id)" class="delete-btn">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de citas
const appointments = ref([
  { id: 1, title: "Entrenamiento Personalizado", client: "Juan Pérez", date: "2023-10-15", time: "10:00 AM" },
  { id: 2, title: "Consulta Nutricional", client: "María López", date: "2023-10-16", time: "11:30 AM" },
  { id: 3, title: "Clase de Yoga", client: "Carlos Ramírez", date: "2023-10-17", time: "03:00 PM" },
]);

// Función para editar una cita
const editAppointment = (appointmentId: number) => {
  console.log(`Editando cita con ID: ${appointmentId}`);
};

// Función para eliminar una cita
const deleteAppointment = (appointmentId: number) => {
  console.log(`Eliminando cita con ID: ${appointmentId}`);
};
</script>

<style scoped lang="scss">
.appointments-view {
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

  .appointments-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .appointment-item {
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

    .edit-btn {
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

    .delete-btn {
      background-color: #ff4d4d;
      color: white;
      border: none;
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #cc0000;
      }
    }
  }
}
</style>
