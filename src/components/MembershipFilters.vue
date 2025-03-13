<template>
  <div class="membership-filters">
    <h3>Filtrar Membresías</h3>
    <div class="filter-options">
      <!-- Filtro de estado -->
      <div class="filter-item">
        <label for="status">Estado</label>
        <select v-model="selectedStatus" id="status">
          <option value="">Todos</option>
          <option value="activas">Activas</option>
          <option value="expiradas">Expiradas</option>
          <option value="pendientes">Pendientes</option>
        </select>
      </div>

      <!-- Filtro de fecha de expiración -->
      <div class="filter-item">
        <label for="date">Fecha de Expiración</label>
        <input type="date" v-model="selectedDate" id="date" />
      </div>

      <!-- Filtro por nombre de cliente -->
      <div class="filter-item">
        <label for="client">Cliente</label>
        <input type="text" v-model="selectedClient" id="client" placeholder="Buscar por nombre de cliente" />
      </div>

      <!-- Botón de aplicar filtros -->
      <div class="filter-item">
        <button @click="applyFilters" class="apply-btn">Aplicar Filtros</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// Variables para los filtros
const selectedStatus = ref<string | null>('');
const selectedDate = ref<string | null>('');
const selectedClient = ref<string | null>('');

// Función para aplicar los filtros
const applyFilters = () => {
  // Aquí deberías emitir los valores de los filtros hacia el componente principal
  // o hacer alguna acción, como filtrar los datos
  console.log('Filtros aplicados:', {
    selectedStatus: selectedStatus.value,
    selectedDate: selectedDate.value,
    selectedClient: selectedClient.value,
  });
};
</script>

<style scoped lang="scss">
.membership-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #333;
}

select,
input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
  width: 100%;
}

button.apply-btn {
  padding: 0.8rem 1.2rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.apply-btn:hover {
  background-color: #1976d2;
}
</style>
