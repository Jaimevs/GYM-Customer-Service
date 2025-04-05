<template>
  <div class="login-container">
    <h2 class="title">Iniciar Sesión</h2>

    <!-- Mensaje de error o éxito -->
    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>

    <!-- Formulario de Login -->
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="input-field" ref="emailField">
        <Icon icon="eva:email-outline" width="24" height="24" />
        <input type="email" v-model="email" placeholder="Correo electrónico" required />
      </div>
      <div class="input-field password-field" ref="passwordField">
        <Icon icon="solar:lock-password-linear" width="24" height="24" />
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Contraseña" required />
        <!-- Ícono para alternar la visibilidad de la contraseña -->
        <Icon :icon="showPassword ? 'eva:eye-outline' : 'eva:eye-off-outline'" width="20" height="20"
          class="toggle-password" @click="togglePasswordVisibility" />
      </div>
      <button type="submit" class="btn solid" ref="submitButton" :disabled="loading">
        <span v-if="loading" class="loader"></span>
        <span v-else>Continuar</span>
      </button>
    </form>

    <!-- Texto de Registro -->
    <p class="register-text">
      ¿No tienes una cuenta?
      <router-link to="/register" class="register-link">Regístrate</router-link>
    </p>

    <!-- Divider Wrapper -->
    <div class="divider-wrapper" ref="dividerWrapper">
      <span>O inicia sesión con</span>
    </div>

    <!-- Opción de continuar con Google -->
    <button @click="handleGoogleLogin" class="btn google" ref="googleButton" :disabled="loading">
      <Icon icon="flat-color-icons:google" width="24" height="24" />
      Continuar con Google
    </button>

    <!-- Separator para Términos de Uso y Política de Privacidad -->
    <div class="separator">
      <a href="#">Términos de uso</a> | <a href="#">Política de privacidad</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import { useAuthStore } from '@/stores/authStore'; // Importar el store de Pinia
import AuthService from '@/services/AuthService';
import GoogleAuthService from '@/services/GoogleAuthService';

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const loading = ref(false);
const message = ref<{ text: string; type: 'success' | 'error' } | null>(null);

// Variable para controlar la visibilidad de la contraseña
const showPassword = ref(false);

// Referencias para las animaciones
const emailField = ref(null);
const passwordField = ref(null);
const submitButton = ref(null);
const dividerWrapper = ref(null);
const googleButton = ref(null);

// Función para alternar la visibilidad de la contraseña
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// En tu método de login
const handleSubmit = async () => {
  loading.value = true;
  message.value = null;

  try {
    // Usar AuthService para iniciar sesión
    const response = await AuthService.login({
      email: email.value,
      password: password.value
    });

    // Actualizar el store de Pinia
    const authStore = useAuthStore();
    authStore.setRole(response.roles[0] || 'usuario'); 
    authStore.setUsername(response.Nombre_Usuario);
    authStore.setAuthentication(true);

    // Redireccionar según el rol
    if (response.roles.includes("admin")) {
      router.push("/dashboard");
    } else if (response.roles.includes("usuario")) {
      router.push("/user-dashboard");
    } else if (response.roles.includes("entrenador")) {
      router.push("/coach-dashboard");
    } else {
      router.push("/dashboard"); // Redirección por defecto
    }
  } catch (error) {
    console.error("Error de login:", error);
    
    let errorMessage = "Error al iniciar sesión";
    if (error.response) {
      errorMessage = error.response.data?.mensaje || errorMessage;
    }
    
    message.value = {
      text: errorMessage,
      type: "error",
    };
  } finally {
    loading.value = false;
  }
};

// Manejar login con Google
const handleGoogleLogin = () => {
  loading.value = true;
  message.value = null;
  
  try {
    // Usar el servicio de autenticación de Google
    GoogleAuthService.startGoogleAuth();
  } catch (error) {
    console.error('Error al iniciar autenticación con Google:', error);
    message.value = {
      text: 'Error al iniciar autenticación con Google',
      type: 'error',
    };
    loading.value = false;
  }
};

onMounted(() => {
  // Verificar si hay errores en la URL
  const errorParam = route.query.error as string;
  if (errorParam) {
    message.value = {
      text: decodeURIComponent(errorParam),
      type: 'error'
    };
  }

  // Animaciones GSAP
  gsap.fromTo(emailField.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
  );

  gsap.fromTo(passwordField.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }
  );

  gsap.fromTo(submitButton.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
  );

  gsap.fromTo(dividerWrapper.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 }
  );

  gsap.fromTo(googleButton.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.0 }
  );
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

// Estilos para el campo de contraseña
.password-field {
  position: relative;
}

// Estilos para el toggle de contraseña
.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #aaa;
  transition: color 0.3s ease;

  &:hover {
    color: #666;
  }
}

// Estilos para el botón de Google
.btn.google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #ffffff;
  color: #757575;
  border: 1px solid #dddddd;
  font-weight: 500;
  margin-bottom: 15px;
  
  &:hover {
    background-color: #f5f5f5;
  }
}

// Estilo para el loader
.loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>