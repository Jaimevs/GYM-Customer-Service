<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin-signup">
        <form @submit.prevent="handleLogin" class="sign-in-form">
          <h2 class="title">Iniciar Sesión</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input 
              id="username"
              type="text"
              v-model="input.username"
              placeholder="Ingresa tu usuario"
              :class="{'input-error': errors.username}" />
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input 
              id="password"
              type="password"
              v-model="input.password"
              placeholder="Ingresa tu contraseña"
              :class="{'input-error': errors.password}" />
          </div>
          <input type="submit" value="Entrar" class="btn solid" />
          <p class="social-text">O inicia sesión con plataformas sociales</p>
          <div class="social-media">
            <a href="#" class="social-icon">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-google"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </form>
      </div>
    </div>
    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>¿Eres nuevo aquí?</h3>
          <p>
            Regístrate para acceder a todas las funcionalidades de nuestra plataforma
          </p>
          <button class="btn transparent" @click="goToRegister">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SET_AUTHENTICATION, SET_USERNAME } from '@/store/storeconstants';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const input = ref({
  username: "",
  password: ""
});

const errors = ref({
  username: false,
  password: false
});

const output = ref(''); // Mensaje de autenticación
const isAuthenticated = ref(false);

const handleLogin = () => {
  // Reiniciar errores
  errors.value.username = false;
  errors.value.password = false;

  // Validar si los campos están vacíos
  if (input.value.username === "") {
    errors.value.username = true;
  }
  if (input.value.password === "") {
    errors.value.password = true;
  }

  // Si no hay errores, proceder con la autenticación
  if (!errors.value.username && !errors.value.password) {
    output.value = "Autenticación completada";
    // Aquí deberías hacer la llamada a la API para autenticar al usuario
    isAuthenticated.value = true;
    router.push('/dashboard');
  } else {
    output.value = "Nombre de usuario y contraseña no pueden estar vacíos";
    isAuthenticated.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
/* Los estilos permanecen igual que los que has proporcionado */
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

.signin-signup {
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

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #ff0000;
  border-color: #ff0000;
}

.btn {
  width: 150px;
  background-color: #ff0000;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #ff0000;
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

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
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
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
    left: 50%;
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
  }

  .panel h3 {
    font-size: 1.3rem;
  }

  .panel p {
    font-size: 0.9rem;
    margin: 1.1rem 0;
  }

  .btn.transparent {
    font-size: 0.9rem;
    margin-top: 20px;
  }

  .input-field {
    margin-bottom: 1rem;
  }
}
</style>
