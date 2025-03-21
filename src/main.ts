import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
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
// Configuración de Vue-Toastification
const options = {
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

app.use(Toast, options);
app.use(router);
app.use(vuetify);
// Registrar ApexCharts globalmente
app.use(VueApexCharts);
app.component("apexchart", VueApexCharts);
window.addEventListener("offline", () => {
  router.push({ name: "Error", params: { code: "offline" } });
});

app.mount("#app");
