<template>
  <form @submit.prevent="handleLogin" class="sign-in-form">
    <h2 class="title">Iniciar Sesión</h2>
    <div class="input-field">
      <i class="fas fa-user"></i>
      <input id="username" type="text" v-model="input.username" placeholder="Ingresa tu usuario"
        :class="{ 'input-error': errors.username }" />
    </div>
    <div class="input-field">
      <i class="fas fa-lock"></i>
      <input id="password" type="password" v-model="input.password" placeholder="Ingresa tu contraseña"
        :class="{ 'input-error': errors.password }" />
    </div>
    <input type="submit" value="Entrar" class="btn solid" />
    <p class="social-text">O inicia sesión con plataformas sociales</p>
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

const input = ref({
  username: "",
  password: ""
});

const errors = ref({
  username: false,
  password: false
});

const handleLogin = () => {
  errors.value.username = input.value.username === "";
  errors.value.password = input.value.password === "";

  if (!errors.value.username && !errors.value.password) {
    console.log("Autenticación completada");
    router.push('/dashboard');
  }
};
</script>
