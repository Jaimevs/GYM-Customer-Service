/* --- SidebarDashboard.vue --- */
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

const props = defineProps<{
  modelValue: boolean;
  expanded: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const route = useRoute();

// Estado del sidebar
const menuVisible = ref(props.modelValue);
const isExpanded = ref(props.expanded);
const currentRoute = computed(() => route.path);

// Actualizar estado desde props
watch(() => props.modelValue, (newValue) => {
  menuVisible.value = newValue;
});

watch(() => props.expanded, (newValue) => {
  isExpanded.value = newValue;
});

// Lista de ítems del menú
const menuItems = ref([
  { title: "Inicio", link: "/dashboard", icon: "mage:dashboard-chart-notification" },
  { title: "Gestión de Servicios", link: "/services", icon: "solar:clipboard-outline" },
  { title: "Gestión de Membresías", link: "/memberships", icon: "bx:id-card" },
  { title: "Control de Vigencia", link: "/membership-expiration", icon: "solar:calendar-outline" },
  { title: "Valoración de Servicios", link: "/service-evaluation", icon: "solar:star-line-duotone" },
  { title: "Cobro de Servicios", link: "/additional-services-payment", icon: "solar:money-bag-outline" },
  { title: "Préstamos de Materiales", link: "/material-loans", icon: "solar:notebook-minimalistic-linear" },
  { title: "Control de Consumibles", link: "/consumables-control", icon: "iconamoon:box-light" },
  { title: "Gestión de Citas", link: "/appointments", icon: "tabler:calendar-check" },
  { title: "Capacitación al Cliente", link: "/client-training", icon: "hugeicons:teacher" },
  { title: "Atención y Resolución", link: "/support-resolution", icon: "material-symbols:help-outline-rounded" },
  { title: "Gestión de Usuarios", link: "/users-management", icon: "solar:users-group-rounded-outline" },
  { title: "Sucursales", link: "/branches", icon: "solar:buildings-outline" }, // Nueva opción
]);

// Función para cerrar el sidebar
const closeMenu = () => {
  menuVisible.value = false;
  emit("update:modelValue", false);
};
</script>

<style scoped lang="scss">
@use "@/styles/common/_sidebar-dashboard.scss";
</style>
