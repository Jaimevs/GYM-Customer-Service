<template>
  <div class="verification-container">
    <h2 class="verification-title">Verificación de Correo</h2>
    <p class="verification-message">
      Te hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, ingrésalo a continuación para activar tu cuenta.
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
import { ref, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import axios from "axios";

// Props para recibir el email del componente padre
const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

const router = useRouter();
const API_URL = 'https://gymtoday12.com';
const digits = ref(Array(6).fill("")); // Array para almacenar cada dígito
const loading = ref(false); // Estado de carga
const message = ref<{ text: string; type: "success" | "error" } | null>(null); // Mensaje de respuesta
const messageElement = ref<HTMLElement | null>(null); // Referencia al mensaje

// Función para manejar la entrada de dígitos
const handleDigitInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  // Asegurarse de que solo se ingresen números
  if (value && !/^\d+$/.test(value)) {
    digits.value[index] = "";
    target.value = "";
    return;
  }

  // Si se ingresa un valor, mover el foco al siguiente campo
  if (value && index < 5) {
    const nextInput = document.querySelector(
      `.digit-input:nth-child(${index + 2})`
    ) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }

  // Actualizar el dígito en el array
  digits.value[index] = value;
  
  // Si se completaron todos los dígitos y estamos en el último, verificar automáticamente
  if (index === 5 && !digits.value.some(d => d === "")) {
    handleVerification();
  }
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
const animateInputField = (event: Event) => {
  const target = event.target as HTMLInputElement;
  gsap.to(target, {
    scale: 1.1,
    duration: 0.2,
    yoyo: true,
    repeat: 1
  });
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
    // Validar que se hayan ingresado todos los dígitos
    const emptyDigits = digits.value.some(digit => digit === "");
    if (emptyDigits) {
      message.value = {
        text: 'Por favor, ingresa todos los dígitos del código',
        type: 'error',
      };
      animateMessage();
      loading.value = false;
      return;
    }

    // Unir los dígitos para formar el código de verificación
    const code = digits.value.join('');

    console.log('Enviando verificación con código:', code);
    console.log('Email para verificación:', props.email);

    // Realizar la solicitud usando la API correcta
    const response = await axios.post(`${API_URL}/api/users/verify/`, {
      email: props.email,
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respuesta de verificación:', response.data);
    
    // Manejar respuesta exitosa
    message.value = {
      text: '¡Tu cuenta ha sido verificada exitosamente!',
      type: 'success',
    };
    animateMessage();

    // Limpiar el email almacenado
    localStorage.removeItem('pendingVerificationEmail');

    // Redirigir al usuario después de la verificación
    setTimeout(() => {
      router.push({ path: '/login' });
    }, 2000);

  } catch (error: any) {
    console.error('Error de verificación:', error);
    
    // Preparar mensaje de error
    let errorMsg = 'Error al verificar el código';
    
    if (axios.isAxiosError(error) && error.response) {
      // Error de respuesta del servidor
      if (error.response.data?.detail) {
        errorMsg = error.response.data.detail;
      } else if (error.response.status === 400) {
        errorMsg = 'Código inválido o expirado';
      } else {
        errorMsg = `Error ${error.response.status}: ${error.response.statusText}`;
      }
      
      console.error('Detalles del error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (axios.isAxiosError(error) && error.request) {
      // Error de conexión
      errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    
    message.value = {
      text: errorMsg,
      type: 'error',
    };
    animateMessage();
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

  // Enfocar el primer campo de dígito automáticamente
  const firstInput = document.querySelector('.digit-input:first-child') as HTMLInputElement;
  if (firstInput) {
    setTimeout(() => {
      firstInput.focus();
    }, 500);
  }
});
</script>

<style scoped>
.verification-container {
  max-width: 90%; /* Ajusta el ancho máximo para que no sobresalga */
  margin: 0 auto;
  padding: 1rem; /* Reduce el padding para pantallas pequeñas */
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.verification-title {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem; /* Ajusta el tamaño de la fuente */
}

.verification-message {
  text-align: center;
  margin-bottom: 1.5rem; /* Reduce el margen inferior */
  color: #666;
  font-size: 0.9rem; /* Ajusta el tamaño de la fuente */
}

.digits-container {
  display: flex;
  justify-content: center;
  gap: 8px; /* Reduce el espacio entre los campos */
  margin-bottom: 1.5rem; /* Reduce el margen inferior */
}

.digit-input {
  width: 40px; /* Reduce el ancho de los campos */
  height: 45px; /* Reduce la altura de los campos */
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 20px; /* Reduce el tamaño de la fuente */
  text-align: center;
  transition: border 0.3s, transform 0.3s;
}

.digit-input:focus {
  outline: none;
  border-color: #5995fd;
  box-shadow: 0 0 8px rgba(89, 149, 253, 0.3);
}

.btn {
  width: 100%;
  padding: 10px; /* Reduce el padding */
  border: none;
  border-radius: 50px;
  background-color: #5995fd;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.btn:hover:not(:disabled) {
  background-color: #4d84e2;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin-top: 1rem; /* Reduce el margen superior */
  padding: 8px; /* Reduce el padding */
  border-radius: 5px;
  text-align: center;
  font-size: 0.9rem; /* Ajusta el tamaño de la fuente */
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.loader {
  width: 18px; /* Reduce el tamaño del loader */
  height: 18px; /* Reduce el tamaño del loader */
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Media queries para ajustes adicionales en pantallas pequeñas */
@media (max-width: 480px) {
  .verification-container {
    padding: 0.5rem;
  }

  .digit-input {
    width: 35px;
    height: 40px;
    font-size: 18px;
  }

  .btn {
    padding: 8px;
  }

  .message {
    font-size: 0.8rem;
  }
}
</style>