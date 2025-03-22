<template>
  <div class="gyms-view">
    <h1>Gimnasios</h1>
    <p>Descubre nuestros gimnasios disponibles.</p>
    <ul>
      <li v-for="(gym, index) in gyms" :key="index">{{ gym.name }} - {{ gym.location }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const gyms = [
  { name: 'GYM BULLS Centro', location: 'Ciudad de México' },
  { name: 'GYM BULLS Norte', location: 'Monterrey' },
  { name: 'GYM BULLS Sur', location: 'Guadalajara' },
];
</script>

<style scoped>
.gyms-view {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  font-size: 18px;
}
</style>
