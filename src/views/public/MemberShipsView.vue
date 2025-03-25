<template>
  <v-container class="membership-container">
    <!-- Encabezado con animación -->
    <div class="text-center mb-10 header-section" ref="headerSection">
      <h1 class="gradient-title mb-4" ref="title">Elige tu Membresía Ideal</h1>
      <p class="subtitle" ref="subtitle">Compara nuestras opciones y selecciona la que mejor se adapte a tus necesidades
      </p>
    </div>

    <!-- Versión móvil (tarjetas) -->
    <div v-if="isMobile" class="mobile-view">
      <v-row>
        <v-col cols="12" v-for="(membership, index) in memberships" :key="index">
          <v-card :class="['membership-card', `card-${index}`]" elevation="3"
            :ref="el => { if (el) mobileCards[index] = el }">
            <v-card-title class="card-title">
              {{ membership.name }}
              <v-chip class="price-chip" color="primary">{{ membership.price }}</v-chip>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="features-list">
              <div v-for="(feature, fIndex) in features" :key="fIndex" class="feature-item">
                <v-icon :color="membership.features[fIndex].included ? 'success' : 'error'">
                  {{ membership.features[fIndex].included ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                <span class="feature-text">{{ feature.name }}</span>
              </div>
            </v-card-text>

            <v-card-actions class="card-actions">
              <v-btn color="primary" block large @click="selectMembership(membership)" class="buy-btn">
                Seleccionar
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Versión desktop (tabla comparativa) -->
    <div v-else class="desktop-view" ref="desktopTable">
      <v-card class="comparison-table" elevation="3">
        <v-table>
          <thead>
            <tr>
              <th class="feature-header">Beneficios</th>
              <th v-for="(membership, index) in memberships" :key="index" class="membership-header">
                <div class="membership-title">{{ membership.name }}</div>
                <div class="membership-price">{{ membership.price }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(feature, fIndex) in features" :key="fIndex">
              <td class="feature-name">{{ feature.name }}</td>
              <td v-for="(membership, mIndex) in memberships" :key="mIndex" class="feature-value">
                <v-icon :color="membership.features[fIndex].included ? 'success' : 'error'" size="24">
                  {{ membership.features[fIndex].included ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
              </td>
            </tr>
            <tr>
              <td></td>
              <td v-for="(membership, index) in memberships" :key="index" class="action-cell">
                <v-btn color="primary" large block @click="selectMembership(membership)" class="buy-btn">
                  Seleccionar
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>

    <!-- Beneficios adicionales -->
    <div class="additional-benefits mt-10" ref="benefitsSection">
      <h2 class="text-center mb-6" ref="benefitsTitle">Beneficios Adicionales</h2>
      <v-row>
        <v-col cols="12" md="4" v-for="(benefit, index) in additionalBenefits" :key="index">
          <v-card class="benefit-card" elevation="2" :ref="el => { if (el) benefitCards[index] = el }">
            <v-icon size="48" class="benefit-icon">{{ benefit.icon }}</v-icon>
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-description">{{ benefit.description }}</p>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugins necesarios
gsap.registerPlugin(ScrollTrigger);

export default {
  setup() {
    const router = useRouter();
    const isMobile = ref(false);

    // Refs para elementos del DOM
    const headerSection = ref(null);
    const title = ref(null);
    const subtitle = ref(null);
    const desktopTable = ref(null);
    const benefitsSection = ref(null);
    const benefitsTitle = ref(null);
    const mobileCards = ref([]);
    const benefitCards = ref([]);

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 960;
    };

    const animateElements = () => {
      // Verificar que todos los elementos existan antes de animar
      if (!title.value || !subtitle.value) return;

      // Configuración global de GSAP
      gsap.defaults({
        duration: 0.8,
        ease: "power2.out"
      });

      // Animación para el encabezado
      gsap.from([title.value, subtitle.value], {
        y: 50,
        opacity: 0,
        stagger: 0.2
      });

      if (isMobile.value) {
        // Animación para tarjetas móviles
        mobileCards.value.forEach((card, index) => {
          if (card) {
            gsap.from(card, {
              y: 30,
              opacity: 0,
              delay: index * 0.15,
              ease: "back.out(1.7)"
            });
          }
        });
      } else if (desktopTable.value) {
        // Animación para tabla desktop
        gsap.from(desktopTable.value, {
          opacity: 0,
          y: 40
        });
      }

      // Configurar ScrollTrigger para animaciones al hacer scroll
      if (benefitsSection.value && benefitsTitle.value) {
        ScrollTrigger.create({
          trigger: benefitsSection.value,
          start: "top 80%",
          onEnter: () => {
            // Animación para título de beneficios
            gsap.from(benefitsTitle.value, {
              y: 30,
              opacity: 0
            });

            // Animación para tarjetas de beneficios
            benefitCards.value.forEach((card, index) => {
              if (card) {
                gsap.from(card, {
                  y: 40,
                  opacity: 0,
                  delay: index * 0.1,
                  ease: "back.out(1.7)"
                });
              }
            });
          }
        });
      }
    };

    onMounted(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);

      // Esperar a que el DOM esté completamente renderizado
      nextTick(() => {
        animateElements();
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkMobile);
      // Limpiar todas las instancias de ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf("*");
    });

    const selectMembership = (event, membership) => {
      // Animación al hacer clic en el botón
      if (event.target) {
        gsap.to(event.target, {
          duration: 0.3,
          scale: 0.95,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          onComplete: () => {
            router.push('/compra-membresia');
          }
        });
      } else {
        router.push('/compra-membresia');
      }
    };

    return {
      isMobile,
      selectMembership,
      headerSection,
      title,
      subtitle,
      desktopTable,
      benefitsSection,
      benefitsTitle,
      mobileCards,
      benefitCards,
      memberships: [
        {
          name: "Básica",
          price: "$500/mes",
          features: [
            { included: true },
            { included: true },
            { included: true },
            { included: false },
            { included: false },
            { included: false },
            { included: false }
          ]
        },
        {
          name: "Estándar",
          price: "$1,000/mes",
          features: [
            { included: true },
            { included: true },
            { included: true },
            { included: true },
            { included: false },
            { included: false },
            { included: false }
          ]
        },
        {
          name: "Premium",
          price: "$2,000/mes",
          features: [
            { included: true },
            { included: true },
            { included: true },
            { included: true },
            { included: true },
            { included: true },
            { included: true }
          ]
        }
      ],
      features: [
        { name: "Acceso a equipos básicos" },
        { name: "Clases grupales" },
        { name: "Área de cardio" },
        { name: "Área de pesas" },
        { name: "Entrenador personal (1 sesión/semana)" },
        { name: "Acceso ilimitado a clases premium" },
        { name: "Área VIP y locker personal" }
      ],
      additionalBenefits: [
        {
          icon: "mdi-lock",
          title: "Acceso Seguro",
          description: "Acceso biométrico las 24 horas con tu membresía"
        },
        {
          icon: "mdi-water",
          title: "Regaderas Premium",
          description: "Área de regaderas con productos de alta calidad"
        },
        {
          icon: "mdi-wifi",
          title: "WiFi de Alta Velocidad",
          description: "Conectividad en todas las áreas del gimnasio"
        }
      ]
    };
  }
};
</script>

<style scoped>
/* Ajustes específicos para el espaciado */
.membership-container {
  max-width: 1200px;
  padding: 40px 20px;
  padding-top: 80px;
  /* Añadido para compensar el navbar */
}

.gradient-title {
  background: linear-gradient(90deg, #c92020, #ec4305);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  color: #616161;
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
}

/* Estilos para móvil (tarjetas) */
.mobile-view {
  margin: 20px 0;
}

.membership-card {
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;
}

.membership-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.price-chip {
  font-size: 1rem;
  font-weight: 600;
  height: 32px;
}

.features-list {
  padding: 20px;
  flex-grow: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.feature-item .v-icon {
  margin-right: 10px;
}

.feature-text {
  font-size: 0.95rem;
}

.card-actions {
  padding: 0 20px 20px;
}

/* Estilos para desktop (tabla) */
.comparison-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-header {
  font-weight: 600;
  font-size: 1.1rem;
  background-color: #f5f5f5;
  width: 25%;
}

.membership-header {
  background-color: #c92020;
  color: white !important;
  text-align: center;
  padding: 20px !important;
}

.membership-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.membership-price {
  font-size: 1.2rem;
  font-weight: 500;
}

.feature-name {
  font-weight: 500;
  padding: 16px 24px !important;
  border-bottom: 1px solid #e0e0e0;
}

.feature-value {
  text-align: center;
  padding: 16px 24px !important;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
}

.action-cell {
  padding: 20px !important;
  text-align: center;
}

/* Botones */
.buy-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  border-radius: 8px;
}

/* Beneficios adicionales */
.benefit-card {
  padding: 30px;
  text-align: center;
  height: 100%;
  transition: transform 0.3s ease;
  border-radius: 12px;
}

.benefit-card:hover {
  transform: translateY(-5px);
}

.benefit-icon {
  margin-bottom: 20px;
  color: #3f51b5;
}

.benefit-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #212121;
}

.benefit-description {
  color: #616161;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 960px) {
  .gradient-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .membership-title {
    font-size: 1.2rem;
  }

  .membership-price {
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .membership-container {
    padding: 20px 10px;
  }

  .gradient-title {
    font-size: 1.8rem;
  }

  .feature-item .v-icon {
    font-size: 20px;
  }

  .feature-text {
    font-size: 0.85rem;
  }

  .benefit-card {
    padding: 20px;
  }
}
</style>
