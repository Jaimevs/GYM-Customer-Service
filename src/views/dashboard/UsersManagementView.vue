<template>
  <v-container fluid class="users-management-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title">
      <span class="title-text">Gestión de Usuarios</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1">Administra los usuarios del sistema y cambia sus roles.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="card-title">Filtros de Búsqueda</v-card-title>
          <v-card-subtitle>Filtra los resultados por nombre o rol</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="filtroNombre" label="Buscar por Nombre o Email" clearable
                  prepend-icon="mdi-magnify" hint="Busca por nombre o correo electrónico"
                  persistent-hint></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="filtroRol" :items="rolesDisponibles" label="Filtrar por Rol" clearable
                  prepend-icon="mdi-filter-variant" hint="Selecciona un rol específico" persistent-hint></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Usuarios -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="card-title">
            Listado de Usuarios
            <v-chip class="ml-2" color="info">{{ usuarios.length }} usuarios cargados</v-chip>
          </v-card-title>
          <v-card-subtitle class="pb-0">
            Información de usuarios y sus roles en el sistema
          </v-card-subtitle>
          <v-card-text>
            <div v-if="cargando" class="text-center py-4">
              <v-progress-circular indeterminate color="var(--color-grafica-rojo-fuego)"
                size="50"></v-progress-circular>
              <p class="mt-2">Cargando datos...</p>
            </div>
            <v-data-table v-else :headers="cabecerasUsuarios" :items="usuariosFiltrados" :items-per-page="-1" dense
              class="elevation-1">

              <!-- Columna de enumeración -->
              <template #item.index="{ index, item }">
                <div>
                  {{ index + 1 }}
                  <span class="text-caption text-grey-darken-1">(ID: {{ item.ID }})</span>
                </div>
              </template>

              <!-- Columna de Roles (Editable) -->
              <template #item.Nombre="{ item }">
                <v-select v-model="item.selectedRol" :items="rolesDisponibles" dense outlined hide-details></v-select>
              </template>

              <!-- Acciones -->
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="editarUsuario(item)"
                  :disabled="item.selectedRol === item.Nombre" v-tooltip="'Guardar cambio de rol'">
                  <v-icon small>mdi-content-save</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas y Notificaciones -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>
            Alertas y Notificaciones
            <v-btn icon small class="ml-2" @click="limpiarAlertas">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-alert v-for="(alerta, index) in alertas" :key="index" :type="alerta.tipo" dense outlined>
              {{ alerta.mensaje }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import UserManagementService, { Usuario } from '@/services/UserManagementService';

// Estado para controlar la carga
const cargando = ref(false);

// Datos de usuarios
const usuarios = ref<Usuario[]>([]);

// Roles disponibles
const rolesDisponibles = ['admin', 'entrenador', 'usuario'];

// Definición de cabeceras para la tabla
const cabecerasUsuarios = [
  {
    text: 'ID',
    value: 'index',
    align: 'center',
    width: '80px',
    tooltip: 'Número secuencial del usuario'
  },
  {
    text: 'Rol actual',
    value: 'Nombre',
    tooltip: 'Rol actual del usuario en el sistema',
    width: '180px'
  },
  {
    text: 'Nombre de usuario',
    value: 'Nombre_Usuario',
    tooltip: 'Nombre completo del usuario'
  },
  {
    text: 'Correo electrónico',
    value: 'Correo_Electronico',
    tooltip: 'Dirección de correo del usuario'
  },
  {
    text: 'Acciones',
    value: 'acciones',
    sortable: false,
    align: 'center',
    tooltip: 'Opciones disponibles para el usuario',
    width: '120px'
  },
];

const alertas = ref<{mensaje: string, tipo: string}[]>([]);

// Estados de filtros
const filtroNombre = ref('');
const filtroRol = ref('');

// Función para cargar usuarios
const cargarDatos = async () => {
  if (cargando.value) return;

  cargando.value = true;
  usuarios.value = [];

  try {
    // Obtener usuarios con roles
    const usuariosCargados = await UserManagementService.obtenerUsuariosConRoles();
    
    usuarios.value = usuariosCargados.map(usuario => ({
      ...usuario,
      selectedRol: usuario.Nombre
    }));

    alertas.value.unshift({
      mensaje: `Se han cargado ${usuarios.value.length} usuarios correctamente.`,
      tipo: 'success'
    });

  } catch (error) {
    console.error('Error al cargar datos:', error);
    alertas.value.unshift({
      mensaje: `Error al cargar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      tipo: 'error'
    });
  } finally {
    cargando.value = false;
  }
};

// Método para guardar cambio de rol
const editarUsuario = async (usuario: Usuario) => {
  try {
    // Verificar si hay cambios para guardar
    if (usuario.selectedRol === usuario.Nombre) {
      alertas.value.unshift({
        mensaje: `No hay cambios de rol para guardar para ${usuario.Nombre_Usuario}`,
        tipo: "info"
      });
      return;
    }

    // Convertir nombre de rol a ID
    const roles: {[key: string]: number} = {
      'admin': 1,
      'usuario': 2,
      'entrenador': 3
    };

    // Obtener el ID del rol
    const rolId = roles[usuario.selectedRol || 'usuario'] || 2;

    cargando.value = true;

    // Llamar al servicio para cambiar el rol
    await UserManagementService.cambiarRolUsuario(usuario.ID, rolId);

    // Recargar datos para reflejar cambios
    await cargarDatos();

    alertas.value.unshift({
      mensaje: `Se ha guardado el cambio de rol de ${usuario.Nombre_Usuario} (ID: ${usuario.ID}) a "${usuario.selectedRol}" (Rol ID: ${rolId}).`,
      tipo: 'success',
    });

  } catch (error: any) {
    console.error('Error al guardar rol:', error);
    
    // Manejo detallado de errores
    let errorMessage = 'Error desconocido al cambiar rol';
    
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      errorMessage = error.response.data?.detail || 
                     error.response.data?.message || 
                     `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      errorMessage = 'No se recibió respuesta del servidor';
    } else {
      // Algo sucedió al configurar la solicitud
      errorMessage = error.message;
    }

    alertas.value.unshift({
      mensaje: `Error al guardar rol: ${errorMessage}`,
      tipo: 'error',
    });
  } finally {
    cargando.value = false;
  }
};

// Computadas
const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(
    (u) =>
      (!filtroNombre.value ||
        (u.Nombre_Usuario && u.Nombre_Usuario.toLowerCase().includes(filtroNombre.value.toLowerCase())) ||
        (u.Correo_Electronico && u.Correo_Electronico.toLowerCase().includes(filtroNombre.value.toLowerCase()))) &&
      (!filtroRol.value || u.Nombre === filtroRol.value)
  );
});

// Cargar datos iniciales al montar el componente
onMounted(() => {
  cargarDatos();
});
</script>

<style scoped lang="scss">
@use "@/styles/_variables.scss" as *;

.users-management-content {
  padding: 2rem;
}

.dashboard-title {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;

  .title-text {
    position: relative;
    z-index: 2;
    font-size: 2.25rem;
    font-weight: 700;
    background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-family: var(--fuente-titulo);
  }

  .title-highlight {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    height: 12px;
    background: rgba(255, 69, 0, 0.2);
    border-radius: 4px;
    z-index: 1;
    transform: rotate(-1deg);
  }
}

.text-subtitle-1 {
  color: var(--color-texto);
  font-family: var(--fuente-principal);
  margin-bottom: 24px;
}

.v-card {
  border-radius: 8px;
  margin-bottom: 24px;

  &__title {
    font-weight: 600;
    color: var(--color-texto-principal);
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-gris-medio);
    font-family: var(--fuente-titulo);
  }
}

@media (max-width: 960px) {
  .dashboard-title {
    .title-text {
      font-size: 1.75rem;
    }

    .title-highlight {
      height: 8px;
      bottom: 3px;
    }
  }

  .users-management-content {
    padding: 1rem;
  }
}
</style>