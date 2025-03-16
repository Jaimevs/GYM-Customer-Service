<template>
  <v-navigation-drawer v-model="menuVisible" right temporary width="320" class="sidebar-menu elevation-3"
    location="right">
    <v-list class="sidebar-content pa-0">
      <!-- Header -->
      <v-list-item class="header">
        <div class="logo-container">
          <Icon icon="icon-park-outline:muscle" class="logo-icon" />
          <h2 class="logo-title">GYM BULLS</h2>
        </div>
        <v-btn icon @click="closeMenu" class="close-btn" variant="text">
          <Icon icon="solar:close-circle-outline" class="close-icon" />
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Menú -->
      <v-list class="menu-list">
        <v-list-item v-for="(item, index) in menuItems" :key="index" @click="navigateTo(item.link)" class="menu-item"
          :class="{ 'menu-item-active': item.link === currentRoute }">
          <template #prepend>
            <Icon :icon="item.icon" class="menu-icon" />
          </template>
          <v-list-item-title class="menu-text">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <!-- Preguntas Frecuentes -->
      <v-list-item @click="navigateTo('/faq')" class="faq-item">
        <template #prepend>
          <Icon icon="solar:chat-round-dots-outline" class="menu-icon" />
        </template>
        <v-list-item-title class="menu-text">
          Preguntas Frecuentes
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, defineProps, ref, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);
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
  { title: "¡Inscríbete ya!", link: "/inscripcion", icon: "solar:users-group-rounded-outline" },
  { title: "Inicio", link: "/", icon: "solar:home-outline" },
  { title: "Gimnasios", link: "/gimnasios", icon: "solar:dumbbell-outline" },
  { title: "Planes", link: "/planes", icon: "solar:money-bag-outline" },
  { title: "Conoce GYM BULLS", link: "/nosotros", icon: "solar:info-circle-outline" },
  { title: "Contáctanos", link: "/contacto", icon: "solar:letter-outline" }
]);

const closeMenu = () => {
  menuVisible.value = false;
  emit("update:modelValue", false);
};

const navigateTo = (link: string) => {
  console.log("Navegar a:", link);
  closeMenu();
};
</script>

<style scoped lang="scss">
@use "@/styles/common/_sidebar.scss";
</style>
