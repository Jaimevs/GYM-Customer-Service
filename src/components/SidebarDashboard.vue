<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>Mi Gimnasio</h2> <!-- O el nombre de la aplicación -->
    </div>
    <ul>
      <li><router-link to="/" class="sidebar-link"><v-icon>mdi-home</v-icon> Inicio</router-link></li>
      <li><router-link to="/dashboard" class="sidebar-link"><v-icon>mdi-view-dashboard</v-icon> Dashboard</router-link></li>
      <li><router-link to="/feedback" class="sidebar-link"><v-icon>mdi-message-alert</v-icon> Quejas y Sugerencias</router-link></li>
      <li><router-link to="/trainer-evaluation" class="sidebar-link"><v-icon>mdi-clipboard-check</v-icon> Evaluación de Entrenadores</router-link></li>
      <li><router-link to="/memberships" class="sidebar-link"><v-icon>mdi-credit-card</v-icon> Membresías y Pagos</router-link></li>
      <li><router-link to="/chat" class="sidebar-link"><v-icon>mdi-chat</v-icon> Chat Interno</router-link></li>
      <li><router-link to="/settings" class="sidebar-link"><v-icon>mdi-cog</v-icon> Ajustes</router-link></li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
// No necesitamos lógica extra aquí
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #1d1f27;
  /* Fondo oscuro para un look moderno */
  padding: 1.5rem;
  height: 100vh;
  position: fixed;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
  /* Sombra para dar profundidad */
  border-radius: 0 15px 15px 0;
  /* Bordes redondeados */
  color: #fff;
  overflow-y: auto; /* Permite desplazamiento si hay muchos elementos */
}

.sidebar-header {
  margin-bottom: 2rem;
  text-align: center;
}

.sidebar-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  margin-bottom: 1.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  font-size: 1.2rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.3s ease, padding-left 0.3s ease;
  /* Transición suave */
}

.sidebar-link v-icon {
  margin-right: 1rem;
  /* Espacio entre el icono y el texto */
  font-size: 1.5rem;
}

.sidebar-link:hover {
  background-color: #32cd32;
  /* Color verde para el hover */
  padding-left: 1.25rem;
  /* Efecto de desplazamiento */
}

.sidebar-link:active {
  background-color: #28a628;
  /* Color más oscuro para el estado activo */
}

.sidebar-link:focus {
  outline: none;
  background-color: #32cd32;
}
</style>