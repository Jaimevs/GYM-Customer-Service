import axios from "axios";

// URL base de la API
const API_URL = "https://gymtoday12.com";

// Interfaces para la configuración de usuario
interface ProfileData {
  Nombre: string;
  Primer_Apellido: string;
  Segundo_Apellido?: string;
  Numero_Telefonico?: string;
  Nombre_Usuario?: string;
  Correo_Electronico?: string;
}

interface PasswordChangeData {
  new_password: string;
}

class SettingsService {
  // Obtener información del perfil
  async getProfileData(): Promise<ProfileData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get(`${API_URL}/personbasic/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Datos de perfil recibidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos del perfil:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Actualizar información del perfil
  async updateProfileData(data: ProfileData): Promise<ProfileData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.put(`${API_URL}/personbasic/`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Perfil actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Crear información del perfil (por si no existe)
  async createProfileData(data: ProfileData): Promise<ProfileData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.post(`${API_URL}/personbasic/`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Perfil creado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear el perfil:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(password: string): Promise<any> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const passwordData: PasswordChangeData = {
        new_password: password
      };

      const response = await axios.post(`${API_URL}/users/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Contraseña actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
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
}

export default new SettingsService();