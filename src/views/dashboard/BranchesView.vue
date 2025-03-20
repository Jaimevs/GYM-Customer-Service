<template>
  <div class="branches-view">
    <h1>Gestión de Sucursales</h1>
    <p>Aquí puedes administrar las sucursales del sistema.</p>

    <!-- Ejemplo de una tabla de sucursales -->
    <table class="branches-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="branch in branches" :key="branch.id">
          <td>{{ branch.id }}</td>
          <td>{{ branch.name }}</td>
          <td>{{ branch.address }}</td>
          <td>{{ branch.phone }}</td>
          <td>
            <button @click="editBranch(branch.id)">Editar</button>
            <button @click="deleteBranch(branch.id)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de sucursales
const branches = ref([
  { id: 1, name: "Sucursal Norte", address: "Calle 123, Ciudad", phone: "123-456-7890" },
  { id: 2, name: "Sucursal Sur", address: "Avenida 456, Ciudad", phone: "987-654-3210" },
  { id: 3, name: "Sucursal Centro", address: "Plaza Principal, Ciudad", phone: "555-555-5555" },
]);

// Función para editar una sucursal
const editBranch = (branchId: number) => {
  console.log(`Editando sucursal con ID: ${branchId}`);
};

// Función para eliminar una sucursal
const deleteBranch = (branchId: number) => {
  console.log(`Eliminando sucursal con ID: ${branchId}`);
};
</script>

<style scoped lang="scss">
.branches-view {
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

  .branches-table {
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
