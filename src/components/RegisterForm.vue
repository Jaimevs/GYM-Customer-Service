<template>
  <form @submit.prevent="handleRegister">
    <input type="text" v-model="username" placeholder="Nombre de Usuario" required />
    <input type="email" v-model="email" placeholder="Correo Electrónico" required />
    <input type="password" v-model="password" placeholder="Contraseña" required />
    <button type="submit">Registrarse</button>
  </form>
</template>

<script lang="ts">
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
      console.log('Registrar usuario:', this.username, this.email, this.password);
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  margin: 0 auto;
}

input {
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  background-color: #3498db;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
