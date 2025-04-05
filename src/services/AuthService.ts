import axios from "axios";
import AuthService from "@/services/AuthService";

// URL base de la API
const API_URL = "https://gymtoday12.com";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  profilePicture?: string;
}

interface AuthResponse {
  ID: number;
  Nombre_Usuario: string;
  Correo_Electronico: string;
  roles: string[];
  token: string;
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
      console.log("Intentando login con:", credentials.email);
      
      const response = await axios.post(`${API_URL}/login/`, {
        Correo_Electronico: credentials.email,
        Contrasena: credentials.password,
      });

      console.log("Respuesta de login:", response.data);
      
      if (response.data && response.data.token) {
        this.setSession(response.data);
        // Marcar como autenticación normal (no Google)
        localStorage.setItem("googleAuth", "false");
        return response.data;
      }

      throw new Error("Respuesta inválida del servidor");
    } catch (error) {
      console.error("Error en el login:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Registro normal
  async register(credentials: RegisterCredentials): Promise<any> {
    try {
      console.log("Enviando registro con datos:", {
        Nombre_Usuario: credentials.username,
        Correo_Electronico: credentials.email,
        Contrasena: credentials.password,
        Numero_Telefonico_Movil: credentials.phone || null
      });

      const response = await axios.post(`${API_URL}/users/register/`, {
        Nombre_Usuario: credentials.username,
        Correo_Electronico: credentials.email,
        Contrasena: credentials.password,
        Numero_Telefonico_Movil: credentials.phone || null
      });

      console.log("Respuesta del registro:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Iniciar flujo de autenticación con Google
  loginWithGoogle(): void {
    // Este método se mantiene aquí por compatibilidad
    // pero se recomienda usar GoogleAuthService.startGoogleAuth()
    window.location.href = `${API_URL}/auth/google`;
  }

  setSession(authResult: AuthResponse): void {
    // Extraer el token correctamente
    const token = authResult.token.access_token;
    const user: User = {
      id: authResult.ID,
      username: authResult.Nombre_Usuario,
      email: authResult.Correo_Electronico,
      roles: authResult.roles || [],
    };
  
    // Log de depuración
    console.log("Token a almacenar:", token);
    
    // Almacenar el token como cadena, no como objeto
    localStorage.setItem("token", token);
    console.log("Token almacenado:", localStorage.getItem("token"));
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userRole", user.roles[0] || "usuario");
  
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
      
      const user = JSON.parse(userStr);
      
      // Añadir foto de perfil si existe (para usuarios de Google)
      const profilePicture = localStorage.getItem("userProfilePicture");
      if (profilePicture) {
        user.profilePicture = profilePicture;
      }
      
      return user;
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
    localStorage.removeItem("userRole");
    localStorage.removeItem("googleAuth");
    localStorage.removeItem("userProfilePicture");
    delete axios.defaults.headers.common["Authorization"];
  }

  /**
   * Verifica un código de verificación enviado al correo electrónico del usuario.
   * @param code El código de verificación.
   * @param email El correo electrónico del usuario.
   * @returns Una promesa con la respuesta del servidor.
   */
  async verifyCode(code: string, email: string): Promise<any> {
    try {
      console.log(`Verificando código con email: ${email}, código: ${code}`);

      const response = await axios.post(`${API_URL}/api/users/verify/`, {
        email: email,
        code: code
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de verificación:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el código:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Utilidad para registrar errores de Axios con más detalle
  logAxiosError(error: any): void {
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error Axios:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
    } else {
      console.error('Error no relacionado con Axios:', error);
    }
  }

  // Método para verificar si el usuario necesita cambiar su contraseña
  needsPasswordChange(): boolean {
    return localStorage.getItem("needsPasswordChange") === "true";
  }

  // Método para marcar que el usuario necesita cambiar su contraseña
  setNeedsPasswordChange(value: boolean): void {
    if (value) {
      localStorage.setItem("needsPasswordChange", "true");
    } else {
      localStorage.removeItem("needsPasswordChange");
    }
  }

  // Obtener el rol del usuario
  getUserRole(): string {
    return localStorage.getItem("userRole") || "usuario";
  }
  
  // Verificar si la autenticación actual es mediante Google
  isGoogleAuthenticated(): boolean {
    return localStorage.getItem("googleAuth") === "true";
  }
}

export default new AuthService();