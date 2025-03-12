import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProfileView from "../views/ProfileView.vue"; // Vista para perfil
import SettingsView from "../views/SettingsView.vue"; // Vista para ajustes

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
  },
  {
    path: "/profile", // Ruta para perfil
    name: "Profile",
    component: ProfileView, // Componente de perfil
  },
  {
    path: "/settings", // Ruta para ajustes
    name: "Settings",
    component: SettingsView, // Componente de ajustes
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
