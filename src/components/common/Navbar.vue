  <template>
    <v-app-bar app color="transparent" flat elevation="4" class="fixed-navbar px-4 px-md-10">
      <div class="navbar-container d-flex align-center">
        <!-- Logo (Izquierda) -->
        <div class="logo-container d-flex align-center gap-4" @click="navigateToHome">
          <img src="/src/assets/img/gymbulls.png" alt="GYM BULLS Logo" class="logo-image" />
        </div>

        <!-- Enlaces de Navegación (Centro) -->
        <div class="nav-links d-none d-md-flex align-center gap-6">
          <router-link to="/gimnasios" class="nav-link">Gimnasios</router-link>
          <router-link to="/planes" class="nav-link">Planes</router-link>
          <router-link to="/instalaciones" class="nav-link">Instalaciones</router-link>
        </div>

        <!-- Botón de Iniciar Sesión (Derecha) -->
        <div class="d-none d-md-block ml-auto">
          <v-btn class="font-weight-bold v-btn--login" @click="navigateToLogin">
            <v-icon left>mdi-login</v-icon>
            Iniciar Sesión
          </v-btn>
        </div>

        <!-- Botón de Menú Hamburguesa (Solo en móviles) -->
        <v-btn icon class="v-btn--menu d-md-none ml-auto" @click="toggleSidebar">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Sidebar Dinámico -->
    <slot name="sidebar"></slot>
  </template>
