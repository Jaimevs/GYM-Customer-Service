<template>
  <v-container fluid class="profile-content">
    <!-- Título y descripción -->
    <h1 class="text-h4 font-weight-bold">Mi Perfil</h1>
    <p class="text-subtitle-1">Actualiza tu información personal y configura tus preferencias.</p>

    <!-- Sección de Información del Usuario -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="pa-6 text-center elevation-4" rounded="lg">
          <v-avatar size="120" color="primary" class="mb-4">
            <Icon icon="solar:user-circle-linear" width="80" height="80" color="white" />
          </v-avatar>
          <h3 class="text-h5">{{ usuario.nombre }}</h3>
          <p class="text-subtitle-1 grey--text">{{ usuario.email }}</p>
          <v-btn color="secondary" outlined small @click="editarFoto">
            <Icon icon="solar:camera-linear" class="mr-2" />
            Cambiar Foto
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="pa-6 elevation-4" rounded="lg">
          <v-form ref="form" v-model="esFormularioValido">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="usuario.nombre" label="Nombre Completo" :rules="[reglas.requerido]" outlined
                  dense>
                  <template #prepend-inner>
                    <Icon icon="solar:user-linear" class="mr-2" />
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="usuario.email" label="Correo Electrónico"
                  :rules="[reglas.requerido, reglas.email]" outlined dense>
                  <template #prepend-inner>
                    <Icon icon="solar:mailbox-linear" class="mr-2" />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="usuario.telefono" label="Teléfono" :rules="[reglas.telefono]" outlined dense>
                  <template #prepend-inner>
                    <Icon icon="solar:phone-linear" class="mr-2" />
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="usuario.genero" :items="['Masculino', 'Femenino', 'Otro']" label="Género" outlined
                  dense>
                  <template #prepend-inner>
                    <Icon icon="solar:gender-male-female-linear" class="mr-2" />
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea v-model="usuario.bio" label="Biografía" hint="Cuéntanos un poco sobre ti" persistent-hint
                  outlined dense>
                  <template #prepend-inner>
                    <Icon icon="solar:pen-linear" class="mr-2" />
                  </template>
                </v-textarea>
              </v-col>
            </v-row>

            <v-btn color="primary" class="mr-4" @click="guardarCambios">
              <Icon icon="solar:diskette-linear" class="mr-2" />
              Guardar Cambios
            </v-btn>
            <v-btn color="error" outlined @click="revertirCambios">
              <Icon icon="solar:refresh-linear" class="mr-2" />
              Revertir Cambios
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de Preferencias -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-6 elevation-4" rounded="lg">
          <v-card-title class="text-h5">Preferencias</v-card-title>
          <v-card-text>
            <v-switch v-model="preferencias.notificaciones" label="Recibir Notificaciones por Email" color="primary">
              <template #prepend>
                <Icon icon="solar:bell-linear" class="mr-2" />
              </template>
            </v-switch>
            <v-switch v-model="preferencias.publicidad" label="Recibir Ofertas y Promociones" color="primary">
              <template #prepend>
                <Icon icon="solar:gift-linear" class="mr-2" />
              </template>
            </v-switch>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de Seguridad -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6 elevation-4" rounded="lg">
          <v-card-title class="text-h5">Seguridad</v-card-title>
          <v-card-text>
            <v-btn color="warning" outlined @click="cambiarContrasena">
              <Icon icon="solar:lock-password-linear" class="mr-2" />
              Cambiar Contraseña
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useToast } from "vue-toastification";

// Inicializar Vue-Toastification
const toast = useToast();

// Datos del usuario
const usuario = ref({
  nombre: "Juan Pérez",
  email: "juan@example.com",
  telefono: "123-456-7890",
  genero: "Masculino",
  bio: "Soy un apasionado del fitness y me encanta entrenar en este gimnasio.",
});

// Datos de preferencias
const preferencias = ref({
  notificaciones: true,
  publicidad: false,
});

// Validaciones del formulario
const esFormularioValido = ref(false);
const reglas = {
  requerido: (value: string) => !!value || "Este campo es obligatorio.",
  email: (value: string) =>
    /.+@.+\..+/.test(value) || "El correo electrónico debe ser válido.",
  telefono: (value: string) =>
    /^\d{10}$/.test(value) || "El teléfono debe tener 10 dígitos.",
};

// Métodos
const guardarCambios = () => {
  if (!esFormularioValido.value) {
    toast.error("Por favor, completa todos los campos obligatorios.");
    return;
  }
  toast.success("Cambios guardados exitosamente.");
};

const revertirCambios = () => {
  usuario.value = {
    nombre: "Juan Pérez",
    email: "juan@example.com",
    telefono: "123-456-7890",
    genero: "Masculino",
    bio: "Soy un apasionado del fitness y me encanta entrenar en este gimnasio.",
  };
  toast.info("Cambios revertidos a los valores originales.");
};

const cambiarContrasena = () => {
  toast.warning("Función no implementada aún.");
};

const editarFoto = () => {
  toast.info("Función de edición de foto no implementada aún.");
};
</script>

<style scoped lang="scss">
.profile-content {
  padding: 2rem;

  .v-card {
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .iconify {
    vertical-align: middle;
  }
}
</style>
