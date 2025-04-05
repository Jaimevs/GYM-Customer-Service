import axios from "axios";

// URL base de la API
const API_URL = "https://gymtoday12.com";

// Interfaz para la nueva respuesta completa
interface GoogleAuthCompleteResponse {
  ID: number;
  Nombre_Usuario: string;
  Correo_Electronico: string;
  roles: string[];
  token: {
    access_token: string;
    token_type: string;
    user_id: number;
    username: string;
    email: string;
    roles: string[];
  }
}

// Interfaz para usuario en formato de localStorage
interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  profilePicture?: string;
}

class GoogleAuthService {
  // Iniciar flujo de autenticación con Google
  startGoogleAuth(): void {
    console.log("Iniciando autenticación con Google...");
    window.location.href = `${API_URL}/auth/google`;
  }

  // Procesar respuesta del callback de OAuth
  processCallback(queryParams: URLSearchParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Verificar si hay un error
      const error = queryParams.get("error");
      if (error) {
        console.error("Error en la autenticación con Google:", error);
        reject(new Error(error));
        return;
      }
      
      // Primero verificar si tenemos la nueva respuesta completa (en formato data)
      const encodedData = queryParams.get("data");
      
      if (encodedData) {
        try {
          // Decodificar y parsear los datos JSON
          const userData = JSON.parse(decodeURIComponent(encodedData)) as GoogleAuthCompleteResponse;
          console.log("Datos completos recibidos:", userData);
          
          // Configurar la sesión con los datos completos
          this.setCompleteGoogleSession(userData)
            .then(() => resolve(true))
            .catch(err => {
              console.error("Error al configurar la sesión:", err);
              reject(err);
            });
        } catch (err) {
          console.error("Error al procesar los datos JSON:", err);
          reject(new Error("Formato de datos inválido"));
        }
      } else {
        // Compatibilidad con versión anterior (token y user_id separados)
        const token = queryParams.get("token");
        const userId = queryParams.get("user_id");
        
        if (!token || !userId) {
          console.error("No se recibió token o ID de usuario");
          reject(new Error("No se recibió información de autenticación válida"));
          return;
        }
        
        console.log("Datos recibidos de Google Auth (formato antiguo):", { token, userId });
        
        // Guardar el token y configurar la sesión (método antiguo)
        this.setGoogleSession(token, userId)
          .then(() => resolve(true))
          .catch(err => {
            console.error("Error al configurar la sesión:", err);
            reject(err);
          });
      }
    });
  }
  
  // Configurar la sesión con el nuevo formato de datos completo
  async setCompleteGoogleSession(userData: GoogleAuthCompleteResponse): Promise<void> {
    try {
      // Extraer el token de acceso
      const token = userData.token.access_token;
      
      console.log("Token a guardar:", token);
      
      // Configurar axios para usar el token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Crear objeto de usuario en formato esperado por localStorage
      const user: User = {
        id: userData.ID,
        username: userData.Nombre_Usuario,
        email: userData.Correo_Electronico,
        roles: userData.roles
      };
      
      // Guardar datos en localStorage (compatible con AuthService.ts)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", userData.roles[0] || "usuario");
      
      // Indicar que es una autenticación de Google
      localStorage.setItem("googleAuth", "true");
      
      console.log("Datos guardados en localStorage:", {
        token: token.substring(0, 20) + "...",
        user,
        userRole: userData.roles[0] || "usuario"
      });
      
      console.log("Sesión con Google configurada correctamente (nuevo formato)");
    } catch (error) {
      console.error("Error al configurar sesión con Google:", error);
      throw error;
    }
  }
  
  // Configurar la sesión después de una autenticación exitosa con Google (formato antiguo)
  async setGoogleSession(token: string, userId: string): Promise<void> {
    try {
      console.log("Token a guardar (formato antiguo):", token);
      
      // Configurar axios para usar el token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Obtener perfil del usuario usando el token
      const userProfile = await this.fetchUserProfile(userId);
      
      if (!userProfile) {
        throw new Error("No se pudo obtener el perfil del usuario");
      }
      
      // Crear objeto de usuario en formato esperado por localStorage
      const user: User = {
        id: parseInt(userId),
        username: userProfile.Nombre_Usuario,
        email: userProfile.Correo_Electronico,
        roles: userProfile.roles || ["usuario"]
      };
      
      if (userProfile.Foto_Perfil) {
        user.profilePicture = userProfile.Foto_Perfil;
        localStorage.setItem("userProfilePicture", userProfile.Foto_Perfil);
      }
      
      // Guardar datos en localStorage (compatible con AuthService.ts)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.roles[0] || "usuario");
      
      // Indicar que es una autenticación de Google
      localStorage.setItem("googleAuth", "true");
      
      console.log("Datos guardados en localStorage:", {
        token: token.substring(0, 20) + "...",
        user,
        userRole: user.roles[0] || "usuario"
      });
      
      console.log("Sesión con Google configurada correctamente (formato antiguo)");
    } catch (error) {
      console.error("Error al configurar sesión con Google:", error);
      throw error;
    }
  }
  
  // Obtener perfil del usuario desde el backend
  async fetchUserProfile(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener perfil de usuario:", error);
      return null;
    }
  }
  
  // Verificar si la autenticación actual es mediante Google
  isGoogleAuthenticated(): boolean {
    return localStorage.getItem("googleAuth") === "true";
  }
}

// CORREGIDO: Exportación por defecto
const googleAuthService = new GoogleAuthService();
export default googleAuthService;