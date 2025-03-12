import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue"; // Ruta hacia la vista Home
import LoginView from "../views/LoginView.vue"; // Ruta hacia la vista Login
import RegisterView from "../views/RegisterView.vue"; // Ruta hacia la vista Register
import DashboardView from "../views/DashboardView.vue"; // Ruta hacia Dashboard

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
