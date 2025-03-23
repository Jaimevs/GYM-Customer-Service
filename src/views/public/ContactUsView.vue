<template>
  <div class="contact-view">
    <!-- Sección principal -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Contáctanos</h1>
        <p class="hero-description">
          Estamos aquí para ayudarte. Puedes contactarnos a través de nuestros canales o enviarnos un mensaje
          directamente.
        </p>
      </div>
    </section>

    <!-- Información de contacto -->
    <section class="contact-info-section">
      <div class="contact-info-card">
        <v-icon class="contact-icon" size="48">mdi-email</v-icon>
        <h3 class="info-title">Email</h3>
        <p class="info-text">contacto@gymbulls.com</p>
      </div>

      <div class="contact-info-card">
        <v-icon class="contact-icon" size="48">mdi-phone</v-icon>
        <h3 class="info-title">Teléfono</h3>
        <p class="info-text">+52 123 456 7890</p>
      </div>

      <div class="contact-info-card">
        <v-icon class="contact-icon" size="48">mdi-map-marker</v-icon>
        <h3 class="info-title">Dirección</h3>
        <p class="info-text">Av. Principal 123, Ciudad de México</p>
      </div>
    </section>

    <!-- Formulario de contacto -->
    <section class="contact-form-section">
      <h2 class="form-title">Envíanos un mensaje</h2>
      <form class="contact-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" placeholder="Tu nombre" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Tu email" required />
        </div>

        <div class="form-group">
          <label for="message">Mensaje</label>
          <textarea id="message" rows="5" placeholder="Escribe tu mensaje" required></textarea>
        </div>

        <v-btn color="var(--color-botones)" dark large>Enviar mensaje</v-btn>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica adicional para esta vista básica.
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;
@use '@/styles/_mixins.scss' as *;

.contact-view {
  background-color: var(--color-fondo);
  padding-top: 64px;
  padding-bottom: 64px;
}

/* Hero Section */
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

/* Contact Info Section */
.contact-info-section {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 64px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;

  @include media-query(small) {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .contact-info-card {
    background-color: var(--color-gris-oscuro);
    color: var(--color-texto);
    border-radius: var(--radio-borde);
    padding: 32px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    @include media-query(small) {
      width: 100%;
    }

    .contact-icon {
      color: var(--color-botones);
      margin-bottom: 16px;
    }

    .info-title {
      font-family: var(--fuente-titulo);
      color: var(--color-titulos);
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;

      @include media-query(small) {
        font-size: 1.25rem;
      }
    }

    .info-text {
      font-family: var(--fuente-principal);
      color: var(--color-texto);
      font-size: 1rem;
      line-height: 1.6;

      @include media-query(small) {
        font-size: 0.9rem;
      }
    }
  }
}

/* Contact Form Section */
.contact-form-section {
  text-align: center;
  margin-bottom: 64px;
  padding: 0 24px;

  .form-title {
    font-family: var(--fuente-titulo);
    color: var(--color-titulos);
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 32px;

    @include media-query(small) {
      font-size: 1.75rem;
    }
  }

  .contact-form {
    max-width: 600px;
    margin: 0 auto;
    text-align: left;

    .form-group {
      margin-bottom: 16px;

      label {
        font-family: var(--fuente-principal);
        color: var(--color-texto);
        font-size: 1rem;
        margin-bottom: 8px;
        display: block;

        @include media-query(small) {
          font-size: 0.9rem;
        }
      }

      input,
      textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--color-bordes);
        border-radius: var(--radio-borde);
        font-family: var(--fuente-principal);
        font-size: 1rem;
        color: var(--color-texto);
        background-color: var(--color-gris-oscuro);

        @include media-query(small) {
          font-size: 0.9rem;
        }
      }

      textarea {
        resize: none;
      }
    }

    .v-btn {
      width: 100%;
      margin-top: 16px;
      font-size: 1rem;
      padding: 12px;

      @include media-query(small) {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
