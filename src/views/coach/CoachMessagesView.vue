<template>
  <v-container class="messages-container">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Mensajes</h1>
      </v-col>
    </v-row>

    <!-- Lista de conversaciones -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="conversation-list" elevation="1">
          <v-card-title class="conversation-title">Conversaciones</v-card-title>
          <v-card-text>
            <v-list class="conversation-items">
              <v-list-item v-for="(conversation, index) in conversations" :key="index"
                @click="selectConversation(index)" class="conversation-item"
                :class="{ 'selected-conversation': selectedConversation === conversation }">
                <v-list-item-avatar>
                  <v-img :src="conversation.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ conversation.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ conversation.lastMessage }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-badge v-if="conversation.unread" color="primary" :content="conversation.unread"></v-badge>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Área de mensajes -->
      <v-col cols="12" md="8">
        <v-card class="message-area-card" elevation="1">
          <v-card-title class="message-area-title">
            {{ selectedConversation ? selectedConversation.name : 'Selecciona una conversación' }}
          </v-card-title>
          <v-card-text class="message-area">
            <div v-if="selectedConversation" class="messages">
              <div v-for="(message, index) in selectedConversation.messages" :key="index"
                :class="['message', message.sender === 'coach' ? 'sent' : 'received']" ref="messageRef">
                <div class="message-content">{{ message.text }}</div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
            <div v-else class="text-center no-conversation">
              <p>Selecciona una conversación para ver los mensajes.</p>
            </div>
          </v-card-text>
          <v-card-actions v-if="selectedConversation" class="message-input-area">
            <v-text-field v-model="newMessage" label="Escribe un mensaje" outlined dense @keyup.enter="sendMessage"
              class="message-input"></v-text-field>
            <v-btn color="primary" @click="sendMessage" class="send-button">Enviar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import gsap from "gsap";

export default defineComponent({
  name: "CoachMessagesView",
  setup() {
    // Lista de conversaciones
    const conversations = ref([
      {
        name: "Juan Pérez",
        avatar: "https://via.placeholder.com/150",
        lastMessage: "Claro, ¡reprogramemos la sesión!",
        unread: 2,
        messages: [
          { text: "Hola Juan, ¿podemos reprogramar la sesión?", sender: "coach", time: "10:00 AM" },
          { text: "Claro, ¡reprogramemos la sesión!", sender: "client", time: "10:05 AM" },
        ],
      },
      {
        name: "María López",
        avatar: "https://via.placeholder.com/150",
        lastMessage: "Gracias por los consejos.",
        unread: 0,
        messages: [
          { text: "Aquí tienes algunos consejos para tu entrenamiento.", sender: "coach", time: "09:00 AM" },
          { text: "Gracias por los consejos.", sender: "client", time: "09:15 AM" },
        ],
      },
    ]);

    // Conversación seleccionada
    const selectedConversation = ref<typeof conversations.value[0] | null>(null);

    // Nuevo mensaje
    const newMessage = ref("");

    // Seleccionar una conversación
    const selectConversation = (index: number) => {
      selectedConversation.value = conversations.value[index];
      conversations.value[index].unread = 0; // Marcar como leído

      // Animación GSAP para resaltar la conversación seleccionada
      gsap.to(".selected-conversation", {
        backgroundColor: "#e9f7f2",
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Enviar un mensaje
    const sendMessage = () => {
      if (newMessage.value.trim() && selectedConversation.value) {
        selectedConversation.value.messages.push({
          text: newMessage.value,
          sender: "coach",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        newMessage.value = ""; // Limpiar el campo de mensaje

        // Animación GSAP para nuevos mensajes
        gsap.fromTo(
          ".message:last-child",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    };

    // Animación inicial de las conversaciones
    onMounted(() => {
      gsap.from(".conversation-item", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    return {
      conversations,
      selectedConversation,
      newMessage,
      selectConversation,
      sendMessage,
    };
  },
});
</script>

<style scoped>
/* Estilo general */
.messages-container {
  background-color: #f0f2f5;
  padding: 20px;
  height: 100vh;
}

/* Card de conversaciones */
.conversation-list {
  background-color: white;
  border-radius: 10px;
}

.conversation-title {
  background-color: #075e54;
  color: white;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.conversation-items {
  padding: 0;
}

.conversation-item {
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.conversation-item:hover {
  background-color: #f5f5f5;
}

.selected-conversation {
  background-color: #e9f7f2;
  border-left: 3px solid #25d366;
}

/* Card de mensajes */
.message-area-card {
  background-color: white;
  border-radius: 10px;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.message-area-title {
  background-color: #075e54;
  color: white;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.message-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #e5ddd5;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
}

.message.sent {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.message.received {
  align-self: flex-start;
  background-color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}

/* Campo de texto para enviar mensajes */
.message-input-area {
  background-color: white;
  padding: 10px;
  border-top: 1px solid #f0f2f5;
}

.message-input {
  flex-grow: 1;
}

.send-button {
  margin-left: 10px;
}

.no-conversation {
  color: #666;
  font-style: italic;
}
</style>
