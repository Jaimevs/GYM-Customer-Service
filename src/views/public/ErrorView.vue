<template>
    <div class="container">
      <div class="forms-container">
        <div class="error-display">
          <div v-if="isOffline" class="error-content">
            <h2 class="title">Sin conexión a internet</h2>
            <p class="error-text">
              Parece que no tienes conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.
            </p>
            <button @click="checkConnection" class="btn">
              Reintentar
            </button>
          </div>
          <div v-else-if="errorCode === '404'" class="error-content">
            <h2 class="title">404</h2>
            <p class="error-text">Página no encontrada</p>
            <router-link to="/" class="btn">Regresar al inicio</router-link>
          </div>
          <div v-else class="error-content">
            <h2 class="title">{{ errorCode }}</h2>
            <p class="error-text">{{ errorMessage || 'Ha ocurrido un error' }}</p>
            <router-link to="/" class="btn">Regresar al inicio</router-link>
          </div>
        </div>
      </div>
      <div class="panels-container">
        <div class="panel left-panel">
          <div class="content">
            <h3>Algo salió mal</h3>
            <p>
              Lo sentimos por los inconvenientes. Estamos trabajando para resolver el problema.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  
  const props = defineProps({
    errorCode: {
      type: String,
      required: false,
      default: '404'
    },
    errorMessage: {
      type: String,
      required: false,
      default: ''
    }
  });
  
  const isOffline = ref(false);
  
  const checkConnection = () => {
    isOffline.value = !navigator.onLine;
    if (!isOffline.value) {
      window.location.reload();
    }
  };
  
  onMounted(() => {
    isOffline.value = !navigator.onLine;
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', () => { isOffline.value = true; });
  });
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body,
  input {
    font-family: "Poppins", sans-serif;
  }
  
  .container {
    position: relative;
    width: 100%;
    background-color: #fff;
    min-height: 100vh;
    overflow: hidden;
  }
  
  .forms-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  
  .error-display {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 75%;
    width: 50%;
    transition: 1s 0.7s ease-in-out;
    display: grid;
    grid-template-columns: 1fr;
    z-index: 5;
  }
  
  .error-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0rem 5rem;
    transition: all 0.2s 0.7s;
    overflow: hidden;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    z-index: 2;
  }
  
  .title {
    font-size: 3.5rem; /* Título más grande */
    color: #444;
    margin-bottom: 20px; /* Mayor espacio abajo */
    font-weight: 700; /* Más negrita */
  }
  
  .error-text {
    padding: 0.7rem 0;
    font-size: 1.4rem; /* Texto más grande */
    color: #333;
    text-align: center;
    max-width: 420px; /* Ancho máximo mayor */
    margin-bottom: 30px; /* Mayor espacio antes del botón */
    line-height: 1.6; /* Mejor espaciado entre líneas */
  }
  
  .btn {
    width: 200px; /* Botón más ancho */
    background-color: #ff0000;
    border: none;
    outline: none;
    height: 54px; /* Botón más alto */
    border-radius: 54px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    margin: 10px 0;
    cursor: pointer;
    transition: 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 1.1rem; /* Texto del botón más grande */
    letter-spacing: 1px; /* Espaciado entre letras */
  }
  
  .btn:hover {
    background-color: #d10000;
    transform: scale(1.05); /* Ligero efecto de escala al hover */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Sombra al hover */
  }
  
  .panels-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .container:before {
    content: "";
    position: absolute;
    height: 2000px;
    width: 2000px;
    top: -10%;
    right: 48%;
    transform: translateY(-50%);
    background-image: linear-gradient(135deg, #ffcc00, #ffa500);
    transition: 1.8s ease-in-out;
    border-radius: 50%;
    z-index: 6;
  }
  
  .panel {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    text-align: center;
    z-index: 6;
  }
  
  .left-panel {
    pointer-events: all;
    padding: 3rem 17% 2rem 12%;
  }
  
  .panel .content {
    color: #fff;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }
  
  .panel h3 {
    font-weight: 700; /* Más negrita */
    line-height: 1.2;
    font-size: 2.2rem; /* Título más grande */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px; /* Más espacio abajo */
  }
  
  .panel p {
    font-size: 1.2rem; /* Texto más grande */
    padding: 0.7rem 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    line-height: 1.6; /* Mejor espaciado entre líneas */
  }
  
  @media (max-width: 870px) {
    .container {
      min-height: 800px;
      height: 100vh;
    }
    
    .error-display {
      width: 100%;
      top: 95px;
      transform: translate(-50%, 0);
      left: 50%;
      transition: 1s 0.8s ease-in-out;
    }
  
    .panels-container {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 2fr 1fr;
    }
  
    .panel {
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 2.5rem 8%;
      grid-column: 1 / 2;
    }
  
    .left-panel {
      grid-row: 1 / 2;
    }
  
    .panel .content {
      padding-right: 15%;
      transition: transform 0.9s ease-in-out;
      transition-delay: 0.8s;
    }
  
    .panel h3 {
      font-size: 1.8rem; /* Título más grande en móvil */
    }
  
    .panel p {
      font-size: 1rem; /* Texto más grande en móvil */
      padding: 0.5rem 0;
    }
  
    .title {
      font-size: 3rem; /* Título ajustado para móvil */
    }
  
    .error-text {
      font-size: 1.2rem; /* Texto ajustado para móvil */
    }
  
    .container:before {
      width: 1500px;
      height: 1500px;
      transform: translateX(-50%);
      left: 30%;
      bottom: 80%;
      right: initial;
      top: initial;
      transition: 2s ease-in-out;
      z-index: 0;
    }
  }
  
  @media (max-width: 570px) {
    .error-content {
      padding: 0 1.5rem;
    }
    
    .panel .content {
      padding: 0.5rem 1rem;
    }
    
    .container {
      padding: 1.5rem;
    }
  
    .title {
      font-size: 2.5rem; /* Título más pequeño en móviles */
    }
  
    .btn {
      width: 180px; /* Botón algo más pequeño en móviles */
      height: 50px;
      font-size: 1rem;
    }
  
    .container:before {
      bottom: 85%;
      left: 50%;
      opacity: 0.8;
    }
  
    .error-display {
      top: 150px;
      padding-top: 20px;
    }
  }
  
  @media (max-width: 400px) {
    .container:before {
      bottom: 90%;
    }
    
    .error-display {
      top: 120px;
    }
  
    .title {
      font-size: 2.2rem;
    }
  
    .error-text {
      font-size: 1rem;
    }
  }
  </style>