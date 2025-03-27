<template>
  <div class="clients-content">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="clients-title">
          <span class="title-text">Gestión de Clientes</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="text-subtitle-1">Administra y analiza la información de tus clientes</p>
      </v-col>
    </v-row>

    <!-- Tarjetas de resumen -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="(card, index) in summaryCards" :key="index" :data-aos="'fade-up'"
        :data-aos-delay="index * 100">
        <v-card class="summary-card" :class="`card-${index}`" elevation="4">
          <div class="card-icon">
            <Icon :icon="card.icon" width="32" />
          </div>
          <v-card-title class="text-h6 font-weight-medium">{{ card.title }}</v-card-title>
          <v-card-text class="text-h3 font-weight-bold">{{ card.value }}</v-card-text>
          <div class="card-decoration"></div>
          <div class="card-wave"></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos principales -->
    <v-row class="mb-6">
      <v-col cols="12" md="8" data-aos="fade-right" data-aos-delay="200">
        <v-card class="chart-card" elevation="4">
          <div class="chart-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:users-group-rounded-outline" width="24" />
            </div>
            <h3 class="text-h6">Distribución de Clientes</h3>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small text v-bind="attrs" v-on="on" class="period-selector">
                  Este mes
                  <Icon icon="solar:alt-arrow-down-outline" class="ml-1" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in timePeriods" :key="index" @click="changeTimePeriod(item.value)">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-card-text>
            <apexchart type="bar" :options="barChartOptions" :series="barChartSeries" height="350"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="fade-left" data-aos-delay="200">
        <v-card class="stats-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:user-plus-outline" width="24" />
            </div>
            <h3 class="text-h6">Nuevos Clientes</h3>
          </div>
          <v-card-text>
            <v-list dense class="transparent">
              <v-list-item v-for="(client, index) in recentClients" :key="index" :class="`client-item-${index}`">
                <v-list-item-avatar>
                  <v-avatar :color="getClientColor(client.membership)" size="36">
                    <span class="white--text">{{ client.name.charAt(0) }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{ client.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip x-small :color="getMembershipColor(client.membership)" text-color="white" class="mr-1">
                      {{ client.membership }}
                    </v-chip>
                    {{ formatDate(client.joinDate) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click="viewClientDetails(client)">
                    <v-icon small>mdi-eye</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn block color="primary" class="mt-4" @click="openAddClientDialog">
              <Icon icon="solar:user-plus-outline" class="mr-2" />
              Agregar Nuevo Cliente
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de clientes -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up" data-aos-delay="100">
        <v-card class="table-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:users-group-two-rounded-outline" width="24" />
            </div>
            <h3 class="text-h6">Listado Completo de Clientes</h3>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar clientes..." single-line hide-details
              class="search-field"></v-text-field>
          </div>
          <v-card-text class="pa-0">
            <v-data-table :headers="headers" :items="filteredClients" :items-per-page="10" :search="search"
              class="elevation-0 clients-table" :footer-props="{
                itemsPerPageOptions: [5, 10, 20, -1],
                showFirstLastPage: true
              }">
              <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                  <v-avatar :color="getClientColor(item.membership)" size="36" class="mr-3">
                    <span class="white--text">{{ item.name.charAt(0) }}</span>
                  </v-avatar>
                  {{ item.name }}
                </div>
              </template>
              <template v-slot:item.membership="{ item }">
                <v-chip :color="getMembershipColor(item.membership)" small dark>
                  {{ item.membership }}
                </v-chip>
              </template>
              <template v-slot:item.joinDate="{ item }">
                {{ formatDate(item.joinDate) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" icon v-bind="attrs" v-on="on" @click="viewClientDetails(item)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver detalles</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="secondary" icon class="ml-2" v-bind="attrs" v-on="on" @click="editClient(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar cliente</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Exportar datos -->
    <v-row data-aos="fade-up" data-aos-delay="100">
      <v-col cols="12">
        <v-card class="export-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:export-outline" width="24" />
            </div>
            <h3 class="text-h6">Exportar Datos de Clientes</h3>
          </div>
          <v-card-text class="export-actions">
            <v-btn v-for="(action, index) in exportActions" :key="index" :color="action.color" variant="flat"
              class="action-btn" @click="action.handler" :data-aos="'zoom-in'" :data-aos-delay="index * 50">
              <v-avatar :color="action.color" size="36" class="mr-3">
                <Icon :icon="action.icon" width="20" />
              </v-avatar>
              <div class="btn-content">
                <div class="btn-label">{{ action.label }}</div>
                <div class="btn-hint">{{ action.format }}</div>
              </div>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para ver detalles del cliente (se mantiene igual) -->
    <v-dialog v-model="clientDetailsDialog" max-width="600" persistent>
      <!-- ... contenido del diálogo ... -->
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: 'ClientsView',
  components: {
    apexchart: VueApexCharts,
    Icon
  },
  setup() {
    // Inicializar animaciones
    onMounted(() => {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-in-out-quad'
      });
    });

    // Datos de ejemplo
    const clients = ref([
      {
        id: 1,
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        phone: "+34 612 345 678",
        membership: "Premium",
        gender: "Masculino",
        age: 30,
        height: 180,
        weight: 75,
        bmi: "24.5 (Normal)",
        joinDate: "2023-10-15"
      },
      {
        id: 2,
        name: "María López",
        email: "maria.lopez@example.com",
        phone: "+34 600 123 456",
        membership: "Básica",
        gender: "Femenino",
        age: 25,
        height: 165,
        weight: 60,
        bmi: "22.0 (Normal)",
        joinDate: "2023-10-10"
      },
      {
        id: 3,
        name: "Carlos Ramírez",
        email: "carlos.ramirez@example.com",
        phone: "+34 699 876 543",
        membership: "Premium",
        gender: "Masculino",
        age: 35,
        height: 175,
        weight: 80,
        bmi: "26.1 (Sobrepeso)",
        joinDate: "2023-10-05"
      },
      {
        id: 4,
        name: "Ana García",
        email: "ana.garcia@example.com",
        phone: "+34 611 222 333",
        membership: "Trial",
        gender: "Femenino",
        age: 28,
        height: 170,
        weight: 65,
        bmi: "22.5 (Normal)",
        joinDate: "2023-09-28"
      },
      {
        id: 5,
        name: "Luis Martínez",
        email: "luis.martinez@example.com",
        phone: "+34 644 555 666",
        membership: "Básica",
        gender: "Masculino",
        age: 40,
        height: 182,
        weight: 85,
        bmi: "25.7 (Sobrepeso)",
        joinDate: "2023-09-20"
      },
    ]);

    // Tarjetas de resumen
    const summaryCards = ref([
      { icon: 'solar:users-group-rounded-outline', title: 'Clientes Totales', value: '125' },
      { icon: 'solar:user-star-outline', title: 'Clientes Premium', value: '42' },
      { icon: 'solar:user-plus-outline', title: 'Nuevos este mes', value: '18' },
      { icon: 'solar:user-heart-outline', title: 'Clientes VIP', value: '12' }
    ]);

    // Periodos de tiempo para filtrado
    const timePeriods = ref([
      { text: 'Hoy', value: 'today' },
      { text: 'Esta semana', value: 'week' },
      { text: 'Este mes', value: 'month' },
      { text: 'Este trimestre', value: 'quarter' },
      { text: 'Este año', value: 'year' }
    ]);

    // Datos para el gráfico de barras
    const barChartOptions = ref({
      chart: {
        type: 'bar',
        fontFamily: 'inherit',
        toolbar: {
          show: false
        }
      },
      colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      },
      yaxis: {
        title: {
          text: 'N° de Clientes'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " clientes";
          }
        }
      }
    });

    const barChartSeries = ref([{
      name: 'Clientes',
      data: [15, 22, 18, 25, 20, 30, 28, 35, 30, 18, 0, 0]
    }]);

    // Clientes recientes
    const recentClients = computed(() => {
      return [...clients.value].sort((a, b) =>
        new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      ).slice(0, 3);
    });

    // Encabezados de la tabla
    const headers = ref([
      { text: "Nombre", value: "name", sortable: true },
      { text: "Email", value: "email", sortable: true },
      { text: "Teléfono", value: "phone", sortable: false },
      { text: "Membresía", value: "membership", sortable: true },
      { text: "Fecha Registro", value: "joinDate", sortable: true },
      { text: "Acciones", value: "actions", sortable: false, width: '120px', align: 'center' },
    ]);

    // Búsqueda
    const search = ref("");
    const filteredClients = computed(() => {
      if (!search.value) return clients.value;
      return clients.value.filter(client => {
        return (
          client.name.toLowerCase().includes(search.value.toLowerCase()) ||
          client.email.toLowerCase().includes(search.value.toLowerCase()) ||
          client.phone.includes(search.value) ||
          client.membership.toLowerCase().includes(search.value.toLowerCase())
        );
      });
    });

    // Acciones de exportación
    const exportActions = ref([
      { icon: 'vscode-icons:file-type-pdf2', label: 'Exportar a PDF', format: 'PDF', color: '#F44336', handler: () => exportClients('pdf') },
      { icon: 'vscode-icons:file-type-excel', label: 'Exportar a Excel', format: 'XLSX', color: '#4CAF50', handler: () => exportClients('excel') },
      { icon: 'vscode-icons:file-type-csv', label: 'Exportar a CSV', format: 'CSV', color: '#2196F3', handler: () => exportClients('csv') },
      { icon: 'vscode-icons:file-type-word', label: 'Exportar a Word', format: 'DOCX', color: '#673AB7', handler: () => exportClients('word') }
    ]);

    // Diálogos y estados
    const clientDetailsDialog = ref(false);
    const selectedClient = ref(null);

    // Funciones de ayuda
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getMembershipColor = (membership: string) => {
      const colors: Record<string, string> = {
        'Premium': '#4CAF50',
        'Básica': '#2196F3',
        'Trial': '#FF9800'
      };
      return colors[membership] || '#9E9E9E';
    };

    const getClientColor = (membership: string) => {
      const colors: Record<string, string> = {
        'Premium': '#2E7D32',
        'Básica': '#1565C0',
        'Trial': '#EF6C00'
      };
      return colors[membership] || '#616161';
    };

    // Funciones de acción
    const changeTimePeriod = (period: string) => {
      console.log('Cambiar periodo:', period);
      // Aquí iría la lógica para actualizar los datos según el periodo seleccionado
    };

    const viewClientDetails = (client: any) => {
      selectedClient.value = { ...client };
      clientDetailsDialog.value = true;
    };

    const editClient = (client: any) => {
      selectedClient.value = { ...client };
      console.log("Editar cliente:", selectedClient.value);
    };

    const openAddClientDialog = () => {
      console.log("Abrir diálogo para añadir nuevo cliente");
    };

    const exportClients = (format: string) => {
      console.log(`Exportar clientes a ${format}`);
      alert(`Exportando clientes a ${format.toUpperCase()}...`);
    };

    return {
      clients,
      summaryCards,
      timePeriods,
      barChartOptions,
      barChartSeries,
      recentClients,
      headers,
      search,
      filteredClients,
      exportActions,
      clientDetailsDialog,
      selectedClient,
      changeTimePeriod,
      viewClientDetails,
      editClient,
      openAddClientDialog,
      exportClients,
      formatDate,
      getMembershipColor,
      getClientColor
    };
  },
});
</script>

<style scoped lang="scss">
.clients-content {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

.clients-title {
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

  .text-subtitle-1 {
    color: var(--color-texto);
    font-family: var(--fuente-principal);
  }
}

/* Mantenemos los mismos estilos para summary-card, chart-card, stats-card, table-card que en ReportsView */
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
    color: white;
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
  }

  .v-card-text {
    padding: 0;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
    color: white;
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

/* Estilos individuales para cada tarjeta */
.card-0 {
  background: linear-gradient(135deg, #2196F3, #1976D2);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-1 {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-2 {
  background: linear-gradient(135deg, #FF9800, #EF6C00);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.card-3 {
  background: linear-gradient(135deg, #9C27B0, #6A1B9A);

  .card-icon {
    background: rgba(255, 255, 255, 0.3);
  }

  .card-decoration {
    background: white;
  }
}

.chart-card,
.stats-card,
.table-card,
.export-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e0e0e0;

    h3 {
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .chart-icon-bg {
      width: 40px;
      height: 40px;
      background: rgba(33, 150, 243, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #2196F3;
    }

    .period-selector {
      text-transform: none;
      letter-spacing: normal;
      color: #2196F3;
    }
  }
}

.clients-table {
  border-radius: 0 0 16px 16px;

  :deep(thead tr th) {
    background-color: #f5f7fa !important;
    color: #333 !important;
    font-weight: 600;
  }

  :deep(tbody tr:nth-of-type(even)) {
    background-color: #f8fafc;
  }

  :deep(tbody tr:hover) {
    background-color: #ebf4ff !important;
  }
}

.search-field {
  max-width: 300px;

  :deep(.v-input__control) {
    background-color: white !important;
    border-radius: 24px;
    padding: 0 12px !important;
    border: 1px solid #e0e0e0;
  }

  :deep(.v-input__control:before) {
    display: none;
  }
}

.export-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
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
    background-color: white !important;
    border: 1px solid #e0e0e0;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
    }

    .btn-content {
      text-align: left;

      .btn-label {
        font-weight: 500;
        font-size: 1rem;
        color: #333;
      }

      .btn-hint {
        font-size: 0.75rem;
        opacity: 0.8;
        margin-top: 2px;
        color: #616161;
      }
    }
  }
}

/* Responsive */
@media (max-width: 960px) {
  .clients-title {
    .title-text {
      font-size: 1.75rem;
    }

    .title-highlight {
      height: 8px;
      bottom: 3px;
    }
  }

  .summary-card {
    padding: 16px;

    .card-icon {
      width: 48px;
      height: 48px;
    }
  }

  .export-actions {
    grid-template-columns: 1fr 1fr !important;
  }
}

@media (max-width: 600px) {
  .export-actions {
    grid-template-columns: 1fr !important;
  }
}
</style>
