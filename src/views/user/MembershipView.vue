<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Mi Membresía</h1>
        <p class="text-subtitle-1">Gestiona tu membresía y estado actual.</p>
      </v-col>
    </v-row>

    <!-- Estado de la membresía -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Estado de la Membresía</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-account-star</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Plan Actual</v-list-item-title>
                  <v-list-item-subtitle>Premium</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-calendar-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Estado</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip color="success" small>Activo</v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-calendar-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Próxima Renovación</v-list-item-title>
                  <v-list-item-subtitle>15 de junio de 2025</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-cash</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Próximo Pago</v-list-item-title>
                  <v-list-item-subtitle>$49.99</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Gestionar Membresía</v-btn>
            <v-btn outlined color="primary">Historial de Pagos</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalles del plan -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Detalles del Plan</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-dumbbell</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Acceso Ilimitado</v-list-item-title>
                  <v-list-item-subtitle>Gimnasio y clases grupales</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Entrenador Personal</v-list-item-title>
                  <v-list-item-subtitle>1 sesión por semana</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-spa</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Acceso a Spa</v-list-item-title>
                  <v-list-item-subtitle>Incluido</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-ticket</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Descuentos Exclusivos</v-list-item-title>
                  <v-list-item-subtitle>En productos y servicios</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Lógica del componente (si es necesaria)
</script>

<style scoped>
/* Estilos personalizados */
.v-card {
  margin-bottom: 16px;
}
</style>
