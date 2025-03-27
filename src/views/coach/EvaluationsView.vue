<template>
  <div class="evaluations-dashboard">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="evaluations-title">
          <span class="title-text">Evaluaciones</span>
          <span class="title-highlight"></span>
        </h1>
        <p class="welcome-message">Revisa el feedback de tus clientes</p>
      </v-col>
    </v-row>

    <!-- Tarjetas de Métricas con estilo unificado -->
    <v-row class="metrics-section">
      <v-col cols="12" md="4" data-aos="fade-up" data-aos-delay="100">
        <v-card class="metric-card" elevation="4">
          <div class="metric-content">
            <div class="chart-icon-bg">
              <Icon icon="mdi:star" width="24" />
            </div>
            <div class="metric-info">
              <h3 class="metric-title">Satisfacción</h3>
              <p class="metric-value">{{ averageRating }}%</p>
              <v-btn text small class="metric-link" @click="showAllRatings">
                Ver detalles
                <Icon icon="mdi:chevron-right" right small />
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" data-aos="fade-up" data-aos-delay="200">
        <v-card class="metric-card" elevation="4">
          <div class="metric-content">
            <div class="chart-icon-bg">
              <Icon icon="mdi:comment-text" width="24" />
            </div>
            <div class="metric-info">
              <h3 class="metric-title">Comentarios</h3>
              <p class="metric-value">{{ comments.length }}</p>
              <v-btn text small class="metric-link" @click="showAllComments">
                Ver todos
                <Icon icon="mdi:chevron-right" right small />
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" data-aos="fade-up" data-aos-delay="300">
        <v-card class="metric-card" elevation="4">
          <div class="metric-content">
            <div class="chart-icon-bg">
              <Icon icon="mdi:account-group" width="24" />
            </div>
            <div class="metric-info">
              <h3 class="metric-title">Clientes Evaluados</h3>
              <p class="metric-value">{{ evaluatedClients }}</p>
              <v-btn text small class="metric-link" @click="showClientList">
                Ver lista
                <Icon icon="mdi:chevron-right" right small />
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contenido Principal -->
    <v-row class="main-content-section">
      <!-- Gráfico de Satisfacción -->
      <v-col cols="12" md="6" data-aos="fade-right" data-aos-delay="200">
        <v-card class="chart-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="mdi:chart-bar" width="24" />
            </div>
            <h2>Distribución de Valoraciones</h2>
          </div>
          <v-card-text class="text-center">
            <apexchart type="radialBar" height="300" :options="ratingChart.options" :series="ratingChart.series">
            </apexchart>
            <div class="d-flex justify-space-around mt-2">
              <v-chip v-for="(label, index) in ratingChart.options.labels" :key="index" :color="getRatingColor(index)"
                text-color="white" small class="px-3">
                {{ label }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Comentarios Recientes -->
      <v-col cols="12" md="6" data-aos="fade-left" data-aos-delay="300">
        <v-card class="comments-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="mdi:comment-quote" width="24" />
            </div>
            <h2>Comentarios Recientes</h2>
            <v-spacer></v-spacer>
            <v-btn icon @click="refreshComments">
              <Icon icon="mdi:refresh" />
            </v-btn>
          </div>
          <v-card-text>
            <v-list class="comments-list">
              <v-list-item v-for="(comment, index) in comments" :key="index" class="comment-item">
                <v-list-item-content>
                  <v-list-item-title class="client-name">{{ comment.client }}</v-list-item-title>
                  <v-list-item-subtitle class="comment-date">
                    {{ formatDate(comment.date) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="comment-text">
                    "{{ comment.text }}"
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip small :color="getRatingColor(comment.rating - 1)" dark>
                    <Icon icon="mdi:star" left small />
                    {{ comment.rating }}/5
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn block color="primary" class="mt-4" @click="showAllComments">
              Ver todos los comentarios
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import AOS from "aos";
import "aos/dist/aos.css";
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: "EvaluationsView",
  components: {
    apexchart: VueApexCharts,
    Icon
  },
  setup() {
    onMounted(() => {
      AOS.init({
        duration: 800,
        once: true,
        easing: "ease-in-out-quad",
      });
    });

    const averageRating = ref(87);
    const evaluatedClients = ref(24);
    const comments = ref([
      {
        client: "Juan Pérez",
        text: "Excelente entrenador, muy motivador. He logrado mis objetivos más rápido de lo esperado.",
        rating: 5,
        date: "2023-10-15",
      },
      {
        client: "María López",
        text: "Muy buen seguimiento, me siento más fuerte y con mejor condición física.",
        rating: 4,
        date: "2023-10-12",
      },
      {
        client: "Carlos Ramírez",
        text: "Podría mejorar la comunicación entre sesiones, pero el entrenamiento es efectivo.",
        rating: 3,
        date: "2023-10-10",
      },
      {
        client: "Ana García",
        text: "Las rutinas son desafiantes pero adaptadas a mi nivel. Muy profesional.",
        rating: 5,
        date: "2023-10-08",
      },
    ]);

    const ratingChart = ref({
      options: {
        chart: {
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: "14px",
                color: "#333",
              },
              value: {
                fontSize: "20px",
                fontWeight: "bold",
                color: "#333",
              },
              total: {
                show: true,
                label: "Promedio",
                color: "#333",
                formatter: () => averageRating.value + "%",
              },
            },
          },
        },
        labels: ["5 Estrellas", "4 Estrellas", "3 Estrellas", "2 Estrellas", "1 Estrella"],
        colors: ["#FF7043", "#FFB74D", "#FFD54F", "#FFA000", "#F57C00"],
      },
      series: [65, 20, 8, 4, 3],
    });

    const getRatingColor = (index: number) => {
      const colors = ["#FF7043", "#FFB74D", "#FFD54F", "#FFA000", "#F57C00"];
      return colors[index];
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const showAllRatings = () => {
      console.log("Mostrar todas las valoraciones");
    };

    const showAllComments = () => {
      console.log("Mostrar todos los comentarios");
    };

    const showClientList = () => {
      console.log("Mostrar lista de clientes evaluados");
    };

    const refreshComments = () => {
      console.log("Refrescando comentarios...");
    };

    return {
      averageRating,
      evaluatedClients,
      comments,
      ratingChart,
      getRatingColor,
      formatDate,
      showAllRatings,
      showAllComments,
      showClientList,
      refreshComments,
    };
  },
});
</script>

<style scoped lang="scss">
.evaluations-dashboard {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

/* Título */
.evaluations-title {
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

.welcome-message {
  font-size: 1rem;
  color: #5D4037;
  margin-top: 8px;
}

/* Tarjetas de Métricas */
.metrics-section {
  margin-bottom: 24px;

  .metric-card {
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    margin-top: 24px;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    }

    .metric-content {
      display: flex;
      align-items: center;
      padding: 24px;
      position: relative;

      .chart-icon-bg {
        width: 40px;
        height: 40px;
        background: rgba(255, 112, 67, 0.1);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        color: #FF7043;
      }

      .metric-info {
        .metric-title {
          font-size: 0.9rem;
          font-weight: 500;
          color: #616161;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
        }

        .metric-link {
          padding: 0;
          text-transform: none;
          letter-spacing: normal;
          font-size: 0.8rem;
          color: #FF7043 !important;
        }
      }
    }
  }
}

/* Tarjetas de contenido */
.chart-card,
.comments-card {
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  margin-top: 24px;

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e0e0e0;

    h2 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .chart-icon-bg {
      width: 40px;
      height: 40px;
      background: rgba(255, 112, 67, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #FF7043;
    }
  }
}

/* Lista de comentarios */
.comments-list {
  padding: 0;

  .comment-item {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    border-radius: 12px;
    background-color: #FFF3E0;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .client-name {
      font-weight: bold;
      color: #333;
    }

    .comment-date {
      color: #5D4037;
      font-size: 0.875rem;
    }

    .comment-text {
      font-style: italic;
      color: #424242;
      margin-top: 8px;
    }
  }
}

/* Botón primario */
.v-btn {
  &.primary {
    background: linear-gradient(45deg, #FF7043, #FFB74D);
    color: white;
    font-weight: 600;

    &:hover {
      box-shadow: 0 4px 8px rgba(255, 112, 67, 0.3) !important;
    }
  }
}

/* Responsive */
@media (max-width: 960px) {
  .evaluations-title .title-text {
    font-size: 1.75rem;
  }

  .title-highlight {
    height: 8px;
    bottom: 3px;
  }

  .metrics-section {
    .metric-card {
      .metric-content {
        padding: 16px;
      }
    }
  }
}

@media (max-width: 600px) {
  .evaluations-dashboard {
    padding: 16px;
  }
}
</style>
