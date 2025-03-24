<template>
  <v-container class="evaluations-dashboard">
    <!-- Título -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">Evaluaciones</h1>
      </v-col>
    </v-row>

    <!-- Resumen de satisfacción -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="satisfaction-card">
          <v-card-title class="text-h6 font-weight-bold d-flex justify-center">
            Satisfacción Promedio
          </v-card-title>
          <v-card-text class="text-center">
            <div class="satisfaction-summary">
              <v-icon size="80" color="success" class="mb-4">mdi-star</v-icon>
              <h2 class="text-h2 font-weight-bold">{{ averageRating }}%</h2>
              <p class="text-body-1 grey--text text--darken-1">Promedio de Satisfacción</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Comentarios recientes -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="comments-card">
          <v-card-title class="text-h6 font-weight-bold d-flex justify-center">
            Comentarios Recientes
          </v-card-title>
          <v-card-text>
            <v-timeline dense align-top>
              <v-timeline-item v-for="(comment, index) in comments" :key="index" small>
                <v-card elevation="2" rounded="lg" class="timeline-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    {{ comment.client }}
                  </v-card-title>
                  <v-card-text class="text-body-2 grey--text text--darken-1">
                    "{{ comment.text }}"
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import gsap from "gsap";

export default defineComponent({
  name: "EvaluationsView",
  setup() {
    // Datos ficticios para el promedio de satisfacción
    const averageRating = ref(87); // Porcentaje de satisfacción

    // Comentarios ficticios
    const comments = ref([
      { client: "Juan Pérez", text: "Excelente entrenador, muy motivador." },
      { client: "María López", text: "Muy buen seguimiento, me siento más fuerte." },
      { client: "Carlos Ramírez", text: "Podría mejorar la comunicación." },
    ]);

    // Animación inicial
    onMounted(() => {
      gsap.from(".satisfaction-summary", {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
      gsap.from(".timeline-card", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    return {
      averageRating,
      comments,
    };
  },
});
</script>

<style scoped>
.evaluations-dashboard {
  padding: 32px;
}

.satisfaction-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f9f9f9;
}

.comments-card {
  height: 100%;
  background-color: #f9f9f9;
}

.timeline-card {
  background-color: white;
  border-left: 4px solid #4a6cf7;
  padding: 16px;
}

.satisfaction-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
