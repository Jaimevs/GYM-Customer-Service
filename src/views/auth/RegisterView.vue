<template>
  <div class="register-container">
    <h2 class="title" ref="title">Registrarse</h2>

    <!-- Mensaje de error o éxito -->
    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>

    <!-- Formulario de Registro -->
    <form @submit.prevent="handleSubmit" class="register-form">
      <!-- Nombre de Usuario -->
      <div class="input-field" ref="usernameField">
        <Icon icon="eva:person-outline" width="24" height="24" />
        <input type="text" v-model="username" placeholder="Nombre de usuario" required />
      </div>

      <!-- Correo Electrónico -->
      <div class="input-field" ref="emailField">
        <Icon icon="eva:email-outline" width="24" height="24" />
        <input type="email" v-model="email" placeholder="Correo electrónico" required />
      </div>

      <!-- Contraseña -->
      <div class="input-field" ref="passwordField">
        <Icon icon="solar:lock-password-linear" width="24" height="24" />
        <input type="password" v-model="password" placeholder="Contraseña" required />
      </div>

      <!-- Botón de Registro -->
      <button type="submit" class="btn solid" ref="submitButton" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Registrarse' }}
      </button>
    </form>

    <!-- Divider Wrapper -->
    <div class="divider-wrapper" ref="dividerWrapper">
      <span>O regístrate con</span>
    </div>

    <!-- Opción de continuar con Google -->
    <button @click="handleGoogleRegister" class="btn google" ref="googleButton" :disabled="loading">
      <Icon icon="flat-color-icons:google" width="24" height="24" />
      Continuar con Google
    </button>

    <!-- Separator para Términos de Uso y Política de Privacidad -->
    <div class="separator">
      <a href="#">Términos de uso</a> | <a href="#">Política de privacidad</a>
    </div>

    <!-- Texto de Login -->
    <p class="login-text" ref="loginText">
      ¿Ya tienes una cuenta?
      <router-link to="/login" class="login-link">Inicia Sesión</router-link>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import AuthService from '@/services/AuthService';

const router = useRouter();
const route = useRoute();
const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const message = ref<{ text: string; type: 'success' | 'error' } | null>(null);

// Referencias para las animaciones
const title = ref(null);
const usernameField = ref(null);
const emailField = ref(null);
const passwordField = ref(null);
const submitButton = ref(null);
const dividerWrapper = ref(null);
const googleButton = ref(null);
const loginText = ref(null);

// Verificar si hay token o error en la URL (después de OAuth)
onBeforeMount(() => {
  // Verificar token en URL (después de autenticación con Google)
  const token = route.query.token as string;
  if (token) {
    try {
      const user = AuthService.processAuthToken(token);
      redirectBasedOnRole(user.roles);
    } catch (error: any) {
      message.value = {
        text: error.message || 'Error al procesar la autenticación',
        type: 'error'
      };
    }
  }

  // Verificar si hay mensaje de error
  const error = route.query.error as string;
  if (error) {
    message.value = {
      text: decodeURIComponent(error),
      type: 'error'
    };
  }
});

// Función para redirigir según rol
const redirectBasedOnRole = (roles: string[]) => {
  if (roles.includes('admin')) {
    router.push('/dashboard?role=admin');
  } else if (roles.includes('entrenador')) {
    router.push('/dashboard?role=entrenador');
  } else {
    router.push('/dashboard');
  }
};

// Manejar el envío del formulario
const handleSubmit = async () => {
  loading.value = true;
  message.value = null;

  try {
    const response = await AuthService.register({
      username: username.value,
      email: email.value,
      password: password.value
    });

    message.value = {
      text: response.data.message || 'Registro exitoso. Verifica tu correo para activar la cuenta.',
      type: 'success'
    };

    // Limpiar formulario
    username.value = '';
    email.value = '';
    password.value = '';
    
    // Esperar unos segundos y redirigir al login
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error: any) {
    console.error('Error de registro:', error);
    message.value = {
      text: error.response?.data?.detail || 'Error al registrarse',
      type: 'error'
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
  // Animación del título
  gsap.to(title.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2,
  });

  // Animación del campo Nombre de Usuario
  gsap.to(usernameField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.4,
  });

  // Animación del campo Correo Electrónico
  gsap.to(emailField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.6,
  });

  // Animación del campo Contraseña
  gsap.to(passwordField.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.8,
  });

  // Animación del botón de registro
  gsap.to(submitButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.0,
  });

  // Animación del divider-wrapper
  gsap.to(dividerWrapper.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.2,
  });

  // Animación del botón de Google
  gsap.to(googleButton.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.4,
  });

  // Animación del texto de login
  gsap.to(loginText.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.6,
  });
});
</script>

<style scoped lang="scss">
@use '@/styles/auth/_auth.scss'; // Estilos generales
@use '@/styles/auth/_register.scss'; // Estilos específicos para registro

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