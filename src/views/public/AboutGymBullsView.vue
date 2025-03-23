<template>
  <div class="about-view">
    <!-- Sección principal -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Conoce GYM BULLS</h1>
        <p class="hero-description">
          GYM BULLS es un gimnasio dedicado a ayudarte a alcanzar tus metas fitness. Nuestro enfoque está en brindar un
          ambiente inclusivo, profesional y motivador para todos nuestros miembros.
        </p>
      </div>
    </section>

    <!-- Misión y valores -->
    <section class="mission-values-section">
      <div class="mission-card">
        <v-icon class="section-icon">mdi-bullseye-arrow</v-icon>
        <h2 class="section-title">Nuestra Misión</h2>
        <p class="section-text">
          En GYM BULLS, nuestra misión es transformar vidas a través del fitness. Nos comprometemos a ofrecer
          instalaciones de primer nivel, equipos modernos y programas personalizados para ayudarte a alcanzar tus
          objetivos.
        </p>
      </div>

      <div class="values-card">
        <v-icon class="section-icon">mdi-heart-multiple</v-icon>
        <h2 class="section-title">Nuestros Valores</h2>
        <ul class="values-list">
          <li><v-icon class="list-icon">mdi-check</v-icon> Inclusión: Todos son bienvenidos.</li>
          <li><v-icon class="list-icon">mdi-check</v-icon> Profesionalismo: Equipos y entrenadores de alta calidad.</li>
          <li><v-icon class="list-icon">mdi-check</v-icon> Motivación: Creamos un ambiente inspirador.</li>
          <li><v-icon class="list-icon">mdi-check</v-icon> Compromiso: Siempre estamos contigo en tu camino fitness.
          </li>
        </ul>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="testimonials-section">
      <h2 class="section-title">Lo que dicen nuestros miembros</h2>
      <div class="testimonials-grid">
        <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-card">
          <p class="testimonial-text">{{ testimonial.text }}</p>
          <p class="testimonial-author">- {{ testimonial.author }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Datos de los testimonios
const testimonials = [
  {
    text: "GYM BULLS ha cambiado mi vida. Los entrenadores son increíbles y el ambiente es muy motivador.",
    author: "María López",
  },
  {
    text: "Gracias a GYM BULLS logré mi meta de perder peso. ¡Altamente recomendado!",
    author: "Carlos Ramírez",
  },
  {
    text: "El equipo es moderno y las instalaciones están siempre limpias. ¡Me encanta este lugar!",
    author: "Ana Martínez",
  },
];
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;
@use '@/styles/_mixins.scss' as *;

.about-view {
  background-color: var(--color-fondo);
  padding-top: 64px;
  padding-bottom: 64px;
}

.hero-section {
  background: linear-gradient(to right, var(--color-gris-oscuro), var(--color-negro));
  padding: 80px 24px;
  text-align: center;
  margin-bottom: 64px;

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-family: var(--fuente-titulo);
    color: var(--color-titulos);
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 16px;

    @include media-query(small) {
      font-size: 2.5rem;
    }
  }

  .hero-description {
    font-family: var(--fuente-principal);
    color: var(--color-texto);
    font-size: 1.25rem;
    line-height: 1.6;

    @include media-query(small) {
      font-size: 1rem;
    }
  }
}

.mission-values-section {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 64px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @include media-query(small) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .mission-card,
  .values-card {
    background-color: var(--color-gris-oscuro);
    color: var(--color-texto);
    border-radius: var(--radio-borde);
    padding: 32px;
    flex: 1;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @include media-query(small) {
      width: 100%;
    }
  }

  .section-icon {
    color: var(--color-botones);
    font-size: 48px;
    margin-bottom: 16px;
  }

  .section-title {
    font-family: var(--fuente-titulo);
    color: var(--color-titulos);
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 16px;

    @include media-query(small) {
      font-size: 1.5rem;
    }
  }

  .section-text {
    font-family: var(--fuente-principal);
    color: var(--color-texto);
    font-size: 1rem;
    line-height: 1.6;

    @include media-query(small) {
      font-size: 0.9rem;
    }
  }

  .values-list {
    list-style-type: none;
    padding-left: 0;

    li {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .list-icon {
      color: var(--color-botones);
      font-size: 20px;
    }
  }
}

.testimonials-section {
  text-align: center;
  margin-bottom: 64px;
  padding: 0 24px;

  .section-title {
    font-family: var(--fuente-titulo);
    color: var(--color-titulos);
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 32px;

    @include media-query(small) {
      font-size: 1.75rem;
    }
  }

  .testimonials-grid {
    display: flex;
    justify-content: center;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;

    @include media-query(small) {
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
  }

  .testimonial-card {
    background-color: var(--color-gris-oscuro);
    color: var(--color-texto);
    border-radius: var(--radio-borde);
    padding: 24px;
    width: 300px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    @include media-query(small) {
      width: 100%;
    }

    .testimonial-text {
      font-family: var(--fuente-principal);
      color: var(--color-texto);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 16px;

      @include media-query(small) {
        font-size: 0.9rem;
      }
    }

    .testimonial-author {
      font-family: var(--fuente-principal);
      color: var(--color-botones);
      font-size: 0.9rem;
      font-weight: bold;
      text-align: right;

      @include media-query(small) {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
