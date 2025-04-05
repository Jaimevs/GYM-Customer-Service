<template>
    <div class="debug-view">
      <h1>Herramientas de Depuración de Autenticación</h1>
      <p class="warning-text">Esta herramienta es solo para depuración de problemas de autenticación.</p>
      
      <!-- Incluir el componente DebugTool -->
      <debug-tool />
    </div>
  </template>
  
  <script setup lang="ts">
  import DebugTool from './DebugTool.vue';  // Ruta relativa
  </script>
  
  <style scoped>
  .debug-view {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .warning-text {
    color: #e74c3c;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #fadbd8;
    border-radius: 4px;
    border-left: 4px solid #e74c3c;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  </style>