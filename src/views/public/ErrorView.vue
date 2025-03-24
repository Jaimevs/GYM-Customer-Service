<template>
  <div class="container">
    <!-- Contenido principal -->
    <div class="error-container">
      <div class="error-circle">
        <span class="error-code">{{ errorCode }}</span>
      </div>

      <div class="error-content">
        <h2 class="title">{{ isOffline ? "Sin conexión a internet" : "Algo salió mal" }}</h2>
        <p class="error-text">
          {{
            isOffline
              ? "Parece que no tienes conexión a internet. Por favor, verifica tu conexión e intenta nuevamente."
              : errorMessage || "La página que buscas no está disponible."
          }}
        </p>

        <button @click="checkConnection" v-if="isOffline" class="btn">Reintentar</button>
        <router-link to="/" v-else class="btn">Regresar al inicio</router-link>
      </div>
    </div>

    <!-- Efecto visual de fondo -->
    <div class="background-effect"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  errorCode: {
    type: String,
    required: false,
    default: '404',
  },
  errorMessage: {
    type: String,
    required: false,
    default: '',
  },
});

const isOffline = ref(false);

// Verificar la conexión a internet
const checkConnection = () => {
  isOffline.value = !navigator.onLine;
  if (!isOffline.value) {
    window.location.reload();
  }
};

onMounted(() => {
  isOffline.value = !navigator.onLine;
  window.addEventListener('online', checkConnection);
  window.addEventListener('offline', () => {
    isOffline.value = true;
  });
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
input {
  font-family: "Poppins", sans-serif;
}

.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #000;
  /* Fondo negro */
  color: #fff;
  /* Texto blanco */
  overflow: hidden;
}

.error-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  z-index: 2;
  animation: fadeIn 1s ease-in-out;
}

.error-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
  background-color: #ff0000;
  /* Círculo rojo */
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(255, 0, 0, 0.3);
  /* Sombra roja */
  animation: pulse 1.5s infinite ease-in-out;
}

.error-code {
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
  /* Texto blanco dentro del círculo */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  /* Sombra para el texto */
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ff0000;
  /* Título rojo */
  animation: slideUp 1s ease-in-out;
}

.error-text {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #ccc;
  /* Texto gris claro */
  animation: fadeIn 1.5s ease-in-out;
}

.btn {
  background-color: #ff0000;
  /* Botón rojo */
  color: #fff;
  border: none;
  outline: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  animation: fadeIn 2s ease-in-out;
}

.btn:hover {
  background-color: #d10000;
  /* Rojo más oscuro al pasar el mouse */
  transform: scale(1.05);
  /* Efecto de escala */
  box-shadow: 0 4px 10px rgba(255, 0, 0, 0.5);
  /* Sombra al hover */
}

/* Efecto visual de fondo */
.background-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 0, 0, 0.1), transparent 70%);
  animation: rotateBackground 10s linear infinite;
  z-index: 1;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes rotateBackground {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Responsividad */
@media (max-width: 768px) {
  .error-circle {
    width: 120px;
    height: 120px;
  }

  .error-code {
    font-size: 2.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .error-text {
    font-size: 1rem;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .error-circle {
    width: 100px;
    height: 100px;
  }

  .error-code {
    font-size: 2rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .error-text {
    font-size: 0.9rem;
  }

  .btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.8rem;
  }
}
</style>
