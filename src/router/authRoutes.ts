import { RouteRecordRaw } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import OAuthCallbackView from "@/views/auth/OAuthCallbackView.vue";
import DebugToolView from "@/views/auth/DebugToolView.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

const authRoutes: RouteRecordRaw[] = [
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
    // Ruta para el callback de Google OAuth
    path: "/login/oauth",
    name: "OAuthCallback",
    component: OAuthCallbackView,
    meta: { layout: AuthLayout },
  },
  {
    path: "/login-success",
    name: "LoginSuccess",
    redirect: (to) => {
      const token = to.query.token as string;
      if (token) {
        localStorage.setItem("token", token);

        try {
          const tokenParts = token.split(".");
          const payload = JSON.parse(atob(tokenParts[1]));

          const userData = {
            id: payload.user_id,
            username: payload.sub,
            email: payload.email,
            roles: payload.roles || [],
          };

          localStorage.setItem("user", JSON.stringify(userData));

          const roles = payload.roles || [];
          if (roles.includes("admin")) {
            return { path: "/dashboard" };
          } else if (roles.includes("entrenador")) {
            return { path: "/coach-dashboard" };
          } else if (roles.includes("usuario")) {
            return { path: "/user-dashboard" };
          } else {
            return { path: "/" };
          }
        } catch (error) {
          console.error("Error al procesar el token:", error);
          return { path: "/" };
        }
      }
      return { path: "/" };
    },
  },
  {
    path: "/auth/debug",
    name: "DebugTool",
    component: DebugToolView,
    meta: { 
      requiresAuth: true,
      layout: AuthLayout 
    },
  },
];

export default authRoutes;