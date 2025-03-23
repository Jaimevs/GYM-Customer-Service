<template>
  <div class="login-container">
    <h2 class="title" ref="title">Registrarse</h2>

    <!-- Mensaje de error o éxito -->
    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>

    <!-- Mostrar el formulario de registro o el componente de verificación -->
    <template v-if="!showVerification">
      <!-- Formulario de Registro -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Nombre de Usuario -->
        <div class="input-field" ref="usernameField">
          <Icon icon="eva:person-outline" width="20" height="20" />
          <input type="text" v-model="username" placeholder="Nombre de usuario" required />
        </div>

        <!-- Correo Electrónico -->
        <div class="input-field" ref="emailField">
          <Icon icon="eva:email-outline" width="20" height="20" />
          <input type="email" v-model="email" placeholder="Correo electrónico" required />
        </div>

        <!-- Contraseña -->
        <div class="input-field" ref="passwordField">
          <Icon icon="solar:lock-password-linear" width="20" height="20" />
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Contraseña" required />
          <Icon :icon="showPassword ? 'eva:eye-outline' : 'eva:eye-off-outline'" width="20" height="20"
            class="toggle-password" @click="togglePasswordVisibility" />
        </div>

        <!-- Confirmar Contraseña -->
        <div class="input-field" ref="confirmPasswordField">
          <Icon icon="solar:lock-password-linear" width="20" height="20" />
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
            placeholder="Confirmar contraseña" required />
          <Icon :icon="showConfirmPassword ? 'eva:eye-outline' : 'eva:eye-off-outline'" width="20" height="20"
            class="toggle-password" @click="toggleConfirmPasswordVisibility" />
        </div>

        <!-- Botón de Registro -->
        <button type="submit" class="btn solid" ref="submitButton" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Registrarse' }}
        </button>
      </form>
    </template>

    <!-- Mostrar el componente de verificación después del registro exitoso -->
    <VerificationCode v-if="showVerification" />

    <!-- Divider Wrapper -->
    <div class="divider-wrapper" ref="dividerWrapper">
      <span>O regístrate con</span>
    </div>

    <!-- Opción de continuar con Google -->
    <button @click="handleGoogleRegister" class="btn google" ref="googleButton" :disabled="loading">
      <Icon icon="flat-color-icons:google" width="20" height="20" />
      Continuar con Google
    </button>

    <!-- Separator para Términos de Uso y Política de Privacidad -->
    <div class="separator">
      <a href="#">Términos de uso</a> | <a href="#">Política de privacidad</a>
    </div>

    <!-- Texto de Login -->
    <p class="register-text" ref="loginText">
      ¿Ya tienes una cuenta?
      <router-link to="/login" class="register-link">Inicia Sesión</router-link>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import AuthService from '@/services/AuthService';
import VerificationCode from '@/components/VerificationCode.vue'; // Importar el componente de verificación

const router = useRouter();
const route = useRoute();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const message = ref<{ text: string; type: 'success' | 'error' } | null>(null);
const showVerification = ref(false); // Controlar la visibilidad del componente de verificación
const showPassword = ref(false); // Mostrar/ocultar contraseña
const showConfirmPassword = ref(false); // Mostrar/ocultar confirmación de contraseña

// Referencias para las animaciones
const title = ref(null);
const usernameField = ref(null);
const emailField = ref(null);
const passwordField = ref(null);
const confirmPasswordField = ref(null);
const submitButton = ref(null);
const dividerWrapper = ref(null);
const googleButton = ref(null);
const loginText = ref(null);

// Mostrar/ocultar contraseña
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Mostrar/ocultar confirmación de contraseña
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Manejar el envío del formulario
const handleSubmit = async () => {
  // Validar que las contraseñas coincidan
  if (password.value !== confirmPassword.value) {
    message.value = {
      text: 'Las contraseñas no coinciden',
      type: 'error',
    };
    return;
  }

  loading.value = true;
  message.value = null;

  try {
    const response = await AuthService.register({
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // Mostrar el componente de verificación después del registro exitoso
    showVerification.value = true;

    // Limpiar formulario
    username.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
  } catch (error: any) {
    console.error('Error de registro:', error);
    message.value = {
      text: error.response?.data?.detail || 'Error al registrarse',
      type: 'error',
    };
  } finally {
    loading.value = false;
  }
};

// Manejar registro con Google
const handleGoogleRegister = () => {
  AuthService.loginWithGoogle();
};

onMounted(() => {
  // Animaciones GSAP
  gsap.to(title.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
  gsap.to(usernameField.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });
  gsap.to(emailField.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 });
  gsap.to(passwordField.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 });
  gsap.to(confirmPasswordField.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.0 });
  gsap.to(submitButton.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.2 });
  gsap.to(dividerWrapper.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.4 });
  gsap.to(googleButton.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.6 });
  gsap.to(loginText.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.8 });
});
</script>

<style scoped lang="scss">
@use '@/styles/auth/_auth.scss';
@use '@/styles/auth/_login.scss';

// Estilos adicionales para mensajes
.message {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;

  &.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  &.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
}

// Estilos para botones deshabilitados
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
