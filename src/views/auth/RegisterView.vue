<template>
  <div class="register-container">
    <h2 class="title" ref="title">Registrarse</h2>

    <!-- Formulario de Registro -->
    <form @submit.prevent="handleSubmit" class="register-form">
      <!-- Nombre de Usuario -->
      <div class="input-field" ref="usernameField">
        <Icon icon="eva:person-outline" width="24" height="24" />
        <input type="text" v-model="username" placeholder="Nombre de usuario" required />
      </div>

      <!-- Correo Electrónico -->
      <div class="input-field" ref="emailField">
        <Icon icon="eva:email-outline" width="24" height="24" />
        <input type="email" v-model="email" placeholder="Correo electrónico" required />
      </div>

      <!-- Contraseña -->
      <div class="input-field" ref="passwordField">
        <Icon icon="solar:lock-password-linear" width="24" height="24" />
        <input type="password" v-model="password" placeholder="Contraseña" required />
      </div>

      <!-- Botón de Registro -->
      <button type="submit" class="btn solid" ref="submitButton">Registrarse</button>
    </form>

    <!-- Divider Wrapper -->
    <div class="divider-wrapper" ref="dividerWrapper">
      <span>O regístrate con</span>
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

    <!-- Texto de Login -->
    <p class="login-text" ref="loginText">
      ¿Ya tienes una cuenta?
      <router-link to="/login" class="login-link">Inicia Sesión</router-link>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');

// Referencias para las animaciones
const title = ref(null);
const usernameField = ref(null);
const emailField = ref(null);
const passwordField = ref(null);
const submitButton = ref(null);
const dividerWrapper = ref(null);
const googleButton = ref(null);
const loginText = ref(null);

// Manejar el envío del formulario
const handleSubmit = () => {
  console.log('Registrando usuario...');
  console.log('Nombre de usuario:', username.value);
  console.log('Correo:', email.value);
  console.log('Contraseña:', password.value);
  router.push('/login'); // Redirigir al login después del registro
};

onMounted(() => {
  // Animación del título
  gsap.to(title.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2,
  });

  // Animación del campo Nombre de Usuario
  gsap.to(usernameField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.4,
  });

  // Animación del campo Correo Electrónico
  gsap.to(emailField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.6,
  });

  // Animación del campo Contraseña
  gsap.to(passwordField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.8,
  });

  // Animación del botón de registro
  gsap.to(submitButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.0,
  });

  // Animación del divider-wrapper
  gsap.to(dividerWrapper.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.2,
  });

  // Animación del botón de Google
  gsap.to(googleButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.4,
  });

  // Animación del texto de login
  gsap.to(loginText.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.6,
  });
});
</script>
<!-- uwu -->
<style scoped lang="scss">
@use '@/styles/auth/_auth.scss'; // Estilos generales
@use '@/styles/auth/_register.scss'; // Estilos específicos para registro

</style>
