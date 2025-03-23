<template>
  <div class="verification-container">
    <h2 class="verification-title">Verificación de Correo</h2>
    <p class="verification-message">
      Te hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, ingrésalo a continuación.
    </p>

    <!-- Campos de entrada para cada dígito del código de verificación -->
    <div class="digits-container">
      <input v-for="(digit, index) in digits" :key="index" type="text" v-model="digits[index]" maxlength="1"
        @input="handleDigitInput(index, $event)" @keydown.delete="handleDelete(index, $event)"
        @focus="animateInputField" class="digit-input" />
    </div>

    <!-- Botón para enviar el código -->
    <button @click="handleVerification" class="btn solid" :disabled="loading">
      <span v-if="loading" class="loader"></span>
      <span v-else>{{ loading ? 'Verificando...' : 'Verificar' }}</span>
    </button>

    <!-- Mensaje de error o éxito -->
    <div v-if="message" :class="['message', message.type]" ref="messageElement">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import AuthService from "@/services/AuthService"; // Importar el servicio de autenticación
import gsap from "gsap"; // Importar GSAP

const digits = ref(Array(6).fill("")); // Array para almacenar cada dígito
const loading = ref(false); // Estado de carga
const message = ref<{ text: string; type: "success" | "error" } | null>(null); // Mensaje de respuesta
const messageElement = ref<HTMLElement | null>(null); // Referencia al mensaje

// Función para manejar la entrada de dígitos
const handleDigitInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  // Si se ingresa un valor, mover el foco al siguiente campo
  if (value && index < 5) {
    const nextInput = document.querySelector(
      `.digit-input:nth-child(${index + 2})`
    ) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }

  // Actualizar el dígito en el array
  digits.value[index] = value;
};

// Función para manejar la tecla de borrado (delete/backspace)
const handleDelete = (index: number, event: KeyboardEvent) => {
  if (event.key === "Backspace" && index > 0 && !digits.value[index]) {
    const prevInput = document.querySelector(
      `.digit-input:nth-child(${index})`
    ) as HTMLInputElement;
    if (prevInput) prevInput.focus();
  }
};

// Animación del campo de entrada al enfocarse
const animateInputField = () => {
  gsap.fromTo(
    ".digits-container",
    { scale: 1 },
    { scale: 1.05, duration: 0.3, ease: "power2.out" }
  );
};

// Animación mejorada del mensaje de éxito/error
const animateMessage = () => {
  if (messageElement.value) {
    gsap.fromTo(
      messageElement.value,
      { opacity: 0, y: 20 }, // Inicia ligeramente abajo
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Si es un error, agregamos un pequeño "shake" para llamar la atención
          if (message.value?.type === "error") {
            gsap.to(messageElement.value, {
              x: [-5, 5, -5, 5, 0], // Efecto de "shake"
              duration: 0.4,
              ease: "power1.inOut",
            });
          }
        },
      }
    );
  }
};

// Función para manejar la verificación del código
const handleVerification = async () => {
  loading.value = true;
  message.value = null;

  try {
    // Unir los dígitos para formar el código de verificación
    const code = digits.value.join('');

    // Llamar al servicio para verificar el código
    const response = await AuthService.verifyCode(code);

    // Mostrar mensaje de éxito
    message.value = {
      text: response.message || '¡Código verificado correctamente!',
      type: 'success',
    };

    // Redirigir al usuario después de la verificación
    setTimeout(() => {
      router.push({ path: '/login' }); // Redirigir al login usando el enrutador de Vue
    }, 3000);
  } catch (error: any) {
    console.error('Error de verificación:', error);
    message.value = {
      text: error.response?.data?.detail || 'Error al verificar el código',
      type: 'error',
    };
  } finally {
    loading.value = false;
  }
};

// Animación inicial del contenedor al montar el componente
onMounted(() => {
  gsap.from(".verification-container", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out",
  });
});
</script>

<style scoped lang="scss">
@use "sass:color"; // Importar el módulo de color de Sass
@use "@/styles/_variables.scss" as *;

.verification-container {
  max-width: 400px;
  margin: 0 auto;
  padding: $espaciado-grande;
  text-align: center;
  background-color: $color-fondo-sidebar;
  border-radius: $radio-borde * 2;
  box-shadow: $sombra-suave;
}

.verification-title {
  font-size: 26px;
  margin-bottom: $espaciado-base;
  color: $color-gris-oscuro;
  font-family: $fuente-titulo;
  font-weight: 700;
}

.verification-message {
  font-size: 14px;
  color: $color-negro;
  margin-bottom: $espaciado-grande;
  line-height: 1.6;
  font-family: $fuente-principal;
}

.digits-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: $espaciado-grande;

  .digit-input {
    width: 40px;
    height: 50px;
    text-align: center;
    font-size: 24px;
    border: $ancho-borde solid $color-gris-medio;
    border-radius: $radio-borde;
    background-color: $color-blanco;
    outline: none;
    transition: border-color 0.3s ease, transform 0.3s ease;

    &:focus {
      border-color: $color-rojo-botones;
      transform: scale(1.1);
    }
  }
}

.btn {
  width: 100%;
  padding: $espaciado-base;
  border: none;
  border-radius: $radio-borde;
  background: linear-gradient(135deg, $color-rojo-botones, $color-rojo-calido);
  color: $color-texto-botones;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  font-family: $fuente-principal;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, $color-rojo-calido, $color-rojo-botones);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loader {
    border: 3px solid $color-gris-claro;
    border-top: 3px solid $color-rojo-botones;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
}

.message {
  padding: $espaciado-base;
  border-radius: $radio-borde;
  margin-bottom: $espaciado-grande;
  text-align: center;
  font-size: 14px;
  box-shadow: $sombra-suave;
  font-family: $fuente-principal;
  transition: all 0.3s ease;

  &.success {
    background-color: rgba($color-verde-lima, 0.1);
    color: color.adjust($color-verde-lima, $lightness: -10%); // Usar color.adjust
    border: 1px solid rgba($color-verde-lima, 0.2);
  }

  &.error {
    background-color: rgba($color-rojo-vibrante, 0.1);
    color: $color-rojo-vibrante;
    border: 1px solid rgba($color-rojo-vibrante, 0.2);
    font-weight: 600;
    box-shadow: 0 4px 12px rgba($color-rojo-vibrante, 0.2);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
