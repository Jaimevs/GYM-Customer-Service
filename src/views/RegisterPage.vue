<template>
    <div class="register">
      <h2>Registrarse</h2>
      <form @submit.prevent="handleRegister">
        <input type="text" v-model="username" placeholder="Nombre de Usuario" required />
        <input type="email" v-model="email" placeholder="Correo Electrónico" required />
        <input type="password" v-model="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    methods: {
      handleRegister() {
        // Lógica para registrar al usuario
        console.log('Registrar usuario:', this.username, this.email, this.password);
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
  