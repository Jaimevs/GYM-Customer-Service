<template>
  <v-container fluid class="support-resolution-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Atención y Resolución</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Gestiona quejas y sugerencias de los clientes.
    </p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6" data-aos="fade-up">
      <v-col cols="12" md="4" data-aos="fade-right" data-aos-delay="100">
        <v-select v-model="filtroTipo" :items="tiposSolicitud" label="Filtrar por Tipo" clearable outlined
          dense></v-select>
      </v-col>
      <v-col cols="12" md="4" data-aos="fade-right" data-aos-delay="200">
        <v-text-field v-model="filtroCliente" label="Buscar Cliente" clearable outlined dense></v-text-field>
      </v-col>
      <v-col cols="12" md="4" data-aos="fade-left" data-aos-delay="300">
        <v-btn color="primary" @click="aplicarFiltros" class="filter-btn" block>
          <v-icon left>mdi-filter</v-icon>
          Aplicar Filtros
        </v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Solicitudes -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" data-aos="fade-right">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-headset</v-icon>
            </div>
            <h3 class="text-h6">Resumen</h3>
          </div>
          <v-card-text>
            <v-list>
              <v-list-item data-aos="fade-up" data-aos-delay="100">
                <v-list-item-icon>
                  <v-icon color="blue">mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Quejas Pendientes</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenSolicitudes.totalAbiertas
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="200">
                <v-list-item-icon>
                  <v-icon color="orange">mdi-lightbulb-on</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Sugerencias</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenSolicitudes.sugerencias
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="300">
                <v-list-item-icon>
                  <v-icon color="green">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Resueltas</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumenSolicitudes.resueltas }}</v-list-item-subtitle>
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
            <h3 class="text-h6">Distribución</h3>
          </div>
          <v-card-text>
            <apexchart type="pie" :options="distribucionSolicitudes.options" :series="distribucionSolicitudes.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Solicitudes -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-format-list-bulleted</v-icon>
            </div>
            <h3 class="text-h6">Listado</h3>
          </div>
          <v-card-text>
            <v-data-table :headers="cabecerasSolicitudes" :items="solicitudesFiltradas" :items-per-page="5"
              class="elevation-0 recent-table" data-aos="fade-up">
              <template #item.estado="{ item }">
                <v-chip small :color="getEstadoColor(item.estado)" dark>
                  {{ item.estado }}
                </v-chip>
              </template>
              <template #item.acciones="{ item }">
                <v-btn v-if="item.tipo === 'Queja'" icon small color="primary" @click="responderQueja(item)"
                  data-aos="zoom-in" data-aos-delay="100">
                  <v-icon small>mdi-reply</v-icon>
                </v-btn>
                <v-btn icon small color="success" @click="resolverSolicitud(item)" data-aos="zoom-in"
                  data-aos-delay="200">
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarSolicitud(item)" data-aos="zoom-in"
                  data-aos-delay="300">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogo para responder quejas -->
    <v-dialog v-model="dialogoResponder" max-width="600">
      <v-card>
        <v-card-title>Responder Queja</v-card-title>
        <v-card-text>
          <v-textarea v-model="respuestaQueja" label="Respuesta" outlined rows="3"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogoResponder = false">Cancelar</v-btn>
          <v-btn color="primary" @click="enviarRespuesta">Enviar Respuesta</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const tiposSolicitud = ['Queja', 'Sugerencia'];
const solicitudes = ref([
  {
    id: 1,
    cliente: 'Juan Pérez',
    tipo: 'Queja',
    estado: 'Pendiente',
    fecha: '2023-10-01',
    descripcion: 'El equipo de pesas estaba sucio',
    respuesta: ''
  },
  {
    id: 2,
    cliente: 'María López',
    tipo: 'Sugerencia',
    estado: 'Revisada',
    fecha: '2023-10-02',
    descripcion: 'Sugiero más clases de yoga por la mañana',
    respuesta: ''
  },
]);

const resumenSolicitudes = ref({
  totalAbiertas: 1,
  sugerencias: 1,
  resueltas: 0,
});

const distribucionSolicitudes = ref({
  options: {
    labels: ['Quejas', 'Sugerencias'],
    colors: ['#ff5252', '#2196f3'],
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
  series: [1, 1],
});

const cabecerasSolicitudes = [
  { text: 'Cliente', value: 'cliente', class: 'table-header' },
  { text: 'Tipo', value: 'tipo', class: 'table-header' },
  { text: 'Descripción', value: 'descripcion', class: 'table-header' },
  { text: 'Estado', value: 'estado', class: 'table-header' },
  { text: 'Fecha', value: 'fecha', class: 'table-header' },
  { text: 'Acciones', value: 'acciones', class: 'table-header', sortable: false },
];

// Estados
const filtroTipo = ref('');
const filtroCliente = ref('');
const dialogoResponder = ref(false);
const respuestaQueja = ref('');
const quejaSeleccionada = ref(null);

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroTipo.value, filtroCliente.value);
};

const responderQueja = (item) => {
  quejaSeleccionada.value = item;
  dialogoResponder.value = true;
};

const enviarRespuesta = () => {
  const index = solicitudes.value.findIndex(s => s.id === quejaSeleccionada.value.id);
  if (index !== -1) {
    solicitudes.value[index].respuesta = respuestaQueja.value;
    solicitudes.value[index].estado = 'Respondida';
    respuestaQueja.value = '';
    dialogoResponder.value = false;
  }
};

const resolverSolicitud = (item) => {
  const index = solicitudes.value.findIndex(s => s.id === item.id);
  if (index !== -1) {
    solicitudes.value[index].estado = 'Resuelta';
  }
};

const eliminarSolicitud = (item) => {
  const index = solicitudes.value.findIndex(s => s.id === item.id);
  if (index !== -1) {
    solicitudes.value.splice(index, 1);
  }
};

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Pendiente': return 'orange';
    case 'Respondida': return 'blue';
    case 'Resuelta': return 'green';
    case 'Revisada': return 'purple';
    default: return 'gray';
  }
};

// Computadas
const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter(
    (s) =>
      (!filtroTipo.value || s.tipo === filtroTipo.value) &&
      (!filtroCliente.value || s.cliente.toLowerCase().includes(filtroCliente.value.toLowerCase()))
  );
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.support-resolution-content {
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
