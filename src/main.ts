import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "vuetify/styles"; // Estilos base de Vuetify
import "@mdi/font/css/materialdesignicons.css"; // Importa los iconos de Material Design

const app = createApp(App);

app.use(router);
app.use(vuetify); 

app.mount("#app");
