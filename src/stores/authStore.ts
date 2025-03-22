import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    username: "",
    role: "", // Rol del usuario (inicialmente vacío)
  }),
  getters: {
    isAuthenticated: (state) => state.authenticated,
    getUsername: (state) => state.username,
    getRole: (state) => state.role,
  },
  actions: {
    setAuthentication(authenticated: boolean) {
      this.authenticated = authenticated;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setRole(role: string) {
      this.role = role;
      console.log("Rol actualizado en el store:", role); // Depuración
    },
  },
});
