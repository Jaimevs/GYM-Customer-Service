<template>
  <div class="settings-dashboard">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="settings-title">
          <span class="title-text">Configuración</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="welcome-message">Gestiona tu perfil y preferencias</p>
      </v-col>
    </v-row>

    <!-- Contenido Principal -->
    <v-row class="main-content-section">
      <!-- Configuración de Perfil -->
      <v-col cols="12" md="6" data-aos="fade-right" data-aos-delay="200">
        <v-card class="settings-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="mdi:account-cog" width="24" />
            </div>
            <h2>Configuración de Perfil</h2>
          </div>
          <v-card-text>
            <v-form @submit.prevent="saveProfileSettings">
              <v-text-field v-model="profileSettings.name" label="Nombre Completo" outlined dense
                prepend-inner-icon="mdi-account" class="mb-3"></v-text-field>

              <v-text-field v-model="profileSettings.email" label="Correo Electrónico" outlined dense
                prepend-inner-icon="mdi-email" class="mb-3"></v-text-field>

              <v-text-field v-model="profileSettings.phone" label="Teléfono" outlined dense
                prepend-inner-icon="mdi-phone" class="mb-3"></v-text-field>

              <v-btn type="submit" color="primary" block class="save-btn">
                <Icon icon="mdi:content-save" left />
                Guardar Cambios
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cambio de Contraseña -->
      <v-col cols="12" md="6" data-aos="fade-left" data-aos-delay="300">
        <v-card class="settings-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="mdi:lock-reset" width="24" />
            </div>
            <h2>Cambiar Contraseña</h2>
          </div>
          <v-card-text>
            <v-form @submit.prevent="changePassword">
              <v-text-field v-model="passwordSettings.currentPassword" label="Contraseña Actual" type="password"
                outlined dense prepend-inner-icon="mdi-lock" class="mb-3"></v-text-field>

              <v-text-field v-model="passwordSettings.newPassword" label="Nueva Contraseña" type="password" outlined
                dense prepend-inner-icon="mdi-key" class="mb-3"></v-text-field>

              <v-text-field v-model="passwordSettings.confirmPassword" label="Confirmar Nueva Contraseña"
                type="password" outlined dense prepend-inner-icon="mdi-key-change" class="mb-3"></v-text-field>

              <v-btn type="submit" color="primary" block class="save-btn">
                <Icon icon="mdi:key-variant" left />
                Cambiar Contraseña
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Configuración Adicional -->
    <v-row class="main-content-section">
      <v-col cols="12" data-aos="fade-up" data-aos-delay="400">
        <v-card class="settings-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="mdi:cog" width="24" />
            </div>
            <h2>Preferencias</h2>
          </div>
          <v-card-text>
            <div class="preferences-container">
              <v-switch v-model="additionalSettings.notifications" label="Recibir Notificaciones" color="primary"
                class="preference-item"></v-switch>

              <v-switch v-model="additionalSettings.darkMode" label="Modo Oscuro" color="primary"
                class="preference-item"></v-switch>

              <v-switch v-model="additionalSettings.availability" label="Mostrar Disponibilidad Pública" color="primary"
                class="preference-item"></v-switch>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: 'CoachSettingsView',
  components: {
    Icon
  },
  setup() {
    // Inicializar animaciones
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out-quad'
    });

    // Datos del formulario de perfil
    const profileSettings = ref({
      name: 'Carlos Martínez',
      email: 'carlos.martinez@example.com',
      phone: '+34 612 345 678',
    });

    // Datos del formulario de cambio de contraseña
    const passwordSettings = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    // Configuración adicional
    const additionalSettings = ref({
      notifications: true,
      darkMode: false,
      availability: true,
    });

    // Método para guardar los cambios del perfil
    const saveProfileSettings = () => {
      console.log('Configuración guardada:', profileSettings.value);
      // Lógica para guardar los cambios en el backend
    };

    // Método para cambiar la contraseña
    const changePassword = () => {
      if (passwordSettings.value.newPassword !== passwordSettings.value.confirmPassword) {
        alert('La nueva contraseña y la confirmación no coinciden.');
        return;
      }
      console.log('Contraseña cambiada:', passwordSettings.value);
      // Lógica para cambiar la contraseña en el backend
    };

    return {
      profileSettings,
      passwordSettings,
      additionalSettings,
      saveProfileSettings,
      changePassword,
    };
  },
});
</script>

<style scoped lang="scss">
.settings-dashboard {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

/* Título */
.settings-title {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;

  .title-text {
    position: relative;
    z-index: 2;
    font-size: 2.25rem;
    font-weight: 700;
    background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-family: var(--fuente-titulo);
  }

  .title-highlight {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    height: 12px;
    background: rgba(255, 69, 0, 0.2);
    border-radius: 4px;
    z-index: 1;
    transform: rotate(-1deg);
  }
}

.welcome-message {
  font-size: 1rem;
  color: #5D4037;
  margin-top: 8px;
}

/* Tarjetas de Configuración */
.settings-card {
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  margin-top: 24px;

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e0e0e0;

    h2 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .chart-icon-bg {
      width: 40px;
      height: 40px;
      background: rgba(255, 112, 67, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #FF7043;
    }
  }

  .save-btn {
    margin-top: 16px;
    transition: all 0.3s;
    background: linear-gradient(45deg, #FF7043, #FFB74D);
    color: white;
    font-weight: 600;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(255, 112, 67, 0.3) !important;
    }
  }
}

/* Preferencias */
.preferences-container {
  padding: 8px 16px;

  .preference-item {
    padding: 12px 0;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }
}

/* Responsive */
@media (max-width: 960px) {
  .settings-title .title-text {
    font-size: 1.75rem;
  }

  .title-highlight {
    height: 8px;
    bottom: 3px;
  }
}
</style>
