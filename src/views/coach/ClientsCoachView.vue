<template>
  <v-container class="clients-dashboard">
    <!-- Título -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">Clientes</h1>
      </v-col>
    </v-row>

    <!-- Lista de clientes -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-bold">Lista de Clientes</v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :items="clients" :items-per-page="5" class="elevation-1">
              <!-- Columna de acciones -->
              <template v-slot:item.actions="{ item }">
                <v-btn icon small @click="viewClientDetails(item)">
                  <Icon icon="solar:eye-bold" class="action-icon" />
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
        <v-card-title class="text-h6 font-weight-bold">Detalles del Cliente</v-card-title>
        <v-card-text>
          <v-list v-if="selectedClient" class="details-list">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{ selectedClient.name }}</v-list-item-title>
                <v-list-item-subtitle>Email: {{ selectedClient.email }}</v-list-item-subtitle>
                <v-list-item-subtitle>Teléfono: {{ selectedClient.phone }}</v-list-item-subtitle>
                <v-list-item-subtitle>Membresía: {{ selectedClient.membership }}</v-list-item-subtitle>
                <v-list-item-subtitle>Sexo: {{ selectedClient.gender }}</v-list-item-subtitle>
                <v-list-item-subtitle>Edad: {{ selectedClient.age }} años</v-list-item-subtitle>
                <v-list-item-subtitle>Estatura: {{ selectedClient.height }} cm</v-list-item-subtitle>
                <v-list-item-subtitle>Peso: {{ selectedClient.weight }} kg</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="closeDetailsDialog">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import gsap from "gsap";

export default defineComponent({
  name: "ClientsCoachView",
  components: { Icon },
  setup() {
    // Lista de clientes con datos adicionales
    const clients = ref([
      {
        id: 1,
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        phone: "+1234567890",
        membership: "Premium",
        gender: "Masculino",
        age: 30,
        height: 180,
        weight: 75,
      },
      {
        id: 2,
        name: "María López",
        email: "maria.lopez@example.com",
        phone: "+0987654321",
        membership: "Básica",
        gender: "Femenino",
        age: 25,
        height: 165,
        weight: 60,
      },
    ]);

    // Encabezados de la tabla
    const headers = ref([
      { text: "Nombre", value: "name" },
      { text: "Email", value: "email" },
      { text: "Teléfono", value: "phone" },
      { text: "Membresía", value: "membership" },
      { text: "Acciones", value: "actions", sortable: false },
    ]);

    // Diálogo para ver detalles del cliente
    const clientDetailsDialog = ref(false);
    const selectedClient = ref(null);

    // Ver detalles del cliente
    const viewClientDetails = (item) => {
      selectedClient.value = item;
      clientDetailsDialog.value = true;

      // Animación GSAP para abrir el diálogo
      gsap.fromTo(
        ".details-list",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    };

    // Cerrar diálogo de detalles
    const closeDetailsDialog = () => {
      clientDetailsDialog.value = false;
    };

    // Animación inicial de la tabla
    onMounted(() => {
      gsap.from(".clients-dashboard .v-data-table tbody tr", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    return {
      clients,
      headers,
      clientDetailsDialog,
      selectedClient,
      viewClientDetails,
      closeDetailsDialog,
    };
  },
});
</script>

<style scoped>
.clients-dashboard {
  padding: 20px;
}

.action-icon {
  font-size: 20px;
  color: #666;
  transition: color 0.3s ease;

  &:hover {
    color: #1976d2;
  }
}

.details-list {
  margin-top: 16px;
}
</style>
