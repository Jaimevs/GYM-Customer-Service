import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday1243.com";

// Interfaz para Quejas
export interface Queja {
  ID: number;
  Usuario_ID: number;
  Entrenador_ID: number;
  Clase_ID: number;
  Calificacion: number;
  Comentario: string | null;
  Estatus: boolean;
  Fecha_Registro: string;
  Fecha_Actualizacion: string | null;
}

export interface QuejaCreate {
  Entrenador_ID: number;
  Clase_ID: number;
  Calificacion: number;
  Comentario?: string | null;
  Estatus?: boolean;
}

export interface QuejaUpdate {
  Calificacion?: number;
  Comentario?: string | null;
  Estatus?: boolean;
}

export interface QuejaDetalle extends Queja {
  Entrenador_Nombre: string | null;
  Clase_Nombre: string | null;
  Usuario_Nombre: string | null;
}

// Interfaz para Sugerencias
export interface Sugerencia {
  ID: number;
  Usuario_ID: number;
  Calificacion: number;
  Comentario: string;
  Tipo: string;
  Estatus: boolean;
  Fecha_Registro: string;
  Fecha_Actualizacion: string | null;
}

export interface SugerenciaCreate {
  Calificacion: number;
  Comentario: string;
  Tipo?: string;
  Estatus?: boolean;
}

export interface SugerenciaUpdate {
  Calificacion?: number;
  Comentario?: string;
  Tipo?: string;
  Estatus?: boolean;
}

class FeedbackService {
  // Constructor que verifica si hay token en localStorage
  constructor() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  /**
   * Obtiene todas las quejas realizadas por el usuario
   * @returns Una promesa con la lista de quejas del usuario
   */
  async getMyComplaints(): Promise<Queja[]> {
    try {
      const response = await axios.get(`${API_URL}/mis-quejas/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Mis quejas obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis quejas:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene todas las sugerencias realizadas por el usuario
   * @returns Una promesa con la lista de sugerencias del usuario
   */
  async getMySuggestions(): Promise<Sugerencia[]> {
    try {
      const response = await axios.get(`${API_URL}/mis-sugerencias/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Mis sugerencias obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis sugerencias:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva queja
   * @param complaint Datos de la queja a crear
   * @returns Una promesa con los datos de la queja creada
   */
  async createComplaint(complaint: QuejaCreate): Promise<Queja> {
    try {
      const response = await axios.post(`${API_URL}/quejas/`, complaint, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Queja creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear queja:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva sugerencia
   * @param suggestion Datos de la sugerencia a crear
   * @returns Una promesa con los datos de la sugerencia creada
   */
  async createSuggestion(suggestion: SugerenciaCreate): Promise<Sugerencia> {
    try {
      const response = await axios.post(`${API_URL}/sugerencias/`, suggestion, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Sugerencia creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear sugerencia:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza una queja existente
   * @param id ID de la queja a actualizar
   * @param complaintData Datos de la queja a actualizar
   * @returns Una promesa con los datos de la queja actualizada
   */
  async updateComplaint(id: number, complaintData: QuejaUpdate): Promise<Queja> {
    try {
      const response = await axios.put(`${API_URL}/quejas/${id}`, complaintData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Queja actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar queja ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza una sugerencia existente
   * @param id ID de la sugerencia a actualizar
   * @param suggestionData Datos de la sugerencia a actualizar
   * @returns Una promesa con los datos de la sugerencia actualizada
   */
  async updateSuggestion(id: number, suggestionData: SugerenciaUpdate): Promise<Sugerencia> {
    try {
      const response = await axios.put(`${API_URL}/sugerencias/${id}`, suggestionData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Sugerencia actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar sugerencia ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Elimina una queja existente
   * @param id ID de la queja a eliminar
   * @returns Una promesa con los datos de la queja eliminada
   */
  async deleteComplaint(id: number): Promise<Queja> {
    try {
      const response = await axios.delete(`${API_URL}/quejas/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Queja eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar queja ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Elimina una sugerencia existente
   * @param id ID de la sugerencia a eliminar
   * @returns Una promesa con los datos de la sugerencia eliminada
   */
  async deleteSuggestion(id: number): Promise<Sugerencia> {
    try {
      const response = await axios.delete(`${API_URL}/sugerencias/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Sugerencia eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar sugerencia ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de una queja específica
   * @param id ID de la queja
   * @returns Una promesa con los detalles de la queja
   */
  async getComplaintById(id: number): Promise<Queja> {
    try {
      const response = await axios.get(`${API_URL}/quejas/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Detalles de queja obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles de la queja ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de una sugerencia específica
   * @param id ID de la sugerencia
   * @returns Una promesa con los detalles de la sugerencia
   */
  async getSuggestionById(id: number): Promise<Sugerencia> {
    try {
      const response = await axios.get(`${API_URL}/sugerencias/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Detalles de sugerencia obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles de la sugerencia ${id}:`, error);
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

export default new FeedbackService();
