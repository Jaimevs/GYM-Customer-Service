<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Messages</h1>
      </v-col>
    </v-row>

    <!-- Lista de conversaciones -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Conversations</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(conversation, index) in conversations" :key="index"
                @click="selectConversation(index)">
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
        <v-card>
          <v-card-title>
            {{ selectedConversation ? selectedConversation.name : 'Select a conversation' }}
          </v-card-title>
          <v-card-text>
            <div v-if="selectedConversation" class="message-area">
              <div v-for="(message, index) in selectedConversation.messages" :key="index"
                :class="['message', message.sender === 'coach' ? 'sent' : 'received']">
                <div class="message-content">{{ message.text }}</div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
            <div v-else class="text-center">
              <p>Select a conversation to view messages.</p>
            </div>
          </v-card-text>
          <v-card-actions v-if="selectedConversation">
            <v-text-field v-model="newMessage" label="Type a message" outlined dense
              @keyup.enter="sendMessage"></v-text-field>
            <v-btn color="primary" @click="sendMessage">Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CoachMessagesView',
  setup() {
    // Lista de conversaciones
    const conversations = ref([
      {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/150',
        lastMessage: 'Sure, let’s schedule it!',
        unread: 2,
        messages: [
          { text: 'Hi John, can we reschedule our session?', sender: 'coach', time: '10:00 AM' },
          { text: 'Sure, let’s schedule it!', sender: 'client', time: '10:05 AM' },
        ],
      },
      {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/150',
        lastMessage: 'Thanks for the tips!',
        unread: 0,
        messages: [
          { text: 'Here are some tips for your workout.', sender: 'coach', time: '09:00 AM' },
          { text: 'Thanks for the tips!', sender: 'client', time: '09:15 AM' },
        ],
      },
    ]);

    // Conversación seleccionada
    const selectedConversation = ref<typeof conversations.value[0] | null>(null);

    // Nuevo mensaje
    const newMessage = ref('');

    // Seleccionar una conversación
    const selectConversation = (index: number) => {
      selectedConversation.value = conversations.value[index];
      conversations.value[index].unread = 0; // Marcar como leído
    };

    // Enviar un mensaje
    const sendMessage = () => {
      if (newMessage.value.trim() && selectedConversation.value) {
        selectedConversation.value.messages.push({
          text: newMessage.value,
          sender: 'coach',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        newMessage.value = ''; // Limpiar el campo de mensaje
      }
    };

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
.message-area {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.message.sent {
  align-items: flex-end;
}

.message.received {
  align-items: flex-start;
}

.message-content {
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}

.message.sent .message-content {
  background-color: #1976d2;
  color: white;
}

.message.received .message-content {
  background-color: #f5f5f5;
  color: black;
}

.message-time {
  font-size: 0.8em;
  color: #666;
  margin-top: 5px;
}
</style>
