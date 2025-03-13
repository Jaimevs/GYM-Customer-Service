import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from './store'
import "vuetify/styles"; // Estilos base de Vuetify
import "@mdi/font/css/materialdesignicons.css"; // Importa los iconos de Material Design
import '@fortawesome/fontawesome-free/css/all.css'; // Importa los iconos de Font Awesome

const app = createApp(App);

app.use(router);
app.use(vuetify); 

window.addEventListener('offline', () => {
    router.push({ name: 'Error', params: { code: 'offline' } });
  });

app.mount("#app");
