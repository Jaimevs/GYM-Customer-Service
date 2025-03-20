<template>
  <div class="support-resolution-view">
    <h1>Soporte y Resolución de Problemas</h1>
    <p>Aquí puedes gestionar las solicitudes de soporte y resolver problemas.</p>

    <!-- Ejemplo de una lista de solicitudes de soporte -->
    <div class="support-list">
      <div v-for="ticket in supportTickets" :key="ticket.id" class="support-item">
        <h3>{{ ticket.title }}</h3>
        <p><strong>Usuario:</strong> {{ ticket.user }}</p>
        <p><strong>Descripción:</strong> {{ ticket.description }}</p>
        <p><strong>Estado:</strong> {{ ticket.status }}</p>
        <button @click="resolveTicket(ticket.id)" class="resolve-btn">Marcar como resuelto</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de tickets de soporte
const supportTickets = ref([
  { id: 1, title: "Problema con membresía", user: "Juan Pérez", description: "No puedo acceder a mi membresía.", status: "Pendiente" },
  { id: 2, title: "Error en la reserva", user: "María López", description: "La reserva no se completó correctamente.", status: "En progreso" },
  { id: 3, title: "Consulta sobre horarios", user: "Carlos Ramírez", description: "¿Cuáles son los horarios disponibles?", status: "Resuelto" },
]);

// Función para marcar un ticket como resuelto
const resolveTicket = (ticketId: number) => {
  const ticket = supportTickets.value.find((t) => t.id === ticketId);
  if (ticket) {
    ticket.status = "Resuelto";
    console.log(`Ticket ${ticketId} marcado como resuelto.`);
  }
};
</script>

<style scoped lang="scss">
.support-resolution-view {
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

  .support-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .support-item {
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

    .resolve-btn {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #45a049;
      }
    }
  }
}
</style>
