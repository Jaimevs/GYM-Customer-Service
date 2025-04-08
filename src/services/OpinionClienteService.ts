import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday12.com";

export interface OpinionCliente {
  ID: number;
  Usuario_ID: number;
  Tipo: string;
  Descripcion: string;
  Respuesta_Usuario_ID: number | null;
  Respuesta: string | null;
  Estatus: boolean;
  Fecha_Registro: string;
  Fecha_Actualizacion: string | null;
}

export interface OpinionClienteCreate {
  Tipo: string;
  Descripcion: string;
}

export interface OpinionClienteUpdate {
  Tipo?: string;
  Descripcion?: string;
}

export interface OpinionClienteDetalle extends OpinionCliente {
  Usuario_Nombre: string | null;
  Respuesta_Usuario_Nombre: string | null;
}

class OpinionClienteService {
  constructor() {
    this.setupAxiosInterceptors();
  }

  private setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtiene todas las opiniones realizadas por el usuario
   * @returns Una promesa con la lista de opiniones del usuario
   */
  async getMisOpiniones(): Promise<OpinionCliente[]> {
    try {
      const response = await axios.get(`${API_URL}/mis-opiniones/`);
      console.log("Mis opiniones obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis opiniones:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva opinión
   * @param opinion Datos de la opinión a crear
   * @returns Una promesa con los datos de la opinión creada
   */
  async createOpinion(opinion: OpinionClienteCreate): Promise<OpinionCliente> {
    try {
      const response = await axios.post(`${API_URL}/opiniones/`, opinion);
      console.log("Opinión creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear opinión:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza una opinión existente
   * @param id ID de la opinión a actualizar
   * @param opinionData Datos de la opinión a actualizar
   * @returns Una promesa con los datos de la opinión actualizada
   */
  async updateOpinion(id: number, opinionData: OpinionClienteUpdate): Promise<OpinionCliente> {
    try {
      const response = await axios.put(`${API_URL}/opiniones/${id}`, opinionData);
      console.log("Opinión actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar opinión ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Elimina una opinión existente
   * @param id ID de la opinión a eliminar
   * @returns Una promesa con los datos de la opinión eliminada
   */
  async deleteOpinion(id: number): Promise<OpinionCliente> {
    try {
      const response = await axios.delete(`${API_URL}/opiniones/${id}`);
      console.log("Opinión eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar opinión ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de una opinión específica
   * @param id ID de la opinión
   * @returns Una promesa con los detalles de la opinión
   */
  async getOpinionById(id: number): Promise<OpinionCliente> {
    try {
      const response = await axios.get(`${API_URL}/opiniones/${id}`);
      console.log("Detalles de opinión obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles de la opinión ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  // Utilidad para registrar errores de Axios con más detalle
  private logAxiosError(error: any): void {
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

export default new OpinionClienteService();