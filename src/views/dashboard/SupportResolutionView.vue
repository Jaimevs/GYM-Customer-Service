<template>
  <v-container fluid class="support-resolution-content">
    <!-- Título y descripción -->
    <h1 class="dashboard-title" data-aos="fade-down">
      <span class="title-text">Atención y Resolución</span>
      <span class="title-highlight"></span>
    </h1>
    <p class="text-subtitle-1" data-aos="fade-down" data-aos-delay="100">
      Gestiona opiniones y sugerencias de los clientes.
    </p>

    <!-- Filtros de Búsqueda -->
    <v-row class="mb-6" data-aos="fade-up">
      <v-col cols="12" md="4" data-aos="fade-right" data-aos-delay="100">
        <v-select v-model="filtroTipo" :items="tiposOpinion" label="Filtrar por Tipo" clearable outlined
          dense></v-select>
      </v-col>
      <v-col cols="12" md="4" data-aos="fade-right" data-aos-delay="200">
        <v-checkbox v-model="soloSinResponder" label="Solo opiniones sin responder" color="primary"></v-checkbox>
      </v-col>
      <v-col cols="12" md="4" data-aos="fade-left" data-aos-delay="300">
        <v-btn color="primary" @click="cargarOpiniones" class="filter-btn" block :loading="cargando">
          <v-icon left>mdi-filter</v-icon>
          Aplicar Filtros
        </v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Opiniones -->
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
                  <v-list-item-title class="summary-title">Opiniones Pendientes</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumen.totalPendientes }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="200">
                <v-list-item-icon>
                  <v-icon color="green">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Opiniones Respondidas</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumen.totalRespondidas }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item data-aos="fade-up" data-aos-delay="300">
                <v-list-item-icon>
                  <v-icon color="purple">mdi-database</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="summary-title">Total</v-list-item-title>
                  <v-list-item-subtitle class="summary-value">{{ resumen.totalPendientes + resumen.totalRespondidas
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
            <h3 class="text-h6">Distribución por Tipo</h3>
          </div>
          <v-card-text>
            <apexchart v-if="hayDatosGrafica" type="pie" :options="opcionesGrafica" :series="seriesGrafica"
              height="300"></apexchart>
            <div v-else class="text-center py-8">
              <v-icon large color="grey lighten-1">mdi-chart-pie</v-icon>
              <p class="mt-2 text-body-1 grey--text">No hay datos disponibles</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Opiniones -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="chart-card" elevation="4" data-aos="zoom-in">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <v-icon color="var(--color-grafica-rojo-fuego)">mdi-format-list-bulleted</v-icon>
            </div>
            <h3 class="text-h6">Listado de Opiniones</h3>
          </div>
          <v-card-text>
            <div v-if="cargando" class="text-center py-6">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <p class="mt-3">Cargando opiniones...</p>
            </div>
            <div v-else-if="opiniones.length === 0" class="text-center py-8">
              <v-icon x-large color="grey lighten-1">mdi-message-bulleted-off</v-icon>
              <p class="mt-3 text-h6 grey--text text--darken-1">No se encontraron opiniones</p>
              <v-btn color="primary" class="mt-3" @click="cargarOpiniones">Actualizar</v-btn>
            </div>
            <v-data-table v-else :headers="cabecerasOpiniones" :items="opiniones" :items-per-page="5"
              class="elevation-0 recent-table" data-aos="fade-up" show-index>
              <template #item.index="{ index }">
                {{ index + 1 }}
              </template>
              <template #item.Estatus="{ item }">
                <v-chip small :color="item.Estatus ? 'success' : 'warning'" dark>
                  {{ item.Estatus ? 'Respondida' : 'Pendiente' }}
                </v-chip>
              </template>
              <template #item.Fecha_Registro="{ item }">
                {{ formatearFecha(item.Fecha_Registro) }}
              </template>
              <template #item.acciones="{ item }">
                <v-btn v-if="!item.Estatus" icon small color="primary" @click="responderOpinion(item)"
                  data-aos="zoom-in" data-aos-delay="100" title="Responder">
                  <v-icon small>mdi-reply</v-icon>
                </v-btn>
                <v-btn icon small color="info" @click="verDetalles(item)" data-aos="zoom-in" data-aos-delay="200"
                  title="Ver detalles">
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="confirmarEliminar(item)" data-aos="zoom-in" data-aos-delay="300"
                  title="Eliminar">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogo para responder opiniones -->
    <v-dialog v-model="dialogoResponder" max-width="600">
      <v-card>
        <v-card-title class="text-h5 primary--text">Responder Opinión</v-card-title>
        <v-card-subtitle v-if="opinionSeleccionada">
          <v-chip class="mr-2" small :color="getTipoColor(opinionSeleccionada.Tipo)" dark>
            {{ opinionSeleccionada.Tipo }}
          </v-chip>
          {{ formatearFecha(opinionSeleccionada.Fecha_Registro) }}
        </v-card-subtitle>
        <v-card-text>
          <div v-if="opinionSeleccionada" class="mb-4 opinion-detalle">
            <p class="text-body-1 font-weight-medium">{{ opinionSeleccionada.Descripcion }}</p>
          </div>
          <v-textarea v-model="respuestaOpinion" label="Tu respuesta" outlined rows="4" counter
            :rules="[v => !!v || 'La respuesta es requerida', v => v.length <= 500 || 'Máximo 500 caracteres']"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="dialogoResponder = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="enviandoRespuesta" @click="enviarRespuesta"
            :disabled="!respuestaOpinion || enviandoRespuesta">
            Enviar Respuesta
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para ver detalles de opinión -->
    <v-dialog v-model="viewDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 primary--text">
          Detalles de la Opinión
          <v-spacer></v-spacer>
          <v-btn icon @click="viewDialog = false">
            <Icon icon="solar:close-circle-bold" width="24" />
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <div v-if="currentOpinionDetails">
            <!-- Encabezado -->
            <div class="d-flex align-center mb-4">
              <v-avatar :color="getOpinionTypeColor(currentOpinionDetails.Tipo)" size="36" class="mr-3">
                <Icon :icon="getOpinionTypeIcon(currentOpinionDetails.Tipo)" width="20"
                  :class="getOpinionTypeTextColor(currentOpinionDetails.Tipo)" />
              </v-avatar>

              <div>
                <div class="d-flex align-center">
                  <span class="text-h6 font-weight-bold">{{ currentOpinionDetails.Tipo }}</span>
                  <v-chip size="small" :color="getOpinionStatusColor(currentOpinionDetails.Estatus)" label class="ml-2">
                    {{ currentOpinionDetails.Estatus ? 'Respondida' : 'Pendiente' }}
                  </v-chip>
                </div>
                <span class="text-caption text-medium-emphasis">
                  {{ formatDate(currentOpinionDetails.Fecha_Registro) }}
                </span>
              </div>
            </div>

            <!-- Contenido de la opinión -->
            <div class="mb-4">
              <p class="text-subtitle-2 font-weight-bold mb-1">Tu opinión:</p>
              <div class="pa-3 rounded-lg" style="background-color: rgba(0,0,0,0.03);">
                <p class="text-body-1">{{ currentOpinionDetails.Descripcion }}</p>
              </div>
            </div>

            <!-- Respuesta (si existe) -->
            <div v-if="currentOpinionDetails.Estatus && currentOpinionDetails.Respuesta">
              <p class="text-subtitle-2 font-weight-bold mb-1">Respuesta:</p>
              <div class="pa-3 response-section">
                <p class="text-body-1">{{ currentOpinionDetails.Respuesta }}</p>
                <p v-if="currentOpinionDetails.Fecha_Actualizacion" class="text-caption text-medium-emphasis mt-2">
                  Respondido el: {{ formatDate(currentOpinionDetails.Fecha_Actualizacion) }}
                </p>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="viewDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogoEliminar" max-width="500">
      <v-card>
        <v-card-title class="text-h5 error--text">¿Eliminar esta opinión?</v-card-title>
        <v-card-text>
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta opinión?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="dialogoEliminar = false">Cancelar</v-btn>
          <v-btn color="error" :loading="eliminando" @click="eliminarOpinion">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import OpinionAdminService, { OpinionCliente, OpinionResumen } from '@/services/OpinionAdminService';

// Inicializar AOS
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out-quad',
    once: true,
    offset: 50
  });

  // Cargar datos iniciales
  cargarDatos();
});

// Variables reactivas
const opiniones = ref<OpinionCliente[]>([]);
const cargando = ref(false);
const resumen = ref<OpinionResumen>({
  totalPendientes: 0,
  totalRespondidas: 0,
  porTipo: {}
});

// Filtros
const filtroTipo = ref('');
const soloSinResponder = ref(false);
const tiposOpinion = ['Queja', 'Sugerencia', 'Felicitacion', 'Recomendacion', 'Otro'];

// Diálogos
const dialogoResponder = ref(false);
const dialogoDetalles = ref(false);
const dialogoEliminar = ref(false);
const opinionSeleccionada = ref<OpinionCliente | null>(null);
const respuestaOpinion = ref('');
const enviandoRespuesta = ref(false);
const eliminando = ref(false);

// Configuración de la tabla
const cabecerasOpiniones = [
  { text: '#', value: 'index', class: 'table-header', width: '50px' },
  { text: 'Tipo', value: 'Tipo', class: 'table-header', width: '120px' },
  { text: 'Descripción', value: 'Descripcion', class: 'table-header' },
  { text: 'Estado', value: 'Estatus', class: 'table-header', width: '120px' },
  { text: 'Fecha', value: 'Fecha_Registro', class: 'table-header', width: '150px' },
  { text: 'Acciones', value: 'acciones', class: 'table-header', sortable: false, width: '120px' },
];

// Computados para la gráfica
const hayDatosGrafica = computed(() => {
  return Object.keys(resumen.value.porTipo).length > 0;
});

const seriesGrafica = computed(() => {
  return Object.values(resumen.value.porTipo);
});

const opcionesGrafica = computed(() => {
  return {
    labels: Object.keys(resumen.value.porTipo),
    colors: ['#ff5252', '#2196f3', '#4caf50', '#9c27b0', '#ff9800'],
    chart: {
      foreColor: 'var(--color-texto-principal)'
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: 'var(--color-texto-principal)'
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} opiniones`
      }
    }
  };
});

// Métodos
async function cargarDatos() {
  try {
    cargando.value = true;

    // Cargar simultáneamente opiniones y resumen
    await Promise.all([
      cargarOpiniones(),
      cargarResumen()
    ]);
  } catch (error) {
    console.error('Error al cargar datos:', error);
    // Manejar el error (podría mostrar una notificación)
  } finally {
    cargando.value = false;
  }
}

async function cargarOpiniones() {
  try {
    cargando.value = true;
    opiniones.value = await OpinionAdminService.getOpiniones(
      0,
      50,
      filtroTipo.value || undefined,
      soloSinResponder.value
    );
  } catch (error) {
    console.error('Error al cargar opiniones:', error);
    // Manejar el error
  } finally {
    cargando.value = false;
  }
}

async function cargarResumen() {
  try {
    resumen.value = await OpinionAdminService.getResumen();
  } catch (error) {
    console.error('Error al cargar resumen:', error);
    // Manejar el error
  }
}

function responderOpinion(opinion: OpinionCliente) {
  opinionSeleccionada.value = opinion;
  respuestaOpinion.value = '';
  dialogoResponder.value = true;
}

function verDetalles(opinion: OpinionCliente) {
  opinionSeleccionada.value = opinion;
  dialogoDetalles.value = true;
}

function confirmarEliminar(opinion: OpinionCliente) {
  opinionSeleccionada.value = opinion;
  dialogoEliminar.value = true;
}

async function enviarRespuesta() {
  if (!opinionSeleccionada.value || !respuestaOpinion.value) return;

  try {
    enviandoRespuesta.value = true;
    await OpinionAdminService.responderOpinion(opinionSeleccionada.value.ID, respuestaOpinion.value);

    // Actualizar datos
    await cargarDatos();

    // Cerrar diálogo
    dialogoResponder.value = false;

    // Mensaje de éxito (podría usar una notificación)
    alert('Respuesta enviada con éxito');
  } catch (error) {
    console.error('Error al enviar respuesta:', error);
    // Manejar el error
    alert('Error al enviar la respuesta');
  } finally {
    enviandoRespuesta.value = false;
  }
}

async function eliminarOpinion() {
  if (!opinionSeleccionada.value) return;

  try {
    eliminando.value = true;
    await OpinionAdminService.eliminarOpinion(opinionSeleccionada.value.ID);

    // Actualizar datos
    await cargarDatos();

    // Cerrar diálogo
    dialogoEliminar.value = false;

    // Mensaje de éxito (podría usar una notificación)
    alert('Opinión eliminada con éxito');
  } catch (error) {
    console.error('Error al eliminar opinión:', error);
    // Manejar el error
    alert('Error al eliminar la opinión');
  } finally {
    eliminando.value = false;
  }
}

// Utilidades
function formatearFecha(fechaStr: string | undefined): string {
  if (!fechaStr) return 'Fecha no disponible';

  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTipoColor(tipo: string): string {
  switch (tipo) {
    case 'Queja': return 'amber darken-2';
    case 'Sugerencia': return 'green darken-1';
    case 'Felicitacion': return 'blue darken-1';
    case 'Recomendacion': return 'purple darken-1';
    default: return 'grey darken-1';
  }
}

// Recargar datos cuando cambien los filtros
watch([filtroTipo, soloSinResponder], () => {
  // No recargamos automáticamente para evitar demasiadas peticiones
  // El usuario debe hacer clic en "Aplicar Filtros"
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

.opinion-text {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border-left: 3px solid rgba(var(--v-theme-primary), 0.7);
}

.opinion-detalle {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid rgba(var(--v-theme-primary), 0.7);
}

.response-section {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  border-left: 3px solid var(--v-theme-primary);
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