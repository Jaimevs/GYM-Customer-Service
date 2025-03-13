import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProfileView from "../views/ProfileView.vue"; // Vista para perfil
import SettingsView from "../views/SettingsView.vue"; // Vista para ajustes
import ErrorPage from "../views/ErrorPage.vue";
import FeedbackPage from "../views/FeedbackView.vue";
import TrainersView from "../views/TrainersView.vue";

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
  {
    path: '/error/:code',
    name: 'Error',
    component: ErrorPage,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorPage,
    props: { errorCode: '404', errorMessage: 'Página no encontrada' }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: FeedbackPage
  },
  {
    path: '/trainers',
    name: 'Trainers',
    component: TrainersView
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!navigator.onLine && to.name !== 'NotFound') {
    next({ name: 'NotFound', params: { errorCode: 'offline' } });
  } else {
    next();
  }
});

export default router;
