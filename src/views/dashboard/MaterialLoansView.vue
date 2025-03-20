<template>
  <div class="material-loans-view">
    <h1>Préstamos de Materiales</h1>
    <p>Aquí puedes gestionar los préstamos de materiales del sistema.</p>

    <!-- Ejemplo de una tabla de préstamos -->
    <table class="loans-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Material</th>
          <th>Cliente</th>
          <th>Fecha de Préstamo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="loan in loans" :key="loan.id">
          <td>{{ loan.id }}</td>
          <td>{{ loan.material }}</td>
          <td>{{ loan.client }}</td>
          <td>{{ loan.date }}</td>
          <td>{{ loan.status }}</td>
          <td>
            <button @click="returnMaterial(loan.id)" class="return-btn">Devolver</button>
            <button @click="deleteLoan(loan.id)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Datos de ejemplo de préstamos
const loans = ref([
  { id: 1, material: "Pesas", client: "Juan Pérez", date: "2023-10-15", status: "Prestado" },
  { id: 2, material: "Colchoneta", client: "María López", date: "2023-10-16", status: "Devuelto" },
  { id: 3, material: "Banda Elástica", client: "Carlos Ramírez", date: "2023-10-17", status: "Prestado" },
]);

// Función para devolver un material
const returnMaterial = (loanId: number) => {
  const loan = loans.value.find((l) => l.id === loanId);
  if (loan) {
    loan.status = "Devuelto";
    console.log(`Material con ID ${loanId} marcado como devuelto.`);
  }
};

// Función para eliminar un préstamo
const deleteLoan = (loanId: number) => {
  console.log(`Eliminando préstamo con ID: ${loanId}`);
};
</script>

<style scoped lang="scss">
.material-loans-view {
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

  .loans-table {
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

    .return-btn {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 4px;
    }

    .return-btn:hover {
      background-color: #218838;
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
