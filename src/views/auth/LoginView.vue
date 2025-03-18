<template>
  <div class="login-container">
    <h2 class="title">Iniciar Sesión</h2>

    <!-- Formulario de Login -->
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="input-field" ref="emailField">
        <Icon icon="eva:email-outline" width="24" height="24" />
        <input type="email" v-model="email" placeholder="Correo electrónico" required />
      </div>
      <div class="input-field" ref="passwordField">
        <Icon icon="solar:lock-password-linear" width="24" height="24" />
        <input type="password" v-model="password" placeholder="Contraseña" required />
      </div>
      <button type="submit" class="btn solid" ref="submitButton">Continuar</button>
    </form>

    <!-- Texto de Registro -->
    <p class="register-text">
      ¿No tienes una cuenta?
      <router-link to="/register" class="register-link">Regístrate</router-link>
    </p>

    <!-- Divider Wrapper -->
    <div class="divider-wrapper" ref="dividerWrapper">
      <span>O inicia sesión con</span>
    </div>

    <!-- Opción de continuar con Google -->
    <button class="btn google" ref="googleButton">
      <Icon icon="flat-color-icons:google" width="24" height="24" />
      Continuar con Google
    </button>

    <!-- Separator para Términos de Uso y Política de Privacidad -->
    <div class="separator">
      <a href="#">Términos de uso</a> | <a href="#">Política de privacidad</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';

const router = useRouter();
const email = ref('');
const password = ref('');

// Referencias para las animaciones
const emailField = ref(null);
const passwordField = ref(null);
const submitButton = ref(null);
const dividerWrapper = ref(null);
const googleButton = ref(null);

// Manejar el envío del formulario
const handleSubmit = () => {
  console.log('Iniciando sesión...');
  console.log('Correo:', email.value);
  console.log('Contraseña:', password.value);
  router.push('/dashboard'); // Redirigir al dashboard después del login
};

onMounted(() => {
  gsap.to(emailField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2,
  });

  gsap.to(passwordField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.4,
  });

  gsap.to(submitButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.6,
  });

  gsap.to(dividerWrapper.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.8,
  });

  gsap.to(googleButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.0,
  });
});
</script>

<style scoped lang="scss">
@use '@/styles/auth/_auth.scss';
@use '@/styles/auth/_login.scss';
</style>
