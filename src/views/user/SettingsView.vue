<template>
  <!-- <NavbarDashboard /> -->
  <div class="settings-view">
    <h1>Configuración de la Cuenta</h1>
    <p>Gestiona tus preferencias y ajustes aquí.</p>

    <!-- Formulario para cambiar la contraseña -->
    <div class="settings-section">
      <h2>Cambiar Contraseña</h2>
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="current-password">Contraseña actual:</label>
          <input type="password" id="current-password" v-model="currentPassword" required />
        </div>
        <div class="form-group">
          <label for="new-password">Nueva contraseña:</label>
          <input type="password" id="new-password" v-model="newPassword" required />
        </div>
        <button type="submit" class="btn primary">Guardar cambios</button>
      </form>
    </div>

    <!-- Preferencias de notificaciones -->
    <div class="settings-section">
      <h2>Preferencias de Notificaciones</h2>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="notifications.email" />
          Recibir notificaciones por email
        </label>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="notifications.push" />
          Recibir notificaciones push
        </label>
      </div>
      <button class="btn secondary" @click="saveNotificationPreferences">Guardar preferencias</button>
    </div>

    <!-- Tema visual -->
    <div class="settings-section">
      <h2>Tema Visual</h2>
      <div class="form-group">
        <label>
          <input type="radio" name="theme" value="light" v-model="theme" />
          Claro
        </label>
        <label>
          <input type="radio" name="theme" value="dark" v-model="theme" />
          Oscuro
        </label>
      </div>
      <button class="btn primary" @click="saveTheme">Aplicar tema</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavbarDashboard from '../../components/dashboard/NavbarDashboard.vue';

// Variables reactivas
const currentPassword = ref('');
const newPassword = ref('');
const notifications = ref({
  email: true,
  push: false,
});
const theme = ref('light');

// Función para cambiar la contraseña
const changePassword = async () => {
  try {
    // Aquí puedes hacer la llamada a la API para cambiar la contraseña
    console.log('Contraseña actual:', currentPassword.value);
    console.log('Nueva contraseña:', newPassword.value);
    alert('Contraseña cambiada exitosamente.');
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    alert('Ocurrió un error al cambiar la contraseña.');
  }
};

// Función para guardar preferencias de notificaciones
const saveNotificationPreferences = () => {
  console.log('Preferencias de notificaciones guardadas:', notifications.value);
  alert('Preferencias de notificaciones guardadas.');
};

// Función para guardar el tema visual
const saveTheme = () => {
  console.log('Tema seleccionado:', theme.value);
  document.body.className = theme.value; // Aplica el tema visual
  alert('Tema aplicado exitosamente.');
};
</script>

<style scoped>
.settings-view {
  padding: 20px;
}

.settings-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: 500;
  margin-right: 10px;
}

input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.primary {
  background-color: #4a6cf7;
  color: white;
}

.secondary {
  background-color: #e9ecef;
  color: #212529;
}
</style>
