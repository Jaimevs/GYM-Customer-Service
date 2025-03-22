<template>
  <v-navigation-drawer v-model="menuVisible" permanent :width="isExpanded ? 320 : 70"
    class="dashboard-sidebar elevation-3">
    <v-list class="sidebar-content pa-0">
      <!-- Menú -->
      <v-list class="menu-list">
        <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.link" class="menu-item"
          :class="{ 'menu-item-active': item.link === currentRoute, 'collapsed': !isExpanded }">
          <template #prepend>
            <Icon :icon="item.icon" class="menu-icon" />
          </template>
          <v-list-item-title class="menu-text">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore"; // Importar el store de autenticación
import { adminMenuItems, userMenuItems, coachMenuItems } from "@/data/menuItems";

// Props
const props = defineProps<{
  modelValue: boolean;
  expanded: boolean;
}>();

// Emits
const emit = defineEmits(["update:modelValue"]);

// Estado del sidebar
const route = useRoute();
const authStore = useAuthStore();
const menuVisible = ref(props.modelValue);
const isExpanded = ref(props.expanded);
const currentRoute = computed(() => route.path);

// Determinar las opciones del menú según el rol
const menuItems = computed(() => {
  const role = authStore.getRole;
  if (role === "admin") return adminMenuItems;
  if (role === "usuario") return userMenuItems;
  if (role === "entrenador") return coachMenuItems;
  return [];
});

// Actualizar estado desde props
watch(() => props.modelValue, (newValue) => {
  menuVisible.value = newValue;
});

watch(() => props.expanded, (newValue) => {
  isExpanded.value = newValue;
});
</script>

<style scoped lang="scss">
@use "@/styles/common/_sidebar-dashboard.scss";
</style>
