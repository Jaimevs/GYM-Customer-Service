<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Classes</h1>
      </v-col>
    </v-row>

    <!-- Lista de clases -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Upcoming Classes</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="classes" :items-per-page="5" class="elevation-1">
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editClass(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteClass(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Calendario de clases -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Class Calendar</v-card-title>
          <v-card-text>
            <v-calendar v-model="calendarDate" :events="calendarEvents" event-color="primary"></v-calendar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón para agregar una nueva clase -->
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="openAddClassDialog">
          <v-icon left>mdi-plus</v-icon>
          Add Class
        </v-btn>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar una clase -->
    <v-dialog v-model="classDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Edit Class' : 'Add Class' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveClass">
            <v-text-field v-model="classForm.name" label="Class Name" outlined dense required></v-text-field>

            <v-text-field v-model="classForm.instructor" label="Instructor" outlined dense required></v-text-field>

            <v-text-field v-model="classForm.date" label="Date" type="date" outlined dense required></v-text-field>

            <v-text-field v-model="classForm.time" label="Time" type="time" outlined dense required></v-text-field>

            <v-btn type="submit" color="primary">
              {{ isEditing ? 'Save Changes' : 'Add Class' }}
            </v-btn>
            <v-btn text @click="classDialog = false">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CoachClassesView',
  setup() {
    // Lista de clases
    const classes = ref([
      { id: 1, name: 'Yoga Class', instructor: 'John Doe', date: '2023-10-15', time: '10:00' },
      { id: 2, name: 'HIIT Workout', instructor: 'Jane Smith', date: '2023-10-16', time: '18:00' },
    ]);

    // Encabezados de la tabla
    const headers = ref([
      { text: 'Class Name', value: 'name' },
      { text: 'Instructor', value: 'instructor' },
      { text: 'Date', value: 'date' },
      { text: 'Time', value: 'time' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]);

    // Calendario
    const calendarDate = ref(new Date().toISOString().substr(0, 10));
    const calendarEvents = ref(
      classes.value.map((cls) => ({
        name: cls.name,
        start: `${cls.date}T${cls.time}:00`,
        end: `${cls.date}T${parseInt(cls.time) + 1}:00:00`,
      }))
    );

    // Diálogo para agregar/editar una clase
    const classDialog = ref(false);
    const isEditing = ref(false);
    const classForm = ref({
      id: null,
      name: '',
      instructor: '',
      date: '',
      time: '',
    });

    // Abrir diálogo para agregar una nueva clase
    const openAddClassDialog = () => {
      classForm.value = { id: null, name: '', instructor: '', date: '', time: '' };
      isEditing.value = false;
      classDialog.value = true;
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
        end: `${cls.date}T${parseInt(cls.time) + 1}:00:00`,
      }));
    };

    return {
      classes,
      headers,
      calendarDate,
      calendarEvents,
      classDialog,
      isEditing,
      classForm,
      openAddClassDialog,
      editClass,
      deleteClass,
      saveClass,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>
