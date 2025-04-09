// UserProfileService.ts

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday12.com";

interface ReservacionInfo {
  ID: number;
  Clase_ID: number;
  Fecha_Reservacion: string;
  Estatus: string;
  Nombre_Clase: string | null;
}

interface UserProfileInfo {
  Nombre_Completo: string;
  Peso: number | null;
  Reservaciones: ReservacionInfo[];
}

class UserProfileService {
  // Constructor que verifica si hay token en localStorage
  constructor() {
    this.setupAuthHeaders();
  }

  // Método para configurar los headers de autenticación
  setupAuthHeaders() {
    const token = localStorage.getItem("token");
    
    if (token) {
      if (token.startsWith("Bearer ")) {
        axios.defaults.headers.common["Authorization"] = token;
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } else {
      console.warn("No hay token disponible para autenticación");
    }
  }

  /**
   * Obtiene la información del perfil del usuario incluyendo nombre completo, peso y reservaciones
   * @returns Una promesa con la información del perfil del usuario
   */
  async getUserProfileInfo(): Promise<UserProfileInfo> {
    try {
      // Asegurar que los headers estén configurados
      this.setupAuthHeaders();
      
      const response = await axios.get(`${API_URL}/user-profile-info/`);
      
      console.log("Información de perfil obtenida:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener información del perfil:", error);
      throw error;
    }
  }
}

export default new UserProfileService();