<template>
  <div class="feedback-view">
    <SidebarDashboard />
    <main class="feedback-main">
      <h1>Quejas y Sugerencias</h1>
      <FeedbackPage />
    </main>
  </div>
</template>

<script lang="ts" setup>
import SidebarDashboard from '@/components/SidebarDashboard.vue';
import FeedbackPage from '@/pages/FeedbackPage.vue';
</script>

<style scoped>
.feedback-view {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.feedback-main {
  flex: 1;
  padding: 2rem;
  margin-left: 250px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .feedback-view {
    flex-direction: column;
  }

  .feedback-main {
    margin-left: 0;
    padding: 1rem;
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
}
</style>
