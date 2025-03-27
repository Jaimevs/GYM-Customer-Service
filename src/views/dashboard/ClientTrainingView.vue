<template>
  <v-container fluid class="client-training-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Capacitación al Cliente</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Administra y ofrece recursos de capacitación para los clientes del gimnasio.
    </p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6" data-aos="fade-up">
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="100">
        <v-select v-model="filtroCategoria" :items="categoriasCapacitacion" label="Filtrar por Categoría" clearable
          outlined dense></v-select>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="200">
        <v-text-field v-model="filtroNombre" label="Buscar por Nombre" clearable outlined dense></v-text-field>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-right" data-aos-delay="300">
        <v-select v-model="filtroEstado" :items="['Disponible', 'En Proceso', 'Completado']" label="Filtrar por Estado"
          clearable outlined dense></v-select>
      </v-col>
      <v-col cols="12" md="3" data-aos="fade-left" data-aos-delay="400">
        <v-btn color="primary" @click="aplicarFiltros" class="filter-btn" block>
          <v-icon left>mdi-filter</v-icon>
          Aplicar Filtros
        </v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Capacitación -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-book-education</v-icon>
            </div>
            <h3 class="text-h6">Resumen de Capacitación</h3>
          </div>
          <v-card-text>
            <v-list>
              <v-list-item data-aos="fade-up" data-aos-delay="100">
                <v-list-item-icon>
                  <v-icon color="green">mdi-book-open-page-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Recursos Disponibles</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenCapacitacion.totalRecursos
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="200">
                <v-list-item-icon>
                  <v-icon color="orange">mdi-progress-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">En Proceso</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenCapacitacion.enProceso }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="300">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Completados</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenCapacitacion.completados
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-chart-pie</v-icon>
            </div>
            <h3 class="text-h6">Distribución por Categoría</h3>
          </div>
          <v-card-text>
            <apexchart type="pie" :options="distribucionRecursos.options" :series="distribucionRecursos.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Recursos -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-format-list-bulleted</v-icon>
            </div>
            <h3 class="text-h6">Recursos de Capacitación</h3>
          </div>
          <v-card-text>
            <v-data-table :headers="cabecerasRecursos" :items="recursosFiltrados" :items-per-page="5"
              class="elevation-0 recent-table" data-aos="fade-up">
              <template #item.estado="{ item }">
                <v-chip small :color="getEstadoColor(item.estado)" dark>
                  {{ item.estado }}
                </v-chip>
              </template>
              <template #item.acciones="{ item }">
                <v-btn icon small color="success" @click="completarRecurso(item)" data-aos="zoom-in"
                  data-aos-delay="100">
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
                <v-btn icon small color="info" @click="editarRecurso(item)" data-aos="zoom-in" data-aos-delay="200">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarRecurso(item)" data-aos="zoom-in" data-aos-delay="300">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas y Notificaciones -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-bell</v-icon>
            </div>
            <h3 class="text-h6">Alertas y Notificaciones</h3>
          </div>
          <v-card-text>
            <v-alert v-for="(alerta, index) in alertas" :key="index" :type="alerta.tipo" dense outlined
              :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'" :data-aos-delay="100 * (index + 1)">
              {{ alerta.mensaje }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reportes y Estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="100">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-chart-line</v-icon>
            </div>
            <h3 class="text-h6">Progreso de Capacitación</h3>
          </div>
          <v-card-text>
            <apexchart type="line" :options="progresoCapacitacion.options" :series="progresoCapacitacion.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="fade-left">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in" data-aos-delay="200">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-chart-bar</v-icon>
            </div>
            <h3 class="text-h6">Uso por Sucursal</h3>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="comparacionUsoRecursos.options" :series="comparacionUsoRecursos.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Inicializar AOS
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out-quad',
    once: true,
    offset: 50
  });
});

// Datos de ejemplo
const categoriasCapacitacion = ['Nutrición', 'Entrenamiento', 'Bienestar', 'Tecnología'];
const recursos = ref([
  { id: 1, nombre: 'Guía de Nutrición Básica', categoria: 'Nutrición', estado: 'Disponible', fechaCreacion: '2023-09-01' },
  { id: 2, nombre: 'Rutina de Entrenamiento Avanzada', categoria: 'Entrenamiento', estado: 'En Proceso', fechaCreacion: '2023-09-15' },
  { id: 3, nombre: 'Meditación Guiada para Principiantes', categoria: 'Bienestar', estado: 'Completado', fechaCreacion: '2023-08-20' },
]);

const resumenCapacitacion = ref({
  totalRecursos: 3,
  enProceso: 1,
  completados: 1,
});

const distribucionRecursos = ref({
  options: {
    labels: ['Nutrición', 'Entrenamiento', 'Bienestar', 'Tecnología'],
    colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
    chart: {
      foreColor: 'var(--color-texto-principal)'
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: 'var(--color-texto-principal)'
      }
    }
  },
  series: [1, 1, 1, 0],
});

const cabecerasRecursos = [
  { text: 'Nombre', value: 'nombre', class: 'table-header' },
  { text: 'Categoría', value: 'categoria', class: 'table-header' },
  { text: 'Estado', value: 'estado', class: 'table-header' },
  { text: 'Fecha de Creación', value: 'fechaCreacion', class: 'table-header' },
  { text: 'Acciones', value: 'acciones', class: 'table-header', sortable: false },
];

const progresoCapacitacion = ref({
  options: {
    chart: {
      id: "progreso-capacitacion",
      foreColor: 'var(--color-texto-principal)'
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    colors: ['var(--color-grafica-rojo-fuego)'],
    tooltip: {
      theme: 'dark'
    }
  },
  series: [{ name: 'Recursos Completados', data: [5, 10, 15, 20, 25] }],
});

const comparacionUsoRecursos = ref({
  options: {
    chart: {
      id: "comparacion-uso-recursos",
      foreColor: 'var(--color-texto-principal)'
    },
    xaxis: {
      categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'],
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--color-texto-principal)'
        }
      }
    },
    colors: ['var(--color-grafica-rojo-fuego)'],
    tooltip: {
      theme: 'dark'
    }
  },
  series: [{ name: 'Recursos Usados', data: [50, 30, 20] }],
});

const alertas = ref([
  { mensaje: 'El recurso "Rutina de Entrenamiento Avanzada" está en proceso.', tipo: 'warning' },
  { mensaje: 'El cliente Juan Pérez ha completado la guía de nutrición básica.', tipo: 'info' },
]);

// Estados de filtros
const filtroCategoria = ref('');
const filtroNombre = ref('');
const filtroEstado = ref('');

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroCategoria.value, filtroNombre.value, filtroEstado.value);
};

const completarRecurso = (item) => {
  console.log('Marcar como completado:', item.nombre);
  const index = recursos.value.findIndex((r) => r.id === item.id);
  if (index !== -1) {
    recursos.value[index].estado = 'Completado';
  }
};

const editarRecurso = (item) => {
  console.log('Editar recurso:', item.nombre);
};

const eliminarRecurso = (item) => {
  console.log('Eliminar recurso:', item.nombre);
  const index = recursos.value.findIndex((r) => r.id === item.id);
  if (index !== -1) {
    recursos.value.splice(index, 1);
  }
};

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Disponible': return 'green';
    case 'En Proceso': return 'orange';
    case 'Completado': return 'blue';
    default: return 'gray';
  }
};

// Computadas
const recursosFiltrados = computed(() => {
  return recursos.value.filter(
    (r) =>
      (!filtroCategoria.value || r.categoria === filtroCategoria.value) &&
      (!filtroNombre.value || r.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase())) &&
      (!filtroEstado.value || r.estado === filtroEstado.value)
  );
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.client-training-content {
  padding: 2rem;
}

.dashboard-title {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;

  .title-text {
    position: relative;
    z-index: 2;
    font-size: 2.25rem;
    font-weight: 700;
    background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-family: var(--fuente-titulo);
  }

  .title-highlight {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    height: 12px;
    background: rgba(255, 69, 0, 0.2);
    border-radius: 4px;
    z-index: 1;
    transform: rotate(-1deg);
  }
}

.text-subtitle-1 {
  color: var(--color-texto);
  font-family: var(--fuente-principal);
  margin-bottom: 24px;
}

.filter-btn {
  height: 40px;
}

.chart-card {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #E0E0E0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .chart-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 8px;

    h3 {
      margin: 0;
      color: #333333;
      font-weight: 600;
      font-family: var(--fuente-titulo);
    }

    .chart-icon-bg {
      width: 40px;
      height: 40px;
      background: rgba(255, 43, 0, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: var(--color-grafica-rojo-fuego);
    }
  }
}

.summary-title {
  font-weight: 600;
  font-family: var(--fuente-titulo);
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-texto-principal);
}

.recent-table {
  th {
    background-color: #F5F5F5 !important;
    color: #333333 !important;
    font-family: var(--fuente-titulo);
  }

  td {
    background-color: #FFFFFF !important;
    color: #333333 !important;
    font-family: var(--fuente-principal);
  }
}

@media (max-width: 960px) {
  .dashboard-title {
    .title-text {
      font-size: 1.75rem;
    }

    .title-highlight {
      height: 8px;
      bottom: 3px;
    }
  }

  .chart-card {
    .chart-header {
      flex-direction: column;
      align-items: flex-start;

      .chart-icon-bg {
        margin-bottom: 8px;
        margin-right: 0;
      }
    }
  }
}
</style>
