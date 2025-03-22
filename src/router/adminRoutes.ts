import { RouteRecordRaw } from "vue-router";
import DashboardView from "@/views/dashboard/DashboardView.vue";
import ServiceManagementView from "@/views/dashboard/ServiceManagementView.vue";
import MembershipsView from "@/views/dashboard/MembershipsView.vue";
import ValidityControlView from "@/views/dashboard/ValidityControlView.vue";
import ServiceRatingView from "@/views/dashboard/ServiceRatingView.vue";
import AdditionalServicesPaymentView from "@/views/dashboard/AdditionalServicesPaymentView.vue";
import MaterialLoansView from "@/views/dashboard/MaterialLoansView.vue";
import ConsumablesControlView from "@/views/dashboard/ConsumablesControlView.vue";
import AppointmentsView from "@/views/dashboard/AppointmentsView.vue";
import ClientTrainingView from "@/views/dashboard/ClientTrainingView.vue";
import SupportResolutionView from "@/views/dashboard/SupportResolutionView.vue";
import UsersManagementView from "@/views/dashboard/UsersManagementView.vue";
import BranchesView from "@/views/dashboard/BranchesView.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

import GeneralLayout from "../layouts/GeneralLayout.vue";

const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/services",
    name: "ServiceManagement",
    component: ServiceManagementView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/memberships",
    name: "Memberships",
    component: MembershipsView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/membership-expiration",
    name: "ValidityControl",
    component: ValidityControlView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/service-evaluation",
    name: "ServiceRating",
    component: ServiceRatingView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/additional-services-payment",
    name: "AdditionalServicesPayment",
    component: AdditionalServicesPaymentView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/material-loans",
    name: "MaterialLoans",
    component: MaterialLoansView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/consumables-control",
    name: "ConsumablesControl",
    component: ConsumablesControlView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/appointments",
    name: "Appointments",
    component: AppointmentsView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/client-training",
    name: "ClientTraining",
    component: ClientTrainingView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/support-resolution",
    name: "SupportResolution",
    component: SupportResolutionView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/users-management",
    name: "UsersManagement",
    component: UsersManagementView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
  {
    path: "/branches",
    name: "Branches",
    component: BranchesView,
    meta: { layout: GeneralLayout, requiresAuth: true, role: "admin" },
  },
];

export default adminRoutes;
