<template>
  <div class="consumables-control-view">
    <h1>Control de Consumibles</h1>
    <p>Aquí puedes gestionar los consumibles del sistema.</p>

    <!-- Ejemplo de una tabla de consumibles -->
    <table class="consumables-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in consumables" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <button @click="editItem(item.id)">Editar</button>
            <button @click="deleteItem(item.id)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de consumibles
const consumables = ref([
  { id: 1, name: "Toallas", quantity: 50 },
  { id: 2, name: "Botellas de Agua", quantity: 200 },
  { id: 3, name: "Suplementos", quantity: 30 },
]);

// Función para editar un consumible
const editItem = (itemId: number) => {
  console.log(`Editando consumible con ID: ${itemId}`);
};

// Función para eliminar un consumible
const deleteItem = (itemId: number) => {
  console.log(`Eliminando consumible con ID: ${itemId}`);
};
</script>

<style scoped lang="scss">
.consumables-control-view {
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

  .consumables-table {
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
