<template>
  <div class="sidebar">
    <ul>
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/profile">Perfil</router-link></li>
      <li><router-link to="/settings">Ajustes</router-link></li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
// Si necesitas agregar lógica aquí, puedes hacerlo
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 2rem;
  height: 100vh;
  position: fixed;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  margin-bottom: 1rem;
}

ul li a {
  text-decoration: none;
  color: #333;
  font-size: 1.2rem;
}

ul li a:hover {
  color: #4CAF50;
}
</style>
