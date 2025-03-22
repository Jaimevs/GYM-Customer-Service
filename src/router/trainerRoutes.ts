import { RouteRecordRaw } from "vue-router";
import CoachView from "@/views/coach/CoachView.vue";
import ClientsCoachView from "@/views/coach/ClientsCoachView.vue";
import CoachClassesView from "@/views/coach/CoachClassesView.vue";
import CoachMessagesView from "@/views/coach/CoachMessagesView.vue";
import CoachSettingsView from "@/views/coach/CoachSettingsView.vue";
import EvaluationsView from "@/views/coach/EvaluationsView.vue";
import ReportsView from "@/views/coach/ReportsView.vue";
import TrainingPlansCoachView from "@/views/coach/TrainingPlansCoachView.vue";
import GeneralLayout from "../layouts/GeneralLayout.vue";


const trainerRoutes: RouteRecordRaw[] = [
  {
    path: "/coach-dashboard",
    name: "CoachDashboard",
    component: CoachView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
  {
    path: "/clientes",
    name: "Clients",
    component: ClientsCoachView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
  {
    path: "/clases-coach",
    name: "CoachClasses",
    component: CoachClassesView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
  {
    path: "/planes-entrenamientos",
    name: "TrainingPlans",
    component: TrainingPlansCoachView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
  {
    path: "/evaluaciones",
    name: "Evaluations",
    component: EvaluationsView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
  {
    path: "/mensajes-coach",
    name: "CoachMessages",
    component: CoachMessagesView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
  {
    path: "/reportes",
    name: "Reports",
    component: ReportsView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
  {
    path: "/ajustes-coach",
    name: "CoachSettings",
    component: CoachSettingsView,
    meta: {
      requiresAuth: true,
      role: "entrenador",
      layout: GeneralLayout,
    },
  },
];

export default trainerRoutes;
