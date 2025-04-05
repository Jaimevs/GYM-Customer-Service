import axios from "axios";

// URL base de la API
const API_URL = "https://gymtoday12.com";

// Definir interfaz de usuario
interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

class UserSettingsService {
  /**
   * Obtener el usuario desde localStorage
   * @returns Objeto de usuario o null
   */
  private getUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return null;
    }
  }

  /**
   * Obtener token válido desde localStorage
   * @returns Token o null
   */
  private getValidToken(): string | null {
    try {
      // ---- SOLUCIÓN DE EMERGENCIA ----
      
      // Verificar si hay un token problemático
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken) {
        console.error("No se encontró token en localStorage");
        return null;
      }
      
      // Verificar específicamente para [object Object]
      if (storedToken === "[object Object]") {
        console.error("ENCONTRADO TOKEN PROBLEMÁTICO: [object Object]");
        
        // Limpiar el token inválido
        localStorage.removeItem("token");
        
        // Notificar al usuario
        alert("Se ha detectado un problema con tu sesión. Por favor, inicia sesión nuevamente.");
        
        // Redirigir a la página de login
        window.location.href = "/login";
        return null;
      }
      
      console.log("Token encontrado (tipo):", typeof storedToken);
      console.log("Token encontrado (primeros 30 caracteres):", storedToken.substring(0, 30));
      
      // En este punto tenemos un token que al menos no es [object Object]
      return storedToken;
    } catch (error) {
      console.error("Error al obtener token:", error);
      return null;
    }
  }

  /**
   * Cambia la contraseña del usuario
   * @param newPassword Nueva contraseña
   * @returns Respuesta del servidor
   */
  async changePassword(newPassword: string): Promise<any> {
    try {
      // Obtener token directamente
      const token = localStorage.getItem("token");
      
      console.log("Token almacenado:", token);
      console.log("Tipo de token:", typeof token);
  
      if (!token) {
        throw new Error("No se encontró token de autorización");
      }
      
      // Realizar la solicitud de cambio de contraseña
      const response = await axios.post(
        `${API_URL}/users/change-password`, 
        { 
          new_password: newPassword 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error.response?.data || error.message);
      
      if (error.response) {
        console.error("Detalles del error:", {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }

  /**
   * Guarda las preferencias de notificación del usuario
   * @param preferences Preferencias de notificación
   * @returns Respuesta del servidor
   */
  async saveNotificationPreferences(preferences: { email: boolean, push: boolean }): Promise<any> {
    try {
      const user = this.getUser();
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const token = this.getValidToken();
      if (!token) {
        throw new Error("No se encontró token de autorización");
      }

      const response = await axios.post(
        `${API_URL}/users/${user.id}/notification-preferences`, 
        preferences,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al guardar preferencias de notificación:", error);
      throw error;
    }
  }

  /**
   * Guarda el tema visual del usuario
   * @param theme Tema seleccionado
   * @returns Respuesta del servidor
   */
  async saveTheme(theme: string): Promise<any> {
    try {
      const user = this.getUser();
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const token = this.getValidToken();
      if (!token) {
        throw new Error("No se encontró token de autorización");
      }

      const response = await axios.post(
        `${API_URL}/users/${user.id}/theme`, 
        { theme },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al guardar el tema:", error);
      throw error;
    }
  }
}

export default new UserSettingsService();