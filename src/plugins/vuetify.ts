import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    sets: {},
  },
  theme: {
    defaultTheme: "light",
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
          background: "#FFFFFF",
          // Añade los colores adicionales que necesitas
          teal: "#009688",
          orange: "#FF9800",
          purple: "#9C27B0",
          indigo: "#3F51B5",
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
          background: "#121212",
          // Añade los mismos colores adicionales para el tema oscuro
          teal: "#009688",
          orange: "#FF9800",
          purple: "#9C27B0",
          indigo: "#3F51B5",
        },
      },
    },
  },
});

export default vuetify;
