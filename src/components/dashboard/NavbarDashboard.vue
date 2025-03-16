<template>
  <v-app-bar color="white" elevation="0" class="navbar-dashboard">
    <!-- Botón de Hamburguesa -->
    <v-btn icon variant="text" @click="toggleSidebar">
      <v-icon size="24" class="texto-principal">mdi-menu</v-icon>
    </v-btn>

    <!-- Logo -->
    <div class="logo-container" @click="navigateTo('/')">
      <v-icon size="36" class="primario">mdi-dumbbell</v-icon>
      <h2 class="logo-title">GYM BULLS</h2>
    </div>

    <!-- Botón de Notificaciones -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon variant="text" class="notification-btn" v-bind="props">
          <v-badge :content="notificationsCount" color="error" overlap>
            <v-icon size="24" class="texto-principal">mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(notification, index) in notifications" :key="index">
          <v-list-item-title>{{ notification }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Estado actual de la ruta
const currentRoute = computed(() => route.path);

// Elementos del navbar
const navItems = ref([
  { title: 'Inicio', link: '/home' },
  { title: 'Membresias', link: '/memberships' },
  { title: 'Chat', link: '/chat' },
]);

// Estado de las notificaciones
const notificationsCount = ref(3); // Ejemplo: 3 notificaciones
const notifications = ref(['Notificación 1', 'Notificación 2', 'Notificación 3']);

// Función para navegar a una ruta
const navigateTo = (link: string) => {
  router.push(link);
};

// Función para cerrar sesión
const logout = () => {
  console.log('Cerrando sesión...');
  // Aquí puedes agregar la lógica para cerrar sesión
  router.push('/login'); // Redirige al login después de cerrar sesión
};

// Emite un evento para alternar el sidebar
const emit = defineEmits(['toggle-sidebar']);
const toggleSidebar = () => {
  emit('toggle-sidebar');
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *; // Importa las variables SCSS

.navbar-dashboard {
  padding: 0 $espaciado-base;
  box-shadow: $sombra-suave;

  .logo-container {
    display: flex;
    align-items: center;
    gap: $espaciado-pequeño;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    .logo-title {
      font-family: $fuente-titulo;
      font-size: 1.5rem;
      font-weight: bold;
      color: $color-texto-principal;
    }
  }

  .nav-links {
    display: flex;
    gap: $espaciado-grande;

    .nav-link {
      font-family: $fuente-principal;
      font-size: 1rem;
      color: $color-texto-principal;
      transition: color 0.3s ease;

      &.nav-link-active {
        color: $color-primario;
        font-weight: bold;
      }

      &:hover {
        color: $color-primario;
      }
    }
  }

  .notification-btn {
    margin-left: $espaciado-grande;

    .v-badge__badge {
      top: -8px;
      right: -8px;
    }
  }

  .user-avatar {
    margin-left: $espaciado-grande;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .user-menu {
    background-color: $color-blanco;
    border-radius: $radio-borde;

    .v-list-item {
      padding: $espaciado-pequeño $espaciado-base;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: $color-gris-claro;
      }

      .v-list-item-title {
        font-family: $fuente-principal;
        font-size: 0.9rem;
        color: $color-texto-principal;
      }
    }
  }
}
</style>
