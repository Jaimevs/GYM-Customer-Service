<template>
  <!-- Título y contenido -->
  <h1>Gestión de Servicios</h1>
  <p>Visualiza, administra y realiza seguimientos a los servicios que ofrece.</p>

  <!-- Contenido principal -->
  <section class="service-management-content">
    <!-- Estado de los Servicios -->
    <div class="servicios-container">
      <header class="header-section">
        <div class="titulo-container">
          <h2 class="titulo-principal">Estado de los Servicios</h2>
          <p class="subtitulo">Monitorea el estado actual de los servicios y gestiona su progreso.</p>
        </div>
      </header>

      <!-- Tarjetas de estado de los servicios -->
      <div class="tarjetas-container">
        <div v-for="(status, index) in serviceStatuses" :key="index" class="tarjeta" :class="status.class">
          <div class="tarjeta-cabecera">
            <div class="tarjeta-titulo">
              <component :is="status.icon" class="icono" />
              <span>{{ status.title }}</span>
            </div>
          </div>
          <div class="tarjeta-contenido">
            <div class="contador">{{ status.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Filtros para la gestión -->
  <ServiceFilters class="service-filters" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PlusIcon from '@/components/common/icons/PlusIcon.vue';
import ClockIcon from '@/components/common/icons/ClockIcon.vue';
import AlertCircleIcon from '@/components/common/icons/AlertCircleIcon.vue';
import CheckCircleIcon from '@/components/common/icons/CheckCircleIcon.vue';
import ServiceFilters from '@/components/dashboard/ServiceFilters.vue';

// Estados de los servicios
const serviceStatuses = [
  { title: 'Pendientes', count: 12, class: 'tarjeta-pendientes', icon: ClockIcon },
  { title: 'En Proceso', count: 8, class: 'tarjeta-proceso', icon: AlertCircleIcon },
  { title: 'Completados', count: 45, class: 'tarjeta-completados', icon: CheckCircleIcon },
];
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.service-management-content {
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

.tarjetas-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.tarjeta {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  border-top: 4px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.tarjeta-pendientes {
  border-top-color: #ffc107;
}

.tarjeta-proceso {
  border-top-color: #2196f3;
}

.tarjeta-completados {
  border-top-color: #4caf50;
}

.tarjeta-cabecera {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.tarjeta-titulo {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
}

.icono {
  margin-right: 0.5rem;
}

.tarjeta-contenido {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contador {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  text-align: center;
}

.service-filters {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: $espaciado-grande;
}
</style>
