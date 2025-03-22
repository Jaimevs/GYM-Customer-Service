/* --- NavbarUser.vue --- */
<template>
  <v-app-bar color="transparent" elevation="0" class="navbar-dashboard">
    <!-- Botón de Hamburguesa -->
    <v-btn icon variant="text" @click="toggleSidebar" class="menu-btn">
      <Icon icon="solar:hamburger-menu-outline" class="icon-menu" />
    </v-btn>

    <!-- Logo -->
    <div class="logo-container" @click="navigateTo('/')">
      <img src="@/assets/img/gymbulls.png" alt="GYM BULLS Logo" class="logo-image" />
    </div>

    <!-- Barra de Búsqueda -->
    <v-text-field v-model="searchQuery" placeholder="Buscar..." prepend-inner-icon="mdi-magnify" variant="outlined"
      density="compact" hide-details single-line class="search-bar"></v-text-field>

    <!-- Espaciador -->
    <v-spacer></v-spacer>

    <!-- Botón de Configuración -->
    <v-btn icon variant="text" class="settings-btn" @click="openSettings">
      <Icon icon="solar:settings-outline" class="icon-settings" />
    </v-btn>

    <!-- Botón de Notificaciones -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon variant="text" class="notification-btn" v-bind="props">
          <v-badge :content="notificationsCount" color="error" overlap>
            <Icon icon="solar:bell-bing-outline" class="icon-bell" />
          </v-badge>
        </v-btn>
      </template>
      <v-list class="notification-list">
        <v-list-item v-for="(notification, index) in notifications" :key="index">
          <v-list-item-title>{{ notification }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Menú de Usuario -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-avatar size="40" class="user-avatar" v-bind="props">
          <img src="https://randomuser.me/api/portraits/men/71.jpg" alt="User Avatar" class="avatar-image" />
        </v-avatar>
      </template>
      <v-list class="user-menu">
        <v-list-item @click="navigateToProfile">
          <v-list-item-title>Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateToSettings">
          <v-list-item-title>Configuración</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Estado de las notificaciones
const notificationsCount = ref(3); // Ejemplo: 3 notificaciones
const notifications = ref(["Notificación 1", "Notificación 2", "Notificación 3"]);

// Estado de la barra de búsqueda
const searchQuery = ref("");

// Información del usuario
const username = ref('');
const userInitials = computed(() => {
  if (!username.value) return 'U';
  return username.value.charAt(0).toUpperCase();
});

// Cargar datos del usuario al montar el componente
onMounted(() => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      username.value = userData.username || '';
    }
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
  }
});

// Funciones de navegación
const navigateTo = (link: string) => {
  router.push(link);
};

const navigateToProfile = () => {
  console.log("Navegando al perfil...");
  router.push("/profile");
};

const navigateToSettings = () => {
  console.log("Navegando a la configuración...");
  router.push("/settings");
};

const openSettings = () => {
  console.log("Abriendo configuración global...");
  router.push("/global-settings");
};

// Función para cerrar sesión
const logout = () => {
  console.log("Cerrando sesión...");

  // Eliminar token y datos de usuario
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Limpiar headers de autorización si estás usando axios
  if (window.axios) {
    delete window.axios.defaults.headers.common['Authorization'];
  }

  // Redirigir al login
  router.push("/login");
};

// Emite un evento para alternar el sidebar
const emit = defineEmits(["toggle-sidebar"]);
const toggleSidebar = () => {
  emit("toggle-sidebar");
};
</script>

<style scoped lang="scss">
@use "@/styles/common/_navbar-dashboard.scss";
</style>
