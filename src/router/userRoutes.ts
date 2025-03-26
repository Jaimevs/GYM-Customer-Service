import { RouteRecordRaw } from "vue-router";
import UsersView from "@/views/user/UsersView.vue";
import ClassesView from "@/views/user/ClassesView.vue";
import MembershipView from "@/views/user/MembershipView.vue";
import MessagesView from "@/views/user/MessagesView.vue";
import ProgressView from "@/views/user/ProgressView.vue";
import SettingsView from "@/views/user/SettingsView.vue";
import StatisticsView from "@/views/user/StatisticsView.vue";
import TrainingPlansView from "@/views/user/TrainingPlansView.vue";
import FeedbackView from "@/views/user/FeedbackView.vue";
import PersonalDataView from "../views/user/PersonalDataView.vue";

// import UserLayout from "@/layouts/GeneralLayout.vue";
import GeneralLayout from "../layouts/GeneralLayout.vue";



const userRoutes: RouteRecordRaw[] = [
  {
    path: "/user-dashboard",
    name: "UserDashboard",
    component: UsersView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  {
    path: "/progreso",
    name: "ProgressView",
    component: ProgressView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  {
    path: "/clases",
    name: "ClassesView",
    component: ClassesView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  {
    path: "/planes-entrenamiento",
    name: "TrainingPlansView",
    component: TrainingPlansView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  // {
  //   path: "/estadisticas",
  //   name: "StatisticsView",
  //   component: StatisticsView,
  //   meta: {
  //     requiresAuth: true,
  //     role: "usuario",
  //     layout: GeneralLayout,
  //   },
  // },
  {
    path: "/membresia",
    name: "MembershipView",
    component: MembershipView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  {
    path: "/mensajes",
    name: "MessagesView",
    component: MessagesView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  {
    path: "/ajustes",
    name: "SettingsView",
    component: SettingsView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  {
    path: "/queja-sugerencia",
    name: "",
    component: FeedbackView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
  {
    path: "/datos-personales",
    name: "",
    component: PersonalDataView,
    meta: {
      requiresAuth: true,
      role: "usuario",
      layout: GeneralLayout,
    },
  },
];

export default userRoutes;
