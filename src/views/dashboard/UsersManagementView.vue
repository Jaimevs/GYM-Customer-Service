<template>
  <v-container fluid class="users-management-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title">
      <span class="title-text">Gestión de Usuarios</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1">Administra los usuarios del sistema, cambia roles y edita su información.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="card-title">Filtros de Búsqueda</v-card-title>
          <v-card-subtitle>Filtra los resultados por nombre o rol</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="filtroNombre" label="Buscar por Nombre o Email" clearable
                  prepend-icon="mdi-magnify" hint="Busca por nombre o correo electrónico"
                  persistent-hint></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="filtroRol" :items="rolesDisponibles" label="Filtrar por Rol" clearable
                  prepend-icon="mdi-filter-variant" hint="Selecciona un rol específico" persistent-hint></v-select>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-btn color="var(--color-grafica-rojo-fuego)" @click="aplicarFiltros" block>
                  <v-icon left>mdi-filter</v-icon>
                  Aplicar Filtros
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Control de IDs a consultar -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="card-title">Consulta de Usuarios</v-card-title>
          <v-card-subtitle>Indica el rango de IDs a consultar</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="idInicio" label="ID Inicio" type="number" min="1" hide-details
                  @keyup.enter="cargarDatos" hint="Primer ID a consultar" persistent-hint></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="idFin" label="ID Fin" type="number" min="1" hide-details
                  @keyup.enter="cargarDatos" hint="Último ID a consultar" persistent-hint></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn color="var(--color-grafica-rojo-fuego)" @click="cargarDatos" :loading="cargando" block>
                  <v-icon left>mdi-refresh</v-icon>
                  Cargar Datos
                </v-btn>
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
              <p class="mt-2">Cargando datos... ({{ progresoCarga }}%)</p>
            </div>
            <v-data-table v-else :headers="cabecerasUsuarios" :items="usuariosFiltrados" :items-per-page="-1" dense
              class="elevation-1" :search="filtroBusqueda">

              <template v-slot:header="{ props: { headers } }">
                <thead>
                  <tr>
                    <th v-for="header in headers" :key="header.value" :class="header.class">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{ header.text }}</span>
                        </template>
                        <span>{{ header.tooltip }}</span>
                      </v-tooltip>
                    </th>
                  </tr>
                </thead>
              </template>

              <!-- Columna de enumeración -->
              <template #item.index="{ index, item }">
                <div>
                  {{ index + 1 }}
                  <span class="text-caption text-grey-darken-1">(ID: {{ item.Usuario_ID }})</span>
                </div>
              </template>

              <!-- Columna de Roles (Editable) -->
              <template #item.Nombre="{ item }">
                <v-select v-model="item.selectedRol" :items="rolesDisponibles" dense outlined hide-details></v-select>
              </template>

              <!-- Columna de Estado -->
              <template #item.Estatus="{ item }">
                <v-chip :color="item.Estatus === 1 ? 'success' : 'error'" small>
                  {{ item.Estatus === 1 ? 'Activo' : 'Inactivo' }}
                </v-chip>
              </template>

              <!-- Acciones -->
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="editarUsuario(item)"
                  :disabled="item.selectedRol === item.Nombre" v-tooltip="'Guardar cambio de rol'">
                  <v-icon small>mdi-content-save</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarUsuario(item)">
                  <v-icon small>mdi-delete</v-icon>
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
import axios from 'axios';

// URL base de la API
const apiBaseUrl = 'https://gymtoday1243.com';

// Estado para controlar la carga
const cargando = ref(false);
const progresoCarga = ref(0);

// Rango de IDs a consultar
const idInicio = ref(1);
const idFin = ref(10); // Inicia consultando los primeros 10 IDs

// Datos de usuarios
const usuarios = ref([]);

// Roles disponibles
const rolesDisponibles = ['admin', 'entrenador', 'usuario'];

// Definición de cabeceras para la tabla según la estructura de la API
const cabecerasUsuarios = [
  {
    text: 'ID',
    value: 'index',
    align: 'center',
    width: '80px',
    tooltip: 'Número secuencial del usuario'
  },
  {
    text: 'Rol de usuario',
    value: 'Nombre',
    tooltip: 'Nivel de acceso del usuario en el sistema',
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
    text: 'Estado',
    value: 'Estatus',
    tooltip: 'Indica si el usuario está activo o inactivo',
    align: 'center',
    width: '120px'
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

const alertas = ref([]);

// Estados de filtros
const filtroNombre = ref('');
const filtroRol = ref('');
const filtroBusqueda = ref('');

// Función para formatear fechas
const formatearFecha = (fechaString) => {
  if (!fechaString) return '-';
  const fecha = new Date(fechaString);
  return fecha.toLocaleString();
};

// Función para limpiar alertas
const limpiarAlertas = () => {
  alertas.value = [];
};

// Función para obtener datos de un ID específico
const obtenerDatosPorId = async (id) => {
  try {
    const url = `${apiBaseUrl}/users/${id}/roles1`;
    const respuesta = await axios.get(url);

    // Inicializar el rol seleccionado para cada usuario
    if (respuesta.data && Array.isArray(respuesta.data)) {
      respuesta.data.forEach(usuario => {
        usuario.selectedRol = usuario.Nombre; // Inicializar con el rol actual
        usuario.Usuario_ID = id; // Guardar el ID del usuario de la URL
      });
    }

    return respuesta.data;
  } catch (error) {
    console.log(`No se encontraron datos para el ID ${id}`);
    return null;
  }
};

// Función para cargar todos los datos en el rango de IDs especificado
const cargarDatos = async () => {
  if (cargando.value) return;

  cargando.value = true;
  progresoCarga.value = 0;
  usuarios.value = [];

  try {
    const inicio = parseInt(idInicio.value);
    const fin = parseInt(idFin.value);

    if (isNaN(inicio) || isNaN(fin) || inicio < 1 || fin < inicio) {
      throw new Error('Rango de IDs inválido');
    }

    const total = fin - inicio + 1;
    let encontrados = 0;

    for (let id = inicio; id <= fin; id++) {
      // Actualizar progreso
      progresoCarga.value = Math.round(((id - inicio) / total) * 100);

      const datos = await obtenerDatosPorId(id);
      if (datos && Array.isArray(datos)) {
        // Añadir un atributo para mostrar el ID de usuario en la tabla
        // (para debugging, no visible en la UI)
        datos.forEach(item => {
          item.indiceTabla = usuarios.value.length + 1;
        });

        usuarios.value = [...usuarios.value, ...datos];
        encontrados += datos.length;
      }
    }

    alertas.value.unshift({
      mensaje: `Se han cargado ${encontrados} registros correctamente en el rango de IDs ${inicio} a ${fin}.`,
      tipo: 'success'
    });

  } catch (error) {
    console.error('Error al cargar datos:', error);
    alertas.value.unshift({
      mensaje: `Error al cargar datos: ${error.message || 'Error desconocido'}`,
      tipo: 'error'
    });
  } finally {
    cargando.value = false;
    progresoCarga.value = 100;
  }
};

// Cargar datos iniciales al montar el componente
onMounted(() => {
  cargarDatos();
});

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroNombre.value, filtroRol.value);
};

// Método para guardar cambio de rol
const guardarRol = async (usuario) => {
  try {
    // Verificar si hay cambios para guardar
    if (usuario.selectedRol === usuario.Nombre) {
      alertas.value.unshift({
        mensaje: "No hay cambios para guardar en el rol",
        tipo: "info"
      });
      return;
    }

    // Convertir nombre de rol a ID
    const roles = {
      'admin': 1,
      'usuario': 2,
      'entrenador': 3
    };

    const rolId = roles[usuario.selectedRol] || 1;

    // Extraer ID de usuario del objeto (si está disponible)
    const userId = usuario.Usuario_ID || idInicio.value; // Usar el ID inicio como fallback

    cargando.value = true;
    const response = await axios.post(`${apiBaseUrl}/users/${userId}/update_rol99`, {
      rol_id: rolId
    });

    // Actualizar rol en la interfaz
    usuario.Nombre = usuario.selectedRol;

    alertas.value.unshift({
      mensaje: `El rol del usuario ${usuario.Nombre_Usuario} ha sido actualizado a "${usuario.selectedRol}" (ID: ${rolId}).`,
      tipo: 'success',
    });

  } catch (error) {
    console.error('Error al actualizar rol:', error);
    alertas.value.unshift({
      mensaje: `Error al actualizar rol: ${error.response?.data?.detail || error.message || 'Error desconocido'}`,
      tipo: 'error',
    });
  } finally {
    cargando.value = false;
  }
};

const editarUsuario = async (usuario) => {
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
    const roles = {
      'admin': 1,
      'usuario': 2,
      'entrenador': 3
    };

    const rolId = roles[usuario.selectedRol] || 1;

    // Obtener el ID del usuario correcto
    // Esto es crítico para actualizar el usuario correcto
    const userId = usuario.Usuario_ID;

    if (!userId) {
      alertas.value.unshift({
        mensaje: `Error: No se pudo determinar el ID del usuario ${usuario.Nombre_Usuario}`,
        tipo: 'error',
      });
      return;
    }

    console.log(`Actualizando usuario ID: ${userId} a rol: ${rolId} (${usuario.selectedRol})`);

    cargando.value = true;
    const response = await axios.post(`${apiBaseUrl}/users/${userId}/update_rol99`, {
      rol_id: rolId
    });

    // Actualizar rol en la interfaz
    usuario.Nombre = usuario.selectedRol;

    alertas.value.unshift({
      mensaje: `Se ha guardado el cambio de rol de ${usuario.Nombre_Usuario} (ID: ${userId}) a "${usuario.selectedRol}" (Rol ID: ${rolId}).`,
      tipo: 'success',
    });

  } catch (error) {
    console.error('Error al guardar rol:', error);
    alertas.value.unshift({
      mensaje: `Error al guardar rol: ${error.response?.data?.detail || error.message || 'Error desconocido'}`,
      tipo: 'error',
    });
  } finally {
    cargando.value = false;
  }
};

const eliminarUsuario = (usuario) => {
  console.log('Eliminar usuario:', usuario.Nombre_Usuario);
  const index = usuarios.value.findIndex((u) => u.ID === usuario.ID);
  if (index !== -1) {
    usuarios.value.splice(index, 1);
    alertas.value.unshift({
      mensaje: `El usuario ${usuario.Nombre_Usuario} ha sido eliminado.`,
      tipo: 'error',
    });
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
