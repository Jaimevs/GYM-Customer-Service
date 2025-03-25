<template>
  <v-container>
    <h1>Mis Clases</h1>

    <!-- Alertas -->
    <v-alert v-if="error" type="error" class="my-4">{{ error }}</v-alert>
    <v-alert v-if="successMessage" type="success" class="my-4">{{ successMessage }}</v-alert>

    <!-- Cargando -->
    <v-progress-circular v-if="loading" indeterminate color="primary"
      class="my-5 mx-auto d-block"></v-progress-circular>

    <div v-else>
      <!-- Clases vacías -->
      <v-card v-if="classes.length === 0" class="my-4 pa-5 text-center">
        <v-icon icon="mdi-calendar-blank" size="64" color="grey-lighten-1"></v-icon>
        <h3 class="mt-4">No has creado ninguna clase</h3>
        <p>Crea tu primera clase haciendo clic en el botón "Agregar Clase"</p>
      </v-card>

      <!-- Lista de clases -->
      <v-data-table v-else :headers="tableHeaders" :items="classes" class="elevation-1 my-4" :items-per-page="5"
        :footer-props="{ itemsPerPageOptions: [5, 10, 15] }">
        <!-- Columna Horario -->
        <template #item.Horario="{ item }">
          {{ item.Dia_Inicio }} a {{ item.Dia_Fin }}, {{ formatTime(item.Hora_Inicio) }} - {{
            formatTime(item.Hora_Fin) }}
        </template>

        <!-- Columna Duración -->
        <template #item.Duracion_Minutos="{ item }">
          {{ item.Duracion_Minutos }} minutos
        </template>

        <!-- Columna Estado -->
        <template #item.Estatus="{ item }">
          <v-chip :color="item.Estatus ? 'success' : 'error'" small>
            {{ item.Estatus ? 'Activa' : 'Inactiva' }}
          </v-chip>
        </template>

        <!-- Columna Acciones -->
        <template #item.Acciones="{ item }">
          <v-btn icon small @click="editClass(item)" class="mr-2">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small @click="confirmDeleteClass(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <!-- Botón Agregar -->
      <v-btn color="primary" @click="openAddClassDialog" block>
        <v-icon left>mdi-plus</v-icon> Agregar Clase
      </v-btn>
    </div>

    <!-- Diálogo para agregar/editar una clase -->
    <v-dialog v-model="classDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>{{ isEditing ? 'Editar Clase' : 'Agregar Clase' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="classForm.Nombre" label="Nombre de la Clase" required></v-text-field>
          <v-textarea v-model="classForm.Descripcion" label="Descripción" rows="3"></v-textarea>

          <div class="d-flex mb-3">
            <v-select v-model="classForm.Dia_Inicio" label="Día Inicio" :items="diasSemana" required
              class="mr-2"></v-select>
            <v-select v-model="classForm.Dia_Fin" label="Día Fin" :items="diasSemana" required class="ml-2"></v-select>
          </div>

          <div class="d-flex mb-3">
            <v-text-field v-model="classForm.Hora_Inicio" label="Hora Inicio" type="time" required
              class="mr-2"></v-text-field>
            <v-text-field v-model="classForm.Hora_Fin" label="Hora Fin" type="time" required
              class="ml-2"></v-text-field>
          </div>

          <v-text-field v-model.number="classForm.Duracion_Minutos" label="Duración (minutos)" type="number" required
            min="1"></v-text-field>

          <v-switch v-model="classForm.Estatus" label="Clase Activa" color="success"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="classDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveClass" :loading="saving" :disabled="saving || !isFormValid">
            {{ isEditing ? 'Guardar Cambios' : 'Agregar Clase' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>¿Eliminar clase?</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la clase "{{ classToDelete?.Nombre }}"? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteClass" :loading="deleting" :disabled="deleting">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CoachClassesService from '../../services/CoachClassesService';

export default {
  name: 'CoachClassesView',
  data() {
    return {
      // Estado para las clases
      classes: [],
      loading: true,
      error: null,
      successMessage: null,

      // Diálogo para agregar/editar una clase
      classDialog: false,
      isEditing: false,
      saving: false,

      // Diálogo para eliminar
      deleteDialog: false,
      classToDelete: null,
      deleting: false,

      // Opciones del formulario
      diasSemana: [
        'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
      ],

      // Formulario para clase
      classForm: {
        Nombre: '',
        Descripcion: '',
        Dia_Inicio: 'Lunes',
        Dia_Fin: 'Viernes',
        Hora_Inicio: '08:00',
        Hora_Fin: '09:00',
        Duracion_Minutos: 60,
        Estatus: true,
        Entrenador_ID: 0,
      },

      // Definición de columnas para la data table
      tableHeaders: [
        { text: 'Nombre', value: 'Nombre', sortable: true },
        { text: 'Horario', value: 'Horario', sortable: false },
        { text: 'Duración', value: 'Duracion_Minutos', sortable: true },
        { text: 'Estado', value: 'Estatus', sortable: true },
        { text: 'Acciones', value: 'Acciones', sortable: false },
      ],
    };
  },
  computed: {
    isFormValid() {
      return (
        this.classForm.Nombre.trim() !== '' &&
        this.classForm.Dia_Inicio !== '' &&
        this.classForm.Dia_Fin !== '' &&
        this.classForm.Hora_Inicio !== '' &&
        this.classForm.Hora_Fin !== '' &&
        this.classForm.Duracion_Minutos > 0
      );
    },
  },
  watch: {
    'classForm.Hora_Inicio': 'calculateDuration',
    'classForm.Hora_Fin': 'calculateDuration',
  },
  async mounted() {
    await this.loadMyClasses();
    await this.getCurrentUser();
  },
  methods: {
    async getCurrentUser() {
      try {
        const userInfo = await CoachClassesService.getCurrentUser();
        this.classForm.Entrenador_ID = userInfo.ID || userInfo.id || 0;
      } catch (err) {
        console.error('Error al obtener información del usuario:', err);
      }
    },
    async loadMyClasses() {
      this.loading = true;
      this.error = null;
      try {
        this.classes = await CoachClassesService.getMyClasses();
      } catch (err) {
        console.error('Error al cargar mis clases:', err);
        this.error = 'No se pudieron cargar tus clases. Por favor, intenta nuevamente más tarde.';
      } finally {
        this.loading = false;
      }
    },
    openAddClassDialog() {
      this.classForm = {
        Nombre: '',
        Descripcion: '',
        Dia_Inicio: 'Lunes',
        Dia_Fin: 'Viernes',
        Hora_Inicio: '08:00',
        Hora_Fin: '09:00',
        Duracion_Minutos: 60,
        Estatus: true,
        Entrenador_ID: this.classForm.Entrenador_ID,
      };
      this.isEditing = false;
      this.classDialog = true;
      this.$nextTick(() => this.calculateDuration());
    },
    editClass(cls) {
      this.classForm = {
        ID: cls.ID,
        Nombre: cls.Nombre,
        Descripcion: cls.Descripcion || '',
        Dia_Inicio: cls.Dia_Inicio,
        Dia_Fin: cls.Dia_Fin,
        Hora_Inicio: this.formatTimeForInput(cls.Hora_Inicio),
        Hora_Fin: this.formatTimeForInput(cls.Hora_Fin),
        Duracion_Minutos: cls.Duracion_Minutos,
        Estatus: cls.Estatus,
        Entrenador_ID: cls.Entrenador_ID,
      };
      this.isEditing = true;
      this.classDialog = true;
      this.$nextTick(() => this.calculateDuration());
    },
    confirmDeleteClass(cls) {
      this.classToDelete = cls;
      this.deleteDialog = true;
    },
    async deleteClass() {
      if (!this.classToDelete) return;
      this.deleting = true;
      this.error = null;
      try {
        await CoachClassesService.deleteClass(this.classToDelete.ID);
        this.successMessage = 'Clase eliminada con éxito';
        this.deleteDialog = false;
        await this.loadMyClasses();
      } catch (err) {
        console.error(`Error al eliminar clase ${this.classToDelete.ID}:`, err);
        if (err instanceof Error && err.message.includes('quejas asociadas')) {
          this.error = err.message;
        } else {
          this.error = 'No se pudo eliminar la clase. Por favor, intenta nuevamente más tarde.';
        }
        this.deleteDialog = false;
      } finally {
        this.deleting = false;
      }
    },
    async saveClass() {
      if (!this.isFormValid) return;
      this.saving = true;
      this.error = null;
      this.successMessage = null;
      try {
        if (this.isEditing && this.classForm.ID) {
          const updateData = {
            Nombre: this.classForm.Nombre,
            Descripcion: this.classForm.Descripcion,
            Dia_Inicio: this.classForm.Dia_Inicio,
            Dia_Fin: this.classForm.Dia_Fin,
            Hora_Inicio: this.classForm.Hora_Inicio,
            Hora_Fin: this.classForm.Hora_Fin,
            Duracion_Minutos: this.classForm.Duracion_Minutos,
            Estatus: this.classForm.Estatus,
          };
          await CoachClassesService.updateClass(this.classForm.ID, updateData);
          this.successMessage = 'Clase actualizada con éxito';
        } else {
          const createData = {
            Nombre: this.classForm.Nombre,
            Descripcion: this.classForm.Descripcion,
            Dia_Inicio: this.classForm.Dia_Inicio,
            Dia_Fin: this.classForm.Dia_Fin,
            Hora_Inicio: this.classForm.Hora_Inicio,
            Hora_Fin: this.classForm.Hora_Fin,
            Duracion_Minutos: this.classForm.Duracion_Minutos,
            Estatus: this.classForm.Estatus,
            Entrenador_ID: this.classForm.Entrenador_ID,
          };
          await CoachClassesService.createClass(createData);
          this.successMessage = 'Clase creada con éxito';
        }
        this.classDialog = false;
        await this.loadMyClasses();
      } catch (err) {
        console.error('Error al guardar clase:', err);
        this.error = 'No se pudo guardar la clase. Por favor, intenta nuevamente más tarde.';
      } finally {
        this.saving = false;
      }
    },
    calculateDuration() {
      if (!this.classForm.Hora_Inicio || !this.classForm.Hora_Fin) return;
      try {
        const startMins = this.timeToMinutes(this.classForm.Hora_Inicio);
        const endMins = this.timeToMinutes(this.classForm.Hora_Fin);
        let duration = endMins - startMins;
        if (duration < 0) {
          duration += 24 * 60;
        }
        this.classForm.Duracion_Minutos = duration;
      } catch (e) {
        console.error('Error al calcular duración:', e);
      }
    },
    timeToMinutes(timeStr) {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    },
    formatTime(timeString) {
      if (!timeString) return '';
      try {
        if (timeString.includes('T')) {
          const date = new Date(timeString);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return timeString.substring(0, 5);
      } catch (e) {
        console.error('Error al formatear la hora:', e);
        return timeString;
      }
    },
    formatTimeForInput(timeString) {
      if (!timeString) return '';
      try {
        if (timeString.includes('T')) {
          const date = new Date(timeString);
          return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        return timeString.substring(0, 5);
      } catch (e) {
        console.error('Error al formatear la hora para input:', e);
        return timeString;
      }
    }
  }
};
</script>

<style scoped>
.d-flex {
  display: flex;
}

.ml-2 {
  margin-left: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}

.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}

.my-5 {
  margin-top: 20px;
  margin-bottom: 20px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.d-block {
  display: block;
}

.text-center {
  text-align: center;
}

.pa-5 {
  padding: 20px;
}
</style>
