<template>
  <form @submit.prevent="handleRegister" class="sign-up-form">
    <h2 class="title">Registrarse</h2>
    <div class="input-field">
      <i class="fas fa-user"></i>
      <input type="text" v-model="username" placeholder="Usuario" :class="{ 'input-error': errors.username }" />
    </div>
    <div class="input-field">
      <i class="fas fa-envelope"></i>
      <input type="email" v-model="email" placeholder="Email" :class="{ 'input-error': errors.email }" />
    </div>
    <div class="input-field">
      <i class="fas fa-lock"></i>
      <input type="password" v-model="password" placeholder="Contraseña" :class="{ 'input-error': errors.password }" />
    </div>
    <input type="submit" class="btn" value="Registrarse" />
    <p class="social-text">O regístrate con plataformas sociales</p>
    <div class="social-media">
      <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
      <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
      <a href="#" class="social-icon"><i class="fab fa-google"></i></a>
      <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Datos del formulario
const username = ref('');
const email = ref('');
const password = ref('');

// Validaciones de errores
const errors = ref({
  username: false,
  email: false,
  password: false,
});

// Manejar el registro
const handleRegister = () => {
  // Validar campos vacíos
  errors.value.username = username.value.trim() === '';
  errors.value.email = email.value.trim() === '';
  errors.value.password = password.value.trim() === '';

  // Si no hay errores, proceder con el registro
  if (!errors.value.username && !errors.value.email && !errors.value.password) {
    console.log('Registrando con:', username.value, email.value, password.value);
    // Aquí iría la lógica de registro (por ejemplo, una llamada a una API)
    router.push('/dashboard'); // Redirigir al dashboard después del registro
  }
};
</script>
