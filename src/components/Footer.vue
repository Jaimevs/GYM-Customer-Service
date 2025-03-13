<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="footer-text">&copy; 2023 GYM BULLS. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// No es necesario definir lógica adicional en este caso
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/_variables.scss' as *; // Importa las variables SCSS
@use '@/styles/_mixins.scss' as *; // Importa los mixins

.footer {
  background-color: $color-negro;
  color: $color-blanco;
  text-align: center;
  padding: $espaciado-base;
  font-family: $fuente-secundaria;
  box-shadow: $sombra-suave;
  /* Añade una sombra suave */
  margin-top: auto;
  /* Empuja el footer hacia abajo si hay espacio */

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $espaciado-pequeño;
    /* Usa la nueva variable */
  }

  .footer-text {
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0;

    @include media-query(small) {
      font-size: 0.8rem;
    }
  }
}
</style>
