<template>
  <v-container>
    <h1>Mis Clases</h1>
    
    <!-- Alertas -->
    <v-alert v-if="error" type="error" class="my-4">{{ error }}</v-alert>
    <v-alert v-if="successMessage" type="success" class="my-4">{{ successMessage }}</v-alert>
    
    <!-- Cargando -->
    <v-progress-circular v-if="loading" indeterminate color="primary" class="my-5 mx-auto d-block"></v-progress-circular>
    
    <div v-else>
      <!-- Clases vacías -->
      <v-card v-if="classes.length === 0" class="my-4 pa-5 text-center">
        <v-icon icon="mdi-calendar-blank" size="64" color="grey-lighten-1"></v-icon>
        <h3 class="mt-4">No has creado ninguna clase</h3>
        <p>Crea tu primera clase haciendo clic en el botón "Agregar Clase"</p>
      </v-card>
      
      <!-- Lista de clases -->
      <v-simple-table v-else class="my-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Horario</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cls in classes" :key="cls.ID">
            <td>{{ cls.Nombre }}</td>
            <td>{{ cls.Dia_Inicio }} a {{ cls.Dia_Fin }}, {{ formatTime(cls.Hora_Inicio) }} - {{ formatTime(cls.Hora_Fin) }}</td>
            <td>{{ cls.Duracion_Minutos }} minutos</td>
            <td>
              <v-chip :color="cls.Estatus ? 'success' : 'error'" small>
                {{ cls.Estatus ? 'Activa' : 'Inactiva' }}
              </v-chip>
            </td>
            <td>
              <v-btn icon small @click="editClass(cls)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="confirmDeleteClass(cls)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      
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
            <v-select
              v-model="classForm.Dia_Inicio"
              label="Día Inicio"
              :items="diasSemana"
              required
              class="mr-2"
            ></v-select>
            <v-select
              v-model="classForm.Dia_Fin"
              label="Día Fin"
              :items="diasSemana"
              required
              class="ml-2"
            ></v-select>
          </div>
          
          <div class="d-flex mb-3">
            <v-text-field 
              v-model="classForm.Hora_Inicio" 
              label="Hora Inicio" 
              type="time" 
              required 
              class="mr-2"
            ></v-text-field>
            <v-text-field 
              v-model="classForm.Hora_Fin" 
              label="Hora Fin" 
              type="time" 
              required 
              class="ml-2"
            ></v-text-field>
          </div>
          
          <v-text-field 
            v-model.number="classForm.Duracion_Minutos" 
            label="Duración (minutos)" 
            type="number" 
            required 
            min="1"
          ></v-text-field>
          
          <v-switch
            v-model="classForm.Estatus"
            label="Clase Activa"
            color="success"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="classDialog = false">Cancelar</v-btn>
          <v-btn 
            color="primary" 
            @click="saveClass" 
            :loading="saving" 
            :disabled="saving || !isFormValid"
          >
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
          ¿Estás seguro de que deseas eliminar la clase "{{ classToDelete?.Nombre }}"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn 
            color="error" 
            @click="deleteClass" 
            :loading="deleting"
            :disabled="deleting"
          >
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
        Entrenador_ID: 0 // Se establecerá con el ID del usuario actual
      }
    };
  },
  computed: {
    // Computed para verificar si el formulario es válido
    isFormValid() {
      return (
        this.classForm.Nombre.trim() !== '' &&
        this.classForm.Dia_Inicio !== '' &&
        this.classForm.Dia_Fin !== '' &&
        this.classForm.Hora_Inicio !== '' &&
        this.classForm.Hora_Fin !== '' &&
        this.classForm.Duracion_Minutos > 0
      );
    }
  },
  async mounted() {
    await this.loadMyClasses();
    await this.getCurrentUser();
  },
  methods: {
    // Cargar información del usuario actual
    async getCurrentUser() {
      try {
        const userInfo = await CoachClassesService.getCurrentUser();
        this.classForm.Entrenador_ID = userInfo.ID || userInfo.id || 0;
      } catch (err) {
        console.error('Error al obtener información del usuario:', err);
      }
    },

    // Cargar mis clases
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

    // Abrir diálogo para agregar una nueva clase
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
        Entrenador_ID: this.classForm.Entrenador_ID // Mantener el ID del entrenador
      };
      this.isEditing = false;
      this.classDialog = true;
    },

    // Editar una clase existente
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
        Entrenador_ID: cls.Entrenador_ID
      };
      this.isEditing = true;
      this.classDialog = true;
    },

    // Confirmar eliminación de una clase
    confirmDeleteClass(cls) {
      this.classToDelete = cls;
      this.deleteDialog = true;
    },

    // Eliminar una clase
async deleteClass() {
  if (!this.classToDelete) return;
  
  this.deleting = true;
  this.error = null;
  
  try {
    await CoachClassesService.deleteClass(this.classToDelete.ID);
    
    this.successMessage = 'Clase eliminada con éxito';
    this.deleteDialog = false;
    
    // Recargar clases
    await this.loadMyClasses();
  } catch (err) {
    console.error(`Error al eliminar clase ${this.classToDelete.ID}:`, err);
    
    // Mensaje específico para error de integridad referencial
    if (err instanceof Error && err.message.includes('quejas asociadas')) {
      this.error = err.message;
    } else {
      this.error = 'No se pudo eliminar la clase. Por favor, intenta nuevamente más tarde.';
    }
    
    // Cerramos el diálogo de confirmación
    this.deleteDialog = false;
  } finally {
    this.deleting = false;
  }
},

    // Guardar una clase (agregar o editar)
    async saveClass() {
      if (!this.isFormValid) return;
      
      this.saving = true;
      this.error = null;
      this.successMessage = null;
      
      try {
        if (this.isEditing && this.classForm.ID) {
          // Actualizar clase existente
          const updateData = {
            Nombre: this.classForm.Nombre,
            Descripcion: this.classForm.Descripcion,
            Dia_Inicio: this.classForm.Dia_Inicio,
            Dia_Fin: this.classForm.Dia_Fin,
            Hora_Inicio: this.classForm.Hora_Inicio,
            Hora_Fin: this.classForm.Hora_Fin,
            Duracion_Minutos: this.classForm.Duracion_Minutos,
            Estatus: this.classForm.Estatus
          };
          
          await CoachClassesService.updateClass(this.classForm.ID, updateData);
          this.successMessage = 'Clase actualizada con éxito';
        } else {
          // Crear nueva clase
          const createData = {
            Nombre: this.classForm.Nombre,
            Descripcion: this.classForm.Descripcion,
            Dia_Inicio: this.classForm.Dia_Inicio,
            Dia_Fin: this.classForm.Dia_Fin,
            Hora_Inicio: this.classForm.Hora_Inicio,
            Hora_Fin: this.classForm.Hora_Fin,
            Duracion_Minutos: this.classForm.Duracion_Minutos,
            Estatus: this.classForm.Estatus,
            Entrenador_ID: this.classForm.Entrenador_ID
          };
          
          await CoachClassesService.createClass(createData);
          this.successMessage = 'Clase creada con éxito';
        }
        
        // Cerrar el diálogo y recargar clases
        this.classDialog = false;
        await this.loadMyClasses();
      } catch (err) {
        console.error('Error al guardar clase:', err);
        this.error = 'No se pudo guardar la clase. Por favor, intenta nuevamente más tarde.';
      } finally {
        this.saving = false;
      }
    },

    // Función para formatear la hora para mostrar
    formatTime(timeString) {
      if (!timeString) return '';
      
      try {
        // Si es un string de tiempo en formato ISO
        if (timeString.includes('T')) {
          const date = new Date(timeString);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Si es solo la hora (HH:MM:SS)
        return timeString.substring(0, 5);
      } catch (e) {
        console.error('Error al formatear la hora:', e);
        return timeString;
      }
    },

    // Función para formatear la hora para el input time
    formatTimeForInput(timeString) {
      if (!timeString) return '';
      
      try {
        // Si es un string de tiempo en formato ISO
        if (timeString.includes('T')) {
          const date = new Date(timeString);
          return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        
        // Si es solo la hora (HH:MM:SS)
        return timeString.substring(0, 5);
      } catch (e) {
        console.error('Error al formatear la hora para input:', e);
        return timeString;
      }
    }
  }
}
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