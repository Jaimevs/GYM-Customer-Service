<template>
    <div class="login">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="Correo Electrónico" required />
        <input type="password" v-model="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      handleLogin() {
        // Lógica para iniciar sesión
        console.log('Iniciar sesión con:', this.email, this.password);
      }
    }
  };
  </script>
  
  <style scoped>
 
  </style>
  