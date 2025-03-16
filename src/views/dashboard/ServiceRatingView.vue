<template>
  <!-- Título y contenido -->
  <h1>Valoración del Servicio</h1>
  <p>Aquí puedes visualizar y administrar las valoraciones y retroalimentación del servicio brindado.</p>

  <section class="service-content">
    <!-- Valoraciones Container -->
    <div class="valoraciones-container">
      <header class="header-section">
        <div class="titulo-container">
          <h2 class="titulo-principal">Valoraciones y Retroalimentación</h2>
          <p class="subtitulo">Gestiona las valoraciones del servicio y sigue el rendimiento.</p>
        </div>
      </header>

      <!-- Nuevas tarjetas en formato grid -->
      <div class="grid gap-4 md:grid-cols-3">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Calificación Promedio</h3>
          </div>
          <div class="card-content">
            <div class="flex items-center">
              <div class="text-2xl font-bold mr-2">4.5</div>
              <div class="flex">
                <StarIcon class="h-4 w-4 fill-primary text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Total de Reseñas</h3>
          </div>
          <div class="card-content">
            <div class="text-2xl font-bold">300</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title flex items-center">
              <AlertCircleIcon class="mr-2 h-4 w-4 text-destructive" />
              Alertas de Valoración
            </h3>
          </div>
          <div class="card-content">
            <div class="text-2xl font-bold">5</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comentarios Ficticios -->
    <section class="comments-section">
      <header class="header-section">
        <h3>Comentarios de los Usuarios:</h3>
        <p class="subtitulo">Estos son algunos de los comentarios que los usuarios han dejado sobre el servicio.</p>
      </header>

      <!-- Comentarios -->
      <div class="comments-container">
        <div class="comment-card" v-for="(comment, index) in comments" :key="index">
          <div class="comment-header">
            <div class="user-info">
              <span class="user-name">{{ comment.name }}</span>
              <div class="user-rating">
                <StarIcon class="h-4 w-4 fill-primary text-primary" />
                <span class="rating">{{ comment.rating }}</span>
              </div>
            </div>
            <p class="comment-date">{{ comment.date }}</p>
          </div>
          <div class="comment-content">
            <p>{{ comment.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AlertCircleIcon from '@/components/common/icons/AlertCircleIcon.vue';
import StarIcon from '@/components/common/icons/StarIcon.vue';

// Comentarios ficticios
const comments = ref([
  {
    name: 'Juan Pérez',
    rating: 5,
    date: '2025-03-10',
    text: 'Excelente servicio, muy rápido y profesional. Lo recomiendo al 100%.',
  },
  {
    name: 'María López',
    rating: 4,
    date: '2025-03-09',
    text: 'El servicio es bueno, aunque podría mejorar en tiempos de espera.',
  },
  {
    name: 'Carlos Ruiz',
    rating: 3,
    date: '2025-03-08',
    text: 'Servicio aceptable, pero hubo algunos problemas con la comunicación.',
  },
]);
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;

.service-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: $espaciado-grande;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.titulo-principal {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitulo {
  color: #666;
  margin-top: 0.5rem;
}

/* Estilos para el nuevo grid */
.grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
}

.card-content {
  padding: 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.mr-2 {
  margin-right: 0.5rem;
}

.h-4 {
  height: 1rem;
}

.w-4 {
  width: 1rem;
}

.fill-primary {
  fill: #0ea5e9;
}

.text-primary {
  color: #0ea5e9;
}

.text-muted-foreground {
  color: #9ca3af;
}

.text-destructive {
  color: #ef4444;
}

.comments-section {
  margin-top: 2rem;
}

.comments-container {
  display: grid;
  gap: 1rem;
}

.comment-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.comment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  gap: 0.5rem;
}

.user-name {
  font-weight: bold;
}

.user-rating {
  display: flex;
  gap: 0.2rem;
}

.rating {
  font-weight: bold;
}

.comment-date {
  font-size: 0.875rem;
  color: #666;
}

.comment-content {
  margin-top: 1rem;
  color: #333;
}
</style>
