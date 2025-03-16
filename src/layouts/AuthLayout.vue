<template>
  <div class="container" :class="{ 'sign-up-mode': isSignUpMode }">
    <!-- Contenedor de Formularios -->
    <div class="forms-container">
      <div class="signin-signup">
        <router-view></router-view> <!-- Aquí se inserta el contenido específico -->
      </div>
    </div>

    <!-- Paneles Laterales -->
    <div class="panels-container">
      <!-- Panel Izquierdo -->
      <div class="panel left-panel">
        <div class="content">
          <h3>{{ isSignUpMode ? '¿Ya eres uno de nosotros?' : '¿Eres nuevo aquí?' }}</h3>
          <p>
            {{
              isSignUpMode
                ? 'Inicia sesión para acceder a tu cuenta.'
                : 'Regístrate para acceder a todas las funcionalidades.'
            }}
          </p>
          <button class="btn transparent" @click="toggleView">
            {{ isSignUpMode ? 'Iniciar Sesión' : 'Registrarse' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

console.log('AuthLayout cargado'); // Depuración: Confirmar que AuthLayout se carga

const router = useRouter();

// Estado para determinar si estamos en modo registro
const isSignUpMode = ref(false);

// Función para alternar entre login y registro
const toggleView = () => {
  isSignUpMode.value = !isSignUpMode.value;

  // Redirigir a la vista correspondiente
  if (isSignUpMode.value) {
    router.push('/register');
  } else {
    router.push('/login');
  }
};

// Observar cambios en la ruta para actualizar el modo automáticamente
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    console.log('Nueva ruta detectada:', newPath); // Depuración: Mostrar la nueva ruta
    isSignUpMode.value = newPath.includes('register');
  },
  { immediate: true }
);
</script>
