<template>
  <div class="home-view">
    <!-- Sección Hero -->
    <HeroSection />

    <main class="main-content">
      <!-- Título Principal -->
      <div class="section-title-container" ref="titleContainer">
        <h1 class="section-title">Nuestros Servicios</h1>
      </div>

      <!-- Contenedor de Tarjetas -->
      <div class="features" ref="featuresContainer">
        <FeatureCard v-for="(feature, index) in features" :key="index" :icon="feature.icon" :title="feature.title"
          :description="feature.description" :data-index="index" class="feature-card" />
      </div>

      <!-- Nueva Sección: Call to Action -->
      <CallToActionSection title="¿Listo para comenzar?"
        description="Únete a nosotros hoy y comienza tu camino hacia una vida más saludable."
        buttonText="¡Regístrate ahora!" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import HeroSection from '@/components/home/HeroSection.vue';
import FeatureCard from '@/components/home/FeatureCard.vue';
import CallToActionSection from '@/components/home/CallToActionSection.vue';

// Datos de las características
const features = [
  {
    icon: 'guidance:personal-training',
    title: 'Entrenamiento Personalizado',
    description: 'Rutinas diseñadas por expertos para alcanzar tus metas.',
  },
  {
    icon: 'grommet-icons:group',
    title: 'Clases Grupales',
    description: 'Disfruta de clases dinámicas como spinning, yoga y crossfit.',
  },
  {
    icon: 'solar:dumbbells-bold',
    title: 'Equipamiento Profesional',
    description: 'Acceso a máquinas y equipos de alta calidad para todos los niveles.',
  },
  {
    icon: 'carbon:running',
    title: 'Zona de Cardio',
    description: 'Máquinas de cardio para mejorar tu resistencia y salud cardiovascular.',
  },
  {
    icon: 'map:spa',
    title: 'Sauna y Spa',
    description: 'Relájate después del entrenamiento en nuestra zona de sauna.',
  },
  {
    icon: 'medical-icon:i-nutrition',
    title: 'Nutrición y Dietas Personalizadas',
    description: 'Planes nutricionales adaptados a tus objetivos y necesidades.',
  },
];

// Referencias
const titleContainer = ref(null);
const featuresContainer = ref(null);

onMounted(() => {
  // Inicializar GSAP y ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Animación del título
  if (titleContainer.value) {
    const titleElement = titleContainer.value.querySelector('.section-title');

    gsap.from(titleElement, {
      scrollTrigger: {
        trigger: titleContainer.value,
        start: 'top 80%', // Activa la animación cuando el título está al 80% en la pantalla
        toggleActions: 'play none none reverse', // Reproduce la animación solo una vez
      },
      opacity: 0, // Comienza invisible
      y: 50, // Desplazamiento hacia abajo
      duration: 1, // Duración de la animación
      ease: 'power3.out', // Función de tiempo suave
      onComplete: () => {
        // Efecto de iluminación final
        gsap.to(titleElement, {
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)', // Sombra ligera
          duration: 0.6,
          ease: 'power2.inOut',
        });
      },
    });
  }

  // Animación de las tarjetas
  if (featuresContainer.value) {
    const cards = featuresContainer.value.querySelectorAll('.feature-card'); // Buscamos los elementos con la clase "feature-card"

    gsap.from(cards, {
      scrollTrigger: {
        trigger: featuresContainer.value,
        start: 'top 80%', // Activa la animación cuando la sección está al 80% en la pantalla
        toggleActions: 'play none none reverse', // Reproduce la animación solo una vez
      },
      opacity: 0, // Comienza invisible
      y: 50, // Desplazamiento hacia abajo
      scale: 0.9, // Escalado inicial
      duration: 0.8, // Duración de la animación
      stagger: 0.2, // Retraso entre cada tarjeta
      ease: 'power3.out', // Función de tiempo suave
      onComplete: () => {
        gsap.set(cards, { clearProps: 'all' }); // Limpia las propiedades después de la animación
      },
    });

    // Efecto de sombra dinámica
    gsap.to(cards, {
      scrollTrigger: {
        trigger: featuresContainer.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', // Sombra dinámica
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.inOut',
    });
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1;

  .main-content {
    flex: 1;
    padding: $espaciado-extra-grande;

    @include media-query(small) {
      padding: $espaciado-pequeño;
    }
  }

  .section-title-container {
    text-align: center;
    margin-bottom: $espaciado-extra-grande;

    .section-title {
      font-family: $fuente-titulo;
      font-size: 2.5rem;
      font-weight: bold;
      color: $color-rojo-vibrante;
      letter-spacing: 1px;

      @include media-query(small) {
        font-size: 2rem;
      }
    }
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $espaciado-grande;
    margin-top: $espaciado-extra-grande;
    text-align: center;

    /* Estilos específicos para las tarjetas */
    .feature-card {
      opacity: 1; // Inicialmente visibles
      transform: none; // Sin desplazamiento
      transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;

      width: 100%;
      max-width: 350px;
      min-height: 280px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: $radio-borde;
      padding: $espaciado-base;
      background-color: $color-blanco;
      box-shadow: $sombra-suave;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-8px);
        box-shadow: $sombra-fuerte;

        .custom-title {
          color: $color-rojo-vibrante;
        }

        .custom-description {
          color: $color-texto-principal;
        }
      }
    }

    .feature-icon-container {
      margin-bottom: $espaciado-base;

      .feature-icon {
        font-size: 60px;
        color: $color-rojo-vibrante;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1);

        /* Cambia el color del ícono al pasar el mouse */
        &:hover {
          transform: scale(1.2);
          color: $color-negro;
        }
      }
    }

    .custom-title {
      font-family: $fuente-titulo;
      font-size: 1.5rem;
      font-weight: bold;
      color: $color-negro;
      margin-bottom: $espaciado-pequeño;
      transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1);

      @include media-query(small) {
        font-size: 1.2rem;
      }
    }

    .custom-description {
      font-family: $fuente-principal;
      font-size: 1rem;
      font-weight: 500;
      color: $color-texto-secundario;
      line-height: 1.6;
      text-align: center;
      transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1);

      @include media-query(small) {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
