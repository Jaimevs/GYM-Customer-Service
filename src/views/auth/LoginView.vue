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
      <div class="input-field" ref="passwordField">
        <Icon icon="solar:lock-password-linear" width="24" height="24" />
        <input type="password" v-model="password" placeholder="Contraseña" required />
      </div>
      <button type="submit" class="btn solid" ref="submitButton" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Continuar' }}
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
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Importar el store de Pinia

// Configura la URL de tu API
const API_URL = 'https://gymtoday12.com';

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const loading = ref(false);
const message = ref<{ text: string; type: 'success' | 'error' } | null>(null);

// Referencias para las animaciones
const emailField = ref(null);
const passwordField = ref(null);
const submitButton = ref(null);
const dividerWrapper = ref(null);
const googleButton = ref(null);

// Verificar si hay token o mensaje de error en la URL
onBeforeMount(() => {
  console.log('Verificando parámetros de URL');
  const token = route.query.token as string;

  if (token) {
    console.log('Token encontrado en URL');
    try {
      // Decodificar el token y guardarlo en localStorage
      localStorage.setItem('token', token);

      // Configurar axios para usar el token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redireccionar al dashboard (en un sistema real, verificarías los roles)
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al procesar el token:', error);
      message.value = {
        text: 'Error al procesar la autenticación',
        type: 'error'
      };
    }
  }

  // Verificar si hay un error
  const error = route.query.error as string;
  if (error) {
    message.value = {
      text: decodeURIComponent(error),
      type: 'error'
    };
  }
});

// En tu método de login (LoginView.vue)
const handleSubmit = async () => {
  loading.value = true;
  message.value = null;

  try {
    const response = await axios.post(`${API_URL}/api/login/`, {
      Correo_Electronico: email.value,
      Contrasena: password.value,
    });

    if (response.data && response.data.access_token) {
      // Guardar token y datos de usuario
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify({
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        roles: response.data.roles || [],
      }));
      localStorage.setItem("userRole", response.data.roles[0]); // Guardar el rol

      // Actualizar el store de Pinia
      const authStore = useAuthStore();
      authStore.setRole(response.data.roles[0]); // Actualizar el rol
      authStore.setUsername(response.data.username);
      authStore.setAuthentication(true);

      console.log("Usuario autenticado:", response.data); // Depuración

      // Redireccionar según el rol
      if (response.data.roles.includes("admin")) {
        router.push("/dashboard");
      } else if (response.data.roles.includes("usuario")) {
        router.push("/user-dashboard");
      } else if (response.data.roles.includes("entrenador")) {
        router.push("/coach-dashboard");
      } else {
        router.push("/dashboard"); // Redirección por defecto
      }
    } else {
      throw new Error("Respuesta inválida del servidor");
    }
  } catch (error: any) {
    console.error("Error de login:", error);
    message.value = {
      text: error.response?.data?.mensaje || "Error al iniciar sesión",
      type: "error",
    };
  } finally {
    loading.value = false;
  }
};

// Manejar login con Google
const handleGoogleLogin = () => {
  console.log('Iniciando login con Google');
  // Usa la URL correcta para redirigir a la autenticación de Google
  window.location.href = `${API_URL}/api/auth/google`;
};

onMounted(() => {
  // Animaciones GSAP
  gsap.to(emailField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2,
  });

  gsap.to(passwordField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.4,
  });

  gsap.to(submitButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.6,
  });

  gsap.to(dividerWrapper.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.8,
  });

  gsap.to(googleButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.0,
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
