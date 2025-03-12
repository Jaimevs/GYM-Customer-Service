<template>
  <v-navigation-drawer v-model="menuVisible" right temporary width="300" class="sidebar-menu" elevation="0"
    location="right">
    <v-list class="sidebar-content pa-0">
      <!-- Header with logo and close button -->
      <v-list-item class="header">
        <div class="logo-container">
          <v-icon size="36" color="red">mdi-dumbbell</v-icon>
          <h2 class="logo-title">GYM BULLS</h2>
        </div>
        <v-btn icon @click="closeMenu" class="close-btn" variant="text">
          <v-icon color="black">mdi-close</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Menu items with icons -->
      <v-list-item v-for="(item, index) in menuItems" :key="index" @click="navigateTo(item.link)" class="menu-item"
        :class="{ 'menu-item-active': item.link === currentRoute }">
        <template v-slot:prepend>
          <v-icon class="menu-icon" color="red">{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title class="menu-text">{{ item.title }}</v-list-item-title>
      </v-list-item>

      <v-divider class="my-4"></v-divider>

      <!-- Language selector -->
      <v-list-item>
        <v-select v-model="selectedLanguage" :items="languages" label="Idioma" dense hide-details
          class="language-selector">
          <template v-slot:selection="{ item }">
            <v-icon :icon="`mdi-flag-${item.raw}`" class="mr-2" color="red"></v-icon>
            {{ item.title }}
          </template>
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon :icon="`mdi-flag-${item.raw}`" color="red"></v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-list-item>

      <v-divider class="my-4"></v-divider>

      <!-- FAQ -->
      <v-list-item @click="navigateTo('/faq')" class="faq-item">
        <template v-slot:prepend>
          <v-icon class="menu-icon" color="red">mdi-help-circle</v-icon>
        </template>
        <v-list-item-title class="menu-text">Preguntas Frecuentes</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue']);
const menuVisible = ref(props.modelValue);
const route = useRoute();

const currentRoute = computed(() => route.path);

watch(
  () => props.modelValue,
  (newValue) => {
    menuVisible.value = newValue;
  }
);

const menuItems = ref([
  { title: '¡Inscríbete ya!', link: '/inscripcion', icon: 'mdi-account-plus' },
  { title: 'Inicio', link: '/', icon: 'mdi-home' },
  { title: 'Gimnasios', link: '/gimnasios', icon: 'mdi-dumbbell' },
  { title: 'Planes', link: '/planes', icon: 'mdi-cash' },
  { title: 'Conoce GYM BULLS', link: '/nosotros', icon: 'mdi-information' },
  { title: 'Sustentabilidad', link: '/sustentabilidad', icon: 'mdi-leaf' },
  { title: 'Tu espacio', link: '/tu-espacio', icon: 'mdi-door' },
  { title: 'Contáctanos', link: '/contacto', icon: 'mdi-email' },
  { title: 'Blog', link: '/blog', icon: 'mdi-book-open' },
]);

const languages = ref([
  { title: 'Español', value: 'mx' },
  { title: 'English', value: 'us' },
  { title: 'Français', value: 'fr' },
]);
const selectedLanguage = ref('mx');

const closeMenu = () => {
  menuVisible.value = false;
  emit('update:modelValue', false);
};

const navigateTo = (link: string) => {
  console.log('Navegar a:', link);
  closeMenu();
};
</script>

<style scoped>
.sidebar-menu {
  background-color: #ffffff;
  border-radius: 0 16px 16px 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #ffcc00, #ffa500);
  border-radius: 0 16px 0 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn {
  color: black;
  transition: all 0.3s ease;
  margin-left: auto;
}

.close-btn:hover {
  transform: rotate(90deg) scale(1.1);
}

.menu-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover,
.menu-item-active {
  background-color: rgba(255, 0, 0, 0.1);
  transform: translateX(4px);
}

.menu-icon {
  color: red;
  transition: all 0.3s ease;
}


.menu-text {
  color: black;
}

.menu-item:hover .menu-icon,
.menu-item-active .menu-icon {
  color: darkred;
}

.language-selector {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 4px 8px;
}

.faq-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.faq-item:hover {
  background-color: rgba(255, 0, 0, 0.1);
  transform: translateX(4px);
}

/* Animations */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}



.menu-item,
.faq-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
