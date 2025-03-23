<template>
  <div class="membership-payment">
    <h1 class="title">Selecciona tu membresía</h1>

    <!-- Contenedor principal -->
    <div class="content-container">
      <!-- Lista de membresías (izquierda) -->
      <div class="membership-options">
        <div v-for="(membership, index) in memberships" :key="index" class="membership-card"
          :class="{ selected: selectedMembership === membership }" @click="selectMembership(membership)">
          <h3>{{ membership.name }}</h3>
          <p class="price">${{ membership.price }} MXN</p>
          <p class="description">{{ membership.description }}</p>
        </div>
      </div>

      <!-- Formulario de pago (derecha) -->
      <div v-if="selectedMembership" class="payment-form">
        <h2 class="payment-title">Pagar ${{ selectedMembership.price }} MXN</h2>

        <!-- Componente PaymentElement de Stripe -->
        <form @submit.prevent="handleSubmit">
          <div id="payment-element">
            <!-- El PaymentElement se renderizará aquí -->
          </div>
          <button type="submit" class="pay-button" :disabled="isProcessing">
            <span v-if="!isProcessing">Pagar ahora</span>
            <span v-else>Procesando...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

// Datos de las membresías
const memberships = [
  { name: 'Básica', price: 500, description: 'Acceso limitado a instalaciones.' },
  { name: 'Premium', price: 1000, description: 'Acceso completo + clases grupales.' },
  { name: 'VIP', price: 2000, description: 'Acceso ilimitado + entrenador personal.' },
];

// Estado del componente
const selectedMembership = ref(null);
const isProcessing = ref(false);
const stripe = ref(null);
const elements = ref(null);

// Seleccionar membresía
const selectMembership = async (membership) => {
  selectedMembership.value = membership;
  await initializeStripe(); // Inicializar Stripe al seleccionar una membresía
};

// Inicializar Stripe y el PaymentElement
const initializeStripe = async () => {
  try {
    // Cargar el SDK de Stripe
    stripe.value = await loadStripe('pk_test_51R5t9ZG6fi6a6EKHj546szZs8r5TowiIT04Xlh5F6PG1CcWWEXiMuCLNEzbyHogK4h3tILi4bjObwE9PJ2zgzN1c00Cg0FFWmy'); // Reemplaza con tu clave pública

    // Crear una instancia de Elements
    elements.value = stripe.value.elements({
      mode: 'payment', // Modo de pago
      amount: selectedMembership.value.price * 100, // Convertir a centavos
      currency: 'mxn', // Moneda
    });

    // Crear y montar el PaymentElement
    const paymentElement = elements.value.create('payment');
    paymentElement.mount('#payment-element');
  } catch (error) {
    console.error('Error al inicializar Stripe:', error);
  }
};

// Manejar el envío del formulario (solo para pruebas visuales)
const handleSubmit = async () => {
  isProcessing.value = true; // Activar el estado de procesamiento
  console.log('Simulando pago...'); // Simular el pago
  setTimeout(() => {
    isProcessing.value = false; // Desactivar el estado de procesamiento
    alert('Pago simulado correctamente.'); // Mostrar mensaje de éxito
  }, 2000);
};
</script>

<style scoped lang="scss">
@use '@/styles/_mixins.scss' as mixins;

.membership-payment {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #000;
  color: #fff;
  margin-top: 80px;

  @include mixins.media-query(small) {
    padding: 1rem;
    margin-top: 60px;
  }
}

.title {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #fff;

  @include mixins.media-query(small) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
}

.content-container {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  align-items: flex-start;

  @include mixins.media-query(small) {
    flex-direction: column;
    gap: 1rem;
  }
}

.membership-options {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @include mixins.media-query(small) {
    width: 100%;
  }
}

.membership-card {
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;

  @include mixins.media-query(small) {
    padding: 1.5rem;
  }
}

.membership-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(255, 255, 255, 0.1);
}

.membership-card.selected {
  border-color: #ff0000;
  box-shadow: 0 12px 24px rgba(255, 0, 0, 0.2);
}

.membership-card h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #fff;

  @include mixins.media-query(small) {
    font-size: 1.5rem;
  }
}

.membership-card .price {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff0000;
  margin-bottom: 1rem;

  @include mixins.media-query(small) {
    font-size: 1.25rem;
  }
}

.membership-card .description {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #ccc;

  @include mixins.media-query(small) {
    font-size: 0.9rem;
  }
}

.payment-form {
  width: 400px;
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;

  @include mixins.media-query(small) {
    width: 100%;
    padding: 1.5rem;
  }
}

.payment-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #fff;

  @include mixins.media-query(small) {
    font-size: 1.75rem;
  }
}

#payment-element {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #222;

  @include mixins.media-query(small) {
    padding: 0.75rem;
    margin: 0.75rem 0;
    font-size: 0.9rem;
  }
}

.pay-button {
  background-color: #ff0000;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1.5rem;

  @include mixins.media-query(small) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}

.pay-button:hover {
  background-color: #d10000;
}

.pay-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}
</style>
