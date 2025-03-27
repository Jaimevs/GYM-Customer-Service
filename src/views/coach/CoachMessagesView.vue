<template>
  <div class="messages-content">
    <!-- Título con animación -->
    <v-row data-aos="fade-down" data-aos-duration="800">
      <v-col cols="12">
        <h1 class="messages-title">
          <span class="title-text">Mensajes</span>
          <span class="title-highlight"></span>
        </h1>
      </v-col>
    </v-row>

    <!-- Contenido principal -->
    <v-row class="mb-6">
      <!-- Lista de conversaciones -->
      <v-col cols="12" md="4" data-aos="fade-right">
        <v-card class="conversation-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="solar:chat-round-line-outline" width="24" />
            </div>
            <h3 class="text-h6">Conversaciones</h3>
            <v-spacer></v-spacer>
            <v-btn icon small>
              <Icon icon="solar:user-plus-outline" />
            </v-btn>
          </div>
          <v-card-text class="pa-0">
            <v-list class="conversation-list">
              <v-list-item v-for="(conversation, index) in conversations" :key="index"
                @click="selectConversation(index)" :class="`conversation-item-${index}`"
                :style="{ 'border-left': selectedIndex === index ? '4px solid #FF7043' : 'none' }">
                <v-list-item-avatar>
                  <v-avatar :color="getAvatarColor(index)" size="40">
                    <span class="white--text">{{ getInitials(conversation.name) }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">{{ conversation.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ conversation.lastMessage }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-badge v-if="conversation.unread" :color="getBadgeColor(index)" :content="conversation.unread">
                  </v-badge>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Área de mensajes -->
      <v-col cols="12" md="8" data-aos="fade-left">
        <v-card class="messages-card" elevation="4">
          <div class="card-header">
            <div class="chart-icon-bg">
              <Icon icon="ep:chat-round" width="24" />
            </div>
            <h3 class="text-h6">{{ selectedConversation ? selectedConversation.name : 'Selecciona una conversación' }}
            </h3>
          </div>
          <v-card-text class="messages-area">
            <div v-if="selectedConversation" class="messages-container">
              <div v-for="(message, index) in selectedConversation.messages" :key="index"
                :class="['message-bubble', message.sender === 'coach' ? 'sent' : 'received']">
                <div class="message-content">{{ message.text }}</div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
            <div v-else class="no-conversation">
              <v-icon size="64" color="grey lighten-1">mdi-forum-outline</v-icon>
              <p class="text-subtitle-1 grey--text">Selecciona una conversación para comenzar</p>
            </div>
          </v-card-text>
          <v-card-actions v-if="selectedConversation" class="message-actions">
            <v-text-field v-model="newMessage" label="Escribe un mensaje" outlined dense hide-details
              @keyup.enter="sendMessage" class="message-input"></v-text-field>
            <v-btn color="primary" @click="sendMessage" class="send-button" :disabled="!newMessage.trim()">
              <Icon icon="solar:arrow-up-outline" width="20" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default defineComponent({
  name: 'MessagesView',
  components: {
    Icon
  },
  setup() {
    // Inicializar animaciones
    onMounted(() => {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-in-out-quad'
      });
    });

    // Lista de conversaciones
    const conversations = ref([
      {
        name: "Juan Pérez",
        avatar: "",
        lastMessage: "Claro, ¡reprogramemos la sesión!",
        unread: 2,
        messages: [
          { text: "Hola Juan, ¿podemos reprogramar la sesión?", sender: "coach", time: "10:00 AM" },
          { text: "Claro, ¡reprogramemos la sesión!", sender: "client", time: "10:05 AM" },
        ],
      },
      {
        name: "María López",
        avatar: "",
        lastMessage: "Gracias por los consejos.",
        unread: 0,
        messages: [
          { text: "Aquí tienes algunos consejos para tu entrenamiento.", sender: "coach", time: "09:00 AM" },
          { text: "Gracias por los consejos.", sender: "client", time: "09:15 AM" },
        ],
      },
      {
        name: "Carlos Ramírez",
        avatar: "",
        lastMessage: "Entendido, nos vemos mañana",
        unread: 1,
        messages: [
          { text: "Recuerda que mañana tenemos sesión a las 8am", sender: "coach", time: "08:30 AM" },
          { text: "Entendido, nos vemos mañana", sender: "client", time: "08:35 AM" },
        ],
      },
    ]);

    // Conversación seleccionada
    const selectedConversation = ref<any>(null);
    const selectedIndex = ref<number | null>(null);
    const newMessage = ref("");

    // Funciones de ayuda
    const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('');
    };

    const getAvatarColor = (index: number) => {
      const colors = ['#FF7043', '#FFB74D', '#D84315', '#8D6E63', '#5D4037'];
      return colors[index % colors.length];
    };

    const getBadgeColor = (index: number) => {
      const colors = ['#FF7043', '#FFB74D', '#D84315', '#8D6E63', '#5D4037'];
      return colors[index % colors.length];
    };

    // Seleccionar conversación
    const selectConversation = (index: number) => {
      selectedIndex.value = index;
      selectedConversation.value = conversations.value[index];
      conversations.value[index].unread = 0;

      // Animación GSAP
      gsap.from('.message-bubble', {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out"
      });
    };

    // Enviar mensaje
    const sendMessage = () => {
      if (newMessage.value.trim() && selectedConversation.value) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        selectedConversation.value.messages.push({
          text: newMessage.value,
          sender: "coach",
          time: timeString
        });

        // Actualizar último mensaje
        selectedConversation.value.lastMessage = newMessage.value.length > 30
          ? newMessage.value.substring(0, 30) + '...'
          : newMessage.value;

        // Animación GSAP
        gsap.from('.message-bubble:last-child', {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.out"
        });

        newMessage.value = "";
      }
    };

    return {
      conversations,
      selectedConversation,
      selectedIndex,
      newMessage,
      getInitials,
      getAvatarColor,
      getBadgeColor,
      selectConversation,
      sendMessage
    };
  },
});
</script>

<style scoped lang="scss">
.messages-content {
  padding: 24px;
  background-color: #FFFFFF;
  max-width: 1600px;
  margin: 0 auto;
}

.messages-title {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;

  .title-text {
    position: relative;
    z-index: 2;
    font-size: 2.25rem;
    font-weight: 700;
    background: linear-gradient(45deg, var(--color-grafica-rojo-fuego), var(--color-grafica-amarillo-dorado));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-family: var(--fuente-titulo);
  }

  .title-highlight {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    height: 12px;
    background: rgba(255, 69, 0, 0.2);
    border-radius: 4px;
    z-index: 1;
    transform: rotate(-1deg);
  }
}

/* Tarjeta de conversaciones */
.conversation-card {
  border-radius: 16px;
  overflow: hidden;
  height: 80vh;

  .conversation-list {
    max-height: calc(80vh - 70px);
    overflow-y: auto;
  }

  .v-list-item {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: #FFF3E0;
    }
  }
}

/* Tarjeta de mensajes */
.messages-card {
  border-radius: 16px;
  overflow: hidden;
  height: 80vh;
  display: flex;
  flex-direction: column;

  .messages-area {
    flex-grow: 1;
    padding: 16px;
    background-color: #F5E7DE;
    overflow-y: auto;
  }

  .no-conversation {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .messages-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message-bubble {
    max-width: 75%;
    padding: 12px 16px;
    border-radius: 18px;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &.sent {
      align-self: flex-end;
      background-color: #FFE0B2;
      border-bottom-right-radius: 4px;
    }

    &.received {
      align-self: flex-start;
      background-color: white;
      border-bottom-left-radius: 4px;
    }

    .message-content {
      font-size: 0.95rem;
      margin-bottom: 4px;
    }

    .message-time {
      font-size: 0.75rem;
      color: #5D4037;
      text-align: right;
    }
  }

  .message-actions {
    padding: 16px;
    background-color: white;
    border-top: 1px solid #E0E0E0;

    .message-input {
      flex-grow: 1;
    }

    .send-button {
      margin-left: 12px;
      min-width: 48px;
    }
  }
}

/* Estilos para el card-header (compartido con ReportsView) */
.card-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;

  h3 {
    margin: 0;
    color: #333;
    font-weight: 600;
  }

  .chart-icon-bg {
    width: 40px;
    height: 40px;
    background: rgba(255, 112, 67, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: #FF7043;
  }
}

/* Responsive */
@media (max-width: 960px) {
  .messages-title {
    .title-text {
      font-size: 1.75rem;
    }

    .title-highlight {
      height: 8px;
      bottom: 3px;
    }
  }

  .conversation-card,
  .messages-card {
    height: auto;
    max-height: 50vh;
  }
}
</style>
