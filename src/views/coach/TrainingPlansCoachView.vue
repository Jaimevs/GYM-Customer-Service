<template>
  <div class="training-plans-content">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="training-plans-title">
          <span class="title-text">Planes de Entrenamiento</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="text-subtitle-1">Gestiona y asigna planes de entrenamiento a tus clientes</p>
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
              <Icon icon="solar:pie-chart-2-outline" width="24" />
            </div>
            <h3 class="text-h6">Distribución de Planes</h3>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small text v-bind="attrs" v-on="on" class="period-selector">
                  Todos los planes
                  <Icon icon="solar:alt-arrow-down-outline" class="ml-1" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in planFilters" :key="index" @click="changePlanFilter(item.value)">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-card-text>
            <apexchart type="donut" :options="donutChartOptions" :series="donutChartSeries" height="350"></apexchart>
            <div class="d-flex justify-space-around mt-2">
              <v-chip v-for="(label, index) in donutChartOptions.labels" :key="index" :color="getChartColor(index)"
                text-color="white" small class="px-3">
                {{ label }}: {{ donutChartSeries[index] }}%
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" data-aos="fade-left" data-aos-delay="200">
        <v-card class="stats-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:clock-circle-outline" width="24" />
            </div>
            <h3 class="text-h6">Planes Recientes</h3>
          </div>
          <v-card-text>
            <v-list dense class="transparent">
              <v-list-item v-for="(plan, index) in recentPlans" :key="index" :class="`plan-item-${index}`">
                <v-list-item-icon>
                  <v-icon :color="getPlanColor(plan.type)">{{ plan.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{ plan.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ plan.date }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click="assignPlan(plan)">
                    <v-icon small>mdi-account-plus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn block color="primary" class="mt-4" @click="openAddPlanDialog">
              <Icon icon="solar:document-add-outline" class="mr-2" />
              Crear Nuevo Plan
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de planes -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up" data-aos-delay="100">
        <v-card class="table-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:document-text-outline" width="24" />
            </div>
            <h3 class="text-h6">Todos los Planes</h3>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar planes..." single-line hide-details
              class="search-field"></v-text-field>
          </div>
          <v-card-text class="pa-0">
            <v-data-table :headers="headers" :items="plans" :items-per-page="10" :search="search"
              class="elevation-0 plans-table" :footer-props="{
                itemsPerPageOptions: [5, 10, 20, -1],
                showFirstLastPage: true
              }">
              <template v-slot:item.date="{ item }">
                <v-chip small :color="getDateColor(item.createdAt)" text-color="white">
                  {{ formatDate(item.createdAt) }}
                </v-chip>
              </template>
              <template v-slot:item.type="{ item }">
                <v-chip :color="getTypeColor(item.type)" small dark>
                  {{ item.type }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" icon v-bind="attrs" v-on="on" @click="editPlan(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar plan</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="secondary" icon class="ml-2" v-bind="attrs" v-on="on" @click="assignPlan(item)">
                      <v-icon>mdi-account-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Asignar a cliente</span>
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
            <h3 class="text-h6">Exportar Planes</h3>
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

    <!-- Diálogo para agregar/editar plan -->
    <v-dialog v-model="planDialog" max-width="600" persistent>
      <v-card class="form-dialog" data-aos="zoom-in">
        <v-card-title>{{ isEditing ? 'Editar Plan' : 'Nuevo Plan' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="planForm.name" label="Nombre del Plan" required outlined></v-text-field>

          <v-select v-model="planForm.type" label="Tipo de Plan" :items="planTypes" required outlined></v-select>

          <div class="d-flex mb-3">
            <v-text-field v-model.number="planForm.duration" label="Duración (semanas)" type="number" required min="1"
              outlined class="mr-2"></v-text-field>
            <v-text-field v-model="planForm.difficulty" label="Nivel de Dificultad" required outlined
              class="ml-2"></v-text-field>
          </div>

          <v-textarea v-model="planForm.description" label="Descripción" rows="3" outlined></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="planDialog = false" class="cancel-btn">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="savePlan" :loading="saving" :disabled="saving || !isFormValid"
            class="save-btn">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Plan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
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
  name: 'TrainingPlansView',
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
    const plans = ref([
      {
        id: 1,
        name: "Plan Básico",
        type: "Inicial",
        duration: 8,
        difficulty: "Principiante",
        description: "Plan introductorio para nuevos miembros",
        clients: [1, 2],
        createdAt: "2023-10-01"
      },
      {
        id: 2,
        name: "Plan Intermedio",
        type: "Intermedio",
        duration: 12,
        difficulty: "Intermedio",
        description: "Para miembros con experiencia previa",
        clients: [3, 4],
        createdAt: "2023-10-05"
      },
      {
        id: 3,
        name: "Plan Avanzado",
        type: "Avanzado",
        duration: 16,
        difficulty: "Avanzado",
        description: "Entrenamiento intensivo para atletas",
        clients: [5],
        createdAt: "2023-10-10"
      },
      {
        id: 4,
        name: "Plan Rehabilitación",
        type: "Especial",
        duration: 6,
        difficulty: "Personalizado",
        description: "Para recuperación de lesiones",
        clients: [],
        createdAt: "2023-10-15"
      },
    ]);

    // Tipos de planes
    const planTypes = ref(["Inicial", "Intermedio", "Avanzado", "Especial", "Personalizado"]);

    // Filtros para planes
    const planFilter = ref('all');
    const planFilters = ref([
      { text: 'Todos los planes', value: 'all' },
      { text: 'Planes activos', value: 'active' },
      { text: 'Planes inactivos', value: 'inactive' },
      { text: 'Planes personalizados', value: 'custom' }
    ]);

    // Tarjetas de resumen
    const summaryCards = ref([
      { icon: 'solar:dumbbell-outline', title: 'Planes Activos', value: computed(() => plans.value.length) },
      {
        icon: 'solar:users-group-two-rounded-outline', title: 'Clientes Asignados',
        value: computed(() => plans.value.reduce((acc, plan) => acc + plan.clients.length, 0))
      },
      {
        icon: 'solar:calendar-outline', title: 'Duración Promedio',
        value: computed(() => `${Math.round(plans.value.reduce((acc, plan) => acc + plan.duration, 0) / plans.value.length)} sem`)

      },
      {
        icon: 'solar:star-outline', title: 'Plan Popular',
        value: computed(() => {
          const popular = plans.value.reduce((prev, current) =>
            (prev.clients.length > current.clients.length) ? prev : current
          );
          return popular.name;
        })
      }
    ]);

    // Planes recientes
    const recentPlans = ref([
      { id: 1, name: 'Plan Básico', date: 'Hoy', type: 'Inicial', icon: 'mdi-account-star' },
      { id: 2, name: 'Plan Intermedio', date: 'Ayer', type: 'Intermedio', icon: 'mdi-account-supervisor' },
      { id: 3, name: 'Plan Rehabilitación', date: 'Hace 2 días', type: 'Especial', icon: 'mdi-account-heart' }
    ]);

    // Datos para el gráfico de donut
    const donutChartOptions = ref({
      labels: computed(() => plans.value.map(p => p.name)),
      colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
      legend: {
        position: 'bottom',
        fontFamily: 'inherit',
        labels: {
          colors: '#333'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Clientes',
                color: '#333',
                fontFamily: 'inherit',
                formatter: () => plans.value.reduce((acc, plan) => acc + plan.clients.length, 0)
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val)}%`,
        style: {
          fontFamily: 'inherit'
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        enabled: true,
        style: {
          fontFamily: 'inherit'
        }
      }
    });

    const donutChartSeries = computed(() => {
      const totalClients = plans.value.reduce((acc, plan) => acc + plan.clients.length, 0);
      return plans.value.map(plan =>
        totalClients > 0 ? Math.round((plan.clients.length / totalClients) * 100) : 0
      );
    });

    // Encabezados de la tabla
    const headers = ref([
      { text: 'ID', value: 'id', width: '80px' },
      { text: 'Nombre', value: 'name' },
      { text: 'Tipo', value: 'type', width: '130px' },
      { text: 'Duración', value: 'duration', width: '120px' },
      { text: 'Fecha', value: 'date', width: '120px' },
      { text: 'Acciones', value: 'actions', sortable: false, width: '150px', align: 'center' },
    ]);

    const search = ref('');

    // Acciones de exportación
    const exportActions = ref([
      { icon: 'vscode-icons:file-type-pdf2', label: 'Exportar a PDF', format: 'PDF', color: '#F44336', handler: () => exportPlans('pdf') },
      { icon: 'vscode-icons:file-type-excel', label: 'Exportar a Excel', format: 'XLSX', color: '#4CAF50', handler: () => exportPlans('excel') },
      { icon: 'vscode-icons:file-type-word', label: 'Exportar a Word', format: 'DOCX', color: '#2196F3', handler: () => exportPlans('word') },
      { icon: 'vscode-icons:file-type-json', label: 'Exportar a JSON', format: 'JSON', color: '#FF9800', handler: () => exportPlans('json') }
    ]);

    // Diálogos y estados
    const planDialog = ref(false);
    const isEditing = ref(false);
    const saving = ref(false);
    const planForm = ref({
      id: null,
      name: "",
      type: "",
      duration: 0,
      difficulty: "",
      description: "",
      clients: []
    });

    // Funciones de ayuda
    const getChartColor = (index: number) => {
      const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
      return colors[index % colors.length];
    };

    const getPlanColor = (type: string) => {
      const typeColors: Record<string, string> = {
        'Inicial': '#2196F3',
        'Intermedio': '#4CAF50',
        'Avanzado': '#FF9800',
        'Especial': '#9C27B0'
      };
      return typeColors[type] || '#9E9E9E';
    };

    const getTypeColor = (type: string) => {
      const typeColors: Record<string, string> = {
        'Inicial': '#2196F3',
        'Intermedio': '#4CAF50',
        'Avanzado': '#FF9800',
        'Especial': '#9C27B0',
        'Personalizado': '#607D8B'
      };
      return typeColors[type] || '#9E9E9E';
    };

    const getDateColor = (date: string) => {
      const planDate = new Date(date);
      const today = new Date();
      const diffTime = today.getTime() - planDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) return '#4CAF50';
      if (diffDays <= 30) return '#FF9800';
      return '#F44336';
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Funciones de acción
    const changePlanFilter = (filter: string) => {
      planFilter.value = filter;
      // Aquí iría la lógica para filtrar los planes
    };

    const assignPlan = (plan: any) => {
      alert(`Asignando plan: ${plan.name}`);
    };

    const openAddPlanDialog = () => {
      planForm.value = {
        id: null,
        name: "",
        type: "",
        duration: 0,
        difficulty: "",
        description: "",
        clients: []
      };
      isEditing.value = false;
      planDialog.value = true;
    };

    const editPlan = (item: any) => {
      planForm.value = { ...item };
      isEditing.value = true;
      planDialog.value = true;
    };

    const savePlan = () => {
      saving.value = true;
      // Simular guardado asíncrono
      setTimeout(() => {
        if (isEditing.value) {
          const index = plans.value.findIndex(plan => plan.id === planForm.value.id);
          plans.value[index] = { ...planForm.value };
        } else {
          planForm.value.id = plans.value.length + 1;
          planForm.value.createdAt = new Date().toISOString().split('T')[0];
          plans.value.push({ ...planForm.value });
        }
        saving.value = false;
        planDialog.value = false;
      }, 1000);
    };

    const exportPlans = (format: string) => {
      alert(`Exportando planes en formato ${format.toUpperCase()}`);
    };

    // Computed
    const isFormValid = computed(() => {
      return (
        planForm.value.name.trim() !== '' &&
        planForm.value.type !== '' &&
        planForm.value.duration > 0 &&
        planForm.value.difficulty.trim() !== ''
      );
    });

    return {
      plans,
      planTypes,
      planFilter,
      planFilters,
      summaryCards,
      donutChartOptions,
      donutChartSeries,
      recentPlans,
      headers,
      search,
      exportActions,
      planDialog,
      isEditing,
      saving,
      planForm,
      isFormValid,
      changePlanFilter,
      assignPlan,
      openAddPlanDialog,
      editPlan,
      savePlan,
      exportPlans,
      getChartColor,
      getPlanColor,
      getTypeColor,
      getDateColor,
      formatDate
    };
  },
});
</script>

<style scoped lang="scss">
.training-plans-content {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

.training-plans-title {
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

.plans-table {
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

.form-dialog {
  border-radius: 16px;
  overflow: hidden;

  .v-card__title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    font-family: var(--fuente-titulo);
    padding: 20px 24px;
    border-bottom: 1px solid #e0e0e0;
    background: linear-gradient(to right, #f8f9fa, white);
  }

  .v-card__text {
    padding: 24px;
  }

  .v-card__actions {
    padding: 16px 24px;
    border-top: 1px solid #e0e0e0;
  }

  .cancel-btn {
    color: $color-texto-secundario;
    transition: all 0.3s ease;

    &:hover {
      color: $color-texto-principal;
    }
  }

  .save-btn {
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

/* Responsive */
@media (max-width: 960px) {
  .training-plans-title {
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
