<template>
  <v-container fluid class="users-management-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Gestión de Usuarios</h1>
    <p class="text-subtitle-1">Administra los usuarios del sistema, cambia roles y edita su información.</p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-text-field v-model="filtroNombre" label="Buscar por Nombre o Email" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroRol" :items="rolesDisponibles" label="Filtrar por Rol" clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
      </v-col>
    </v-row>

    <!-- Listado de Usuarios -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Usuarios</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasUsuarios" :items="usuariosFiltrados" :items-per-page="5"
              class="elevation-1" :search="filtroBusqueda">
              <!-- Columna de Roles (Editable) -->
              <template #item.rol="{ item }">
                <v-select v-model="item.rol" :items="rolesDisponibles" dense outlined hide-details
                  @change="actualizarRol(item)"></v-select>
              </template>

              <!-- Acciones -->
              <template #item.acciones="{ item }">
                <v-btn icon small color="info" @click="editarUsuario(item)">
                  <v-icon small>mdi-pencil</v-icon>
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
          <v-card-title>Alertas y Notificaciones</v-card-title>
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
import { ref, computed } from 'vue';

// Datos de ejemplo
const usuarios = ref([
  { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'usuario', estado: 'Activo' },
  { id: 2, nombre: 'María López', email: 'maria@example.com', rol: 'entrenador', estado: 'Activo' },
  { id: 3, nombre: 'Pedro Ramírez', email: 'pedro@example.com', rol: 'admin', estado: 'Inactivo' },
]);

const rolesDisponibles = ['usuario', 'entrenador', 'admin'];

const cabecerasUsuarios = [
  { text: 'ID', value: 'id' },
  { text: 'Nombre', value: 'nombre' },
  { text: 'Email', value: 'email' },
  { text: 'Rol', value: 'rol' },
  { text: 'Estado', value: 'estado' },
  { text: 'Acciones', value: 'acciones', sortable: false },
];

const alertas = ref([
  { mensaje: 'El rol del usuario Juan Pérez ha sido actualizado a "admin".', tipo: 'success' },
  { mensaje: 'El usuario María López ha sido eliminado.', tipo: 'error' },
]);

// Estados de filtros
const filtroNombre = ref('');
const filtroRol = ref('');
const filtroBusqueda = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroNombre.value, filtroRol.value);
};

const actualizarRol = (usuario) => {
  console.log(`Rol actualizado para ${usuario.nombre}:`, usuario.rol);
  alertas.value.push({
    mensaje: `El rol del usuario ${usuario.nombre} ha sido actualizado a "${usuario.rol}".`,
    tipo: 'success',
  });
};

const editarUsuario = (usuario) => {
  console.log('Editar usuario:', usuario.nombre);
  alertas.value.push({
    mensaje: `Editar información del usuario ${usuario.nombre}.`,
    tipo: 'info',
  });
};

const eliminarUsuario = (usuario) => {
  console.log('Eliminar usuario:', usuario.nombre);
  const index = usuarios.value.findIndex((u) => u.id === usuario.id);
  if (index !== -1) {
    usuarios.value.splice(index, 1);
    alertas.value.push({
      mensaje: `El usuario ${usuario.nombre} ha sido eliminado.`,
      tipo: 'error',
    });
  }
};

// Computadas
const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(
    (u) =>
      (!filtroNombre.value ||
        u.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase()) ||
        u.email.toLowerCase().includes(filtroNombre.value.toLowerCase())) &&
      (!filtroRol.value || u.rol === filtroRol.value)
  );
});
</script>

<style scoped lang="scss">
.users-management-content {
  padding: 2rem;
}
</style>
