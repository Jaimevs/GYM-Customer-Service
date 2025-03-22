<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Coach Settings</h1>
      </v-col>
    </v-row>

    <!-- Formulario de configuración -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Profile Settings</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveProfileSettings">
              <v-text-field v-model="profileSettings.name" label="Full Name" outlined dense></v-text-field>

              <v-text-field v-model="profileSettings.email" label="Email" outlined dense></v-text-field>

              <v-text-field v-model="profileSettings.phone" label="Phone Number" outlined dense></v-text-field>

              <v-btn type="submit" color="primary" class="mt-4">
                Save Changes
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cambio de contraseña -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="changePassword">
              <v-text-field v-model="passwordSettings.currentPassword" label="Current Password" type="password" outlined
                dense></v-text-field>

              <v-text-field v-model="passwordSettings.newPassword" label="New Password" type="password" outlined
                dense></v-text-field>

              <v-text-field v-model="passwordSettings.confirmPassword" label="Confirm New Password" type="password"
                outlined dense></v-text-field>

              <v-btn type="submit" color="primary" class="mt-4">
                Change Password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Configuración adicional -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Additional Settings</v-card-title>
          <v-card-text>
            <v-switch v-model="additionalSettings.notifications" label="Enable Notifications"
              color="primary"></v-switch>

            <v-switch v-model="additionalSettings.darkMode" label="Dark Mode" color="primary"></v-switch>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CoachSettingsView',
  setup() {
    // Datos del formulario de perfil
    const profileSettings = ref({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
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
    });

    // Método para guardar los cambios del perfil
    const saveProfileSettings = () => {
      console.log('Profile settings saved:', profileSettings.value);
      // Aquí puedes agregar la lógica para guardar los cambios en el backend
    };

    // Método para cambiar la contraseña
    const changePassword = () => {
      if (passwordSettings.value.newPassword !== passwordSettings.value.confirmPassword) {
        alert('New password and confirmation do not match.');
        return;
      }
      console.log('Password changed:', passwordSettings.value);
      // Aquí puedes agregar la lógica para cambiar la contraseña en el backend
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

<style scoped>
/* Estilos personalizados si los necesitas */
</style>
