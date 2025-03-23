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
          <span v-if="loading" class="loader"></span>
          <span v-else>{{ loading ? 'Cargando...' : 'Registrarse' }}</span>
        </button>
      </form>
    </template>

    <!-- Mostrar el componente de verificación después del registro exitoso -->
    <VerificationCode v-if="showVerification" :email="email" />

    <!-- Solo mostrar estas opciones cuando no se está en la pantalla de verificación -->
    <template v-if="!showVerification">
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
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import AuthService from '@/services/AuthService';
import VerificationCode from '@/components/VerificationCode.vue';

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

// Validar entrada de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña
const validatePassword = (password: string): boolean => {
  // La contraseña debe tener al menos 8 caracteres, una letra y un número
  return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
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
    // Guardar el email para recuperarlo durante la verificación
    localStorage.setItem('pendingVerificationEmail', email.value);
    
    const response = await AuthService.register({
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // Mostrar mensaje de éxito
    message.value = {
      text: response.message || 'Se ha enviado un código de verificación a tu correo electrónico.',
      type: 'success',
    };

    // Mostrar el componente de verificación después del registro exitoso
    showVerification.value = true;
  } catch (error: any) {
    console.error('Error de registro:', error);
    message.value = {
      text: error.response?.data?.detail || 'Error al registrarse',
      type: 'error',
    };
    // Limpiar contraseñas en caso de error
    password.value = '';
    confirmPassword.value = '';
  } finally {
    loading.value = false;
  }
};

// Manejar registro con Google
const handleGoogleRegister = () => {
  loading.value = true;
  AuthService.loginWithGoogle();
};

onMounted(() => {
  // Verificar si hay un registro pendiente de verificación
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');
  if (pendingEmail) {
    email.value = pendingEmail;
    
    // Si venimos desde una recarga y teníamos un registro pendiente
    // podríamos decidir mostrar directamente la pantalla de verificación
    // pero por ahora lo dejamos así para mantener compatibilidad
  }

  // Animaciones GSAP
  const staggerDelay = 0.2;
  const elements = [
    { ref: title.value, delay: staggerDelay * 1 },
    { ref: usernameField.value, delay: staggerDelay * 2 },
    { ref: emailField.value, delay: staggerDelay * 3 },
    { ref: passwordField.value, delay: staggerDelay * 4 },
    { ref: confirmPasswordField.value, delay: staggerDelay * 5 },
    { ref: submitButton.value, delay: staggerDelay * 6 },
    { ref: dividerWrapper.value, delay: staggerDelay * 7 },
    { ref: googleButton.value, delay: staggerDelay * 8 },
    { ref: loginText.value, delay: staggerDelay * 9 }
  ];

  elements.forEach(elem => {
    if (elem.ref) {
      gsap.fromTo(
        elem.ref, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: elem.delay }
      );
    }
  });
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