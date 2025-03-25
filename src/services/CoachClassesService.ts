import axios from "axios";
import { Clase, ClaseCreate, ClaseUpdate } from "./ClassesService";

const API_URL = import.meta.env.VITE_API_URL || "http://gymtoday1243.com";

class CoachClassesService {
  // Constructor que verifica si hay token en localStorage
  constructor() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  /**
   * Obtiene todas las clases del entrenador actual
   * @returns Una promesa con la lista de clases del entrenador
   */
  async getMyClasses(): Promise<Clase[]> {
    try {
      const response = await axios.get(`${API_URL}/mis-clases/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Mis clases obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis clases:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva clase
   * @param classeData Datos de la clase a crear
   * @returns Una promesa con los datos de la clase creada
   */
  async createClass(classeData: ClaseCreate): Promise<Clase> {
    try {
      const response = await axios.post(`${API_URL}/clases/`, classeData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Clase creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear clase:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza una clase existente
   * @param id ID de la clase a actualizar
   * @param classeData Datos de la clase a actualizar
   * @returns Una promesa con los datos de la clase actualizada
   */
  async updateClass(id: number, classeData: ClaseUpdate): Promise<Clase> {
    try {
      const response = await axios.put(`${API_URL}/clases/${id}`, classeData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Clase actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar clase ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Elimina una clase existente (con manejo de errores de clave foránea)
   * @param id ID de la clase a eliminar
   * @returns Una promesa con los datos de la clase eliminada o error controlado
   */
  async deleteClass(id: number): Promise<Clase> {
    try {
      const response = await axios.delete(`${API_URL}/clases/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Clase eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar clase ${id}:`, error);
      this.logAxiosError(error);
      
      // Verificar si es un error de integridad referencial
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        const errorMessage = error.response?.data?.detail || '';
        
        if (errorMessage.includes('IntegrityError') || 
            errorMessage.includes('foreign key constraint') ||
            errorMessage.includes('FOREIGN KEY')) {
          
          throw new Error("Esta clase tiene quejas asociadas y no puede ser eliminada. " +
            "Por favor, contacta al administrador para eliminar primero las quejas relacionadas.");
        }
      }
      
      throw error;
    }
  }

  /**
   * Obtiene información del usuario actual (entrenador)
   * @returns Una promesa con la información del usuario
   */
  async getCurrentUser() {
    try {
      // Esta función dependería de cómo manejas la información del usuario en tu aplicación
      // Podrías tener un servicio dedicado para esto
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }
      
      // Decodificar el token para obtener la información del usuario
      // Esto es solo un ejemplo, la implementación real dependería de tu estructura de token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
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
        method: error.config?.method,
        headers: error.config?.headers,
        requestData: error.config?.data
      });
    } else {
      console.error('Error no relacionado con Axios:', error);
    }
  }
}

export default new CoachClassesService();