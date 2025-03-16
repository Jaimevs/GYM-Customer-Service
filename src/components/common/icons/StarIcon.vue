<template>
    <svg
      v-for="star in totalStars"
      :key="star"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      :fill="star <= rating ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-star"
    >
      <polygon
        points="12 17.27 18.18 21 15 13.97 21 9.24 13.91 8.62 12 2 10.09 8.62 3 9.24 9 13.97 5.82 21 12 17.27"
        :fill="star <= rating ? 'currentColor' : 'none'"
        stroke="currentColor"
      ></polygon>
    </svg>
  </template>
  
  <script setup>
  const props = defineProps({
    totalStars: {
      type: Number,
      default: 5,
    },
    rating: {
      type: Number,
      default: 0,
    },
  });
  </script>
  
  <style scoped>
  .feather {
    width: 24px;
    height: 24px;
    color: #f39c12; /* Color de las estrellas (puedes cambiarlo a tu gusto) */
  }
  </style>
  