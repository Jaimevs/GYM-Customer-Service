<template>
  <div class="faq-view">
    <!-- Título -->
    <h1 class="faq-title">Preguntas Frecuentes</h1>

    <!-- Lista de preguntas frecuentes -->
    <div class="faq-list">
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <!-- Pregunta -->
        <div class="faq-question" @click="toggleAnswer(index)">
          <h3>{{ faq.question }}</h3>
          <v-icon size="24" :class="{ 'rotate-icon': activeIndex === index }">mdi-chevron-down</v-icon>
        </div>

        <!-- Respuesta -->
        <transition name="slide-fade">
          <div v-if="activeIndex === index" class="faq-answer">
            <p>{{ faq.answer }}</p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Datos de las preguntas frecuentes
const faqs = [
  {
    question: '¿Qué horarios tienen?',
    answer: 'Estamos abiertos de 6 AM a 10 PM todos los días.',
  },
  {
    question: '¿Ofrecen clases grupales?',
    answer: 'Sí, ofrecemos yoga, spinning y más.',
  },
  {
    question: '¿Cómo puedo inscribirme?',
    answer: 'Regístrate en línea o visita cualquiera de nuestras sucursales.',
  },
];

// Estado para controlar qué respuesta está activa
const activeIndex = ref<number | null>(null);

// Función para alternar la respuesta
const toggleAnswer = (index: number) => {
  if (activeIndex.value === index) {
    activeIndex.value = null; // Cierra la respuesta si ya está abierta
  } else {
    activeIndex.value = index; // Abre la respuesta correspondiente
  }
};
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;
@use '@/styles/_mixins.scss' as *;

.faq-view {
  background-color: var(--color-fondo);
  padding-top: 64px;
  /* Espacio para el navbar */
  padding-bottom: 64px;
  /* Espacio para el footer */
  text-align: center;
}

/* Título */
.faq-title {
  font-family: var(--fuente-titulo);
  color: var(--color-titulos);
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 48px;

  @include media-query(small) {
    font-size: 2.5rem;
  }
}

/* Lista de preguntas frecuentes */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

.faq-item {
  background-color: var(--color-gris-oscuro);
  color: var(--color-texto);
  border-radius: var(--radio-borde);
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-hover);
  }

  h3 {
    font-family: var(--fuente-titulo);
    color: var(--color-botones);
    font-size: 1.25rem;
    margin: 0;

    @include media-query(small) {
      font-size: 1rem;
    }
  }

  .rotate-icon {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
  }
}

/* Respuesta */
.faq-answer {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  font-size: 1rem;
  line-height: 1.6;
  padding: 16px;
  background-color: var(--color-gris-claro);
  border-top: 1px solid var(--color-bordes);

  @include media-query(small) {
    font-size: 0.9rem;
  }
}

/* Animación de transición */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
