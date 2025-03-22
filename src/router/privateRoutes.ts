import { RouteRecordRaw } from "vue-router";
import ProfileView from "@/views/dashboard/ProfileView.vue";
import SettingsView from "@/views/user/SettingsView.vue";
import FeedbackView from "@/views/dashboard/FeedbackView.vue";
import TrainersView from "@/views/dashboard/TrainersView.vue";
// import DashboardLayout from "@/layouts/DashboardLayout.vue";
import GeneralLayout from "../layouts/GeneralLayout.vue";

const privateRoutes: RouteRecordRaw[] = [
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { layout: GeneralLayout, requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsView,
    meta: { layout: GeneralLayout, requiresAuth: true },
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: FeedbackView,
    meta: { layout: GeneralLayout, requiresAuth: true },
  },
  {
    path: "/trainers",
    name: "Trainers",
    component: TrainersView,
    meta: { layout: GeneralLayout, requiresAuth: true },
  },
];

export default privateRoutes;
