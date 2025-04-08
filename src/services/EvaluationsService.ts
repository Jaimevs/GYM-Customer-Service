import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://gymtoday12.com';

// Interfaces para la estructura de datos
interface Distribucion {
  "5_estrellas": number;
  "4_estrellas": number;
  "3_estrellas": number;
  "2_estrellas": number;
  "1_estrella": number;
}

interface TendenciaItem {
  periodo: string;
  promedio_calificacion: number;
  total_quejas: number;
}

interface Entrenador {
  entrenador_id: number;
  nombre: string;
  promedio_calificacion: number;
  total_quejas: number;
  distribucion_calificaciones: Distribucion;
}

interface Queja {
  id: number;
  calificacion: number;
  comentario: string;
  fecha: string;
  usuario_nombre: string;
  clase_nombre: string;
}

interface EstadisticasGenerales {
  total_quejas: number;
  promedio_calificacion: number;
  distribucion_calificaciones: Distribucion;
  tendencia_calificaciones: TendenciaItem[];
  estadisticas_por_entrenador: Entrenador[];
  top_entrenadores?: Entrenador[];
}

interface DetalleEntrenador {
  entrenador_id: number;
  nombre: string;
  promedio_calificacion: number;
  total_quejas: number;
  distribucion_calificaciones: Distribucion;
  tendencia_calificaciones: TendenciaItem[];
  ultimas_quejas: Queja[];
}

class EvaluationsService {
  /**
   * Obtiene las estadísticas generales de todas las evaluaciones
   */
  async getEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(`${API_URL}/admin/quejas/estadisticas/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas detalladas de un entrenador específico
   */
  async getDetalleEntrenador(entrenadorId: number): Promise<DetalleEntrenador> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(`${API_URL}/admin/entrenador/${entrenadorId}/estadisticas/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle del entrenador:', error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Calcula la cantidad de evaluaciones por calificación basado en el porcentaje
   */
  calcularCantidadPorPorcentaje(porcentaje: number, total: number): number {
    return Math.round((porcentaje / 100) * total);
  }

  /**
   * Convierte claves de calificación a valores numéricos
   */
  getRatingValue(key: string): number {
    if (key === '5_estrellas') return 5;
    if (key === '4_estrellas') return 4;
    if (key === '3_estrellas') return 3;
    if (key === '2_estrellas') return 2;
    if (key === '1_estrella') return 1;
    return parseInt(key.charAt(0));
  }

  /**
   * Formatea una fecha ISO a formato local español
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Obtiene color según la calificación
   */
  getColorForRating(rating: number): string {
    const colors = {
      1: 'var(--color-grafica-rojo-granate)',
      2: 'var(--color-grafica-rojo-fuego)',
      3: 'var(--color-grafica-amarillo-dorado)',
      4: 'var(--color-grafica-naranja-calido)',
      5: 'var(--color-grafica-ocre)'
    };
    return colors[rating] || 'var(--color-grafica-gris-plata)';
  }

  /**
   * Registra errores de Axios con más detalle
   */
  private logAxiosError(error: any): void {
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

export default new EvaluationsService();