  /* --- SidebarUser.vue --- */
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

// Lista de ítems del menú con íconos de Solar
const menuItems = ref([
  { title: "Inicio", link: "/user-dashboard", icon: "solar:home-2-linear" },
  { title: "Progreso", link: "/progreso", icon: "solar:chart-2-linear" },
  { title: "Clases", link: "/clases", icon: "solar:calendar-linear" },
  { title: "Planes de Entrenamiento", link: "/planes-entrenamiento", icon: "solar:dumbbell-linear" },
  { title: "Estadísticas", link: "/estadisticas", icon: "solar:graph-linear" },
  { title: "Membresía", link: "/membresia", icon: "solar:card-linear" },
  { title: "Mensajes", link: "/mensajes", icon: "mage:message" },
  { title: "Configuración", link: "/ajustes", icon: "solar:settings-linear" },
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
