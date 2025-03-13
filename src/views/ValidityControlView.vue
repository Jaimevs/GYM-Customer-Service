<template>
  <div class="membership-expiry-dashboard">
    <!-- Sidebar -->
    <SidebarDashboard :isVisible="isSidebarVisible" @update:isVisible="updateSidebarVisibility" />

    <!-- Contenido principal -->
    <main class="membership-expiry-main" :class="{ 'sidebar-visible': isSidebarVisible }">
      <!-- Navbar -->
      <NavbarDashboard @toggle-sidebar="toggleSidebar" />

      <!-- Título y contenido -->
      <h1>Control de Vigencia de Membresías</h1>
      <p>Monitorea el estado de las membresías y su fecha de vencimiento.</p>

      <!-- Estado de las Membresías -->
      <section class="membership-expiry-content">
        <div class="membresias-container">
          <header class="header-section">
            <div class="titulo-container">
              <h2 class="titulo-principal">Estado de las Membresías</h2>
              <p class="subtitulo">Monitorea las membresías activas, próximas a vencer y vencidas.</p>
            </div>
          </header>

          <!-- Tarjetas de estado de las membresías -->
          <div class="tarjetas-container">
            <div v-for="(membership, index) in filteredMemberships" :key="index" class="tarjeta"
              :class="membership.statusClass">
              <div class="tarjeta-cabecera">
                <div class="tarjeta-titulo">
                  <span>{{ membership.name }}</span>
                  <span class="fecha-vencimiento">{{ membership.expiryDate }}</span>
                </div>
              </div>
              <div class="tarjeta-contenido">
                <div class="estado">{{ membership.status }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filtros de Membresías (al final) -->
      <section class="membership-filters">
        <h2>Filtros de Membresías</h2>
        <MembershipFilters @filter-changed="updateFilter" />
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import NavbarDashboard from '@/components/NavbarDashboard.vue';
import MembershipFilters from '@/components/MembershipFilters.vue';

const isSidebarVisible = ref(true);

const memberships = ref([
  { name: 'Juan Pérez', expiryDate: '2025-05-10', status: 'Activo', statusClass: 'activo' },
  { name: 'Ana García', expiryDate: '2025-03-15', status: 'Próximo a vencer', statusClass: 'proximo-vencer' },
  { name: 'Carlos Ruiz', expiryDate: '2025-01-20', status: 'Vencido', statusClass: 'vencido' },
  { name: 'María López', expiryDate: '2025-06-01', status: 'Activo', statusClass: 'activo' },
  { name: 'Pedro Jiménez', expiryDate: '2025-04-10', status: 'Próximo a vencer', statusClass: 'proximo-vencer' },
  { name: 'Lucía Martínez', expiryDate: '2025-02-28', status: 'Vencido', statusClass: 'vencido' },
]);

const filterStatus = ref('Todos'); // Estado del filtro (puede ser Todos, Activo, Próximo a vencer, Vencido)

const filteredMemberships = computed(() => {
  if (filterStatus.value === 'Todos') {
    return memberships.value;
  } else {
    return memberships.value.filter(membership => membership.status === filterStatus.value);
  }
});

const updateFilter = (newStatus: string) => {
  filterStatus.value = newStatus;
};

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const updateSidebarVisibility = (newValue: boolean) => {
  isSidebarVisible.value = newValue;
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.membership-expiry-dashboard {
  display: flex;
  min-height: 100vh;
}

.membership-expiry-main {
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

.membership-expiry-content {
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

.tarjeta .tarjeta-cabecera {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.tarjeta .tarjeta-titulo {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 600;
  color: #555;
}

.fecha-vencimiento {
  font-weight: 500;
  color: #999;
}

.tarjeta .tarjeta-contenido {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.estado {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
}

.activo {
  border-top: 4px solid #4caf50;
}

.proximo-vencer {
  border-top: 4px solid #ff9800;
}

.vencido {
  border-top: 4px solid #f44336;
}

.membership-filters {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
