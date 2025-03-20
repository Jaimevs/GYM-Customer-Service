<template>
  <div class="additional-services-payment-view">
    <h1>Cobro de Servicios Adicionales</h1>
    <p>Aquí puedes gestionar los pagos de servicios adicionales.</p>

    <!-- Ejemplo de una lista de servicios adicionales -->
    <div class="services-list">
      <div v-for="service in additionalServices" :key="service.id" class="service-item">
        <h3>{{ service.name }}</h3>
        <p><strong>Precio:</strong> ${{ service.price }}</p>
        <button @click="processPayment(service.id)" class="pay-btn">Procesar Pago</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de servicios adicionales
const additionalServices = ref([
  { id: 1, name: "Clase de Yoga", price: 15 },
  { id: 2, name: "Entrenamiento Personalizado", price: 50 },
  { id: 3, name: "Consulta Nutricional", price: 30 },
]);

// Función para procesar el pago de un servicio adicional
const processPayment = (serviceId: number) => {
  console.log(`Procesando pago para el servicio con ID: ${serviceId}`);
};
</script>

<style scoped lang="scss">
.additional-services-payment-view {
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

  .services-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .service-item {
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

    .pay-btn {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #218838;
      }
    }
  }
}
</style>
