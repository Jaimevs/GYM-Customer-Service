<template>
  <v-container>
    <!-- Título de la página -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Mensajes</h1>
        <p class="text-subtitle-1">Gestiona tus mensajes y notificaciones.</p>
      </v-col>
    </v-row>

    <!-- Lista de mensajes -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Bandeja de Entrada</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(message, index) in messages" :key="index" @click="selectMessage(message)">
                <v-list-item-icon>
                  <v-icon :color="message.read ? 'grey' : 'primary'">
                    {{ message.read ? 'mdi-email-open' : 'mdi-email' }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ message.sender }}</v-list-item-title>
                  <v-list-item-subtitle>{{ message.subject }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">
                    {{ message.date }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click.stop="deleteMessage(index)">
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalles del mensaje seleccionado -->
    <v-row v-if="selectedMessage">
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ selectedMessage.subject }}</v-card-title>
          <v-card-subtitle>De: {{ selectedMessage.sender }}</v-card-subtitle>
          <v-card-text>
            <p>{{ selectedMessage.content }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined color="primary" @click="markAsRead(selectedMessage)">
              Marcar como Leído
            </v-btn>
            <v-btn color="error" @click="deleteSelectedMessage">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// Datos de ejemplo para los mensajes
const messages = ref([
  {
    sender: 'Gimnasio FitHub',
    subject: 'Recordatorio de Clase',
    date: '2023-10-01',
    content: 'No olvides tu clase de HIIT hoy a las 6:00 PM.',
    read: false,
  },
  {
    sender: 'Entrenador Juan',
    subject: 'Actualización de Plan',
    date: '2023-09-30',
    content: 'Hemos actualizado tu plan de entrenamiento. Revísalo en la app.',
    read: true,
  },
  {
    sender: 'Soporte Técnico',
    subject: 'Mantenimiento Programado',
    date: '2023-09-29',
    content: 'El sistema estará en mantenimiento el 5 de octubre.',
    read: false,
  },
]);

// Mensaje seleccionado
const selectedMessage = ref(null);

// Función para seleccionar un mensaje
const selectMessage = (message) => {
  selectedMessage.value = message;
  if (!message.read) {
    message.read = true; // Marcar como leído al abrir
  }
};

// Función para eliminar un mensaje
const deleteMessage = (index) => {
  messages.value.splice(index, 1);
  if (selectedMessage.value === messages.value[index]) {
    selectedMessage.value = null; // Limpiar selección si se elimina el mensaje abierto
  }
};

// Función para eliminar el mensaje seleccionado
const deleteSelectedMessage = () => {
  const index = messages.value.findIndex(
    (msg) => msg === selectedMessage.value
  );
  if (index !== -1) {
    deleteMessage(index);
  }
};

// Función para marcar un mensaje como leído
const markAsRead = (message) => {
  message.read = true;
};
</script>

<style scoped>
/* Estilos personalizados */
.v-list-item {
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
}

.v-list-item:last-child {
  border-bottom: none;
}
</style>
