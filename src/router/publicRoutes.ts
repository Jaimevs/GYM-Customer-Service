import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/public/HomeView.vue";
import GymsView from "@/views/public/GymsView.vue";
import MemberShipsView from "@/views/public/MemberShipsView.vue";
import FacilitiesView from "@/views/public/FacilitiesView.vue";
import AboutGymBullsView from "@/views/public/AboutGymBullsView.vue";
import ContactUsView from "@/views/public/ContactUsView.vue";
import FaqView from "@/views/public/FaqView.vue";
import PublicLayout from "@/layouts/PublicLayout.vue";

const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { layout: PublicLayout },
  },
  {
    path: "/gimnasios",
    name: "Gyms",
    component: GymsView,
    meta: { layout: PublicLayout },
  },
  {
    path: "/planes",
    name: "MemberShips",
    component: MemberShipsView,
    meta: { layout: PublicLayout },
  },
  {
    path: "/instalaciones",
    name: "Facilities",
    component: FacilitiesView,
    meta: { layout: PublicLayout },
  },
  {
    path: "/conoce-gym-bulls",
    name: "AboutGymBulls",
    component: AboutGymBullsView,
    meta: { layout: PublicLayout },
  },
  {
    path: "/contactanos",
    name: "ContactUs",
    component: ContactUsView,
    meta: { layout: PublicLayout },
  },
  {
    path: "/preguntas-frecuentes",
    name: "FAQ",
    component: FaqView,
    meta: { layout: PublicLayout },
  },
];

export default publicRoutes;
