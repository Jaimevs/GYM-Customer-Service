<template>
  <!-- Título y contenido -->
  <h1>Evaluación de Entrenadores</h1>
  <p>Aquí puedes visualizar y administrar la evaluación de los entrenadores.</p>

  <section class="trainers-content">
    <!-- Evaluaciones Container -->
    <div class="evaluaciones-container">
      <header class="header-section">
        <div class="titulo-container">
          <h2 class="titulo-principal">Evaluaciones y Seguimiento</h2>
          <p class="subtitulo">Gestiona las evaluaciones y seguimiento de los entrenadores.</p>
        </div>
      </header>

      <!-- Nuevas tarjetas en formato grid -->
      <div class="grid gap-4 md:grid-cols-3">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Calificación Promedio</h3>
          </div>
          <div class="card-content">
            <div class="flex items-center">
              <div class="text-2xl font-bold mr-2">4.2</div>
              <div class="flex">
                <StarIcon class="h-4 w-4 fill-primary text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Total de Reseñas</h3>
          </div>
          <div class="card-content">
            <div class="text-2xl font-bold">128</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title flex items-center">
              <AlertCircleIcon class="mr-2 h-4 w-4 text-destructive" />
              Alertas de Calificación
            </h3>
          </div>
          <div class="card-content">
            <div class="text-2xl font-bold">3</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Lista de Entrenadores -->
  <TrainersList class="evaluation-filters" />
</template>

<script lang="ts" setup>
import AlertCircleIcon from '@/components/common/icons/AlertCircleIcon.vue';
import StarIcon from '@/components/common/icons/StarIcon.vue';
import TrainersList from '@/components/dashboard/TrainersList.vue';
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.trainers-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: $espaciado-grande;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.titulo-principal {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitulo {
  color: #666;
  margin-top: 0.5rem;
}

/* Estilos para el nuevo grid */
.grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
}

.card-content {
  padding: 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.mr-2 {
  margin-right: 0.5rem;
}

.h-4 {
  height: 1rem;
}

.w-4 {
  width: 1rem;
}

.fill-primary {
  fill: #0ea5e9;
}

.text-primary {
  color: #0ea5e9;
}

.text-muted-foreground {
  color: #9ca3af;
}

.text-destructive {
  color: #ef4444;
}

.evaluation-filters {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
}
</style>
