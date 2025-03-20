<template>
    <NavbarDashboard />
    <div class="coach-dashboard">
      <h1>Dashboard de Usuario</h1>
      <p>Bienvenido al panel de Usuario.</p>
      
      <!-- Contenido específico para entrenadores -->
      <div class="coach-content">
        <div class="stats-card">
          <h3>Tus Estudiantes</h3>
          <p class="stat">12 activos</p>
        </div>
        
        <div class="stats-card">
          <h3>Sesiones Programadas</h3>
          <p class="stat">5 para hoy</p>
        </div>
        
        <div class="stats-card">
          <h3>Rendimiento</h3>
          <p class="stat">98% satisfacción</p>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn primary">Programar Sesión</button>
        <button class="btn secondary">Ver Estudiantes</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import NavbarDashboard from '../../components/dashboard/NavbarDashboard.vue';
  </script>
  
  <style scoped>
  .coach-dashboard {
    padding: 20px;
  }
  
  .coach-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  
  .stats-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .stat {
    font-size: 24px;
    font-weight: bold;
    color: #4a6cf7;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .btn {
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