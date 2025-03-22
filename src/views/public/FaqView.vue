<template>
  <div class="faq-view">
    <h1>Preguntas Frecuentes</h1>
    <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
      <h3>{{ faq.question }}</h3>
      <p>{{ faq.answer }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const faqs = [
  { question: '¿Qué horarios tienen?', answer: 'Estamos abiertos de 6 AM a 10 PM todos los días.' },
  { question: '¿Ofrecen clases grupales?', answer: 'Sí, ofrecemos yoga, spinning y más.' },
  { question: '¿Cómo puedo inscribirme?', answer: 'Regístrate en línea o visita cualquiera de nuestras sucursales.' },
];
</script>

<style scoped>
.faq-view {
  text-align: center;
}

.faq-item {
  border-bottom: 1px solid #ccc;
  padding: 15px 0;
  text-align: left;
}

h3 {
  color: #4a6cf7;
}
</style>
