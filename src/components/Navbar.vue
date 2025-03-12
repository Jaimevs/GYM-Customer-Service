<template>
  <header class="navbar">
    <div class="logo">
      <h1>GymService</h1>
    </div>
    <nav>
      <router-link to="/" class="nav-link">Inicio</router-link>
      <router-link to="/login" class="nav-link">Iniciar sesión</router-link>
      <router-link to="/register" class="nav-link">Registrarse</router-link>
    </nav>
  </header>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3498db;
  padding: 1rem;
}

.logo h1 {
  color: white;
  margin: 0;
}

nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 5px;
}

.nav-link:hover {
  background-color: #2980b9;
}
</style>
