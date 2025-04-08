import axios from "axios";

// URL base de la API
const API_URL = "https://gymtoday12.com";

// Interfaces basadas en el schema OpinionCliente
export interface OpinionCliente {
  ID: number;
  Usuario_ID: number;
  Tipo: string;
  Descripcion: string;
  Respuesta_Usuario_ID?: number;
  Respuesta?: string;
  Estatus: boolean;
  Fecha_Registro: string;
  Fecha_Actualizacion?: string;
}

export interface OpinionClienteDetalle extends OpinionCliente {
  Usuario_Nombre?: string;
  Respuesta_Usuario_Nombre?: string;
}

export interface OpinionRespuesta {
  Respuesta: string;
}

export interface OpinionResumen {
  totalPendientes: number;
  totalRespondidas: number;
  porTipo: Record<string, number>;
}

class OpinionAdminService {
  // Obtener todas las opiniones (sólo admin)
  async getOpiniones(skip: number = 0, limit: number = 10, tipo?: string, sinResponder: boolean = false): Promise<OpinionCliente[]> {
    try {
      let url = `${API_URL}/opiniones/?skip=${skip}&limit=${limit}`;
      
      if (tipo) {
        url += `&tipo=${tipo}`;
      }
      
      if (sinResponder) {
        url += `&sin_responder=true`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al obtener opiniones:", error);
      throw error;
    }
  }

  // Obtener opiniones con detalles de usuario
  async getOpinionesConDetalles(skip: number = 0, limit: number = 10): Promise<OpinionClienteDetalle[]> {
    try {
      const response = await axios.get(`${API_URL}/opiniones/detalles/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener opiniones con detalles:", error);
      throw error;
    }
  }

  // Responder a una opinión
  async responderOpinion(id: number, respuesta: string): Promise<OpinionCliente> {
    try {
      const response = await axios.put(`${API_URL}/opiniones/${id}/responder`, {
        Respuesta: respuesta
      });
      return response.data;
    } catch (error) {
      console.error(`Error al responder a la opinión ${id}:`, error);
      throw error;
    }
  }

  // Eliminar una opinión
  async eliminarOpinion(id: number): Promise<OpinionCliente> {
    try {
      const response = await axios.delete(`${API_URL}/opiniones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la opinión ${id}:`, error);
      throw error;
    }
  }

  // Obtener resumen de opiniones (método personalizado)
  async getResumen(): Promise<OpinionResumen> {
    try {
      // Obtener todas las opiniones para generar el resumen
      const opiniones = await this.getOpiniones(0, 100);
      
      // Calcular resumen
      const resumen: OpinionResumen = {
        totalPendientes: 0,
        totalRespondidas: 0,
        porTipo: {}
      };
      
      opiniones.forEach(opinion => {
        // Contar por estado
        if (opinion.Estatus) {
          resumen.totalRespondidas++;
        } else {
          resumen.totalPendientes++;
        }
        
        // Contar por tipo
        if (!resumen.porTipo[opinion.Tipo]) {
          resumen.porTipo[opinion.Tipo] = 0;
        }
        resumen.porTipo[opinion.Tipo]++;
      });
      
      return resumen;
    } catch (error) {
      console.error("Error al obtener resumen:", error);
      throw error;
    }
  }
}

export default new OpinionAdminService();