<template>
  <v-container class="classes-dashboard">
    <!-- Título -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">Clases</h1>
      </v-col>
    </v-row>

    <!-- Lista de clases -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold">Próximas Clases</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="classes" :items-per-page="5" class="elevation-1">
              <!-- Columna de acciones -->
              <template v-slot:item.actions="{ item }">
                <v-btn icon small @click="editClass(item)">
                  <Icon icon="solar:pen-bold" class="action-icon" />
                </v-btn>
                <v-btn icon small @click="deleteClass(item)">
                  <Icon icon="solar:trash-bin-trash-bold" class="action-icon" />
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Calendario de clases -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold">Calendario de Clases</v-card-title>
          <v-card-text>
            <v-calendar v-model="calendarDate" :events="calendarEvents" event-color="primary"
              class="rounded-lg"></v-calendar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón para agregar una nueva clase -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-btn color="primary" large block @click="openAddClassDialog">
          <Icon icon="solar:plus-circle-outline" class="mr-2" /> Agregar Clase
        </v-btn>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar una clase -->
    <v-dialog v-model="classDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ isEditing ? "Editar Clase" : "Agregar Clase" }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveClass" ref="form">
            <v-text-field v-model="classForm.name" label="Nombre de la Clase" outlined dense required
              class="mb-3"></v-text-field>

            <v-autocomplete v-model="classForm.client" :items="clients" item-text="name" item-value="id"
              label="Buscar Cliente" outlined dense required class="mb-3">
              <template v-slot:prepend-inner>
                <Icon icon="solar:user-search-outline" class="mr-2" />
              </template>
            </v-autocomplete>

            <v-text-field v-model="classForm.date" label="Fecha" type="date" outlined dense required
              class="mb-3"></v-text-field>

            <v-text-field v-model="classForm.time" label="Hora" type="time" outlined dense required
              class="mb-3"></v-text-field>

            <v-btn type="submit" color="primary" block large>
              {{ isEditing ? "Guardar Cambios" : "Agregar Clase" }}
            </v-btn>
            <v-btn text block large @click="classDialog = false">Cancelar</v-btn>
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
  name: "CoachClassesView",
  components: { Icon },
  setup() {
    // Lista de clientes (simulada)
    const clients = ref([
      { id: 1, name: "Juan Pérez", email: "juan.perez@example.com" },
      { id: 2, name: "María López", email: "maria.lopez@example.com" },
      { id: 3, name: "Carlos Ramírez", email: "carlos.ramirez@example.com" },
    ]);

    // Lista de clases
    const classes = ref([
      {
        id: 1,
        name: "Clase de Yoga",
        date: "2023-10-15",
        time: "10:00",
        client: 1, // ID del cliente asignado
      },
      {
        id: 2,
        name: "Entrenamiento HIIT",
        date: "2023-10-16",
        time: "18:00",
        client: 2, // ID del cliente asignado
      },
    ]);

    // Encabezados de la tabla
    const headers = ref([
      { text: "Nombre de la Clase", value: "name" },
      { text: "Fecha", value: "date" },
      { text: "Hora", value: "time" },
      { text: "Cliente", value: "clientName", sortable: false },
      { text: "Acciones", value: "actions", sortable: false },
    ]);

    // Calendario
    const calendarDate = ref(new Date().toISOString().substr(0, 10));
    const calendarEvents = ref(
      classes.value.map((cls) => ({
        name: cls.name,
        start: `${cls.date}T${cls.time}:00`,
        end: `${cls.date}T${parseInt(cls.time.split(":")[0]) + 1}:00:00`,
      }))
    );

    // Diálogo para agregar/editar una clase
    const classDialog = ref(false);
    const isEditing = ref(false);
    const classForm = ref({
      id: null,
      name: "",
      client: null,
      date: "",
      time: "",
    });

    // Abrir diálogo para agregar una nueva clase
    const openAddClassDialog = () => {
      classForm.value = {
        id: null,
        name: "",
        client: null,
        date: "",
        time: "",
      };
      isEditing.value = false;
      classDialog.value = true;

      // Animación GSAP para abrir el diálogo
      gsap.fromTo(
        ".details-list",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    };

    // Editar una clase existente
    const editClass = (item) => {
      classForm.value = { ...item };
      isEditing.value = true;
      classDialog.value = true;
    };

    // Eliminar una clase
    const deleteClass = (item) => {
      classes.value = classes.value.filter((cls) => cls.id !== item.id);
      updateCalendarEvents();
    };

    // Guardar una clase (agregar o editar)
    const saveClass = () => {
      if (isEditing.value) {
        const index = classes.value.findIndex((cls) => cls.id === classForm.value.id);
        classes.value[index] = { ...classForm.value };
      } else {
        classForm.value.id = classes.value.length + 1;
        classes.value.push({ ...classForm.value });
      }
      updateCalendarEvents();
      classDialog.value = false;
    };

    // Actualizar eventos del calendario
    const updateCalendarEvents = () => {
      calendarEvents.value = classes.value.map((cls) => ({
        name: cls.name,
        start: `${cls.date}T${cls.time}:00`,
        end: `${cls.date}T${parseInt(cls.time.split(":")[0]) + 1}:00:00`,
      }));
    };

    // Obtener el nombre del cliente asignado a una clase
    const getClientName = (clientId) => {
      const client = clients.value.find((c) => c.id === clientId);
      return client ? client.name : "Sin cliente";
    };

    // Animación inicial de la tabla
    onMounted(() => {
      gsap.from(".classes-dashboard .v-data-table tbody tr", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    return {
      classes,
      headers,
      calendarDate,
      calendarEvents,
      classDialog,
      isEditing,
      classForm,
      clients,
      openAddClassDialog,
      editClass,
      deleteClass,
      saveClass,
      getClientName,
    };
  },
});
</script>

<style scoped>
.classes-dashboard {
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
