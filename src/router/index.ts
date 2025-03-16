import { createRouter, createWebHistory } from "vue-router";

// Importar vistas
import HomeView from "../views/public/HomeView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import ProfileView from "../views/dashboard/ProfileView.vue";
import SettingsView from "../views/dashboard/SettingsView.vue";
import ErrorPage from "../views/public/ErrorView.vue";
import FeedbackView from "../views/dashboard/FeedbackView.vue";
import TrainersView from "../views/dashboard/TrainersView.vue";
import ServiceManagementView from "../views/dashboard/ServiceManagementView.vue";
import MembershipsView from "../views/dashboard/MembershipsView.vue";
import ValidityControlView from "../views/dashboard/ValidityControlView.vue";
import ServiceRatingView from "../views/dashboard/ServiceRatingView.vue";

// Importar layouts
import AuthLayout from "../layouts/AuthLayout.vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";

// Rutas públicas
const publicRoutes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { layout: PublicLayout },
  },
];

// Rutas de autenticación
const authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { layout: AuthLayout },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: { layout: AuthLayout },
  },
];

// Rutas privadas (dashboard)
const privateRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/gestion-servicios",
    name: "ServiceManagement",
    component: ServiceManagementView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/gestion-membresias",
    name: "MembershipVue",
    component: MembershipsView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/control-vigencia",
    name: "ValidityControlVue",
    component: ValidityControlView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/valoracion-servicios",
    name: "ServiceRatingVue",
    component: ServiceRatingView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: FeedbackView,
    meta: { layout: DashboardLayout },
  },
  {
    path: "/trainers",
    name: "Trainers",
    component: TrainersView,
    meta: { layout: DashboardLayout },
  },
];

// Rutas de error
const errorRoutes = [
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

// Combinar todas las rutas
const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...privateRoutes,
  ...errorRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar conexión a internet
router.beforeEach((to, from, next) => {
  // Verificar conexión a internet
  if (!navigator.onLine && to.name !== "NotFound") {
    next({ name: "NotFound", params: { errorCode: "offline" } });
    return;
  }

  // Permitir acceso a todas las rutas sin verificar autenticación
  next();
});

export default router;
