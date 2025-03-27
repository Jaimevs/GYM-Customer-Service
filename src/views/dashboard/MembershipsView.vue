<template>
  <v-container fluid class="membership-management-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title">
      <span class="title-text">Gestión de Membresías</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1">Administra los planes de membresía, clientes y estadísticas relacionadas.</p>

    <!-- Contenido principal -->
    <v-row>
      <!-- Listado de Membresías -->
      <v-col cols="12">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:medal-ribbon-outline" width="24" />
            </div>
            <h3 class="text-h6">Listado de Membresías</h3>
          </div>
          <v-card-text>
            <!-- Filtros -->
            <v-row class="mb-4">
              <v-col cols="12" sm="3">
                <v-select v-model="filtroTipo" :items="tiposMembresia" label="Filtrar por Tipo" clearable></v-select>
              </v-col>
              <v-col cols="12" sm="3">
                <v-select v-model="filtroDuracion" :items="duracionMembresia" label="Filtrar por Duración"
                  clearable></v-select>
              </v-col>
              <v-col cols="12" sm="3">
                <v-select v-model="filtroEstado" :items="['Activa', 'Inactiva']" label="Filtrar por Estado"
                  clearable></v-select>
              </v-col>
              <v-col cols="12" sm="3">
                <v-btn color="primary" class="filter-btn" @click="aplicarFiltros">Aplicar Filtros</v-btn>
              </v-col>
            </v-row>

            <!-- Tabla de Membresías -->
            <v-data-table :headers="cabecerasMembresias" :items="membresiasFiltradas" :items-per-page="5"
              class="elevation-0 recent-table">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="editarMembresia(item)">
                  <Icon icon="mdi:pencil" width="18" />
                </v-btn>
                <v-btn icon small color="error" @click="eliminarMembresia(item)">
                  <Icon icon="mdi:delete" width="18" />
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Creación/Edición de Membresías -->
    <v-dialog v-model="mostrarFormulario" max-width="600px">
      <v-card class="form-card">
        <v-card-title class="form-title">{{ modoEdicion ? 'Editar Membresía' : 'Crear Membresía' }}</v-card-title>
        <v-card-text>
          <v-form ref="formularioMembresia" @submit.prevent="guardarMembresia">
            <v-text-field v-model="membresia.nombre" label="Nombre de la Membresía" required></v-text-field>
            <v-select v-model="membresia.duracion" :items="duracionMembresia" label="Duración" required></v-select>
            <v-text-field v-model="membresia.precio" label="Precio" type="number" prefix="$" required></v-text-field>
            <v-textarea v-model="membresia.beneficios" label="Beneficios"></v-textarea>
            <v-select v-model="membresia.tipo" :items="tiposMembresia" label="Tipo de Membresía" required></v-select>
            <v-checkbox v-model="membresia.autoRenovacion" label="Auto-renovación Habilitada"
              color="primary"></v-checkbox>
            <v-menu v-model="menuFechaInicio" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="membresia.fechaInicio" label="Fecha de Inicio" prepend-icon="mdi-calendar"
                  readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="membresia.fechaInicio" no-title @input="menuFechaInicio = false"></v-date-picker>
            </v-menu>
            <v-menu v-model="menuFechaFin" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="membresia.fechaFin" label="Fecha de Fin" prepend-icon="mdi-calendar" readonly
                  v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="membresia.fechaFin" no-title @input="menuFechaFin = false"></v-date-picker>
            </v-menu>
            <div class="form-actions">
              <v-btn type="submit" color="primary" class="action-btn">{{ modoEdicion ? 'Actualizar' : 'Guardar'
              }}</v-btn>
              <v-btn @click="cerrarFormulario" text class="cancel-btn">Cancelar</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Gestión de Clientes con Membresía -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="recent-activity-card" elevation="4">
          <div class="card-header">
            <div class="header-icon">
              <Icon icon="solar:users-group-two-rounded-outline" width="24" />
            </div>
            <h3 class="text-h6">Gestión de Clientes con Membresía</h3>
          </div>
          <v-card-text>
            <v-data-table :headers="cabecerasClientes" :items="clientesConMembresia" :items-per-page="5"
              class="elevation-0 recent-table">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="renovarMembresia(item)">
                  <Icon icon="mdi:refresh" width="18" />
                </v-btn>
                <v-btn icon small color="error" @click="cancelarMembresia(item)">
                  <Icon icon="mdi:cancel" width="18" />
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estadísticas y Reportes -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:pie-chart-outline" width="24" />
            </div>
            <h3 class="text-h6">Membresías Activas vs Inactivas</h3>
          </div>
          <v-card-text>
            <apexchart type="pie" :options="estadisticasMembresias.options" :series="estadisticasMembresias.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:chart-outline" width="24" />
            </div>
            <h3 class="text-h6">Ingresos Generados por Membresías</h3>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="ingresosMembresias.options" :series="ingresosMembresias.series"
              height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';

// Datos de ejemplo
const membresias = ref([
  { id: 1, nombre: 'Básica Mensual', duracion: '1 mes', precio: 50, tipo: 'Básica', beneficios: 'Acceso a clases grupales', autoRenovacion: false, estado: 'Activa', fechaInicio: '2023-01-01', fechaFin: '2023-01-31' },
  { id: 2, nombre: 'Premium Anual', duracion: '1 año', precio: 500, tipo: 'Premium', beneficios: 'Acceso ilimitado + entrenamientos personalizados', autoRenovacion: true, estado: 'Activa', fechaInicio: '2023-01-01', fechaFin: '2023-12-31' },
]);

const clientesConMembresia = ref([
  { id: 1, nombre: 'Juan Pérez', telefono: '123456789', correo: 'juan@example.com', tipoMembresia: 'Básica Mensual', fechaVencimiento: '2023-02-01', historialPagos: ['2023-01-01'], renovacionAutomatica: true },
  { id: 2, nombre: 'María López', telefono: '987654321', correo: 'maria@example.com', tipoMembresia: 'Premium Anual', fechaVencimiento: '2023-12-31', historialPagos: ['2023-01-01'], renovacionAutomatica: false },
]);

const tiposMembresia = ['Básica', 'Estándar', 'Premium'];
const duracionMembresia = ['1 mes', '3 meses', '6 meses', '1 año'];

// Cabeceras de tablas
const cabecerasMembresias = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Duración', key: 'duracion' },
  { title: 'Precio', key: 'precio' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'acciones' }
];

const cabecerasClientes = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Correo', key: 'correo' },
  { title: 'Membresía', key: 'tipoMembresia' },
  { title: 'Vencimiento', key: 'fechaVencimiento' },
  { title: 'Acciones', key: 'acciones' }
];

// Estados del formulario
const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const membresia = ref({
  id: null,
  nombre: '',
  duracion: '',
  precio: 0,
  beneficios: '',
  tipo: '',
  autoRenovacion: false,
  estado: 'Activa',
  fechaInicio: '',
  fechaFin: '',
});
const menuFechaInicio = ref(false);
const menuFechaFin = ref(false);
const filtroTipo = ref('');
const filtroDuracion = ref('');
const filtroEstado = ref('');

// Gráficos ApexCharts
const estadisticasMembresias = ref({
  options: {
    chart: {
      foreColor: '#333',
    },
    labels: ['Activas', 'Inactivas'],
    colors: ['#FF2B00', '#FFD700'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  },
  series: [70, 30],
});

const ingresosMembresias = ref({
  options: {
    chart: {
      id: 'ingresos-membresias',
      foreColor: '#333',
    },
    colors: ['#FF2B00'],
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      labels: { style: { colors: '#333' } }
    },
    yaxis: {
      labels: { style: { colors: '#333' } }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false
      }
    }
  },
  series: [{ name: 'Ingresos', data: [500, 300, 400, 600, 700, 800] }],
});

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroTipo.value, filtroDuracion.value, filtroEstado.value);
};

const editarMembresia = (item) => {
  modoEdicion.value = true;
  membresia.value = { ...item };
  mostrarFormulario.value = true;
};

const eliminarMembresia = (item) => {
  const index = membresias.value.findIndex((m) => m.id === item.id);
  if (index !== -1) membresias.value.splice(index, 1);
};

const guardarMembresia = () => {
  if (modoEdicion.value) {
    const index = membresias.value.findIndex((m) => m.id === membresia.value.id);
    if (index !== -1) membresias.value[index] = { ...membresia.value };
  } else {
    membresia.value.id = Date.now();
    membresias.value.push({ ...membresia.value });
  }
  cerrarFormulario();
};

const cerrarFormulario = () => {
  membresia.value = {
    id: null,
    nombre: '',
    duracion: '',
    precio: 0,
    beneficios: '',
    tipo: '',
    autoRenovacion: false,
    estado: 'Activa',
    fechaInicio: '',
    fechaFin: '',
  };
  modoEdicion.value = false;
  mostrarFormulario.value = false;
};

const renovarMembresia = (cliente) => {
  console.log('Renovando membresía de:', cliente.nombre);
};

const cancelarMembresia = (cliente) => {
  console.log('Cancelando membresía de:', cliente.nombre);
};

// Computadas
const membresiasFiltradas = computed(() => {
  return membresias.value.filter((m) => {
    return (
      (!filtroTipo.value || m.tipo === filtroTipo.value) &&
      (!filtroDuracion.value || m.duracion === filtroDuracion.value) &&
      (!filtroEstado.value || m.estado === filtroEstado.value)
    );
  });
});

// Animaciones GSAP
onMounted(() => {
  gsap.from('.membership-management-content', { opacity: 0, y: 20, duration: 1 });
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.membership-management-content {
  padding: 24px;
  background-color: #FFFFFF;
  color: #333333;
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

/* Estilos para tarjetas */
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

/* Estilos para formularios */
.form-card {
  border-radius: 16px;
  padding: 16px;
  background-color: #FFFFFF;

  .form-title {
    color: #333333;
    font-family: var(--fuente-titulo);
    padding-bottom: 16px;
    border-bottom: 1px solid #E0E0E0;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    gap: 12px;
  }
}

/* Estilos para botones */
.filter-btn,
.action-btn {
  background-color: var(--color-grafica-rojo-fuego) !important;
  color: white !important;
  text-transform: none;
  letter-spacing: normal;
  font-family: var(--fuente-principal);
  font-weight: 500;

  &:hover {
    background-color: var(--color-rojo-granate) !important;
  }
}

.cancel-btn {
  color: #666666 !important;
  font-family: var(--fuente-principal);
}

/* Estilos para tablas */
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

/* Estilos para tarjetas de actividad */
.recent-activity-card {
  background-color: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #E0E0E0;

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #F5F5F5;

    h3 {
      margin: 0;
      color: #333333;
      font-weight: 600;
      font-family: var(--fuente-titulo);
    }

    .header-icon {
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

/* Responsive */
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
}
</style>
