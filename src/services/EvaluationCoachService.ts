import axios from "axios";

// URL base de la API
const API_URL = "https://gymtoday12.com";

// Interfaces
export interface EvaluacionDetalle {
  id: number;
  usuario_id: number;
  nombre_usuario: string;
  clase_id: number;
  clase_nombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  fecha_actualizacion: string | null;
  estatus: boolean;
}

export interface EstadisticasEvaluaciones {
  totalEvaluaciones: number;
  promedioCalificacion: number;
  distribucionCalificaciones: {
    "5_estrellas": number;
    "4_estrellas": number;
    "3_estrellas": number;
    "2_estrellas": number;
    "1_estrella": number;
  };
}

class EvaluationService {
  // Obtener todas las evaluaciones del entrenador
  async getTrainerEvaluations(): Promise<EvaluacionDetalle[]> {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      
      const response = await axios.get(`${API_URL}/entrenador/mis-quejas/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Evaluaciones recibidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener evaluaciones:", error);
      this.logAxiosError(error);
      throw error;
    }
  }
  
  // Procesar estadísticas a partir de las evaluaciones
  processStatistics(evaluaciones: EvaluacionDetalle[]): EstadisticasEvaluaciones {
    // Inicializar objeto de estadísticas
    const stats: EstadisticasEvaluaciones = {
      totalEvaluaciones: evaluaciones.length,
      promedioCalificacion: 0,
      distribucionCalificaciones: {
        "5_estrellas": 0,
        "4_estrellas": 0,
        "3_estrellas": 0,
        "2_estrellas": 0,
        "1_estrella": 0
      }
    };
    
    // Si no hay evaluaciones, devolver estadísticas vacías
    if (evaluaciones.length === 0) {
      return stats;
    }
    
    // Calcular promedio
    const sumaCalificaciones = evaluaciones.reduce((sum, item) => sum + item.calificacion, 0);
    stats.promedioCalificacion = Math.round((sumaCalificaciones / evaluaciones.length) * 20); // Convertir a porcentaje (1-5 -> 20-100%)
    
    // Calcular distribución
    evaluaciones.forEach(item => {
      switch(item.calificacion) {
        case 5:
          stats.distribucionCalificaciones["5_estrellas"]++;
          break;
        case 4:
          stats.distribucionCalificaciones["4_estrellas"]++;
          break;
        case 3:
          stats.distribucionCalificaciones["3_estrellas"]++;
          break;
        case 2:
          stats.distribucionCalificaciones["2_estrellas"]++;
          break;
        case 1:
          stats.distribucionCalificaciones["1_estrella"]++;
          break;
      }
    });
    
    return stats;
  }
  
  // Obtener comentarios recientes (los últimos 4)
  getRecentComments(evaluaciones: EvaluacionDetalle[]): any[] {
    // Ordenar por fecha (más recientes primero)
    const sortedEvaluaciones = [...evaluaciones].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
    
    // Convertir al formato que espera el componente
    return sortedEvaluaciones.slice(0, 4).map(item => ({
      client: item.nombre_usuario,
      text: item.comentario || "Sin comentarios",
      rating: item.calificacion,
      date: item.fecha
    }));
  }
  
  // Obtener número de clientes únicos que han evaluado
  getUniqueClientCount(evaluaciones: EvaluacionDetalle[]): number {
    const uniqueClientIds = new Set();
    
    evaluaciones.forEach(item => {
      uniqueClientIds.add(item.usuario_id);
    });
    
    return uniqueClientIds.size;
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

export default new EvaluationService();