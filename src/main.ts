// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/authStore"; // Importar el store de autenticación
import "./styles/global.scss"; // Importa el archivo global de estilos
import "./styles/styles.css";
import "./styles/main.scss";
import "vuetify/styles"; // Estilos base de Vuetify
import "@mdi/font/css/materialdesignicons.css"; // Importa los iconos de Material Design
import "@fortawesome/fontawesome-free/css/all.css"; // Importa los iconos de Font Awesome
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
const pinia = createPinia();

// Configuración de Vue-Toastification
const options: PluginOptions = {
  position: "top",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

// Recuperar el rol del usuario al iniciar la aplicación
const authStore = useAuthStore(pinia); // Inicializar el store con Pinia
const userRole = localStorage.getItem("userRole") || "";
authStore.setRole(userRole);

app.use(Toast, options);
app.use(router);
app.use(vuetify);
app.use(pinia);

// Registrar ApexCharts globalmente
app.use(VueApexCharts);
app.component("apexchart", VueApexCharts);

// Manejar estado offline
window.addEventListener("offline", () => {
  router.push({ name: "Error", params: { code: "offline" } });
});

app.mount("#app");
