<template>
  <v-container fluid class="service-management-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title">
      <span class="title-text">Gestión de Servicios</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1">Visualiza, administra y realiza seguimientos a los servicios que ofrece el gimnasio.</p>

    <!-- Contenido principal -->
    <v-row>
      <!-- Estado de los Servicios -->
      <v-col cols="12" md="4">
        <v-card class="summary-card card-0" elevation="4">
          <div class="card-icon">
            <Icon icon="solar:pie-chart-outline" width="32" />
          </div>
          <v-card-title class="text-h6 font-weight-medium">Estado de los Servicios</v-card-title>
          <v-card-text>
            <apexchart type="donut" :options="estadoServicios.options" :series="estadoServicios.series" height="300">
            </apexchart>
          </v-card-text>
          <div class="card-decoration"></div>
          <div class="card-wave"></div>
        </v-card>
      </v-col>

      <!-- Listado de Servicios -->
      <v-col cols="12" md="8">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:document-text-outline" width="24" />
            </div>
            <h3 class="text-h6">Listado de Servicios</h3>
          </div>
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
                <v-btn color="primary" class="filter-btn" @click="aplicarFiltros">Aplicar Filtros</v-btn>
              </v-col>
            </v-row>

            <!-- Tabla de Servicios -->
            <v-data-table :headers="cabecerasServicios" :items="serviciosFiltrados" :items-per-page="5"
              class="elevation-0 recent-table">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="editarServicio(item)">
                  <Icon icon="mdi:pencil" width="18" />
                </v-btn>
                <v-btn icon small color="error" @click="eliminarServicio(item)">
                  <Icon icon="mdi:delete" width="18" />
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Creación/Edición de Servicios -->
    <v-dialog v-model="mostrarFormulario" max-width="600px">
      <v-card class="form-card">
        <v-card-title class="form-title">{{ modoEdicion ? 'Editar Servicio' : 'Crear Servicio' }}</v-card-title>
        <v-card-text>
          <v-form ref="formularioServicio" @submit.prevent="guardarServicio">
            <v-text-field v-model="servicio.nombre" label="Nombre" required></v-text-field>
            <v-textarea v-model="servicio.descripcion" label="Descripción"></v-textarea>
            <v-select v-model="servicio.categoria" :items="categorias" label="Categoría" required></v-select>
            <v-text-field v-model="servicio.duracion" label="Duración (minutos)" type="number" required></v-text-field>
            <v-text-field v-model="servicio.precio" label="Precio" type="number" prefix="$" required></v-text-field>
            <v-file-input v-model="servicio.imagen" label="Imagen Promocional"></v-file-input>
            <v-switch v-model="servicio.activo" label="Activo" color="primary"></v-switch>
            <v-text-field v-model="servicio.capacidadMaxima" label="Capacidad Máxima por Sesión"
              type="number"></v-text-field>
            <v-checkbox v-model="servicio.incluidoEnMembresia" label="Incluido en Membresía"
              color="primary"></v-checkbox>
            <div class="form-actions">
              <v-btn type="submit" color="primary" class="action-btn">{{ modoEdicion ? 'Actualizar' : 'Guardar'
                }}</v-btn>
              <v-btn @click="cerrarFormulario" text class="cancel-btn">Cancelar</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Estadísticas de Popularidad -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:chart-outline" width="24" />
            </div>
            <h3 class="text-h6">Popularidad de Servicios</h3>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="popularidadServicios.options" :series="popularidadServicios.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Retroalimentación de Clientes -->
      <v-col cols="12" md="6">
        <v-card class="recent-activity-card" elevation="4">
          <div class="card-header">
            <div class="header-icon">
              <Icon icon="solar:chat-round-like-outline" width="24" />
            </div>
            <h3 class="text-h6">Retroalimentación de Clientes</h3>
          </div>
          <v-card-text>
            <v-list class="alerts-list">
              <v-list-item v-for="(comentario, index) in comentarios" :key="index" :class="`alert-item-${index}`">
                <template v-slot:prepend>
                  <v-avatar :color="alertColors[index % alertColors.length]" size="40" class="alert-avatar">
                    <Icon icon="mdi:account" width="20" />
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ comentario.cliente }}</v-list-item-title>
                <v-list-item-subtitle>{{ comentario.comentario }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-rating v-model="comentario.valoracion" readonly color="amber" dense></v-rating>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Promociones y Descuentos -->
    <v-dialog v-model="mostrarPromocionFormulario" max-width="600px">
      <v-card class="form-card">
        <v-card-title class="form-title">{{ modoEdicionPromocion ? 'Editar Promoción' : 'Crear Promoción'
          }}</v-card-title>
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
            <div class="form-actions">
              <v-btn type="submit" color="primary" class="action-btn">{{ modoEdicionPromocion ? 'Actualizar' : 'Guardar'
                }}</v-btn>
              <v-btn @click="cerrarFormularioPromocion" text class="cancel-btn">Cancelar</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="quick-actions-card" elevation="4">
          <div class="card-header">
            <div class="header-icon">
              <Icon icon="solar:sale-outline" width="24" />
            </div>
            <h3 class="text-h6">Promociones y Descuentos</h3>
          </div>
          <v-card-text class="quick-actions">
            <v-btn color="primary" class="action-btn" @click="mostrarFormularioPromocion = true">
              <v-avatar color="primary" size="36" class="mr-3">
                <Icon icon="solar:sale-outline" width="20" />
              </v-avatar>
              <div class="btn-content">
                <div class="btn-label">Crear Promoción</div>
                <div class="btn-hint">Acceso directo</div>
              </div>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
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

const alertColors = ['#FF2B00', '#FFD700', '#8B0000'];

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

// Cabeceras de la tabla
const cabecerasServicios = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Categoría', key: 'categoria' },
  { title: 'Duración (min)', key: 'duracion' },
  { title: 'Precio', key: 'precio' },
  { title: 'Acciones', key: 'acciones' }
];

// Gráficos ApexCharts
const estadoServicios = ref({
  options: {
    chart: {
      foreColor: '#333',
    },
    labels: ['Activos', 'Inactivos'],
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
  series: [80, 20],
});

const popularidadServicios = ref({
  options: {
    chart: {
      id: 'popularidad-servicios',
      foreColor: '#333',
    },
    colors: ['#FF2B00'],
    xaxis: {
      categories: ['Yoga', 'Entrenamiento', 'Spa'],
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
  series: [{ name: 'Reservas', data: [120, 80, 50] }],
});

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
  return servicios.value.filter((s) => {
    return (
      (!filtroCategoria.value || s.categoria === filtroCategoria.value) &&
      (!filtroPrecio.value || s.precio <= parseFloat(filtroPrecio.value))
    );
  });
});

// Animaciones GSAP
onMounted(() => {
  gsap.from('.service-management-content', { opacity: 0, y: 20, duration: 1 });
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.service-management-content {
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
.summary-card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;

    .card-wave {
      transform: translateX(0);
    }
  }

  .card-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.2);
    transition: transform 0.3s;
  }

  .card-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    border-radius: 0 0 0 100%;
    opacity: 0.1;
    transition: opacity 0.3s;
  }

  .card-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-50%);
    transition: transform 1.5s ease-in-out;
    z-index: 1;
  }

  .v-card-title {
    padding: 0;
    margin-bottom: 8px;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
    color: white;
    font-family: var(--fuente-principal);
  }

  .v-card-text {
    padding: 0;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
    color: white;
    font-family: var(--fuente-principal);
  }

  &:hover {
    .card-icon {
      transform: scale(1.1);
    }

    .card-decoration {
      opacity: 0.2;
    }

    .v-card-title {
      letter-spacing: 0.5px;
    }

    .v-card-text {
      transform: scale(1.05);
    }
  }
}

/* Estilos para gráficos */
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

/* Estilos para listas */
.alerts-list {
  .v-list-item {
    padding: 16px;
    border-bottom: 1px solid #F0F0F0;
    transition: all 0.3s;

    &:hover {
      background-color: #F9F9F9 !important;
      transform: translateX(5px);

      .alert-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }

    &:last-child {
      border-bottom: none;
    }

    .v-list-item-title {
      color: #333333;
      font-family: var(--fuente-titulo);
    }

    .v-list-item-subtitle {
      color: #666666;
      font-family: var(--fuente-principal);
    }
  }
}

/* Estilos para tarjetas de acciones rápidas */
.quick-actions-card {
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

  .quick-actions {
    padding: 16px;

    .action-btn {
      height: auto;
      padding: 16px;
      border-radius: 12px;
      text-transform: none;
      letter-spacing: normal;
      display: flex;
      align-items: center;
      transition: all 0.3s;
      background-color: var(--color-grafica-rojo-fuego) !important;
      color: white !important;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
        background-color: var(--color-rojo-granate) !important;
      }

      .btn-content {
        text-align: left;

        .btn-label {
          font-weight: 500;
          font-size: 1rem;
          color: white;
          font-family: var(--fuente-titulo);
        }

        .btn-hint {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.8);
          font-family: var(--fuente-principal);
        }
      }
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
