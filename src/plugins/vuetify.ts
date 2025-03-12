import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",

    sets: {
    },
  },
  theme: {
    defaultTheme: "light", // Especificar el tema por defecto
    themes: {
      light: {
        colors: {
          primary: "#FF2B00",
          secondary: "#32CD32",
          accent: "#FFD700",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
          background: "#FFFFFF", // Fondo blanco por defecto
        },
      },
      dark: {
        colors: {
          primary: "#FF2B00",
          secondary: "#32CD32",
          accent: "#FFD700",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
          background: "#121212", // Fondo oscuro para el tema dark
        },
      },
    },
  },
});

export default vuetify;
