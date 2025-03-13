<template>
  <v-navigation-drawer v-model="menuVisible" permanent width="250" class="sidebar-menu" elevation="0" :temporary="true">
    <v-list class="sidebar-content pa-0">
      <!-- Header con logo y nombre -->
      <v-list-item class="header">
        <div class="logo-container">
          <v-icon size="36" :color="$color - amarillo - dorado">mdi-dumbbell</v-icon>
          <h2 class="logo-title">GYM BULLS</h2>
        </div>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Elementos del menú con íconos -->
      <v-list-item v-for="(item, index) in menuItems" :key="index" @click="navigateTo(item.link)" class="menu-item"
        :class="{ 'menu-item-active': item.link === currentRoute }">
        <template v-slot:prepend>
          <v-icon class="menu-icon" :color="$color - amarillo - dorado">{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title class="menu-text">{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- Separador para opciones menos importantes -->
      <v-divider class="my-4"></v-divider>

      <!-- Ajustes (opcional, si decides dejarlo) -->
      <v-list-item v-if="showSettings" @click="navigateTo('/settings')" class="menu-item"
        :class="{ 'menu-item-active': '/settings' === currentRoute }">
        <template v-slot:prepend>
          <v-icon class="menu-icon" :color="$color - amarillo - dorado">mdi-cog</v-icon>
        </template>
        <v-list-item-title class="menu-text">Ajustes</v-list-item-title>
      </v-list-item>

      <!-- Cerrar Sesión -->
      <v-list-item @click="logout" class="menu-item logout-item">
        <template v-slot:prepend>
          <v-icon class="menu-icon" :color="$color - rojo - vibrante">mdi-logout</v-icon>
        </template>
        <v-list-item-title class="menu-text">Cerrar Sesión</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Estado actual de la ruta
const currentRoute = computed(() => route.path);

// Prop para controlar la visibilidad del sidebar
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

// Estado local que sincroniza con la prop
const menuVisible = ref(props.isVisible);

// Watcher para actualizar el estado cuando cambia la prop
watch(
  () => props.isVisible,
  (newVal) => {
    menuVisible.value = newVal;
  }
);

// Emitir evento cuando el sidebar se oculta (opcional)
const emit = defineEmits(['update:isVisible']);
const toggleSidebar = () => {
  menuVisible.value = !menuVisible.value;
  emit('update:isVisible', menuVisible.value);
};

// Nuevas opciones del menú
const menuItems = ref([
  { title: 'Dashboard', link: '/dashboard', icon: 'mdi mdi-view-dashboard' },
  { title: 'Quejas y Sugerencias', link: '/feedback', icon: 'mdi mdi-comment-quote' },
  { title: 'Evaluación de Entrenadores', link: '/trainers', icon: 'mdi mdi-star-outline' },
  { title: 'Gestión de Servicios', link: '/gestion-servicios', icon: 'mdi-cogs' },
  { title: 'Gestión de Membresías', link: '/gestion-membresias', icon: 'mdi-card-account-details' },
  { title: 'Control de Vigencia de Membresías', link: '/control-vigencia', icon: 'mdi-calendar-check' },
  { title: 'Valoración de Servicios', link: '/valoracion-servicios', icon: 'mdi-star-circle' },
  { title: 'Cobro de Servicios Adicionales', link: '/cobro-servicios', icon: 'mdi-cash-multiple' },
  { title: 'Préstamos de Materiales', link: '/prestamos-materiales', icon: 'mdi-package-variant-closed' },
  { title: 'Control de Consumibles', link: '/control-consumibles', icon: 'mdi-archive' },
  { title: 'Gestión de Citas', link: '/gestion-citas', icon: 'mdi-calendar-clock' },
  { title: 'Capacitación al Cliente', link: '/capacitacion-cliente', icon: 'mdi-school' },
  { title: 'Atención y Resolución', link: '/atencion-resolucion', icon: 'mdi-headset' },
]);

const showSettings = ref(false); // Cambia a true si decides mostrar Ajustes

const navigateTo = (link: string) => {
  router.push(link);
};

const logout = () => {
  console.log('Cerrando sesión...');
  // Aquí puedes agregar la lógica para cerrar sesión
  router.push('/login'); // Redirige al login después de cerrar sesión
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *; // Importa las variables SCSS
@use 'sass:color'; // Importa el módulo color de Sass

.sidebar-menu {
  background-color: $color-fondo-sidebar;
  /* Fondo claro */
  border-radius: 0 $radio-borde $radio-borde 0;
  box-shadow: $sombra-suave;
  height: 100vh;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $espaciado-extra-grande $espaciado-base;
  background: linear-gradient(135deg, $color-primario, color.scale($color-primario, $lightness: -15%));
  /* Degradado amarillo */
  border-radius: 0 $radio-borde 0 0;
}

.menu-text {
  font-family: $fuente-principal;
  color: $color-texto-principal;
  white-space: normal;
  /* Permite múltiples líneas */
  line-height: 1.4;
  /* Mejora la legibilidad */
  word-break: break-word;
  /* Divide palabras largas si es necesario */
}

.logo-container {
  display: flex;
  align-items: center;
  gap: $espaciado-base;
}

.logo-title {
  font-family: $fuente-titulo;
  font-size: 1.75rem;
  font-weight: bold;
  color: $color-blanco;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.menu-item {
  margin: $espaciado-pequeño $espaciado-base;
  border-radius: $radio-borde;
  transition: all 0.3s ease;

  &:hover,
  &.menu-item-active {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX($espaciado-pequeño);
  }
}

.menu-icon {
  color: $color-amarillo-dorado;
  /* Color amarillo dorado para los íconos */
  transition: all 0.3s ease;
}

.menu-item:hover .menu-icon,
.menu-item-active .menu-icon {
  color: color.scale($color-amarillo-dorado, $lightness: -15%);
  /* Color amarillo más oscuro al hacer hover */
}

.logout-item .menu-icon {
  color: $color-rojo-vibrante;
  /* Color rojo vibrante para el ícono de cerrar sesión */
}

.logout-item {
  margin-top: auto;
}

/* Animaciones */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.menu-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
