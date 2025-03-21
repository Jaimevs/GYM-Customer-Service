<template>
  <v-container fluid class="service-rating-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Valoración de Servicios</h1>
    <p class="text-subtitle-1">Monitorea y analiza las valoraciones de los clientes sobre los servicios del gimnasio.
    </p>

    <!-- Resumen General de Valoraciones -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Calificación Promedio</v-card-title>
          <v-card-text>
            <apexchart type="radialBar" :options="calificacionPromedio.options" :series="calificacionPromedio.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Distribución de Calificaciones</v-card-title>
          <v-card-text>
            <apexchart type="donut" :options="distribucionCalificaciones.options"
              :series="distribucionCalificaciones.series" height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de Reseñas y Comentarios -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Reseñas y Comentarios</v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasReseñas" :items="reseñas" :items-per-page="5" class="elevation-1">
              <template #item.acciones="{ item }">
                <v-btn icon small color="primary" @click="responderComentario(item)">
                  <v-icon small>mdi-reply</v-icon>
                </v-btn>
                <v-btn icon small color="success" @click="marcarComoDestacada(item)">
                  <v-icon small>mdi-star</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="ocultarComentario(item)">
                  <v-icon small>mdi-eye-off</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Análisis de Sentimiento -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Tendencias de Calificación</v-card-title>
          <v-card-text>
            <apexchart type="line" :options="tendenciasCalificacion.options" :series="tendenciasCalificacion.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Palabras Más Mencionadas</v-card-title>
          <v-card-text>
            <apexchart type="heatmap" :options="palabrasMencionadas.options" :series="palabrasMencionadas.series"
              height="300"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas y Notificaciones -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Alertas y Notificaciones</v-card-title>
          <v-card-text>
            <v-alert v-for="(alerta, index) in alertas" :key="index" :type="alerta.tipo" dense outlined>
              {{ alerta.mensaje }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reportes y Estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Ranking de Servicios Mejor Valorados</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="rankingServicios.options" :series="rankingServicios.series" height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>Ranking de Entrenadores Mejor Valorados</v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="rankingEntrenadores.options" :series="rankingEntrenadores.series"
              height="300">
            </apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// Datos de ejemplo
const calificacionPromedio = ref({
  options: {
    chart: { id: "calificacion-promedio" },
    labels: ["Calificación Promedio"],
  },
  series: [4.5], // Ejemplo de calificación promedio
});

const distribucionCalificaciones = ref({
  options: {
    labels: ["1 Estrella", "2 Estrellas", "3 Estrellas", "4 Estrellas", "5 Estrellas"],
    colors: ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50'],
  },
  series: [5, 10, 20, 30, 35], // Ejemplo de distribución
});

const cabecerasReseñas = ref([
  { text: 'Tipo de Servicio', value: 'tipoServicio' },
  { text: 'Calificación', value: 'calificacion' },
  { text: 'Comentario', value: 'comentario' },
  { text: 'Fecha', value: 'fecha' },
  { text: 'Cliente', value: 'cliente' },
  { text: 'Sucursal', value: 'sucursal' },
  { text: 'Acciones', value: 'acciones' },
]);

const reseñas = ref([
  { tipoServicio: 'Clase de Yoga', calificacion: 5, comentario: 'Excelente clase, muy relajante.', fecha: '2023-10-01', cliente: 'Juan Pérez', sucursal: 'Sucursal A' },
  { tipoServicio: 'Entrenador Personal', calificacion: 4, comentario: 'Muy buen entrenador, pero podría mejorar la puntualidad.', fecha: '2023-10-02', cliente: 'María López', sucursal: 'Sucursal B' },
]);

const tendenciasCalificacion = ref({
  options: {
    chart: { id: "tendencias-calificacion" },
    xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
  },
  series: [{ name: 'Calificación Promedio', data: [4.0, 4.2, 4.5, 4.3, 4.6] }],
});

const palabrasMencionadas = ref({
  options: {
    chart: { id: "palabras-mencionadas" },
    xaxis: { categories: ['excelente', 'bueno', 'regular', 'malo', 'mejorable'] },
  },
  series: [{ name: 'Frecuencia', data: [30, 25, 15, 10, 5] }],
});

const rankingServicios = ref({
  options: {
    chart: { id: "ranking-servicios" },
    xaxis: { categories: ['Yoga', 'Spinning', 'Pesas', 'CrossFit'] },
  },
  series: [{ name: 'Calificación Promedio', data: [4.8, 4.6, 4.4, 4.2] }],
});

const rankingEntrenadores = ref({
  options: {
    chart: { id: "ranking-entrenadores" },
    xaxis: { categories: ['Pedro Ramírez', 'Ana Gómez', 'Luis Torres', 'Sofía Pérez'] },
  },
  series: [{ name: 'Calificación Promedio', data: [4.9, 4.7, 4.5, 4.3] }],
});

const alertas = ref([
  { mensaje: 'Reseña negativa recibida para Clase de Yoga en Sucursal A.', tipo: 'error' },
  { mensaje: '¡El entrenador Pedro Ramírez ha sido destacado por sus excelentes reseñas!', tipo: 'success' },
]);

// Métodos
const responderComentario = (item) => {
  console.log('Responder comentario de:', item.cliente);
};

const marcarComoDestacada = (item) => {
  console.log('Marcar como destacada la reseña de:', item.cliente);
};

const ocultarComentario = (item) => {
  console.log('Ocultar comentario de:', item.cliente);
};
</script>

<style scoped lang="scss">
.service-rating-content {
  padding: 2rem;
}
</style>
