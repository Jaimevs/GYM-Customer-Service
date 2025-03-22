<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Clients</h1>
      </v-col>
    </v-row>

    <!-- Lista de clientes -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Client List</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="clients" :items-per-page="5" class="elevation-1">
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="viewClientDetails(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon @click="editClient(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteClient(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para ver detalles del cliente -->
    <v-dialog v-model="clientDetailsDialog" max-width="500">
      <v-card>
        <v-card-title>Client Details</v-card-title>
        <v-card-text>
          <v-list v-if="selectedClient">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ selectedClient.name }}</v-list-item-title>
                <v-list-item-subtitle>Email: {{ selectedClient.email }}</v-list-item-subtitle>
                <v-list-item-subtitle>Phone: {{ selectedClient.phone }}</v-list-item-subtitle>
                <v-list-item-subtitle>Membership: {{ selectedClient.membership }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="clientDetailsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para editar un cliente -->
    <v-dialog v-model="editClientDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Client</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveClient">
            <v-text-field v-model="clientForm.name" label="Name" outlined dense required></v-text-field>

            <v-text-field v-model="clientForm.email" label="Email" outlined dense required></v-text-field>

            <v-text-field v-model="clientForm.phone" label="Phone" outlined dense required></v-text-field>

            <v-select v-model="clientForm.membership" :items="membershipOptions" label="Membership" outlined dense
              required></v-select>

            <v-btn type="submit" color="primary">Save Changes</v-btn>
            <v-btn text @click="editClientDialog = false">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ClientsCoachView',
  setup() {
    // Lista de clientes
    const clients = ref([
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', membership: 'Premium' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+0987654321', membership: 'Basic' },
    ]);

    // Encabezados de la tabla
    const headers = ref([
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Phone', value: 'phone' },
      { text: 'Membership', value: 'membership' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]);

    // Diálogo para ver detalles del cliente
    const clientDetailsDialog = ref(false);
    const selectedClient = ref(null);

    // Diálogo para editar un cliente
    const editClientDialog = ref(false);
    const clientForm = ref({
      id: null,
      name: '',
      email: '',
      phone: '',
      membership: '',
    });

    // Opciones de membresía
    const membershipOptions = ref(['Basic', 'Premium', 'VIP']);

    // Ver detalles del cliente
    const viewClientDetails = (item) => {
      selectedClient.value = item;
      clientDetailsDialog.value = true;
    };

    // Editar un cliente
    const editClient = (item) => {
      clientForm.value = { ...item };
      editClientDialog.value = true;
    };

    // Eliminar un cliente
    const deleteClient = (item) => {
      clients.value = clients.value.filter((client) => client.id !== item.id);
    };

    // Guardar cambios del cliente
    const saveClient = () => {
      const index = clients.value.findIndex((client) => client.id === clientForm.value.id);
      clients.value[index] = { ...clientForm.value };
      editClientDialog.value = false;
    };

    return {
      clients,
      headers,
      clientDetailsDialog,
      selectedClient,
      editClientDialog,
      clientForm,
      membershipOptions,
      viewClientDetails,
      editClient,
      deleteClient,
      saveClient,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>
