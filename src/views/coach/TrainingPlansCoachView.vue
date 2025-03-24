<template>
  <v-container class="training-plans-dashboard">
    <!-- Título -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">Planes de Entrenamiento</h1>
      </v-col>
    </v-row>

    <!-- Lista de planes -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold">Lista de Planes</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="plans" :items-per-page="5" class="elevation-1">
              <!-- Columna de acciones -->
              <template v-slot:item.actions="{ item }">
                <v-btn icon small @click="editPlan(item)">
                  <Icon icon="solar:pen-bold" class="action-icon" />
                </v-btn>
                <v-btn icon small @click="deletePlan(item)">
                  <Icon icon="solar:trash-bin-trash-bold" class="action-icon" />
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Resumen de clientes asignados -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold">Resumen de Clientes</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="(plan, index) in plans" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{ plan.name }}</v-list-item-title>
                  <v-list-item-subtitle>Clientes: {{ plan.clients.length }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón para agregar un nuevo plan -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-btn color="primary" large block @click="openAddPlanDialog">
          <Icon icon="solar:plus-circle-outline" class="mr-2" /> Agregar Plan
        </v-btn>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar un plan -->
    <v-dialog v-model="planDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ isEditing ? "Editar Plan" : "Agregar Plan" }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="savePlan" ref="form">
            <v-text-field v-model="planForm.name" label="Nombre del Plan" outlined dense required
              class="mb-3"></v-text-field>

            <v-text-field v-model="planForm.duration" label="Duración (semanas)" type="number" outlined dense required
              class="mb-3"></v-text-field>

            <v-autocomplete v-model="planForm.clients" :items="clients" item-text="name" item-value="id"
              label="Buscar Clientes" multiple chips outlined dense required class="mb-3">
              <template v-slot:prepend-inner>
                <Icon icon="solar:user-search-outline" class="mr-2" />
              </template>
            </v-autocomplete>

            <v-btn type="submit" color="primary" block large>
              {{ isEditing ? "Guardar Cambios" : "Agregar Plan" }}
            </v-btn>
            <v-btn text block large @click="planDialog = false">Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import gsap from "gsap";

export default defineComponent({
  name: "TrainingPlansCoachView",
  components: { Icon },
  setup() {
    // Lista de clientes (simulada)
    const clients = ref([
      { id: 1, name: "Juan Pérez", email: "juan.perez@example.com" },
      { id: 2, name: "María López", email: "maria.lopez@example.com" },
      { id: 3, name: "Carlos Ramírez", email: "carlos.ramirez@example.com" },
    ]);

    // Lista de planes
    const plans = ref([
      {
        id: 1,
        name: "Plan Básico",
        duration: 8,
        clients: [1, 2], // IDs de los clientes asignados
      },
      {
        id: 2,
        name: "Plan Intermedio",
        duration: 12,
        clients: [3],
      },
    ]);

    // Encabezados de la tabla
    const headers = ref([
      { text: "Nombre del Plan", value: "name" },
      { text: "Duración (semanas)", value: "duration" },
      { text: "Clientes Asignados", value: "clientNames", sortable: false },
      { text: "Acciones", value: "actions", sortable: false },
    ]);

    // Diálogo para agregar/editar un plan
    const planDialog = ref(false);
    const isEditing = ref(false);
    const planForm = ref({
      id: null,
      name: "",
      duration: 0,
      clients: [],
    });

    // Abrir diálogo para agregar un nuevo plan
    const openAddPlanDialog = () => {
      planForm.value = {
        id: null,
        name: "",
        duration: 0,
        clients: [],
      };
      isEditing.value = false;
      planDialog.value = true;

      // Animación GSAP para abrir el diálogo
      gsap.fromTo(
        ".details-list",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    };

    // Editar un plan existente
    const editPlan = (item) => {
      planForm.value = { ...item };
      isEditing.value = true;
      planDialog.value = true;
    };

    // Eliminar un plan
    const deletePlan = (item) => {
      plans.value = plans.value.filter((plan) => plan.id !== item.id);
    };

    // Guardar un plan (agregar o editar)
    const savePlan = () => {
      if (isEditing.value) {
        const index = plans.value.findIndex((plan) => plan.id === planForm.value.id);
        plans.value[index] = { ...planForm.value };
      } else {
        planForm.value.id = plans.value.length + 1;
        plans.value.push({ ...planForm.value });
      }
      planDialog.value = false;
    };

    // Obtener los nombres de los clientes asignados a un plan
    const getClientNames = (clientIds) => {
      return clients.value
        .filter((client) => clientIds.includes(client.id))
        .map((client) => client.name)
        .join(", ");
    };

    // Animación inicial de la tabla
    onMounted(() => {
      gsap.from(".training-plans-dashboard .v-data-table tbody tr", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    return {
      plans,
      headers,
      clients,
      planDialog,
      isEditing,
      planForm,
      openAddPlanDialog,
      editPlan,
      deletePlan,
      savePlan,
      getClientNames,
    };
  },
});
</script>

<style scoped>
.training-plans-dashboard {
  padding: 20px;
}

.action-icon {
  font-size: 20px;
  color: #666;
  transition: color 0.3s ease;

  &:hover {
    color: #1976d2;
  }
}

.details-list {
  margin-top: 16px;
}
</style>
