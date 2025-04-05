<template>
    <div class="debug-container">
      <h2>Herramienta de Depuración</h2>
      
      <div class="debug-section">
        <h3>Información de Autenticación</h3>
        <button @click="inspectToken" class="debug-button">Inspeccionar Token</button>
        <div v-if="tokenInfo" class="token-info">
          <h4>Token encontrado:</h4>
          <pre>{{ tokenInfo.preview }}</pre>
          <p><strong>Longitud:</strong> {{ tokenInfo.length }}</p>
          <p><strong>Parece JWT válido:</strong> {{ tokenInfo.isValidJWT ? 'Sí' : 'No' }}</p>
          <p><strong>Parece JSON:</strong> {{ tokenInfo.isJSON ? 'Sí' : 'No' }}</p>
        </div>
  
        <h4 class="mt-4">Información de Usuario</h4>
        <button @click="inspectUser" class="debug-button">Inspeccionar Usuario</button>
        <div v-if="userInfo" class="user-info">
          <pre>{{ userInfo }}</pre>
        </div>
      </div>
  
      <div class="debug-section">
        <h3>Acciones</h3>
        <button @click="testApiRequest" class="debug-button">Probar Solicitud API</button>
        <div v-if="apiResponse" class="api-response">
          <h4>Respuesta:</h4>
          <pre>{{ apiResponse }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  
  const API_URL = "https://gymtoday12.com";
  
  const tokenInfo = ref(null);
  const userInfo = ref(null);
  const apiResponse = ref(null);
  
  // Inspeccionar el token almacenado
  const inspectToken = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      tokenInfo.value = { 
        preview: 'No se encontró token en localStorage',
        length: 0,
        isValidJWT: false,
        isJSON: false
      };
      return;
    }
    
    // Función para verificar si es un JWT válido
    const isValidJWT = (str: string): boolean => {
      const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
      return jwtPattern.test(str);
    };
    
    // Intentar determinar si es JSON
    let isJSON = false;
    try {
      JSON.parse(token);
      isJSON = true;
    } catch (e) {
      isJSON = false;
    }
    
    // Crear vista previa segura
    const preview = token.length > 100 ? 
      `${token.substring(0, 50)}...${token.substring(token.length - 50)}` : 
      token;
    
    tokenInfo.value = {
      preview,
      length: token.length,
      isValidJWT: isValidJWT(token),
      isJSON
    };
  };
  
  // Inspeccionar datos de usuario
  const inspectUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      userInfo.value = 'No se encontró información de usuario en localStorage';
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      userInfo.value = JSON.stringify(user, null, 2);
    } catch (e) {
      userInfo.value = `Error al parsear datos de usuario: ${e.message}\nDatos originales: ${userStr}`;
    }
  };
  
  // Probar una solicitud API simple
  const testApiRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        apiResponse.value = 'No hay token disponible para la solicitud';
        return;
      }
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        apiResponse.value = 'No se encontró ID de usuario';
        return;
      }
      
      // Intentar una solicitud de prueba
      const response = await axios.get(`${API_URL}/users/${user.id}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      apiResponse.value = JSON.stringify(response.data, null, 2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        apiResponse.value = `Error: ${error.message}\nEstado: ${error.response?.status}\nDatos: ${JSON.stringify(error.response?.data || {}, null, 2)}`;
      } else {
        apiResponse.value = `Error: ${error.message}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .debug-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .debug-section {
    margin-bottom: 30px;
    padding: 15px;
    background-color: white;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }
  
  h2 {
    color: #333;
    margin-bottom: 20px;
  }
  
  h3 {
    color: #555;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
  }
  
  h4 {
    color: #666;
    margin-top: 15px;
    margin-bottom: 10px;
  }
  
  .mt-4 {
    margin-top: 20px;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
    font-size: 13px;
    line-height: 1.5;
    max-height: 200px;
  }
  
  .debug-button {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  
  .debug-button:hover {
    background-color: #5a6268;
  }
  
  .token-info, .user-info, .api-response {
    margin-top: 15px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e9ecef;
  }
  </style>