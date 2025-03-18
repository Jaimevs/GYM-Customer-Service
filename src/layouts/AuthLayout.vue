<template>
  <div class="container">
    <!-- Barra Superior -->
    <header class="auth-header" ref="authHeader">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i> <!-- Ícono de retroceso -->
      </button>
      <img src="@/assets/img/gymbulls.png" alt="Gymmbulls Logo" class="logo" />
    </header>

    <!-- Contenido Principal -->
    <main class="forms-container" ref="formsContainer">
      <router-view></router-view> <!-- Aquí se inserta el contenido específico -->
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';

const router = useRouter();

// Referencias para las animaciones
const authHeader = ref(null);
const formsContainer = ref(null);

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
    isSignUpMode.value = newPath.includes('register');
  },
  { immediate: true }
);

// Función para retroceder al inicio
const goBack = () => {
  router.push('/');
};

// Animaciones GSAP
onMounted(() => {
  // Animación del encabezado
  gsap.from(authHeader.value, {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Animación del contenido principal
  gsap.from(formsContainer.value, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.6,
  });
});
</script>

<style scoped lang="scss">
@use '@/styles/auth/_auth.scss'; // Importa los estilos específicos para autenticación
</style>
