<template>
  <div class="service-filters">
    <h3>Filtrar Servicios</h3>
    <form @submit.prevent="applyFilters">
      <div class="filter-group">
        <label for="status">Estado del Servicio</label>
        <select v-model="filters.status" id="status">
          <option value="">Todos</option>
          <option value="Pendientes">Pendientes</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completados">Completados</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="category">Tipo de Servicio</label>
        <select v-model="filters.category" id="category">
          <option value="">Todos</option>
          <option value="Gimnasio">Gimnasio</option>
          <option value="Nutrición">Nutrición</option>
          <option value="Masajes">Masajes</option>
          <option value="Entrenamiento Personal">Entrenamiento Personal</option>
          <option value="Asesoría de Salud">Asesoría de Salud</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="date">Fecha de Solicitud</label>
        <input type="date" v-model="filters.date" id="date" />
      </div>

      <button type="submit">Aplicar Filtros</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// Definir los filtros disponibles
const filters = ref({
  status: '',
  category: '',
  date: ''
});

// Emitir los filtros aplicados al componente padre
const applyFilters = () => {
  // Emite los filtros seleccionados al componente padre
  emit('apply-filters', filters.value);
};
</script>

<style scoped>
.service-filters {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  max-width: 400px;
  width: 100%;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.filter-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
}

select,
input[type="date"] {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  width: 100%;
  margin-top: 1.25rem;
}

button:hover {
  background-color: #45a049;
}
</style>
