// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/authStore"; // Importar el store de autenticación
import publicRoutes from "./publicRoutes";
import authRoutes from "./authRoutes";
import privateRoutes from "./privateRoutes";
import userRoutes from "./userRoutes";
import trainerRoutes from "./trainerRoutes";
import adminRoutes from "./adminRoutes";
import errorRoutes from "./errorRoutes";

// Función para verificar autenticación
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Función para obtener roles del usuario
const getUserRoles = (): string[] => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return [];
    const user = JSON.parse(userStr);
    return user.roles || [];
  } catch (error) {
    console.error("Error al obtener roles del usuario:", error);
    return [];
  }
};

// Función para verificar si el usuario tiene un rol específico
const hasRole = (role: string): boolean => {
  const roles = getUserRoles();
  return roles.includes(role);
};

// Combinar todas las rutas
const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...authRoutes,
  ...privateRoutes,
  ...userRoutes,
  ...trainerRoutes,
  ...adminRoutes,
  ...errorRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar autenticación y roles
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Obtener el store de autenticación

  // Recuperar el rol del usuario desde localStorage
  const userRole = localStorage.getItem("userRole");
  if (userRole) {
    authStore.setRole(userRole); // Actualizar el rol en el store
  }

  // Verificar si el usuario está offline
  if (!navigator.onLine && to.name !== "Error") {
    next({ name: "Error", params: { code: "offline" } });
    return;
  }

  const userRoles = getUserRoles();

  // Redireccionar si el usuario ya está autenticado y trata de acceder a Login o Register
  if (to.name === "Login" || to.name === "Register") {
    if (isAuthenticated()) {
      if (userRoles.length === 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        next();
        return;
      }

      if (hasRole("admin")) {
        next({ name: "Dashboard" });
      } else if (hasRole("entrenador")) {
        next({ name: "CoachDashboard" });
      } else if (hasRole("usuario")) {
        next({ name: "UserDashboard" });
      } else {
        next();
      }
      return;
    } else {
      next();
      return;
    }
  }

  // Verificar autenticación y roles para rutas protegidas
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }

    if (to.meta.role) {
      const requiredRole = to.meta.role as string;
      if (!hasRole(requiredRole)) {
        if (hasRole("admin")) {
          next({ name: "Dashboard" });
        } else if (hasRole("entrenador")) {
          next({ name: "CoachDashboard" });
        } else if (hasRole("usuario")) {
          next({ name: "UserDashboard" });
        } else {
          next({ name: "Home" });
        }
        return;
      }
    }
  }

  // Redireccionar al dashboard correspondiente si el usuario está autenticado y accede a la ruta raíz
  if (to.path === "/" && isAuthenticated()) {
    if (userRoles.length === 0) {
      next();
      return;
    }

    if (hasRole("admin")) {
      next({ name: "Dashboard" });
    } else if (hasRole("entrenador")) {
      next({ name: "CoachDashboard" });
    } else if (hasRole("usuario")) {
      next({ name: "UserDashboard" });
    } else {
      next();
    }
    return;
  }

  next();
});

export default router;
