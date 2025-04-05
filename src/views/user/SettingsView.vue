<template>
  <div class="settings-view">
    <h1>Configuración de Cuenta</h1>
    
    <!-- Mensaje de error o éxito -->
    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>
    
    <!-- Cambio de contraseña -->
    <div class="settings-section">
      <h2>Cambiar Contraseña</h2>
      
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="new-password">Nueva contraseña:</label>
          <input 
            type="password"
            id="new-password" 
            v-model="newPassword"
            required
            placeholder="Ingrese nueva contraseña"
          />
        </div>
        
        <div class="form-group">
          <label for="confirm-password">Confirmar nueva contraseña:</label>
          <input 
            type="password"
            id="confirm-password" 
            v-model="confirmPassword"
            required
            placeholder="Confirme nueva contraseña"
          />
        </div>
        
        <button 
          type="submit"
          class="btn primary"
          :disabled="loading"
        >
          {{ loading ? 'Cambiando...' : 'Cambiar Contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserSettingsService from '@/services/UserSettingsService';

// Variables reactivas
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const message = ref<{ text: string; type: 'success' | 'error' } | null>(null);

// Función para cambiar la contraseña
const changePassword = async () => {
  // Resetear mensajes
  message.value = null;
  
  // Validar que las contraseñas coincidan
  if (newPassword.value !== confirmPassword.value) {
    message.value = {
      text: 'Las contraseñas no coinciden.',
      type: 'error'
    };
    return;
  }
  
  loading.value = true;
  
  try {
    // Llamar al servicio para cambiar la contraseña
    await UserSettingsService.changePassword(newPassword.value);
    
    message.value = {
      text: 'Contraseña actualizada exitosamente.',
      type: 'success'
    };
    
    // Limpiar campos
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error: any) {
    let errorMessage = 'Ocurrió un error al cambiar la contraseña.';
    
    if (error.message) {
      errorMessage = error.message;
    }
    
    message.value = {
      text: errorMessage,
      type: 'error'
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.settings-view {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.settings-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0069d9;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 4px;
  font-weight: 500;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

h2 {
  color: #444;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
}
</style>