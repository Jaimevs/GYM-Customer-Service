<template>
  <v-container class="dashboard-content">
    <!-- Sección de Bienvenida -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>¡Bienvenido de nuevo!</v-card-title>
          <v-card-subtitle>Aquí tienes un resumen de tu progreso hoy</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <div class="progress-item">
                  <span class="text-sm font-medium">Objetivo Semanal</span>
                  <v-progress-linear :value="60" height="8" color="primary"></v-progress-linear>
                  <span class="text-xs text-muted">3/5 entrenamientos completados</span>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="progress-item">
                  <span class="text-sm font-medium">Visitas Mensuales</span>
                  <v-progress-linear :value="75" height="8" color="primary"></v-progress-linear>
                  <span class="text-xs text-muted">12/16 visitas</span>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="progress-item">
                  <span class="text-sm font-medium">Objetivo de Peso</span>
                  <v-progress-linear :value="40" height="8" color="primary"></v-progress-linear>
                  <span class="text-xs text-muted">4/10 kg perdidos</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="primary">Ver Progreso Detallado</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Estado de Membresía</v-card-title>
          <v-card-text>
            <div class="membership-info">
              <div class="info-item">
                <span class="text-sm font-medium">Plan:</span>
                <v-chip color="primary" small>Premium</v-chip>
              </div>
              <div class="info-item">
                <span class="text-sm font-medium">Estado:</span>
                <span class="text-sm text-success">Activo</span>
              </div>
              <div class="info-item">
                <span class="text-sm font-medium">Renovación:</span>
                <span class="text-sm">15 de junio de 2025</span>
              </div>
              <v-divider class="my-3"></v-divider>
              <div class="info-item">
                <span class="text-sm font-medium">Próximo Pago:</span>
                <span class="text-sm">$49.99</span>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block>Gestionar Membresía</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Clases Próximas -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Clases Próximas</v-card-title>
          <v-card-subtitle>Clases que has reservado para los próximos 7 días</v-card-subtitle>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(classItem, index) in upcomingClasses" :key="index">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ classItem.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ classItem.time }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-chip outlined>Confirmado</v-chip>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="primary">Ver Todas las Clases</v-btn>
            <v-btn color="primary">Reservar una Clase</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Seguimiento de Progreso -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-tabs v-model="activeTab">
            <v-tab value="weight">Peso</v-tab>
            <v-tab value="measurements">Medidas</v-tab>
            <v-tab value="activity">Actividad</v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-items v-model="activeTab">
              <v-tab-item value="weight">
                <div class="chart-placeholder">
                  <p>Gráfica de peso aquí</p>
                </div>
                <v-row class="mt-4">
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Inicio</p>
                        <p class="text-lg font-medium">85 kg</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Actual</p>
                        <p class="text-lg font-medium">81 kg</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Objetivo</p>
                        <p class="text-lg font-medium">75 kg</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Perdido</p>
                        <p class="text-lg font-medium">4 kg</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item value="measurements">
                <div class="chart-placeholder">
                  <p>Gráfica de medidas aquí</p>
                </div>
                <v-row class="mt-4">
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Pecho</p>
                        <p class="text-lg font-medium">102 cm</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Cintura</p>
                        <p class="text-lg font-medium">88 cm</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Cadera</p>
                        <p class="text-lg font-medium">98 cm</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Bíceps</p>
                        <p class="text-lg font-medium">36 cm</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item value="activity">
                <div class="chart-placeholder">
                  <p>Gráfica de actividad aquí</p>
                </div>
                <v-row class="mt-4">
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Esta Semana</p>
                        <p class="text-lg font-medium">3 visitas</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Este Mes</p>
                        <p class="text-lg font-medium">12 visitas</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Duración Promedio</p>
                        <p class="text-lg font-medium">65 min</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-card outlined>
                      <v-card-text>
                        <p class="text-sm text-muted">Racha</p>
                        <p class="text-lg font-medium">5 días</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="primary">Actualizar Progreso</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Planes de Entrenamiento -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Plan de Entrenamiento Actual</v-card-title>
          <v-card-subtitle>Tu rutina de ejercicios personalizada</v-card-subtitle>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(plan, index) in trainingPlans" :key="index">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-dumbbell</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ plan.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ plan.schedule }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-btn outlined color="primary">Ver</v-btn>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="primary">Solicitar Cambios</v-btn>
            <v-btn color="primary">Agendar con Entrenador</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// Clases próximas
const upcomingClasses = ref([
  { name: 'Entrenamiento HIIT', time: 'Hoy, 6:00 PM - 7:00 PM' },
  { name: 'Clase de Yoga', time: 'Mañana, 8:00 AM - 9:00 AM' },
  { name: 'Spinning', time: 'Viernes, 5:30 PM - 6:30 PM' },
]);

// Planes de entrenamiento
const trainingPlans = ref([
  { name: 'Fuerza Superior', schedule: 'Lunes y Jueves' },
  { name: 'Enfoque en Piernas', schedule: 'Martes y Viernes' },
  { name: 'Cardio y Core', schedule: 'Miércoles y Sábado' },
]);

// Seguimiento de progreso
const activeTab = ref('weight');
</script>

<style scoped>
.progress-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.membership-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #e0e0e0;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #9e9e9e;
  font-size: 14px;
}
</style>
