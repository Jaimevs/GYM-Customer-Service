<template>
  <v-container fluid class="service-management-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Gestión de Servicios</h1>
    <p class="text-subtitle-1">Visualiza, administra y realiza seguimientos a los servicios que ofrece el gimnasio.</p>

    <!-- Contenido principal -->
    <v-row>
      <!-- Estado de los Servicios -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Estado de los Servicios</v-card-title>
          <v-card-text>
            <apexchart type="donut" :options="estadoServicios.options" :series="estadoServicios.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Listado de Servicios -->
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Listado de Servicios</v-card-title>
          <v-card-text>
            <!-- Filtros -->
            <v-row class="mb-4">
              <v-col cols="12" sm="4">
                <v-select v-model="filtroCategoria" :items="categorias" label="Filtrar por Categoría"
                  clearable></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="filtroPrecio" label="Filtrar por Precio Máximo" type="number"
                  clearable></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn color="primary" @click="aplicarFiltros">Aplicar Filtros</v-btn>
              </v-col>
            </v-row>

            <!-- Tabla de Servicios -->
            <v-data-table :headers="cabecerasServicios" :items="serviciosFiltrados" :items-per-page="5"
              class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="editarServicio(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="eliminarServicio(item)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Creación/Edición de Servicios -->
    <v-dialog v-model="mostrarFormulario" max-width="600px">
      <v-card>
        <v-card-title>{{ modoEdicion ? 'Editar Servicio' : 'Crear Servicio' }}</v-card-title>
        <v-card-text>
          <v-form ref="formularioServicio" @submit.prevent="guardarServicio">
            <v-text-field v-model="servicio.nombre" label="Nombre" required></v-text-field>
            <v-textarea v-model="servicio.descripcion" label="Descripción"></v-textarea>
            <v-select v-model="servicio.categoria" :items="categorias" label="Categoría" required></v-select>
            <v-text-field v-model="servicio.duracion" label="Duración (minutos)" type="number" required></v-text-field>
            <v-text-field v-model="servicio.precio" label="Precio" type="number" prefix="$" required></v-text-field>
            <v-file-input v-model="servicio.imagen" label="Imagen Promocional"></v-file-input>
            <v-switch v-model="servicio.activo" label="Activo"></v-switch>
            <v-text-field v-model="servicio.capacidadMaxima" label="Capacidad Máxima por Sesión"
              type="number"></v-text-field>
            <v-checkbox v-model="servicio.incluidoEnMembresia" label="Incluido en Membresía"></v-checkbox>
            <v-btn type="submit" color="primary">{{ modoEdicion ? 'Actualizar' : 'Guardar' }}</v-btn>
            <v-btn @click="cerrarFormulario" text>Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Estadísticas de Popularidad -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Popularidad de Servicios</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="popularidadServicios.options" :series="popularidadServicios.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Retroalimentación de Clientes -->
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Retroalimentación de Clientes</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(comentario, index) in comentarios" :key="index">
                <v-list-item-avatar>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ comentario.cliente }}</v-list-item-title>
                  <v-list-item-subtitle>{{ comentario.comentario }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-rating v-model="comentario.valoracion" readonly></v-rating>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Promociones y Descuentos -->
    <v-dialog v-model="mostrarPromocionFormulario" max-width="600px">
      <v-card>
        <v-card-title>{{ modoEdicionPromocion ? 'Editar Promoción' : 'Crear Promoción' }}</v-card-title>
        <v-card-text>
          <v-form ref="formularioPromocion" @submit.prevent="guardarPromocion">
            <v-text-field v-model="promocion.nombre" label="Nombre de la Promoción" required></v-text-field>
            <v-text-field v-model="promocion.descuento" label="Descuento (%)" type="number" required></v-text-field>
            <v-menu v-model="menuFechaVigencia" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="promocion.vigencia" label="Fecha de Vigencia" prepend-icon="mdi-calendar"
                  readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="promocion.vigencia" no-title @input="menuFechaVigencia = false"></v-date-picker>
            </v-menu>
            <v-btn type="submit" color="success">{{ modoEdicionPromocion ? 'Actualizar' : 'Guardar' }}</v-btn>
            <v-btn @click="cerrarFormularioPromocion" text>Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Promociones y Descuentos</v-card-title>
          <v-card-text>
            <v-btn color="success" @click="mostrarFormularioPromocion = true">Crear Promoción</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { gsap } from 'gsap';

// Datos de ejemplo
const servicios = ref([
  { id: 1, nombre: 'Clase de Yoga', descripcion: 'Sesión de yoga matutino.', categoria: 'Clases', duracion: 60, precio: 15, activo: true, capacidadMaxima: 20, incluidoEnMembresia: false },
  { id: 2, nombre: 'Entrenamiento Personalizado', descripcion: 'Entrenamiento personalizado con instructor.', categoria: 'Entrenamiento', duracion: 90, precio: 50, activo: true, capacidadMaxima: 10, incluidoEnMembresia: true },
]);

const categorias = ['Clases', 'Entrenamiento', 'Spa'];
const comentarios = [
  { cliente: 'Juan Pérez', comentario: 'Excelente clase de yoga.', valoracion: 5 },
  { cliente: 'María López', comentario: 'El entrenador fue muy profesional.', valoracion: 4 },
];

// Estados del formulario
const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const servicio = ref({
  id: null,
  nombre: '',
  descripcion: '',
  categoria: '',
  duracion: 0,
  precio: 0,
  activo: true,
  capacidadMaxima: 0,
  incluidoEnMembresia: false,
});
const filtroCategoria = ref('');
const filtroPrecio = ref('');

// Gráficos ApexCharts
const estadoServicios = ref({
  options: {
    labels: ['Activos', 'Inactivos'],
    colors: ['#4caf50', '#f44336'],
  },
  series: [80, 20],
});

const popularidadServicios = ref({
  options: {
    chart: { id: 'popularidad-servicios' },
    xaxis: { categories: ['Yoga', 'Entrenamiento', 'Spa'] },
  },
  series: [{ name: 'Reservas', data: [120, 80, 50] }],
});

// Métodos
const aplicarFiltros = () => {
  console.log('Filtros aplicados:', filtroCategoria.value, filtroPrecio.value);
};

const editarServicio = (item) => {
  modoEdicion.value = true;
  servicio.value = { ...item };
  mostrarFormulario.value = true;
};

const eliminarServicio = (item) => {
  const index = servicios.value.findIndex((s) => s.id === item.id);
  if (index !== -1) servicios.value.splice(index, 1);
};

const guardarServicio = () => {
  if (modoEdicion.value) {
    const index = servicios.value.findIndex((s) => s.id === servicio.value.id);
    if (index !== -1) servicios.value[index] = { ...servicio.value };
  } else {
    servicio.value.id = Date.now();
    servicios.value.push({ ...servicio.value });
  }
  cerrarFormulario();
};

const cerrarFormulario = () => {
  servicio.value = { id: null, nombre: '', descripcion: '', categoria: '', duracion: 0, precio: 0, activo: true, capacidadMaxima: 0, incluidoEnMembresia: false };
  modoEdicion.value = false;
  mostrarFormulario.value = false;
};

// Promociones
const mostrarPromocionFormulario = ref(false);
const modoEdicionPromocion = ref(false);
const promocion = ref({
  id: null,
  nombre: '',
  descuento: 0,
  vigencia: '',
});
const menuFechaVigencia = ref(false);

const guardarPromocion = () => {
  console.log('Guardar promoción:', promocion.value);
  cerrarFormularioPromocion();
};

const cerrarFormularioPromocion = () => {
  promocion.value = { id: null, nombre: '', descuento: 0, vigencia: '' };
  modoEdicionPromocion.value = false;
  mostrarPromocionFormulario.value = false;
};

// Computadas
const serviciosFiltrados = computed(() => {
  return servicios.value.filter(
    (s) =>
      (!filtroCategoria.value || s.categoria === filtroCategoria.value) &&
      (!filtroPrecio.value || s.precio <= parseFloat(filtroPrecio.value))
  );
});

// Animaciones GSAP
onMounted(() => {
  gsap.from('.service-management-content', { opacity: 0, y: 20, duration: 1 });
});
</script>

<style scoped lang="scss">
.service-management-content {
  padding: 2rem;
}
</style>
