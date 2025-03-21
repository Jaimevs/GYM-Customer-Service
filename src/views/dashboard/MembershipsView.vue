<template>
  <v-container fluid class="membership-management-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Gestión de Membresías</h1>
    <p class="text-subtitle-1">Administra los planes de membresía, clientes y estadísticas relacionadas.</p>

    <!-- Contenido principal -->
    <v-row>
      <!-- Listado de Membresías -->
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Membresías</v-card-title>
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
                <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
              </v-col>
            </v-row>

            <!-- Tabla de Membresías -->
            <v-data-table :headers="cabecerasMembresias" :items="membresiasFiltradas" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="editarMembresia(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarMembresia(item)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Creación/Edición de Membresías -->
    <v-dialog v-model="mostrarFormulario" max-width="600px">
      <v-card>
        <v-card-title>{{ modoEdicion ? 'Editar Membresía' : 'Crear Membresía' }}</v-card-title>
        <v-card-text>
          <v-form ref="formularioMembresia" @submit.prevent="guardarMembresia">
            <v-text-field v-model="membresia.nombre" label="Nombre de la Membresía" required></v-text-field>
            <v-select v-model="membresia.duracion" :items="duracionMembresia" label="Duración" required></v-select>
            <v-text-field v-model="membresia.precio" label="Precio" type="number" prefix="$" required></v-text-field>
            <v-textarea v-model="membresia.beneficios" label="Beneficios"></v-textarea>
            <v-select v-model="membresia.tipo" :items="tiposMembresia" label="Tipo de Membresía" required></v-select>
            <v-checkbox v-model="membresia.autoRenovacion" label="Auto-renovación Habilitada"></v-checkbox>
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
            <v-btn type="submit" color="primary">{{ modoEdicion ? 'Actualizar' : 'Guardar' }}</v-btn>
            <v-btn @click="cerrarFormulario" text>Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Gestión de Clientes con Membresía -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Gestión de Clientes con Membresía</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasClientes" :items="clientesConMembresia" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="renovarMembresia(item)">
                  <v-icon small>mdi-refresh</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="cancelarMembresia(item)">
                  <v-icon small>mdi-cancel</v-icon>
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
        <v-card class="pa-4" elevation="2">
          <v-card-title>Membresías Activas vs Inactivas</v-card-title>
          <v-card-text>
            <apexchart type="pie" :options="estadisticasMembresias.options" :series="estadisticasMembresias.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Ingresos Generados por Membresías</v-card-title>
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
import gsap from 'gsap';

// Datos de ejemplo
const membresias = ref([
  { id: 1, nombre: 'Básica Mensual', duracion: '1 mes', precio: 50, tipo: 'Individual', beneficios: 'Acceso a clases grupales', autoRenovacion: false, estado: 'Activa', fechaInicio: '2023-01-01', fechaFin: '2023-01-31' },
  { id: 2, nombre: 'Premium Anual', duracion: '1 año', precio: 500, tipo: 'Familiar', beneficios: 'Acceso ilimitado + entrenamientos personalizados', autoRenovacion: true, estado: 'Activa', fechaInicio: '2023-01-01', fechaFin: '2023-12-31' },
]);

const clientesConMembresia = ref([
  { id: 1, nombre: 'Juan Pérez', telefono: '123456789', correo: 'juan@example.com', tipoMembresia: 'Básica Mensual', fechaVencimiento: '2023-02-01', historialPagos: ['2023-01-01'], renovacionAutomatica: true },
  { id: 2, nombre: 'María López', telefono: '987654321', correo: 'maria@example.com', tipoMembresia: 'Premium Anual', fechaVencimiento: '2023-12-31', historialPagos: ['2023-01-01'], renovacionAutomatica: false },
]);

const tiposMembresia = ['Individual', 'Familiar', 'Corporativa'];
const duracionMembresia = ['1 mes', '3 meses', '6 meses', '1 año'];

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
const filtroTipo = ref('');
const filtroDuracion = ref('');
const filtroEstado = ref('');

// Gráficos ApexCharts
const estadisticasMembresias = ref({
  options: {
    labels: ['Activas', 'Inactivas'],
    colors: ['#4caf50', '#f44336'],
  },
  series: [70, 30],
});

const ingresosMembresias = ref({
  options: {
    chart: { id: 'ingresos-membresias' },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
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
  return membresias.value.filter(
    (m) =>
      (!filtroTipo.value || m.tipo === filtroTipo.value) &&
      (!filtroDuracion.value || m.duracion === filtroDuracion.value) &&
      (!filtroEstado.value || m.estado === filtroEstado.value)
  );
});

// Animaciones GSAP
onMounted(() => {
  gsap.from('.membership-management-content', { opacity: 0, y: 20, duration: 1 });
});
</script>

<style scoped lang="scss">
.membership-management-content {
  padding: 2rem;
}
</style>
