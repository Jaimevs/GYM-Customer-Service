import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday1243.com";

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
      console.error("Error en el login:", error);
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
      });

      const response = await axios.post(`${API_URL}/api/users/register/`, {
        Nombre_Usuario: credentials.username,
        Correo_Electronico: credentials.email,
        Contrasena: credentials.password,
      });

      console.log("Respuesta del registro:", response);
      return response;
    } catch (error) {
      console.error("Error en el registro:", error);
      this.logAxiosError(error);
      throw error;
    }
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
   * @param email El correo electrónico del usuario.
   * @returns Una promesa con la respuesta del servidor.
   */
  async verifyCode(code: string, email: string): Promise<any> {
    try {
      console.log(`Verificando código con email: ${email}, código: ${code}`);

      // Probar con la ruta que usamos originalmente en el servicio
      const response = await axios.post(`${API_URL}/api/verify-code/`, {
        code: code,
        email: email
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Respuesta de verificación:", response);
      return response.data;
    } catch (error) {
      console.error("Error al verificar el código:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Método para probar múltiples endpoints para verificación de código
  async verifyCodeMultipleEndpoints(code: string, email: string): Promise<any> {
    const possibleEndpoints = [
      '/api/verify-code/', // Endpoint original
      '/api/users/verify/', // Ruta con barra final
      '/api/users/verify', // Ruta sin barra final
      '/verify-code/',
      '/users/verify/'
    ];
    
    let lastError = null;
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Intentando con endpoint: ${endpoint}`);
        
        const response = await axios.post(`${API_URL}${endpoint}`, {
          code: code,
          email: email
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log(`Verificación exitosa con endpoint: ${endpoint}`);
        return response.data;
      } catch (error) {
        console.error(`Error con endpoint ${endpoint}:`, error);
        lastError = error;
        
        // Si no es 404 o 405, puede ser un error de validación real
        if (axios.isAxiosError(error) && 
            error.response && 
            ![404, 405].includes(error.response.status)) {
          throw error;
        }
        
        // Si es 404 o 405, intentamos con el siguiente endpoint
      }
    }
    
    // Si llegamos aquí, ningún endpoint funcionó
    console.error("Todos los intentos de verificación fallaron");
    throw lastError;
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
        method: error.config?.method,
        headers: error.config?.headers,
        requestData: error.config?.data
      });
    } else {
      console.error('Error no relacionado con Axios:', error);
    }
  }
}

export default new AuthService();