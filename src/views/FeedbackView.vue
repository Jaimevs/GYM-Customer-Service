<template>
  <div class="feedback-dashboard">
    <!-- Sidebar -->
    <SidebarDashboard :isVisible="isSidebarVisible" @update:isVisible="updateSidebarVisibility" />

    <!-- Contenido principal -->
    <main class="feedback-main" :class="{ 'sidebar-visible': isSidebarVisible }">
      <!-- Navbar -->
      <NavbarDashboard @toggle-sidebar="toggleSidebar" />

      <!-- Título y contenido -->
      
        <h1>Gestión de Feedback</h1>
        <p>Aquí puedes visualizar y administrar el feedback de los clientes.</p>
        <section class="feedback-content">
        <!-- Quejas Container -->
        <div class="quejas-container">
          <header class="header-section">
            <div class="titulo-container">
              <h2 class="titulo-principal">Quejas y Sugerencias</h2>
              <p class="subtitulo">Gestiona las quejas y sugerencias de los clientes.</p>
            </div>
          </header>

          <!-- Tarjetas de estado de quejas -->
          <div class="tarjetas-container">
            <div v-for="(status, index) in complaintStatuses" :key="index" class="tarjeta" :class="status.class">
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
      <ComplaintFilters class="complain-filters" />
    </main>
    
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import NavbarDashboard from '@/components/NavbarDashboard.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import ClockIcon from '@/components/icons/ClockIcon.vue';
import AlertCircleIcon from '@/components/icons/AlertCircleIcon.vue';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon.vue';
import ComplaintFilters from '../components/ComplaintFilters.vue';

const isSidebarVisible = ref(true);

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const updateSidebarVisibility = (newValue: boolean) => {
  isSidebarVisible.value = newValue;
};


const complaintStatuses = [
  { title: 'Pendientes', count: 12, class: 'tarjeta-pendientes', icon: ClockIcon },
  { title: 'En Proceso', count: 8, class: 'tarjeta-proceso', icon: AlertCircleIcon },
  { title: 'Resueltas', count: 45, class: 'tarjeta-resueltas', icon: CheckCircleIcon },
];
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.feedback-dashboard {
  display: flex;
  min-height: 100vh;
}

.feedback-main {
  flex: 1;
  padding: $espaciado-grande;
  margin-top: 64px; 
  background-color: #f9f9f9;
  box-shadow: $sombra-suave;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.sidebar-visible {
  margin-left: 250px;
}

@include media-query(small) {
  .feedback-main {
    margin-left: 0;
    padding: $espaciado-base;
  }
}

.feedback-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .header-section {
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
}

@media (min-width: 768px) {
  .tarjetas-container {
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
}

.tarjeta:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.tarjeta-pendientes {
  border-top-color: #ffc107;
}

.tarjeta-proceso {
  border-top-color: #2196f3;
}

.tarjeta-resueltas {
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

.complain-filters {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
}
</style>
