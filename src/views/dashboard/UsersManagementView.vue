<template>
  <div class="users-management-view">
    <h1>Gestión de Usuarios</h1>
    <p>Aquí puedes administrar los usuarios del sistema.</p>

    <!-- Ejemplo de una tabla de usuarios -->
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(user.id)">Editar</button>
            <button @click="deleteUser(user.id)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de usuarios
const users = ref([
  { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "admin" },
  { id: 2, name: "María López", email: "maria@example.com", role: "usuario" },
  { id: 3, name: "Carlos Ramírez", email: "carlos@example.com", role: "entrenador" },
]);

// Función para editar un usuario
const editUser = (userId: number) => {
  console.log(`Editando usuario con ID: ${userId}`);
};

// Función para eliminar un usuario
const deleteUser = (userId: number) => {
  console.log(`Eliminando usuario con ID: ${userId}`);
};
</script>

<style scoped lang="scss">
.users-management-view {
  padding: 20px;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
  }

  p {
    font-size: 1rem;
    margin-bottom: 20px;
    color: #666;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 10px;
      text-align: left;
      border: 1px solid #ddd;
    }

    th {
      background-color: #f4f4f4;
      font-weight: bold;
    }

    .delete-btn {
      background-color: #ff4d4d;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 4px;
    }

    .delete-btn:hover {
      background-color: #cc0000;
    }
  }
}
</style>
