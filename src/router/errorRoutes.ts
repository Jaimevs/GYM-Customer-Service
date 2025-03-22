import { RouteRecordRaw } from "vue-router";
import ErrorPage from "@/views/public/ErrorView.vue";

const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/error/:code",
    name: "Error",
    component: ErrorPage,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: ErrorPage,
    props: { errorCode: "404", errorMessage: "Página no encontrada" },
  },
];

export default errorRoutes;
