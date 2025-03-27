<template>
  <v-container class="messages-view" fluid>
    <!-- Encabezado mejorado -->
    <v-row class="mb-6" data-aos="fade-down">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <v-badge :content="unreadCount" color="error" overlap>
            <Icon icon="solar:chat-round-unread-bold" width="36" class="mr-3 text-primary" />
          </v-badge>
          <h1 class="text-h3 font-weight-bold text-gradient">Mensajes</h1>
        </div>
        <p class="text-subtitle-1 text-medium-emphasis">
          Tienes {{ messages.length }} mensajes, {{ unreadCount }} sin leer
        </p>
      </v-col>
    </v-row>

    <!-- Contenedor principal de mensajes y vista previa -->
    <v-row class="message-container">
      <!-- Lista de mensajes (más estrecha) -->
      <v-col cols="12" md="4" lg="3" class="message-list">
        <v-card class="elevation-2 h-100">
          <v-card-title class="d-flex align-center py-3">
            <v-text-field v-model="search" prepend-inner-icon="solar:magnifer-bold" placeholder="Buscar mensajes..."
              variant="outlined" density="comfortable" hide-details single-line class="search-field"></v-text-field>
            <v-btn icon variant="text" color="primary" class="ml-2" @click="refreshMessages">
              <Icon icon="solar:refresh-bold" width="20" />
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-0 message-list-content">
            <v-list class="py-0" v-if="filteredMessages.length > 0">
              <v-list-item v-for="(message, index) in filteredMessages" :key="index" @click="selectMessage(message)"
                class="px-3 message-item" :class="{
                  'unread': !message.read,
                  'selected': selectedMessage && selectedMessage === message
                }" data-aos="fade-up" :data-aos-delay="100 * index">
                <template v-slot:prepend>
                  <v-badge dot :color="message.important ? 'amber' : 'transparent'" offset-x="-5" offset-y="-5">
                    <v-avatar :color="message.read ? 'grey-lighten-3' : 'primary-lighten-4'" size="40" class="mr-3">
                      <Icon :icon="getSenderIcon(message.sender)" width="20"
                        :color="message.read ? 'grey-darken-1' : 'primary'" />
                    </v-avatar>
                  </v-badge>
                </template>

                <v-list-item-title class="font-weight-bold text-subtitle-2 d-flex align-center text-truncate">
                  <span class="text-truncate">{{ message.sender }}</span>
                  <v-chip v-if="message.important" color="amber" size="x-small" label class="ml-1">
                    <Icon icon="solar:star-bold" width="12" class="mr-1" />
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle class="mt-1 text-truncate">
                  <div class="text-body-2 font-weight-medium text-truncate">{{ message.subject }}</div>
                  <div class="d-flex align-center mt-1">
                    <Icon icon="solar:clock-circle-linear" width="14" class="mr-1 text-medium-emphasis" />
                    <span class="text-caption text-medium-emphasis">{{ formatRelativeDate(message.date) }}</span>
                  </div>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <div v-else class="text-center py-10 empty-state">
              <Icon icon="solar:inbox-line-duotone" width="60" class="mb-4 text-grey-lighten-1" />
              <p class="text-h6 mb-2">No hay mensajes</p>
              <p class="text-body-1 text-medium-emphasis">No se encontraron mensajes</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Área de visualización de mensaje (más ancha) -->
      <v-col cols="12" md="8" lg="9" class="message-preview">
        <v-card class="elevation-2 h-100" v-if="selectedMessage">
          <v-card-title class="d-flex align-center py-4 px-6">
            <v-avatar :color="selectedMessage.read ? 'grey-lighten-3' : 'primary-lighten-4'" size="48" class="mr-3">
              <Icon :icon="getSenderIcon(selectedMessage.sender)" width="24"
                :color="selectedMessage.read ? 'grey-darken-1' : 'primary'" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ selectedMessage.subject }}</div>
              <div class="text-subtitle-1">De: {{ selectedMessage.sender }}</div>
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex">
              <v-btn icon variant="text" :color="selectedMessage.important ? 'amber' : 'grey'"
                @click="toggleImportant(selectedMessage)" class="mr-1">
                <Icon :icon="selectedMessage.important ? 'solar:star-bold' : 'solar:star-line-duotone'" width="24" />
              </v-btn>
              <v-btn icon variant="text" color="error" @click="deleteSelectedMessage">
                <Icon icon="solar:trash-bin-trash-bold" width="24" />
              </v-btn>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6 message-content-wrapper">
            <div class="d-flex justify-space-between mb-4">
              <div class="d-flex align-center">
                <Icon icon="solar:clock-circle-linear" width="18" class="mr-1 text-medium-emphasis" />
                <span class="text-caption text-medium-emphasis">{{ formatFullDate(selectedMessage.date) }}</span>
              </div>
              <v-chip :color="selectedMessage.read ? 'grey-lighten-2' : 'primary-lighten-4'" small>
                {{ selectedMessage.read ? 'Leído' : 'No leído' }}
              </v-chip>
            </div>

            <div class="message-content">
              <p>{{ selectedMessage.content }}</p>
            </div>

            <v-divider class="my-4"></v-divider>

            <div v-if="selectedMessage.attachments" class="attachments">
              <div class="text-subtitle-2 mb-2">Adjuntos:</div>
              <div class="d-flex flex-wrap">
                <v-chip v-for="(attachment, i) in selectedMessage.attachments" :key="i" class="mr-2 mb-2" link
                  @click="downloadAttachment(attachment)">
                  <Icon :icon="getAttachmentIcon(attachment.type)" width="16" class="mr-1" />
                  {{ attachment.name }}
                </v-chip>
              </div>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-btn variant="outlined" color="primary" @click="markAsRead(selectedMessage)"
              :disabled="selectedMessage.read" class="mr-2">
              <Icon icon="solar:check-read-bold" width="18" class="mr-1" />
              Marcar como leído
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="flat" @click="replyMessage" class="mr-2">
              <Icon icon="solar:arrow-back-bold" width="18" class="mr-1" />
              Responder
            </v-btn>
            <v-btn color="secondary" variant="flat" @click="forwardMessage">
              <Icon icon="solar:forward-bold" width="18" class="mr-1" />
              Reenviar
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-else class="elevation-2 h-100 d-flex align-center justify-center empty-preview">
          <div class="text-center pa-6">
            <Icon icon="solar:chat-line-duotone" width="80" class="mb-4 text-grey-lighten-1" />
            <p class="text-h5 mb-2">Selecciona un mensaje</p>
            <p class="text-body-1 text-medium-emphasis">Elige un mensaje de la lista para ver su contenido</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Icon } from '@iconify/vue';

// Estados
const search = ref('');
const messages = ref([
  {
    sender: 'Gimnasio FitHub',
    subject: 'Recordatorio de Clase',
    date: new Date(),
    content: 'Estimado miembro,\n\nNo olvides tu clase de HIIT hoy a las 6:00 PM. Por favor llega 10 minutos antes para el registro. Hemos notado que esta es una de tus clases favoritas y queremos recordarte que tenemos espacios limitados.\n\nRecomendaciones:\n- Usa ropa cómoda\n- Trae una toalla y botella de agua\n- Ven con energía positiva\n\n¡Nos vemos pronto!\n\nEl equipo FitHub',
    read: false,
    important: true,
    attachments: [
      { name: 'Horario.pdf', type: 'pdf' },
      { name: 'Instrucciones.docx', type: 'doc' }
    ]
  },
  {
    sender: 'Entrenador Juan',
    subject: 'Actualización de Plan de Entrenamiento',
    date: new Date(Date.now() - 86400000), // Ayer
    content: 'Hola,\n\nHemos actualizado tu plan de entrenamiento basado en tu último progreso. Los cambios principales son:\n\n1. Aumento de peso en press de banca (5kg más)\n2. Nuevos ejercicios de movilidad\n3. Ajuste en los tiempos de descanso\n\nPor favor revisa los detalles en la app y dime qué te parece en tu próxima sesión.\n\nSaludos,\nJuan',
    read: true,
    important: false
  },
  {
    sender: 'Soporte Técnico',
    subject: 'Mantenimiento Programado',
    date: new Date(Date.now() - 172800000), // Anteayer
    content: 'Estimado usuario,\n\nEl sistema estará en mantenimiento el próximo 5 de octubre de 2:00 AM a 4:00 AM. Durante este tiempo:\n\n- La app no estará disponible\n- No podrás reservar clases\n- Tu historial no será accesible\n\nDisculpa las molestias. Este mantenimiento traerá nuevas funciones:\n\n- Seguimiento de nutrición mejorado\n- Integración con wearables\n- Nuevo diseño de interfaz\n\nGracias por tu comprensión.\n\nEl equipo técnico',
    read: false,
    important: false
  },
  {
    sender: 'Nutricionista María',
    subject: 'Revisión de Dieta',
    date: new Date(Date.now() - 259200000), // Hace 3 días
    content: 'Hola,\n\nHe revisado tu registro de alimentación de la última semana y tengo algunas observaciones:\n\n1. Buen aumento en el consumo de proteínas\n2. Necesitamos más vegetales verdes\n3. Hidratación excelente\n\nPropuesta de cambios:\n\n- Añadir espinacas al desayuno\n- Cambiar snack de media mañana\n- Reducir carbohidratos simples por la tarde\n\nPor favor agenda una sesión cuando puedas para discutir estos cambios.\n\nSaludos,\nMaría',
    read: true,
    important: true,
    attachments: [
      { name: 'Plan_Nutricional.pdf', type: 'pdf' }
    ]
  }
]);

const selectedMessage = ref(null);

// Computed
const unreadCount = computed(() => {
  return messages.value.filter(msg => !msg.read).length;
});

const filteredMessages = computed(() => {
  let result = [...messages.value];

  // Filtrar por búsqueda
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(msg =>
      msg.sender.toLowerCase().includes(searchTerm) ||
      msg.subject.toLowerCase().includes(searchTerm) ||
      msg.content.toLowerCase().includes(searchTerm)
    );
  }

  // Ordenar por fecha (más recientes primero) y no leídos primero
  return result.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.date) - new Date(a.date);
  });
});

// Métodos
const getSenderIcon = (sender) => {
  const senderIcons = {
    'Gimnasio FitHub': 'solar:home-smile-bold',
    'Entrenador Juan': 'solar:dumbbell-bold',
    'Soporte Técnico': 'solar:shield-warning-bold',
    'Nutricionista María': 'solar:apple-bold'
  };
  return senderIcons[sender] || 'solar:user-bold';
};

const getAttachmentIcon = (type) => {
  const icons = {
    'pdf': 'solar:file-text-bold',
    'doc': 'solar:file-doc-bold',
    'xls': 'solar:file-xls-bold',
    'jpg': 'solar:file-jpg-bold',
    'png': 'solar:file-bold'
  };
  return icons[type] || 'solar:file-bold';
};

const formatRelativeDate = (date) => {
  const now = new Date();
  const msgDate = new Date(date);
  const diffDays = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoy, ' + msgDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Ayer, ' + msgDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } else {
    return msgDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
};

const formatFullDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const selectMessage = (message) => {
  selectedMessage.value = message;
  if (!message.read) {
    message.read = true;
  }
};

const markAsRead = (message) => {
  message.read = true;
};

const toggleImportant = (message) => {
  message.important = !message.important;
};

const deleteMessage = (index) => {
  if (selectedMessage.value === messages.value[index]) {
    selectedMessage.value = null;
  }
  messages.value.splice(index, 1);
};

const deleteSelectedMessage = () => {
  const index = messages.value.findIndex(msg => msg === selectedMessage.value);
  if (index !== -1) {
    deleteMessage(index);
  }
};

const replyMessage = () => {
  console.log('Respondiendo a:', selectedMessage.value);
  // Lógica para responder mensaje
};

const forwardMessage = () => {
  console.log('Reenviando:', selectedMessage.value);
  // Lógica para reenviar mensaje
};

const downloadAttachment = (attachment) => {
  console.log('Descargando:', attachment.name);
  // Lógica para descargar adjunto
};

const refreshMessages = () => {
  console.log('Refrescando mensajes...');
  // Lógica para recargar mensajes
};

// Inicialización
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });
});
</script>

<style scoped lang="scss">
.messages-view {
  max-width: 1800px;
  margin: 0 auto;
  padding: 24px;
}

.text-gradient {
  background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.message-container {
  min-height: calc(100vh - 200px);
}

.message-list {
  padding-right: 8px;

  .v-card {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.message-preview {
  padding-left: 8px;

  .v-card {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.message-list-content {
  height: calc(100% - 65px);
  overflow-y: auto;
}

.message-content-wrapper {
  height: calc(100% - 120px);
  overflow-y: auto;
}

.message-item {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  min-height: 80px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &.unread {
    background-color: rgba(var(--v-theme-primary), 0.03);

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.05);
    }
  }

  &.selected {
    background-color: rgba(var(--v-theme-primary), 0.08);
    border-left: 3px solid var(--v-primary-base);
  }

  &:last-child {
    border-bottom: none;
  }
}

.message-content {
  line-height: 1.8;
  font-size: 1.05rem;
  color: rgba(0, 0, 0, 0.8);
  white-space: pre-line;
}

.attachments {
  margin-top: 24px;

  .v-chip {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }
  }
}

.empty-state {
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.empty-preview {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.v-avatar {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.search-field {
  max-width: calc(100% - 48px);
}

@media (max-width: 960px) {

  .message-list,
  .message-preview {
    padding-left: 12px;
    padding-right: 12px;
    padding-bottom: 12px;
  }

  .message-list {
    padding-bottom: 0;
  }

  .v-card {
    border-radius: 12px !important;
  }
}
</style>
