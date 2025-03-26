<template>
  <v-container class="membership-view">
    <!-- Título de la página con animación -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <Icon icon="solar:card-bold" width="36" class="mr-3 text-primary" />
          <h1 class="text-h3 font-weight-bold text-gradient">Mi Membresía</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis">
          Gestiona tu membresía y estado actual
        </p>
      </v-col>
    </v-row>

    <!-- Estado de la membresía -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up">
        <v-card class="h-100" elevation="4">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:card-holder-bold" width="24" class="mr-2" />
            <span>Estado de la Membresía</span>
            <v-spacer></v-spacer>
            <v-chip small color="primary">
              Premium
            </v-chip>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" v-for="(item, index) in membershipStatus" :key="index" data-aos="fade-up"
                :data-aos-delay="100 * index">
                <v-card variant="outlined" class="h-100">
                  <v-card-text class="d-flex align-center">
                    <Icon :icon="item.icon" width="24" class="mr-3" :class="`text-${item.color}`" />
                    <div>
                      <div class="text-subtitle-1 font-weight-medium">{{ item.title }}</div>
                      <div class="text-body-1">
                        <template v-if="item.chip">
                          <v-chip :color="item.chipColor" size="small">{{ item.value }}</v-chip>
                        </template>
                        <template v-else>
                          {{ item.value }}
                        </template>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="manageMembership" data-aos="zoom-in">
              Gestionar Membresía
              <Icon icon="solar:arrow-right-bold" class="ml-1" />
            </v-btn>
            <v-btn variant="text" color="secondary" @click="viewPaymentHistory" data-aos="zoom-in" data-aos-delay="100">
              Historial de Pagos
              <Icon icon="solar:arrow-right-bold" class="ml-1" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Beneficios del plan -->
    <v-row class="mb-6">
      <v-col cols="12" data-aos="fade-up" data-aos-delay="200">
        <v-card class="h-100" elevation="4">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:medal-star-bold" width="24" class="mr-2" />
            <span>Beneficios de tu Plan</span>
            <v-spacer></v-spacer>
            <v-chip small color="secondary">
              Premium
            </v-chip>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" v-for="(benefit, index) in planBenefits" :key="index" data-aos="fade-up"
                :data-aos-delay="150 * index">
                <v-card class="benefit-card" :color="benefit.highlight ? 'primary' : undefined">
                  <v-card-text class="text-center">
                    <Icon :icon="benefit.icon" width="32" class="mb-2"
                      :class="benefit.highlight ? 'text-white' : `text-${benefit.color}`" />
                    <div :class="`text-subtitle-1 font-weight-medium ${benefit.highlight ? 'text-white' : ''}`">
                      {{ benefit.title }}
                    </div>
                    <div :class="`text-body-2 ${benefit.highlight ? 'text-white' : 'text-medium-emphasis'}`">
                      {{ benefit.description }}
                    </div>
                    <v-chip v-if="benefit.tag" small :color="benefit.highlight ? 'white' : benefit.tagColor"
                      class="mt-2" :text-color="benefit.highlight ? 'primary' : undefined">
                      {{ benefit.tag }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Renovación -->
    <v-row class="mb-6" data-aos="fade-up" data-aos-delay="300">
      <v-col cols="12">
        <v-card elevation="4">
          <v-card-title class="d-flex align-center">
            <Icon icon="solar:calendar-mark-bold" width="24" class="mr-2" />
            <span>Próxima Renovación</span>
            <v-spacer></v-spacer>
            <v-chip small color="teal">
              15 Junio 2025
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-end">
                <p class="text-h3 font-weight-bold mr-2">45</p>
                <p class="text-h6 text-medium-emphasis">días restantes</p>
              </div>
              <div class="d-flex align-end">
                <p class="text-h3 font-weight-bold mr-2">$49.99</p>
                <p class="text-h6 text-medium-emphasis">próximo pago</p>
              </div>
            </div>
            <v-progress-linear :model-value="75" height="8" color="primary" rounded striped
              class="mt-4"></v-progress-linear>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="renewNow" data-aos="zoom-in">
              Renovar Ahora
              <Icon icon="solar:arrow-right-bold" class="ml-1" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Añadido onMounted aquí
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';

// Inicializar animaciones
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });
});

// Datos de estado de membresía
const membershipStatus = ref([
  {
    icon: 'solar:medal-ribbon-bold',
    title: 'Plan Actual',
    value: 'Premium',
    color: 'primary'
  },
  {
    icon: 'solar:shield-check-bold',
    title: 'Estado',
    value: 'Activo',
    chip: true,
    chipColor: 'success',
    color: 'success'
  },
  {
    icon: 'solar:calendar-mark-bold',
    title: 'Próxima Renovación',
    value: '15 de junio de 2025',
    color: 'secondary'
  },
  {
    icon: 'solar:wallet-money-bold',
    title: 'Próximo Pago',
    value: '$49.99',
    color: 'primary'
  }
]);

// Beneficios del plan
const planBenefits = ref([
  {
    icon: 'solar:dumbbell-bold',
    title: 'Acceso Ilimitado',
    description: 'Gimnasio y clases grupales',
    color: 'primary',
    highlight: true
  },
  {
    icon: 'solar:user-hand-up-bold',
    title: 'Entrenador Personal',
    description: '1 sesión por semana incluida',
    color: 'secondary',
    tag: 'Nuevo',
    tagColor: 'secondary'
  },
  {
    icon: 'solar:spa-bold',
    title: 'Acceso a Spa',
    description: 'Área premium de relajación',
    color: 'teal'
  },
  {
    icon: 'solar:tag-price-bold',
    title: 'Descuentos',
    description: '20% en productos y servicios',
    color: 'primary'
  },
  {
    icon: 'solar:waterdrop-bold',
    title: 'Bebidas Gratis',
    description: 'Agua y bebidas isotónicas',
    color: 'primary'
  },
  {
    icon: 'solar:users-group-two-rounded-bold',
    title: 'Invitados',
    description: '2 invitados gratis por mes',
    color: 'secondary'
  }
]);

// Métodos
const manageMembership = () => {
  console.log('Gestionar membresía');
};

const viewPaymentHistory = () => {
  console.log('Ver historial de pagos');
};

const renewNow = () => {
  console.log('Renovar ahora');
};
</script>

<style scoped lang="scss">
.membership-view {
  max-width: 1200px;
  margin: 0 auto;
}

.text-gradient {
  background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.benefit-card {
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
  }
}

.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 12px;
}

.v-card-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
