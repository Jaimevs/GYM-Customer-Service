import { createRouter, createWebHistory } from "vue-router";

// Importar vistas
import HomeView from "../views/public/HomeView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import ProfileView from "../views/dashboard/ProfileView.vue";
import SettingsView from "../views/dashboard/SettingsView.vue";
import ErrorPage from "../views/public/ErrorView.vue";
import FeedbackView from "../views/dashboard/FeedbackView.vue";
import TrainersView from "../views/dashboard/TrainersView.vue";

// Importar vistas específicas para administradores
import DashboardView from "../views/dashboard/DashboardView.vue";
import ServiceManagementView from "../views/dashboard/ServiceManagementView.vue";
import MembershipsView from "../views/dashboard/MembershipsView.vue";
import ValidityControlView from "../views/dashboard/ValidityControlView.vue";
import ServiceRatingView from "../views/dashboard/ServiceRatingView.vue";
import AdditionalServicesPaymentView from "../views/dashboard/AdditionalServicesPaymentView.vue";
import MaterialLoansView from "../views/dashboard/MaterialLoansView.vue";
import ConsumablesControlView from "../views/dashboard/ConsumablesControlView.vue";
import AppointmentsView from "../views/dashboard/AppointmentsView.vue";
import ClientTrainingView from "../views/dashboard/ClientTrainingView.vue";
import SupportResolutionView from "../views/dashboard/SupportResolutionView.vue";
import UsersManagementView from "../views/dashboard/UsersManagementView.vue";
import BranchesView from "../views/dashboard/BranchesView.vue";

import UsersView from "../views/user/UsersView.vue"; // Para usuario normal
import CoachView from "../views/coach/CoachView.vue"; // Para entrenador

// Importar layouts
import AuthLayout from "../layouts/AuthLayout.vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";

// Función para verificar autenticación
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Función para obtener roles del usuario
const getUserRoles = (): string[] => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return [];

    const user = JSON.parse(userStr);
    console.log("Datos de usuario en localStorage:", user);
    return user.roles || [];
  } catch (error) {
    console.error('Error al obtener roles del usuario:', error);
    return [];
  }
};

// Función para verificar si el usuario tiene un rol específico
const hasRole = (role: string): boolean => {
  const roles = getUserRoles();
  console.log(`Verificando rol '${role}' en roles:`, roles);
  return roles.includes(role);
};

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
  {
    path: "/login-success",
    name: "LoginSuccess",
    redirect: (to) => {
      const token = to.query.token as string;
      if (token) {
        localStorage.setItem('token', token);

        try {
          // Decodificar el token para obtener roles
          const tokenParts = token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));

          // Guardar en localStorage y loguear para depuración
          const userData = {
            id: payload.user_id,
            username: payload.sub,
            email: payload.email,
            roles: payload.roles || []
          };

          localStorage.setItem('user', JSON.stringify(userData));
          console.log("Token decodificado:", payload);
          console.log("Datos de usuario guardados:", userData);

          // Redirigir según rol
          const roles = payload.roles || [];
          console.log("Roles detectados:", roles);

          if (roles.includes('admin')) {
            console.log("Redirigiendo a /dashboard (admin)");
            return { path: '/dashboard' }; // Admin va al dashboard
          } else if (roles.includes('entrenador')) {
            console.log("Redirigiendo a /coach-dashboard (entrenador)");
            return { path: '/coach-dashboard' }; // Entrenador va a su dashboard
          } else if (roles.includes('usuario')) {
            console.log("Redirigiendo a /user-dashboard (usuario normal)");
            return { path: '/user-dashboard' }; // Usuario normal va a su dashboard
          } else {
            console.log("Sin rol específico, redirigiendo a home");
            return { path: '/' }; // Sin rol específico, va a home
          }
        } catch (error) {
          console.error('Error al procesar el token:', error);
          return { path: '/' }; // En caso de error, ir a home
        }
      }
      console.log("No se encontró token, redirigiendo a home");
      return { path: '/' }; // Si no hay token, ir a home
    }
  }
];

// Rutas privadas (dashboard) - compartidas entre roles
const privateRoutes = [
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { layout: DashboardLayout, requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsView,
    meta: { layout: DashboardLayout, requiresAuth: true },
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: FeedbackView,
    meta: { layout: DashboardLayout, requiresAuth: true },
  },
  {
    path: "/trainers",
    name: "Trainers",
    component: TrainersView,
    meta: { layout: DashboardLayout, requiresAuth: true },
  },
];

// Rutas específicas para usuarios normales
const userRoutes = [
  {
    path: "/user-dashboard",
    name: "UserDashboard",
    component: UsersView,
    meta: {
      requiresAuth: true,
      role: 'usuario'
    },
  },
];

// Rutas para entrenadores - sin usar DashboardLayout
const trainerRoutes = [
  {
    path: "/coach-dashboard",
    name: "CoachDashboard",
    component: CoachView,
    meta: {
      requiresAuth: true,
      role: 'entrenador'
    },
  },
];

// Rutas para administradores - DashboardView exclusivo para admin
const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/services",
    name: "ServiceManagement",
    component: ServiceManagementView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/memberships",
    name: "Memberships",
    component: MembershipsView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/membership-expiration",
    name: "ValidityControl",
    component: ValidityControlView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/service-evaluation",
    name: "ServiceRating",
    component: ServiceRatingView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/additional-services-payment",
    name: "AdditionalServicesPayment",
    component: AdditionalServicesPaymentView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/material-loans",
    name: "MaterialLoans",
    component: MaterialLoansView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/consumables-control",
    name: "ConsumablesControl",
    component: ConsumablesControlView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/appointments",
    name: "Appointments",
    component: AppointmentsView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/client-training",
    name: "ClientTraining",
    component: ClientTrainingView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/support-resolution",
    name: "SupportResolution",
    component: SupportResolutionView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/users-management",
    name: "UsersManagement",
    component: UsersManagementView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
  },
  {
    path: "/branches",
    name: "Branches",
    component: BranchesView,
    meta: { layout: DashboardLayout, requiresAuth: true, role: 'admin' },
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
  ...userRoutes,
  ...trainerRoutes,
  ...adminRoutes,
  ...errorRoutes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar autenticación y roles
router.beforeEach((to, from, next) => {
  // Verificar conexión a internet
  if (!navigator.onLine && to.name !== "Error") {
    next({ name: "Error", params: { code: "offline" } });
    return;
  }

  // Obtener roles y loguear para depuración
  const userRoles = getUserRoles();
  console.log("Rutas - Roles del usuario:", userRoles);
  console.log("Navegando a:", to.path, "Requiere Auth:", to.meta.requiresAuth, "Rol requerido:", to.meta.role);

  // Si el usuario está intentando acceder a login/register
  if (to.name === "Login" || to.name === "Register") {
    if (isAuthenticated()) {
      console.log("Usuario autenticado intentando acceder a login/register, verificando roles");

      // Si no tiene roles, hacer logout automático
      if (userRoles.length === 0) {
        console.log("Usuario autenticado sin roles, haciendo logout automático");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        next(); // Permitir acceso a login/register
        return;
      }

      // Redirigir según roles
      if (hasRole('admin')) {
        console.log("Redirigiendo a Dashboard (admin)");
        next({ name: "Dashboard" });
      } else if (hasRole('entrenador')) {
        console.log("Redirigiendo a CoachDashboard (entrenador)");
        next({ name: "CoachDashboard" });
      } else if (hasRole('usuario')) {
        console.log("Redirigiendo a UserDashboard (usuario con rol)");
        next({ name: "UserDashboard" });
      } else {
        console.log("Sin roles reconocidos, permitiendo acceso");
        next();
      }
      return;
    } else {
      // No autenticado, permitir acceso a login/register
      next();
      return;
    }
  }

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      console.log("No autenticado, redirigiendo a login");
      // Redirigir a login si no está autenticado
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }

    // Si la ruta requiere un rol específico
    if (to.meta.role) {
      const requiredRole = to.meta.role as string;
      if (!hasRole(requiredRole)) {
        console.log(`No tiene el rol '${requiredRole}', redirigiendo según rol`);
        // Redirigir según el rol del usuario
        if (hasRole('admin')) {
          console.log("Redirigiendo a Dashboard (admin)");
          next({ name: "Dashboard" });
        } else if (hasRole('entrenador')) {
          console.log("Redirigiendo a CoachDashboard (entrenador)");
          next({ name: "CoachDashboard" });
        } else if (hasRole('usuario')) {
          console.log("Redirigiendo a UserDashboard (usuario con rol)");
          next({ name: "UserDashboard" });
        } else {
          console.log("Sin roles específicos, redirigiendo a Home");
          next({ name: "Home" });
        }
        return;
      }
    }
  }

  // Si el usuario va a la raíz y está autenticado, redirigir según rol
  if (to.path === '/' && isAuthenticated()) {
    console.log("Usuario autenticado en ruta raíz, verificando roles");
    // Verificar si tiene al menos un rol
    if (userRoles.length === 0) {
      console.log("Usuario sin roles, permitiendo acceso a Home");
      next(); // Si no tiene roles, permitir acceso a Home
      return;
    }

    console.log("Redirigiendo según rol");
    if (hasRole('admin')) {
      console.log("Redirigiendo a Dashboard (admin)");
      next({ name: "Dashboard" });
    } else if (hasRole('entrenador')) {
      console.log("Redirigiendo a CoachDashboard (entrenador)");
      next({ name: "CoachDashboard" });
    } else if (hasRole('usuario')) {
      console.log("Redirigiendo a UserDashboard (usuario con rol)");
      next({ name: "UserDashboard" });
    } else {
      console.log("Sin roles reconocidos, permaneciendo en Home");
      next();
    }
    return;
  }

  // Permitir acceso a la ruta
  console.log("Acceso permitido a la ruta");
  next();
});

export default router;
