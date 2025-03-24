<template>
  <v-container class="personal-data-view">
    <!-- Título del apartado -->
    <h1 class="section-title">Datos Personales</h1>

    <!-- Formulario para ingresar datos personales -->
    <v-form @submit.prevent="savePersonalData" class="form-container">
      <!-- Fila 1: Título de cortesía, nombre y apellidos -->
      <v-row class="form-row">
        <v-col cols="12" sm="4">
          <v-text-field v-model="title" label="Título de cortesía (opcional)" variant="outlined" density="compact"
            placeholder="Ejemplo: Sr., Dra., Lic., etc." prepend-inner-icon="mdi-account-tie"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="firstName" label="Nombre" variant="outlined" density="compact"
            prepend-inner-icon="mdi-card-account-details"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="lastName1" label="Primer apellido" variant="outlined" density="compact"
            prepend-inner-icon="mdi-account"></v-text-field>
        </v-col>
      </v-row>

      <!-- Fila 2: Segundo apellido, número telefónico y fecha de nacimiento -->
      <v-row class="form-row">
        <v-col cols="12" sm="4">
          <v-text-field v-model="lastName2" label="Segundo apellido" variant="outlined" density="compact"
            prepend-inner-icon="mdi-account-outline"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="phoneNumber" label="Número telefónico" variant="outlined" type="tel" density="compact"
            prepend-inner-icon="mdi-phone"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="birthDate" label="Fecha de nacimiento" variant="outlined" type="date" density="compact"
            prepend-inner-icon="mdi-calendar"></v-text-field>
        </v-col>
      </v-row>

      <!-- Fila 3: Género y tipo de sangre -->
      <v-row class="form-row">
        <v-col cols="12" sm="6">
          <v-select v-model="gender" :items="['Masculino', 'Femenino', 'Otro']" label="Género" variant="outlined"
            density="compact" prepend-inner-icon="mdi-gender-male-female"></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select v-model="bloodType" :items="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']"
            label="Tipo de sangre" variant="outlined" density="compact" prepend-inner-icon="mdi-water"></v-select>
        </v-col>
      </v-row>

      <!-- Fila 4: Estatura y peso -->
      <v-row class="form-row">
        <v-col cols="12" sm="6">
          <v-text-field v-model="height" label="Estatura (cm)" variant="outlined" type="number" density="compact"
            prepend-inner-icon="mdi-human-male-height"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="weight" label="Peso (kg)" variant="outlined" type="number" density="compact"
            prepend-inner-icon="mdi-scale-bathroom"></v-text-field>
        </v-col>
      </v-row>

      <!-- Fila 5: Cargar fotografía -->
      <v-row class="form-row">
        <v-col cols="12">
          <v-file-input v-model="photo" label="Cargar fotografía" accept="image/*" variant="outlined" density="compact"
            prepend-icon="mdi-camera" append-inner-icon="mdi-upload"></v-file-input>
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
import { ref } from 'vue';

// Estado del formulario
const title = ref<string | null>(null); // Cambiado a texto libre
const firstName = ref<string>('');
const lastName1 = ref<string>('');
const lastName2 = ref<string>('');
const phoneNumber = ref<string>('');
const birthDate = ref<string | null>(null);
const gender = ref<string | null>(null);
const bloodType = ref<string | null>(null);
const height = ref<number | null>(null);
const weight = ref<number | null>(null);
const photo = ref<File | null>(null);
const loading = ref<boolean>(false);

// Función para guardar los datos personales
const savePersonalData = () => {
  loading.value = true;

  const personalData = {
    title: title.value,
    firstName: firstName.value,
    lastName1: lastName1.value,
    lastName2: lastName2.value,
    phoneNumber: phoneNumber.value,
    birthDate: birthDate.value,
    gender: gender.value,
    bloodType: bloodType.value,
    height: height.value,
    weight: weight.value,
    photo: photo.value ? URL.createObjectURL(photo.value) : null, // Convertir la imagen a URL
  };

  console.log('Datos personales guardados:', personalData);
  setTimeout(() => {
    alert('Datos personales guardados correctamente.');
    loading.value = false;
  }, 1000); // Simulación de carga
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
