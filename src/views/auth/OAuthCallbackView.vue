<template>
  <div class="oauth-callback-container">
    <div class="loader-container" v-if="loading">
      <div class="loader"></div>
      <p>Completando la autenticación...</p>
    </div>
    
    <div v-if="error" class="error-message">
      <h3>Error de autenticación</h3>
      <p>{{ errorMessage }}</p>
      <router-link to="/login" class="btn">Volver al inicio de sesión</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const API_URL = "https://gymtoday12.com";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');

onMounted(() => {
  console.log('OAuthCallbackView montado, procesando respuesta...');
  
  // Obtener los parámetros de la URL
  const queryParams = new URLSearchParams(window.location.search);
  
  // Registrar todos los parámetros recibidos para depuración
  const params = Object.fromEntries(queryParams.entries());
  console.log('Parámetros recibidos:', params);
  
  // Verificar si hay un error
  const errorParam = queryParams.get('error');
  if (errorParam) {
    error.value = true;
    loading.value = false;
    errorMessage.value = errorParam === 'authentication_failed' 
      ? 'Error de autenticación con Google' 
      : 'Error del servidor durante la autenticación';
    console.error('Error detectado en la URL:', errorParam);
    return;
  }
  
  // Procesar el callback
  processCallback(queryParams);
});

// Función para procesar el callback
const processCallback = async (queryParams: URLSearchParams) => {
  try {
    // Verificar si recibimos datos completos
    const encodedData = queryParams.get('data');
    
    if (encodedData) {
      console.log('Datos codificados encontrados, decodificando...');
      try {
        // Decodificar y parsear los datos JSON
        const userData = JSON.parse(decodeURIComponent(encodedData));
        console.log('Datos decodificados:', userData);
        
        // CORRECCIÓN: Extraer y almacenar el token correctamente
        if (userData.token && userData.token.access_token) {
          // Guardar SOLO el string del token, no el objeto completo
          const tokenString = userData.token.access_token;
          console.log('Token extraído (access_token):', tokenString.substring(0, 30) + '...');
          
          // Guardar como string en localStorage
          localStorage.setItem('token', tokenString);
          
          // Guardar información del usuario
          const user = {
            id: userData.ID,
            username: userData.Nombre_Usuario,
            email: userData.Correo_Electronico,
            roles: userData.roles || []
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userRole', user.roles[0] || 'usuario');
          localStorage.setItem('googleAuth', 'true');
          
          console.log('Datos guardados correctamente en localStorage');
          
          // Actualizar el rol en el store
          authStore.setRole(user.roles[0] || 'usuario');
          
          // Redirigir según el rol
          setTimeout(() => {
            redirectByRole(user.roles);
          }, 800);
          
          return;
        } else {
          throw new Error('No se encontró access_token en los datos recibidos');
        }
      } catch (err) {
        console.error('Error al procesar datos de usuario:', err);
        showError('Error al procesar datos de autenticación: ' + (err.message || ''));
        return;
      }
    }
    
    // Si no hay datos codificados, buscar token y user_id separados (versión antigua)
    const token = queryParams.get('token');
    const userId = queryParams.get('user_id');
    
    if (!token || !userId) {
      showError('No se recibieron datos de autenticación válidos');
      return;
    }
    
    console.log('Usando formato antiguo de token:', token.substring(0, 20) + '...');
    
    // CORRECCIÓN: Asegurarse de guardar solo el string del token
    localStorage.setItem('token', token);
    
    // Obtener datos del usuario con una petición adicional
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userProfile = response.data;
      
      // Crear objeto de usuario
      const user = {
        id: parseInt(userId),
        username: userProfile.Nombre_Usuario || '',
        email: userProfile.Correo_Electronico || '',
        roles: userProfile.roles || ['usuario']
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.roles[0] || 'usuario');
      localStorage.setItem('googleAuth', 'true');
      
      // Actualizar el rol en el store
      authStore.setRole(user.roles[0] || 'usuario');
      
      // Redirigir según el rol
      setTimeout(() => {
        redirectByRole(user.roles);
      }, 800);
      
    } catch (err) {
      console.error('Error al obtener datos del usuario:', err);
      showError('Error al obtener datos del usuario');
    }
  } catch (err) {
    console.error('Error general en el procesamiento:', err);
    showError('Error inesperado durante la autenticación');
  }
};

// Función para mostrar errores
const showError = (message: string) => {
  error.value = true;
  loading.value = false;
  errorMessage.value = message;
};

// Función para redirigir según el rol
const redirectByRole = (roles: string[]) => {
  console.log('Redirigiendo según roles:', roles);
  
  if (roles.includes('admin')) {
    router.push('/dashboard');
  } else if (roles.includes('entrenador')) {
    router.push('/coach-dashboard');
  } else if (roles.includes('usuario')) {
    router.push('/user-dashboard');
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
.oauth-callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.loader-container {
  text-align: center;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-message h3 {
  color: #e74c3c;
  margin-bottom: 15px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #2980b9;
}
</style>