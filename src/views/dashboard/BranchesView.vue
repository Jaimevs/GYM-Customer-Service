<template>
  <v-container fluid class="branches-content">
    <!-- Título y descripción con animación -->
    <div class="header-section" data-aos="fade-down" data-aos-duration="800">
      <h1 class="dashboard-title">
        <span class="title-text">Gestión de Sucursales</span>
        <span class="title-highlight"></span>
      </h1>
      <p class="text-subtitle-1">Administra las sucursales del gimnasio y visualiza estadísticas clave.</p>
    </div>

    <!-- Filtros de Búsqueda con animación -->
    <v-row class="mb-6 filter-section" data-aos="fade-right" data-aos-duration="800" data-aos-delay="100">
      <v-col cols="12" md="4">
        <v-text-field v-model="filtroNombre" label="Buscar por Nombre o Dirección" clearable variant="outlined"
          density="comfortable" prepend-inner-icon="mdi-magnify" color="var(--color-grafica-amarillo-dorado)"
          class="search-input"></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="filtroEstado" :items="['Activo', 'Inactivo']" label="Filtrar por Estado" clearable
          variant="outlined" density="comfortable" prepend-inner-icon="mdi-filter"
          color="var(--color-grafica-amarillo-dorado)" class="filter-select"></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="var(--color-grafica-rojo-fuego)" @click="aplicarFiltros" variant="flat" class="filter-btn"
          append-icon="mdi-send">
          Aplicar Filtros
        </v-btn>
      </v-col>
    </v-row>

    <!-- Resumen de Sucursales con animación -->
    <v-row class="mb-6 stats-section">
      <v-col cols="12" md="6" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="200">
        <v-card class="summary-card glow-card" elevation="8">
          <v-card-title class="card-title">
            <v-icon left color="var(--color-grafica-amarillo-dorado)">mdi-storefront</v-icon>
            <span class="title-glow">Resumen de Sucursales</span>
          </v-card-title>
          <v-card-text>
            <v-list lines="two" class="stats-list">
              <v-list-item class="active-item" data-aos="fade-right" data-aos-duration="500" data-aos-delay="300">
                <template v-slot:prepend>
                  <v-avatar color="var(--color-grafica-rojo-fuego)" size="40" class="pulse-avatar">
                    <v-icon color="white">mdi-check-circle</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="stats-label">Total de Sucursales Activas</v-list-item-title>
                <v-list-item-subtitle class="stats-value animate-count" :data-target="resumenSucursales.totalActivas">
                  0
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item class="inactive-item" data-aos="fade-right" data-aos-duration="500" data-aos-delay="400">
                <template v-slot:prepend>
                  <v-avatar color="var(--color-grafica-naranja-calido)" size="40" class="pulse-avatar">
                    <v-icon color="white">mdi-close-circle</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="stats-label">Total de Sucursales Inactivas</v-list-item-title>
                <v-list-item-subtitle class="stats-value animate-count" :data-target="resumenSucursales.totalInactivas">
                  0
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="300">
        <v-card class="chart-card glow-card" elevation="8">
          <v-card-title class="card-title">
            <v-icon left color="var(--color-grafica-amarillo-dorado)">mdi-chart-bar</v-icon>
            <span class="title-glow">Distribución de Clientes</span>
          </v-card-title>
          <v-card-text>
            <apexchart type="bar" :options="distribucionClientes.options" :series="distribucionClientes.series"
              height="300" class="animated-chart"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Listado de Sucursales con animación -->
    <v-row class="mb-6 table-section">
      <v-col cols="12" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
        <v-card class="table-card glow-card" elevation="8">
          <v-card-title class="card-title">
            <v-icon left color="var(--color-grafica-amarillo-dorado)">mdi-format-list-bulleted</v-icon>
            <span class="title-glow">Listado de Sucursales</span>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="cabecerasSucursales" :items="sucursalesFiltradas" :items-per-page="5"
              class="elevation-1 animated-table" hover>
              <!-- Columna de Estado (Editable) -->
              <template #item.estado="{ item }">
                <v-chip
                  :color="item.estado === 'Activo' ? 'var(--color-grafica-rojo-fuego)' : 'var(--color-grafica-naranja-calido)'"
                  variant="flat" prepend-icon="mdi-circle" class="state-chip">
                  {{ item.estado }}
                </v-chip>
              </template>

              <!-- Acciones -->
              <template #item.acciones="{ item }">
                <div class="action-buttons">
                  <v-tooltip text="Editar sucursal" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon variant="text" color="var(--color-grafica-amarillo-dorado)"
                        @click="editarSucursal(item)" class="action-btn scale-hover">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Eliminar sucursal" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon variant="text" color="var(--color-grafica-rojo-fuego)"
                        @click="eliminarSucursal(item)" class="action-btn scale-hover">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas y Notificaciones con animación -->
    <v-row class="mb-6 alerts-section">
      <v-col cols="12" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
        <v-card class="alerts-card glow-card" elevation="8">
          <v-card-title class="card-title">
            <v-icon left color="var(--color-grafica-amarillo-dorado)">mdi-alert</v-icon>
            <span class="title-glow">Alertas y Notificaciones</span>
          </v-card-title>
          <v-card-text>
            <transition-group name="list" tag="div">
              <v-alert v-for="(alerta, index) in alertas" :key="index" :type="alerta.tipo" variant="tonal"
                border="start" class="alert-item slide-in" :class="`alert-${alerta.tipo}`">
                {{ alerta.mensaje }}
                <template v-slot:close>
                  <v-btn icon small @click="removeAlert(index)" color="var(--color-grafica-amarillo-dorado)"
                    class="close-btn">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-alert>
            </transition-group>
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

// Datos de ejemplo
const sucursales = ref([
  { id: 1, nombre: 'Sucursal A', direccion: 'Av. Principal 123', estado: 'Activo', clientes: 150 },
  { id: 2, nombre: 'Sucursal B', direccion: 'Calle Secundaria 456', estado: 'Inactivo', clientes: 80 },
  { id: 3, nombre: 'Sucursal C', direccion: 'Plaza Central 789', estado: 'Activo', clientes: 200 },
]);

const resumenSucursales = ref({
  totalActivas: 2,
  totalInactivas: 1,
});

const distribucionClientes = ref({
  options: {
    chart: {
      id: "distribucion-clientes",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 800
        }
      }
    },
    colors: [
      'var(--color-grafica-rojo-fuego)',
      'var(--color-grafica-naranja-calido)',
      'var(--color-grafica-amarillo-dorado)'
    ],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: '70%',
        distributed: false,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['var(--color-texto-botones)'],
        fontSize: '12px'
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: 'var(--color-negro)',
        opacity: 0.45
      }
    },
    xaxis: {
      categories: ['Sucursal A', 'Sucursal B', 'Sucursal C'],
      labels: {
        style: {
          colors: 'var(--color-gris-claro-brillante)',
          fontSize: '12px',
          fontFamily: 'var(--fuente-titulo)'
        }
      },
      axisBorder: {
        show: true,
        color: 'var(--color-grafica-amarillo-dorado)',
        height: 1,
        width: '100%'
      },
      axisTicks: {
        show: true,
        color: 'var(--color-grafica-amarillo-dorado)'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--color-gris-claro-brillante)',
          fontSize: '12px',
          fontFamily: 'var(--fuente-titulo)'
        },
        formatter: function (val: number) {
          return val.toFixed(0);
        }
      },
      axisBorder: {
        show: true,
        color: 'var(--color-grafica-amarillo-dorado)'
      }
    },
    grid: {
      borderColor: 'var(--color-grafica-amarillo-dorado)',
      strokeDashArray: 4,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: true,
      style: {
        fontSize: '14px',
        fontFamily: 'var(--fuente-principal)'
      }
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
        }
      }
    }]
  },
  series: [{
    name: 'Clientes',
    data: [150, 80, 200],
  }],
});

const cabecerasSucursales = [
  { text: 'ID', value: 'id', align: 'center', class: 'header-cell' },
  { text: 'Nombre', value: 'nombre', align: 'start', class: 'header-cell' },
  { text: 'Dirección', value: 'direccion', align: 'start', class: 'header-cell' },
  { text: 'Estado', value: 'estado', align: 'center', class: 'header-cell' },
  { text: 'Clientes Registrados', value: 'clientes', align: 'center', class: 'header-cell' },
  { text: 'Acciones', value: 'acciones', align: 'center', sortable: false, class: 'header-cell' },
];

const alertas = ref([
  { mensaje: 'La sucursal B ha sido marcada como inactiva.', tipo: 'warning' },
  { mensaje: 'La sucursal C tiene más de 100 clientes registrados.', tipo: 'info' },
]);

// Estados de filtros
const filtroNombre = ref('');
const filtroEstado = ref('');

// Inicializar animaciones
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out-quad',
    once: true
  });

  animateCounters();
  startGlowEffect();
});

// Métodos
const aplicarFiltros = () => {
  // Efecto al aplicar filtros
  const filterSection = document.querySelector('.filter-section');
  filterSection?.classList.add('apply-filter-animation');
  setTimeout(() => {
    filterSection?.classList.remove('apply-filter-animation');
  }, 1000);

  console.log('Filtros aplicados:', filtroNombre.value, filtroEstado.value);
};

const actualizarEstado = (sucursal) => {
  console.log(`Estado actualizado para ${sucursal.nombre}:`, sucursal.estado);
  alertas.value.push({
    mensaje: `El estado de la sucursal ${sucursal.nombre} ha sido actualizado a "${sucursal.estado}".`,
    tipo: 'success',
  });
};

const editarSucursal = (sucursal) => {
  console.log('Editar sucursal:', sucursal.nombre);
  alertas.value.push({
    mensaje: `Editar información de la sucursal ${sucursal.nombre}.`,
    tipo: 'info',
  });
};

const eliminarSucursal = (sucursal) => {
  console.log('Eliminar sucursal:', sucursal.nombre);
  const index = sucursales.value.findIndex((s) => s.id === sucursal.id);
  if (index !== -1) {
    // Animación de eliminación
    const row = document.querySelector(`tr[data-id="${sucursal.id}"]`);
    row?.classList.add('delete-animation');

    setTimeout(() => {
      sucursales.value.splice(index, 1);
      alertas.value.push({
        mensaje: `La sucursal ${sucursal.nombre} ha sido eliminada.`,
        tipo: 'error',
      });
    }, 500);
  }
};

const removeAlert = (index: number) => {
  alertas.value.splice(index, 1);
};

// Animaciones
const animateCounters = () => {
  const counters = document.querySelectorAll('.animate-count');
  const speed = 200;

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / speed;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment).toString();
      setTimeout(animateCounters, 1);
    } else {
      counter.innerText = target.toString();
    }
  });
};

const startGlowEffect = () => {
  const glowElements = document.querySelectorAll('.glow-card');

  glowElements.forEach(el => {
    setInterval(() => {
      el.classList.toggle('glow-effect');
    }, 3000);
  });
};

// Computadas
const sucursalesFiltradas = computed(() => {
  return sucursales.value.filter(
    (s) =>
      (!filtroNombre.value ||
        s.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase()) ||
        s.direccion.toLowerCase().includes(filtroNombre.value.toLowerCase())) &&
      (!filtroEstado.value || s.estado === filtroEstado.value)
  );
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.branches-content {
  padding: 2rem;
  background-color: var(--color-negro);
  min-height: 100vh;
  color: var(--color-gris-claro-brillante);
}

/* Animaciones globales */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(var(--color-grafica-rojo-fuego), 0.5);
  }

  50% {
    box-shadow: 0 0 20px rgba(var(--color-grafica-rojo-fuego), 0.8);
  }

  100% {
    box-shadow: 0 0 5px rgba(var(--color-grafica-rojo-fuego), 0.5);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos específicos */
.header-section {
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease-out;

  .dashboard-title {
    position: relative;
    display: inline-block;
    margin-bottom: 12px;
    font-family: var(--fuente-titulo);
    text-transform: uppercase;
    letter-spacing: 1px;

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
    color: var(--color-gris-medio);
    font-family: var(--fuente-principal);
    font-size: 1.1rem;
    max-width: 600px;
    line-height: 1.6;
    animation: fadeIn 1s ease-out 0.3s both;
  }
}

.filter-section {

  .search-input,
  .filter-select {
    :deep(.v-field__outline) {
      color: var(--color-grafica-amarillo-dorado) !important;
    }

    :deep(.v-field__prepend-inner) {
      color: var(--color-grafica-amarillo-dorado) !important;
    }

    :deep(input),
    :deep(label) {
      color: var(--color-gris-claro-brillante) !important;
    }
  }

  .filter-btn {
    font-family: var(--fuente-titulo);
    letter-spacing: 1px;
    font-weight: 600;
    text-transform: uppercase;
    height: 48px;
    padding: 0 24px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: linear-gradient(45deg,
        var(--color-grafica-rojo-fuego),
        var(--color-grafica-naranja-calido));
    box-shadow: 0 4px 15px rgba(var(--color-grafica-rojo-fuego), 0.4);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(var(--color-grafica-rojo-fuego), 0.6);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &.apply-filter-animation {
    animation: pulse 0.8s ease;
  }
}

.stats-section {

  .summary-card,
  .chart-card {
    background: rgba(var(--color-gris-carbon), 0.7);
    border: 1px solid var(--color-grafica-amarillo-dorado);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    backdrop-filter: blur(5px);

    &:hover {
      transform: translateY(-5px) scale(1.01);
      box-shadow: 0 15px 30px rgba(var(--color-grafica-rojo-fuego), 0.3) !important;
    }

    &.glow-effect {
      animation: glow 2s infinite alternate;
    }
  }

  .card-title {
    font-weight: 600;
    color: var(--color-gris-claro-brillante);
    padding: 20px;
    border-bottom: 1px solid var(--color-grafica-amarillo-dorado);
    background: linear-gradient(90deg,
        rgba(var(--color-grafica-rojo-granate), 0.3),
        rgba(var(--color-grafica-cafe-oscuro), 0.3));
    font-family: var(--fuente-titulo);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 1.2rem;
    display: flex;
    align-items: center;

    .title-glow {
      text-shadow: 0 0 8px rgba(var(--color-grafica-amarillo-dorado), 0.7);
    }
  }

  .stats-list {
    background: transparent;

    .v-list-item {
      padding: 16px;
      margin: 8px 0;
      border-radius: 12px;
      transition: all 0.3s ease;
      background: rgba(var(--color-gris-carbon), 0.5);

      &:hover {
        background: rgba(var(--color-grafica-rojo-fuego), 0.2);
        transform: translateX(10px);
      }
    }

    .stats-label {
      font-weight: 500;
      color: var(--color-gris-claro-brillante);
      font-size: 1rem;
      letter-spacing: 0.5px;
    }

    .stats-value {
      font-weight: 700;
      color: var(--color-grafica-amarillo-dorado);
      font-size: 1.8rem;
      margin-top: 8px;
      font-family: var(--fuente-titulo);
      animation: countUp 0.8s ease-out;
    }
  }

  .pulse-avatar {
    animation: pulse 2s infinite;
    margin-right: 16px;
    box-shadow: 0 0 10px currentColor;
  }

  .active-item .v-avatar {
    background: linear-gradient(45deg,
        var(--color-grafica-rojo-fuego),
        var(--color-grafica-rosa-neon)) !important;
  }

  .inactive-item .v-avatar {
    background: linear-gradient(45deg,
        var(--color-grafica-naranja-calido),
        var(--color-grafica-ocre)) !important;
  }

  .animated-chart {
    animation: scaleUp 1s ease-out;
  }
}

.table-section {
  .table-card {
    background: rgba(var(--color-gris-carbon), 0.7);
    border: 1px solid var(--color-grafica-amarillo-dorado);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.5s ease;
    backdrop-filter: blur(5px);

    &:hover {
      box-shadow: 0 15px 30px rgba(var(--color-grafica-rojo-fuego), 0.2) !important;
    }

    &.glow-card.glow-effect {
      animation: glow 2s infinite alternate;
    }
  }

  .card-title {
    font-weight: 600;
    color: var(--color-gris-claro-brillante);
    padding: 20px;
    border-bottom: 1px solid var(--color-grafica-amarillo-dorado);
    background: linear-gradient(90deg,
        rgba(var(--color-grafica-rojo-granate), 0.3),
        rgba(var(--color-grafica-cafe-oscuro), 0.3));
    font-family: var(--fuente-titulo);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 1.2rem;
    display: flex;
    align-items: center;

    .title-glow {
      text-shadow: 0 0 8px rgba(var(--color-grafica-amarillo-dorado), 0.7);
    }
  }

  :deep(.v-table) {
    background: transparent;
    color: var(--color-gris-claro-brillante);

    .v-table__wrapper {
      &::-webkit-scrollbar {
        height: 8px;
        background: var(--color-gris-carbon);
      }

      &::-webkit-scrollbar-thumb {
        background: var(--color-grafica-amarillo-dorado);
        border-radius: 4px;
      }
    }

    thead {
      tr {
        th {
          background: rgba(var(--color-grafica-rojo-granate), 0.5);
          color: var(--color-gris-claro-brillante);
          font-family: var(--fuente-titulo);
          letter-spacing: 1px;
          font-size: 0.9rem;
          text-transform: uppercase;
          border-bottom: 2px solid var(--color-grafica-amarillo-dorado);
        }
      }
    }

    tbody {
      tr {
        transition: all 0.3s ease;
        background: rgba(var(--color-gris-carbon), 0.5);

        &:hover {
          background: rgba(var(--color-grafica-rojo-fuego), 0.2) !important;
          transform: scale(1.01);
        }

        td {
          border-bottom: 1px solid rgba(var(--color-grafica-amarillo-dorado), 0.2);
          font-family: var(--fuente-principal);
        }

        &.delete-animation {
          animation: fadeOut 0.5s ease-out forwards;
        }
      }
    }
  }

  .state-chip {
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 0.8rem;
    padding: 8px 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: rgba(var(--color-gris-carbon), 0.7);
    border: 1px solid currentColor;

    &:hover {
      background: currentColor !important;
      color: white !important;

      .v-icon {
        color: white !important;
        animation: pulse 0.5s ease;
      }
    }

    &.scale-hover:hover {
      transform: scale(1.2);
    }
  }
}

.alerts-section {
  .alerts-card {
    background: rgba(var(--color-gris-carbon), 0.7);
    border: 1px solid var(--color-grafica-amarillo-dorado);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.5s ease;
    backdrop-filter: blur(5px);

    &:hover {
      box-shadow: 0 15px 30px rgba(var(--color-grafica-rojo-fuego), 0.2) !important;
    }

    &.glow-card.glow-effect {
      animation: glow 2s infinite alternate;
    }
  }

  .card-title {
    font-weight: 600;
    color: var(--color-gris-claro-brillante);
    padding: 20px;
    border-bottom: 1px solid var(--color-grafica-amarillo-dorado);
    background: linear-gradient(90deg,
        rgba(var(--color-grafica-rojo-granate), 0.3),
        rgba(var(--color-grafica-cafe-oscuro), 0.3));
    font-family: var(--fuente-titulo);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 1.2rem;
    display: flex;
    align-items: center;

    .title-glow {
      text-shadow: 0 0 8px rgba(var(--color-grafica-amarillo-dorado), 0.7);
    }
  }

  .alert-item {
    margin-bottom: 16px;
    border-radius: 8px;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    font-family: var(--fuente-principal);
    font-weight: 500;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 5px;
      background: currentColor;
    }

    &:hover {
      transform: translateX(10px);
    }

    &.slide-in {
      animation: slideIn 0.5s ease-out;
    }

    &.alert-success {
      color: var(--color-grafica-rojo-fuego);
      background: rgba(var(--color-grafica-rojo-fuego), 0.1);
    }

    &.alert-warning {
      color: var(--color-grafica-naranja-calido);
      background: rgba(var(--color-grafica-naranja-calido), 0.1);
    }

    &.alert-error {
      color: var(--color-grafica-rosa-neon);
      background: rgba(var(--color-grafica-rosa-neon), 0.1);
    }

    &.alert-info {
      color: var(--color-grafica-amarillo-dorado);
      background: rgba(var(--color-grafica-amarillo-dorado), 0.1);
    }
  }

  .close-btn {
    transition: all 0.3s ease;

    &:hover {
      transform: rotate(90deg);
      color: var(--color-grafica-rojo-fuego) !important;
    }
  }
}

/* Animaciones para listas */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Media queries para responsividad */
@media (max-width: 960px) {
  .header-section .dashboard-title .title-text {
    font-size: 1.8rem;
  }

  .filter-section {
    flex-direction: column;

    .v-col {
      width: 100%;
      max-width: 100%;
    }
  }

  .stats-section {
    flex-direction: column;

    .v-col {
      width: 100%;
      max-width: 100%;
      margin-bottom: 20px;
    }
  }
}

@media (max-width: 600px) {
  .branches-content {
    padding: 1rem;
  }

  .header-section .dashboard-title .title-text {
    font-size: 1.5rem;
  }

  .text-subtitle-1 {
    font-size: 0.9rem;
  }
}
</style>
