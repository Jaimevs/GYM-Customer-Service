import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday12.com";

export interface Clase {
  ID: number;
  Entrenador_ID: number;
  Nombre: string;
  Descripcion: string | null;
  Dia_Inicio: string;
  Dia_Fin: string;
  Hora_Inicio: string;
  Hora_Fin: string;
  Duracion_Minutos: number;
  Estatus: boolean;
  Fecha_Registro: string;
  Fecha_Actualizacion: string | null;
}

export interface ClaseWithEntrenador extends Clase {
  Entrenador_Nombre: string | null;
  Entrenador_Apellido: string | null;
}

export interface ClaseCreate {
  Entrenador_ID: number;
  Nombre: string;
  Descripcion?: string | null;
  Dia_Inicio: string;
  Dia_Fin: string;
  Hora_Inicio: string;
  Hora_Fin: string;
  Duracion_Minutos: number;
  Estatus?: boolean;
}

export interface ClaseUpdate {
  Nombre?: string;
  Descripcion?: string | null;
  Dia_Inicio?: string;
  Dia_Fin?: string;
  Hora_Inicio?: string;
  Hora_Fin?: string;
  Duracion_Minutos?: number;
  Estatus?: boolean;
}

class ClassesService {
  // Constructor que verifica si hay token en localStorage
  constructor() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  /**
   * Obtiene todas las clases con detalles del entrenador
   * @returns Una promesa con la lista de clases
   */
  async getAllClasses(): Promise<ClaseWithEntrenador[]> {
    try {
      const response = await axios.get(`${API_URL}/clases/with-details/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Clases obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener clases:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de una clase específica
   * @param id ID de la clase
   * @returns Una promesa con los detalles de la clase
   */
  async getClassById(id: number): Promise<ClaseWithEntrenador> {
    try {
      const response = await axios.get(`${API_URL}/clases/${id}/with-details/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Detalles de clase obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles de la clase ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene las clases de un entrenador específico
   * @param entrenadorId ID del entrenador
   * @returns Una promesa con la lista de clases del entrenador
   */
  async getClassesByTrainer(entrenadorId: number): Promise<Clase[]> {
    try {
      const response = await axios.get(`${API_URL}/clases/entrenador/${entrenadorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Clases del entrenador obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener clases del entrenador ${entrenadorId}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene las clases del entrenador autenticado
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
   * Elimina una clase existente
   * @param id ID de la clase a eliminar
   * @returns Una promesa con los datos de la clase eliminada
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

export default new ClassesService();