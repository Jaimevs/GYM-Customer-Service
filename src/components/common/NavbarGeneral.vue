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

    <!-- Espaciador -->
    <v-spacer></v-spacer>

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
          <Icon icon="solar:user-circle-linear" class="menu-icon" />
          <v-list-item-title>Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateToSettings">
          <Icon icon="solar:settings-linear" class="menu-icon" />
          <v-list-item-title>Configuración</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <Icon icon="solar:logout-2-linear" class="menu-icon" />
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
import { useAuthStore } from "@/stores/authStore"; // Importar el store de autenticación
import AuthService from "@/services/AuthService"; // Importar el servicio de autenticación

const router = useRouter();
const authStore = useAuthStore();

// Estado de las notificaciones
const notificationsCount = ref(3); // Ejemplo: 3 notificaciones
const notifications = ref(["Notificación 1", "Notificación 2", "Notificación 3"]);

// Información del usuario
const username = ref('');
const userInitials = computed(() => {
  if (!username.value) return 'U';
  return username.value.charAt(0).toUpperCase();
});

// Obtener el rol del usuario desde el store
const userRole = computed(() => authStore.getRole);

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

const logout = () => {
  console.log("Cerrando sesión...");
  
  // Usar el método logout del servicio de autenticación
  AuthService.logout();
  
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