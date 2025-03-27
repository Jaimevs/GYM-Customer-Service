<template>
  <v-container class="personal-data-view" fluid>
    <!-- Encabezado con diseño mejorado -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center justify-center mb-2">
          <Icon icon="solar:user-id-bold" width="36" class="mr-3 text-primary" />
          <h1 class="text-h3 font-weight-bold text-gradient">Datos Personales</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis text-center">
          Actualiza y gestiona tu información personal
        </p>
      </v-col>
    </v-row>

    <!-- Contenedor principal con diseño de tarjeta -->
    <v-card class="elevation-4 mx-auto" max-width="1000" data-aos="fade-up">
      <!-- Alerta flotante -->
      <v-alert v-if="alert.show" :type="alert.type" :text="alert.message" class="floating-alert" closable
        @click:close="alert.show = false"></v-alert>

      <v-row no-gutters>
        <!-- Columna izquierda - Foto de perfil -->
        <v-col cols="12" md="4" class="profile-column pa-6">
          <div class="d-flex flex-column align-center">
            <div class="avatar-container mb-4">
              <v-avatar size="180" class="profile-avatar">
                <v-img v-if="personalData.photoUrl" :src="personalData.photoUrl" alt="Fotografía de perfil"
                  cover></v-img>
                <Icon v-else icon="solar:user-circle-bold" width="100" class="text-grey-lighten-1" />
              </v-avatar>
              <v-btn icon color="primary" size="small" class="edit-photo-btn" @click="$refs.fileInput.click()">
                <Icon icon="solar:camera-bold" width="20" />
              </v-btn>
            </div>

            <v-file-input ref="fileInput" v-model="photo" accept="image/*" label="Cambiar foto" prepend-icon=""
              variant="outlined" density="compact" class="d-none" @change="handlePhotoChange"></v-file-input>

            <div class="text-center mt-4">
              <h3 class="text-h5 font-weight-bold">{{ fullName }}</h3>
              <p class="text-body-1 text-medium-emphasis">{{ personalData.title || 'Sin título' }}</p>
            </div>

            <v-divider class="my-4 w-100"></v-divider>

            <div class="quick-stats w-100">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption text-medium-emphasis">Edad:</span>
                <span class="text-body-2 font-weight-medium">{{ calculatedAge || '--' }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption text-medium-emphasis">Tipo de sangre:</span>
                <span class="text-body-2 font-weight-medium">{{ personalData.bloodType || '--' }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-caption text-medium-emphasis">IMC:</span>
                <span class="text-body-2 font-weight-medium">{{ calculatedBMI || '--' }}</span>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Columna derecha - Formulario -->
        <v-col cols="12" md="8" class="form-column pa-6">
          <v-form @submit.prevent="savePersonalData" class="form-container">
            <!-- Sección 1: Información básica -->
            <div class="form-section">
              <div class="section-header mb-4">
                <Icon icon="solar:card-bold" width="24" class="mr-2 text-primary" />
                <h2 class="text-h5 font-weight-bold">Información Básica</h2>
              </div>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.firstName" label="Nombre" variant="outlined" density="comfortable"
                    prepend-inner-icon="solar:user-bold" :rules="[requiredRule]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.lastName1" label="Primer apellido" variant="outlined"
                    density="comfortable" prepend-inner-icon="solar:user-bold" :rules="[requiredRule]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.lastName2" label="Segundo apellido" variant="outlined"
                    density="comfortable" prepend-inner-icon="solar:user-bold"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.title" label="Título de cortesía" variant="outlined"
                    density="comfortable" prepend-inner-icon="solar:medal-star-bold"
                    placeholder="Ej: Sr., Dra., Lic."></v-text-field>
                </v-col>
              </v-row>
            </div>

            <!-- Sección 2: Datos de contacto -->
            <div class="form-section mt-6">
              <div class="section-header mb-4">
                <Icon icon="solar:phone-bold" width="24" class="mr-2 text-primary" />
                <h2 class="text-h5 font-weight-bold">Datos de Contacto</h2>
              </div>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.phoneNumber" label="Teléfono" variant="outlined"
                    density="comfortable" prepend-inner-icon="solar:phone-bold" type="tel"
                    :rules="[phoneRule]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.birthDate" label="Fecha de nacimiento" variant="outlined"
                    density="comfortable" prepend-inner-icon="solar:calendar-bold" type="date"
                    :max="maxBirthDate"></v-text-field>
                </v-col>
              </v-row>
            </div>

            <!-- Sección 3: Información médica -->
            <div class="form-section mt-6">
              <div class="section-header mb-4">
                <Icon icon="solar:heart-pulse-bold" width="24" class="mr-2 text-primary" />
                <h2 class="text-h5 font-weight-bold">Información Médica</h2>
              </div>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-select v-model="personalData.gender" :items="genders" label="Género" variant="outlined"
                    density="comfortable" prepend-inner-icon="solar:users-bold" :rules="[requiredRule]"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="personalData.bloodType" :items="bloodTypes" label="Tipo de sangre"
                    variant="outlined" density="comfortable" prepend-inner-icon="solar:blood-drop-bold"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.height" label="Estatura (cm)" variant="outlined"
                    density="comfortable" prepend-inner-icon="solar:ruler-bold" type="number" min="100" max="250"
                    suffix="cm"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalData.weight" label="Peso (kg)" variant="outlined" density="comfortable"
                    prepend-inner-icon="solar:weight-bold" type="number" min="30" max="200" suffix="kg"></v-text-field>
                </v-col>
              </v-row>
            </div>

            <!-- Botones de acción -->
            <v-row class="mt-8">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="secondary" variant="outlined" class="mr-3" @click="resetForm" :disabled="loading">
                  <Icon icon="solar:close-circle-bold" width="18" class="mr-1" />
                  Cancelar
                </v-btn>
                <v-btn type="submit" color="primary" variant="flat" :loading="loading" :disabled="loading">
                  <Icon icon="solar:check-circle-bold" width="18" class="mr-1" />
                  Guardar Cambios
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import PersonalDataService from '@/services/PersonalDataService';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Datos de opciones
const genders = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Desconocido'];

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
const loading = ref(false);
const alert = reactive({
  show: false,
  type: 'success',
  message: ''
});

// Reglas de validación
const requiredRule = (v: string) => !!v || 'Este campo es requerido';
const phoneRule = (v: string) => !v || /^[0-9]{10}$/.test(v) || 'Teléfono inválido';

// Computed
const fullName = computed(() => {
  return `${personalData.firstName || ''} ${personalData.lastName1 || ''} ${personalData.lastName2 || ''}`.trim();
});

const calculatedAge = computed(() => {
  if (!personalData.birthDate) return null;
  const birthDate = new Date(personalData.birthDate);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

const calculatedBMI = computed(() => {
  if (!personalData.height || !personalData.weight) return null;
  const heightInMeters = personalData.height / 100;
  const bmi = personalData.weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
});

const maxBirthDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Métodos
const loadPersonalData = async () => {
  try {
    loading.value = true;
    const userData = await PersonalDataService.getPersonalData();

    personalData.title = userData.Titulo_Cortesia || '';
    personalData.firstName = userData.Nombre || '';
    personalData.lastName1 = userData.Primer_Apellido || '';
    personalData.lastName2 = userData.Segundo_Apellido || '';
    personalData.phoneNumber = userData.Numero_Telefonico || '';
    personalData.birthDate = userData.Fecha_Nacimiento ? new Date(userData.Fecha_Nacimiento).toISOString().split('T')[0] : '';
    personalData.gender = userData.Genero || '';
    personalData.bloodType = userData.Tipo_Sangre || '';
    personalData.height = userData.Estatura ? userData.Estatura * 100 : null;
    personalData.weight = userData.Peso;
    personalData.photoUrl = userData.Fotografia;

  } catch (error) {
    console.error('Error al cargar datos personales:', error);
  } finally {
    loading.value = false;
  }
};

const savePersonalData = async () => {
  try {
    loading.value = true;

    const apiData = {
      Titulo_Cortesia: personalData.title || null,
      Nombre: personalData.firstName || null,
      Primer_Apellido: personalData.lastName1 || null,
      Segundo_Apellido: personalData.lastName2 || null,
      Numero_Telefonico: personalData.phoneNumber || null,
      Fecha_Nacimiento: personalData.birthDate || null,
      Genero: personalData.gender || null,
      Tipo_Sangre: personalData.bloodType || null,
      Estatura: personalData.height ? personalData.height / 100 : null,
      Peso: personalData.weight
    };

    const result = await PersonalDataService.saveOrCreateProfile(apiData, photo.value);

    if (result.Fotografia) {
      personalData.photoUrl = result.Fotografia;
    }

    showAlert('success', 'Tus datos se han guardado correctamente');

  } catch (error) {
    console.error('Error al guardar datos personales:', error);
    showAlert('error', 'No se pudieron guardar los datos. Por favor intenta nuevamente.');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  loadPersonalData();
  photo.value = null;
};

const handlePhotoChange = (file: File) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      personalData.photoUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const showAlert = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
  alert.type = type;
  alert.message = message;
  alert.show = true;
  setTimeout(() => { alert.show = false; }, 5000);
};

// Inicialización
onMounted(() => {
  AOS.init({ duration: 800, once: true });
  loadPersonalData();
});
</script>

<style scoped lang="scss">
.personal-data-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.text-gradient {
  background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.floating-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.profile-column {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.avatar-container {
  position: relative;
  display: inline-block;

  .profile-avatar {
    border: 4px solid var(--v-primary-base);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }
  }

  .edit-photo-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

.quick-stats {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-column {
  background-color: white;
}

.form-section {
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.2);
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 960px) {
  .profile-column {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .floating-alert {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>
