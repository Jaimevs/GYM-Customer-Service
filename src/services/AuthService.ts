import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday12.com";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expiration: number;
  user_id: number;
  username: string;
  email: string;
  roles: string[];
}

class AuthService {
  // Inicializar headers con token si existe
  constructor() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  // Login normal
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/login/`, {
        Correo_Electronico: credentials.email,
        Contrasena: credentials.password,
      });

      if (response.data && response.data.access_token) {
        this.setSession(response.data);
        return response.data;
      }

      throw new Error("Respuesta inválida del servidor");
    } catch (error) {
      throw error;
    }
  }

  // Registro normal
  async register(credentials: RegisterCredentials): Promise<any> {
    return axios.post(`${API_URL}/api/users/register/`, {
      Nombre_Usuario: credentials.username,
      Correo_Electronico: credentials.email,
      Contrasena: credentials.password,
    });
  }

  // Iniciar flujo de autenticación con Google
  loginWithGoogle(): void {
    window.location.href = `${API_URL}/api/auth/google`;
  }

  // Procesar token de autenticación
  processAuthToken(token: string): User {
    try {
      // Decodificar token
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));

      // Crear objeto de usuario
      const user: User = {
        id: payload.user_id,
        username: payload.sub || "",
        email: payload.email || "",
        roles: payload.roles || [],
      };

      // Guardar en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Configurar axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch (error) {
      console.error("Error al procesar token:", error);
      throw new Error("Token inválido");
    }
  }

  // Configurar sesión después de login exitoso
  setSession(authResult: AuthResponse): void {
    const token = authResult.access_token;
    const user: User = {
      id: authResult.user_id,
      username: authResult.username,
      email: authResult.email,
      roles: authResult.roles,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Configurar axios para incluir el token en todas las peticiones
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return localStorage.getItem("token") !== null;
  }

  // Obtener el usuario actual
  getUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return null;
    }
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    return user.roles.includes(role);
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  }

  /**
   * Verifica un código de 6 dígitos enviado por el usuario.
   * @param code El código de 6 dígitos a verificar.
   * @returns Una promesa con la respuesta del servidor.
   */
  async verifyCode(code: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/api/verify-code/`, {
        code: code,
      });

      // Si la verificación es exitosa, puedes manejar la respuesta aquí
      if (response.data && response.data.success) {
        console.log("Código verificado correctamente:", response.data);
      }

      return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
      console.error("Error al verificar el código:", error);
      throw error; // Lanza el error para que pueda ser manejado en la vista
    }
  }
}

export default new AuthService();
