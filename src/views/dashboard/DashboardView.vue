<template>
  <div class="dashboard-container">
    <h1>Bienvenido al Dashboard</h1>

    <div class="dashboard-widgets">
      <v-card class="widget-card" elevation="3">
        <v-card-title>Total Usuarios</v-card-title>
        <v-card-subtitle>1,250</v-card-subtitle>
      </v-card>

      <v-card class="widget-card" elevation="3">
        <v-card-title>Gimnasios Activos</v-card-title>
        <v-card-subtitle>8</v-card-subtitle>
      </v-card>

      <v-card class="widget-card" elevation="3">
        <v-card-title>Miembros Registrados</v-card-title>
        <v-card-subtitle>4,320</v-card-subtitle>
      </v-card>
    </div>

    <div class="dashboard-charts">
      <v-card class="chart-card" elevation="3">
        <v-card-title>Estadísticas de Membresía</v-card-title>
        <div class="chart-placeholder">[Gráfica de Membresías]</div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
// No necesitas importar DashboardLayout aquí
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.dashboard-container {
  padding: $espaciado-grande;
}

h1 {
  font-size: 2rem;
  color: var(--color-titulos);
  margin-bottom: $espaciado-grande;
}

.dashboard-widgets {
  display: flex;
  gap: $espaciado-base;
}

.widget-card {
  flex: 1;
  padding: $espaciado-base;
  text-align: center;
}

.dashboard-charts {
  margin-top: $espaciado-grande;
}

.chart-card {
  padding: $espaciado-base;
  text-align: center;
}

.chart-placeholder {
  height: 200px;
  background-color: var(--color-fondo-secundario);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-texto-secundario);
  border-radius: $radio-borde;
}
</style>
