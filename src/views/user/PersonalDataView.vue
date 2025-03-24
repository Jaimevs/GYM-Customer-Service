<template>
  <v-container class="personal-data-view">
    <!-- Título del apartado -->
    <h1 class="section-title">Datos Personales</h1>

    <!-- Alerta para mensajes de éxito o error -->
    <v-alert
      v-if="alert.show"
      :type="alert.type"
      :text="alert.message"
      class="mb-4"
      closable
      @click:close="alert.show = false"
    ></v-alert>

    <!-- Mostrar fotografía actual si existe -->
    <div v-if="personalData.photoUrl" class="text-center mb-4">
      <v-avatar size="150" class="profile-avatar">
        <v-img :src="personalData.photoUrl" alt="Fotografía de perfil"></v-img>
      </v-avatar>
    </div>

    <!-- Formulario para ingresar datos personales -->
    <v-form @submit.prevent="savePersonalData" class="form-container">
      <!-- Fila 1: Título de cortesía, nombre y apellidos -->
      <v-row class="form-row">
        <v-col cols="12" sm="4">
          <v-text-field v-model="personalData.title" label="Título de cortesía (opcional)" variant="outlined" density="compact"
            placeholder="Ejemplo: Sr., Dra., Lic., etc." prepend-inner-icon="mdi-account-tie"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="personalData.firstName" label="Nombre" variant="outlined" density="compact"
            prepend-inner-icon="mdi-card-account-details"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="personalData.lastName1" label="Primer apellido" variant="outlined" density="compact"
            prepend-inner-icon="mdi-account"></v-text-field>
        </v-col>
      </v-row>

      <!-- Fila 2: Segundo apellido, número telefónico y fecha de nacimiento -->
      <v-row class="form-row">
        <v-col cols="12" sm="4">
          <v-text-field v-model="personalData.lastName2" label="Segundo apellido" variant="outlined" density="compact"
            prepend-inner-icon="mdi-account-outline"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="personalData.phoneNumber" label="Número telefónico" variant="outlined" type="tel" density="compact"
            prepend-inner-icon="mdi-phone"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="personalData.birthDate" label="Fecha de nacimiento" variant="outlined" type="date" density="compact"
            prepend-inner-icon="mdi-calendar"></v-text-field>
        </v-col>
      </v-row>

      <!-- Fila 3: Género y tipo de sangre -->
      <v-row class="form-row">
        <v-col cols="12" sm="6">
          <v-select v-model="personalData.gender" :items="['Masculino', 'Femenino', 'Otro']" label="Género" variant="outlined"
            density="compact" prepend-inner-icon="mdi-gender-male-female"></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select v-model="personalData.bloodType" :items="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']"
            label="Tipo de sangre" variant="outlined" density="compact" prepend-inner-icon="mdi-water"></v-select>
        </v-col>
      </v-row>

      <!-- Fila 4: Estatura y peso -->
      <v-row class="form-row">
        <v-col cols="12" sm="6">
          <v-text-field v-model="personalData.height" label="Estatura (cm)" variant="outlined" type="number" density="compact"
            prepend-inner-icon="mdi-human-male-height"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="personalData.weight" label="Peso (kg)" variant="outlined" type="number" density="compact"
            prepend-inner-icon="mdi-scale-bathroom"></v-text-field>
        </v-col>
      </v-row>

      <!-- Fila 5: Cargar fotografía -->
      <v-row class="form-row">
        <v-col cols="12">
          <v-file-input v-model="photo" label="Cargar fotografía" accept="image/*" variant="outlined" density="compact"
            prepend-icon="mdi-camera" append-inner-icon="mdi-upload" hint="La imagen se guardará en formato Base64"></v-file-input>
        </v-col>
      </v-row>

      <!-- Botón para guardar -->
      <v-row class="form-row">
        <v-col cols="12">
          <v-btn type="submit" color="primary" block class="submit-button" :loading="loading" :disabled="loading">
            <v-icon left>mdi-content-save</v-icon>
            Guardar Datos
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import PersonalDataService from '@/services/PersonalDataService';

// Estado del formulario
const personalData = reactive({
  title: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  phoneNumber: '',
  birthDate: '',
  gender: '',
  bloodType: '',
  height: null as number | null,
  weight: null as number | null,
  photoUrl: '' as string | null
});

const photo = ref<File | null>(null);
const loading = ref<boolean>(false);
const alert = reactive({
  show: false,
  type: 'success',
  message: ''
});

// Cargar datos del usuario al iniciar el componente
onMounted(async () => {
  try {
    loading.value = true;
    const userData = await PersonalDataService.getPersonalData();
    
    // Mapear datos del backend al formato del formulario
    personalData.title = userData.Titulo_Cortesia || '';
    personalData.firstName = userData.Nombre || '';
    personalData.lastName1 = userData.Primer_Apellido || '';
    personalData.lastName2 = userData.Segundo_Apellido || '';
    personalData.phoneNumber = userData.Numero_Telefonico || '';
    personalData.birthDate = userData.Fecha_Nacimiento ? new Date(userData.Fecha_Nacimiento).toISOString().split('T')[0] : '';
    personalData.gender = userData.Genero || '';
    personalData.bloodType = userData.Tipo_Sangre || '';
    personalData.height = userData.Estatura;
    personalData.weight = userData.Peso;
    personalData.photoUrl = userData.Fotografia;
    
    console.log('Datos personales cargados:', personalData);
  } catch (error) {
    console.error('Error al cargar datos personales:', error);
    showAlert('error', 'No se pudieron cargar tus datos personales. Intenta nuevamente.');
  } finally {
    loading.value = false;
  }
});

// Función para guardar los datos personales
const savePersonalData = async () => {
  try {
    loading.value = true;

    // Convertir estatura de cm a metros para el backend (si está presente)
    let estaturaMetros = null;
    if (personalData.height !== null) {
      estaturaMetros = personalData.height / 100; // Convertir cm a metros
    }

    // Preparar datos para enviar al backend
    const apiData = {
      Titulo_Cortesia: personalData.title || null,
      Nombre: personalData.firstName || null,
      Primer_Apellido: personalData.lastName1 || null,
      Segundo_Apellido: personalData.lastName2 || null,
      Numero_Telefonico: personalData.phoneNumber || null,
      Fecha_Nacimiento: personalData.birthDate || null,
      Genero: personalData.gender || null,
      Tipo_Sangre: personalData.bloodType || null,
      Estatura: estaturaMetros,
      Peso: personalData.weight
    };

    // Guardar datos completos usando el servicio
    const result = await PersonalDataService.saveCompleteProfile(apiData, photo.value);
    
    // Actualizar la URL de la foto en el estado local si se devolvió una
    if (result.Fotografia) {
      personalData.photoUrl = result.Fotografia;
    }
    
    // Mostrar mensaje de éxito
    showAlert('success', 'Datos personales guardados correctamente.');
    
    console.log('Datos guardados:', result);
  } catch (error) {
    console.error('Error al guardar datos personales:', error);
    showAlert('error', 'No se pudieron guardar los datos. Verifica tu conexión e intenta nuevamente.');
  } finally {
    loading.value = false;
  }
};

// Función para mostrar alertas
const showAlert = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
  alert.type = type;
  alert.message = message;
  alert.show = true;
  
  // Ocultar automáticamente después de 5 segundos
  setTimeout(() => {
    alert.show = false;
  }, 5000);
};
</script>

<style scoped lang="scss">
.personal-data-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: #007bff;
    margin: 1rem auto 0;
    border-radius: 4px;
  }
}

.profile-avatar {
  border: 4px solid #4a90e2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.form-container {
  padding: 1rem;
}

.form-row {
  margin-bottom: 1.5rem;
}

.v-text-field,
.v-select,
.v-file-input {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.submit-button {
  margin-top: 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.3);
  }
}
</style>