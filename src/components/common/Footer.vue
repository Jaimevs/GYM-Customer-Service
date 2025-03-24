<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Logo -->
      <div class="footer-logo">
        <img src="/src/assets/img/gymbulls.png" alt="GYM BULLS Logo" class="logo-image" />
      </div>

      <!-- Enlaces útiles -->
      <div class="footer-links">
        <h3 class="footer-title">Menú</h3>
        <ul class="footer-link-list">
          <li><a href="/">Inicio</a></li>
          <li><a href="/planes">Planes</a></li>
          <li><a href="/instalaciones">Instalaciones</a></li>
        </ul>
      </div>

      <!-- Redes sociales -->
      <div class="footer-social">
        <h3 class="footer-title">Conéctate</h3>
        <div class="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="fa6-brands:x-twitter" class="social-icon social-icon-twitter" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="mdi:facebook" class="social-icon social-icon-facebook" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Icon icon="mdi:instagram" class="social-icon social-icon-instagram" />
          </a>
        </div>
      </div>

      <!-- Botón de contacto -->
      <div class="footer-cta">
        <!-- Usamos router-link para navegar a /compra-membresia -->
        <router-link to="/compra-membresia" class="cta-button">ÚNETE AHORA</router-link>
      </div>

      <!-- Derechos reservados -->
      <div class="footer-copyright">
        <p class="footer-text">&copy; {{ currentYear }} GYM BULLS. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

// Obtener el año actual dinámicamente
const currentYear = ref(new Date().getFullYear());
</script>

<style scoped lang="scss">
@use '@/styles/common/_footer.scss'; // Importa los estilos desde el archivo SCSS
</style>
