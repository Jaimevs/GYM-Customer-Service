<template>
  <NavbarDashboard />
  <div class="coach-dashboard">
    <h1>Dashboard de Usuario</h1>
    <p>Bienvenido al panel de Usuario.</p>
    
    <!-- Datos personales del usuario -->
    <div class="personal-data">
      <h2>Tus Datos Personales</h2>
      
      <div v-if="loading" class="loading">
        Cargando datos personales...
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button v-if="!personData" class="btn primary mt-2" @click="useDemoData">
          Usar datos de demostración
        </button>
      </div>
      
      <table v-if="personData" class="person-table">
        <tbody>
          <tr>
            <th>Nombre:</th>
            <td>{{ personData.Nombre || 'No disponible' }}</td>
          </tr>
          <tr>
            <th>Primer Apellido:</th>
            <td>{{ personData.Primer_Apellido || 'No disponible' }}</td>
          </tr>
          <tr>
            <th>Segundo Apellido:</th>
            <td>{{ personData.Segundo_Apellido || 'No disponible' }}</td>
          </tr>
          <tr>
            <th>Título de Cortesía:</th>
            <td>{{ personData.Titulo_Cortesia || 'No disponible' }}</td>
          </tr>
          <tr>
            <th>Fecha de Nacimiento:</th>
            <td>{{ formatDate(personData.Fecha_Nacimiento) }}</td>
          </tr>
          <tr>
            <th>Género:</th>
            <td>{{ personData.Genero || 'No disponible' }}</td>
          </tr>
          <tr>
            <th>Tipo de Sangre:</th>
            <td>{{ personData.Tipo_Sangre || 'No disponible' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Contenido específico para usuarios -->
    <div class="coach-content">
      <div class="stats-card">
        <h3>Tus Sesiones</h3>
        <p class="stat">3 programadas</p>
      </div>
      
      <div class="stats-card">
        <h3>Días Activos</h3>
        <p class="stat">15 este mes</p>
      </div>
      
      <div class="stats-card">
        <h3>Progreso</h3>
        <p class="stat">75% completado</p>
      </div>
    </div>
    
    <div class="action-buttons">
      <button class="btn primary">Ver Horarios</button>
      <button class="btn secondary">Mi Entrenamiento</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavbarDashboard from '../../components/dashboard/NavbarDashboard.vue';
import axios from 'axios';
import AuthService from '../../services/AuthService';

// Variables reactivas
const personData = ref(null);
const loading = ref(true);
const error = ref('');

// URL de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://gymtoday12.com';

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

// Usar datos de demostración
const useDemoData = () => {
  // Obtener información del usuario del localStorage
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  
  personData.value = {
    ID: 1,
    Usuario_ID: userInfo.id || 4,
    Nombre: userInfo.username?.split(' ')[0] || "Usuario",
    Primer_Apellido: userInfo.username?.split(' ')[1] || "De Prueba",
    Segundo_Apellido: "",
    Titulo_Cortesia: "Sr.",
    Fecha_Nacimiento: "1990-01-01T00:00:00.000Z",
    Genero: "Masculino",
    Tipo_Sangre: "O+",
    Estatus: true
  };
  
  error.value = "Mostrando datos de demostración mientras se conecta con el servidor.";
};

// Obtener datos de la persona
// En tu UsersView.vue, modifica la función fetchPersonData
const fetchPersonData = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Obtener token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay sesión activa');
    }
    
    // IMPORTANTE: Asegurarse de usar el formato correcto
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    console.log("Token usado:", token);
    console.log("Headers enviados:", headers);
    
    // Intentar con la ruta sin prefijo porque así está montado en app.py
    try {
      const response = await axios.get('https://gymtoday12.com/my-person/', { headers });
      personData.value = response.data;
      return;
    } catch (err) {
      console.log("Error con la primera URL:", err.response?.status);
      // Continuar con datos de prueba
    }
    
    // Si llegamos aquí, usar datos de prueba
    useDemoData();
  } catch (err) {
    console.error('Error:', err);
    error.value = 'Error al cargar datos. Usando datos de demostración.';
    useDemoData();
  } finally {
    loading.value = false;
  }
};

// Llamar a la función cuando el componente se monte
onMounted(() => {
  fetchPersonData();
});
</script>

<style scoped>
.coach-dashboard {
  padding: 20px;
}

.personal-data {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.person-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.person-table th, .person-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.person-table th {
  width: 30%;
  font-weight: 600;
  color: #495057;
}

.loading, .error-message {
  padding: 20px;
  text-align: center;
  border-radius: 6px;
  margin: 15px 0;
}

.error-message {
  background-color: #ffe9e9;
  color: #d32f2f;
}

.loading {
  background-color: #f8f9fa;
  color: #6c757d;
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

.mt-2 {
  margin-top: 10px;
}
</style>