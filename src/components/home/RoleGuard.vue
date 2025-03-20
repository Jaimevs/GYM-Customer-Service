<template>
    <div v-if="authorized">
      <slot></slot>
    </div>
    <div v-else-if="showError" class="unauthorized-message">
      <h3>Acceso no autorizado</h3>
      <p>No tienes los permisos necesarios para ver este contenido.</p>
      <button @click="goToDashboard" class="btn btn-primary">Volver al Dashboard</button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, defineProps } from 'vue';
  import { useRouter } from 'vue-router';
  import AuthService from '@/services/AuthService';
  
  const props = defineProps({
    requiredRole: {
      type: String,
      required: true
    },
    showError: {
      type: Boolean,
      default: true
    }
  });
  
  const router = useRouter();
  
  // Verificar si el usuario tiene el rol requerido
  const authorized = computed(() => {
    return AuthService.hasRole(props.requiredRole);
  });
  
  // Función para redirigir al dashboard
  const goToDashboard = () => {
    router.push('/dashboard');
  };
  </script>
  
  <style scoped>
  .unauthorized-message {
    text-align: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 2rem auto;
    max-width: 500px;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    margin-top: 1rem;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
  }
  </style>