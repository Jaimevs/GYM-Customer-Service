import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday12.com";

// Definición de interfaces para manejar los datos de clases
export interface Clase {
  ID: number;
  Nombre: string;
  Descripcion: string;
  Dia_Inicio: string;
  Dia_Fin: string;
  Hora_Inicio: string;
  Hora_Fin: string;
  Duracion_Minutos: number;
  Estatus: boolean;
  Fecha_Registro: string;
  Fecha_Actualizacion: string;
}

export interface ClaseCreate {
  Nombre: string;
  Descripcion: string;
  Dia_Inicio: string;
  Dia_Fin: string;
  Hora_Inicio: string;
  Hora_Fin: string;
  Duracion_Minutos: number;
  Estatus: boolean;
}

export interface ClaseUpdate {
  Nombre?: string;
  Descripcion?: string;
  Dia_Inicio?: string;
  Dia_Fin?: string;
  Hora_Inicio?: string;
  Hora_Fin?: string;
  Duracion_Minutos?: number;
  Estatus?: boolean;
}

class CoachClassesService {
  // Constructor que verifica si hay token en localStorage
  constructor() {
    this.setupAxiosInterceptors();
  }

  private setupAxiosInterceptors() {
    // Interceptor para establecer el token en cada solicitud
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
   * Obtiene todas las clases del entrenador actual usando el endpoint /mis-clases/
   * @returns Una promesa con la lista de clases del entrenador
   */
  async getMyClasses(): Promise<Clase[]> {
    try {
      const response = await axios.get(`${API_URL}/mis-clases/`);
      console.log("Mis clases obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis clases:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva clase con el endpoint /clases/
   * No necesita especificar Entrenador_ID ya que se obtiene del token
   * @param classeData Datos de la clase a crear
   * @returns Una promesa con los datos de la clase creada
   */
  async createClass(classeData: ClaseCreate): Promise<Clase> {
    try {
      const response = await axios.post(`${API_URL}/clases/`, classeData);
      console.log("Clase creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear clase:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza una clase existente con el endpoint /clases/{id}
   * @param id ID de la clase a actualizar
   * @param classeData Datos de la clase a actualizar
   * @returns Una promesa con los datos de la clase actualizada
   */
  async updateClass(id: number, classeData: ClaseUpdate): Promise<Clase> {
    try {
      const response = await axios.put(`${API_URL}/clases/${id}`, classeData);
      console.log("Clase actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar clase ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Elimina una clase existente con el endpoint /clases/{id}
   * Solo puede eliminar clases que el entrenador haya creado
   * @param id ID de la clase a eliminar
   * @returns Una promesa con los datos de la clase eliminada
   */
  async deleteClass(id: number): Promise<Clase> {
    try {
      const response = await axios.delete(`${API_URL}/clases/${id}`);
      console.log("Clase eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar clase ${id}:`, error);
      this.logAxiosError(error);

      // Verificar si es un error de permisos o integridad referencial
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error("No tienes permiso para eliminar esta clase.");
        } else if (error.response?.status === 500) {
          // Verificar si es un error de integridad referencial
          const errorMessage = error.response?.data?.detail || '';
          if (errorMessage.includes('IntegrityError') ||
              errorMessage.includes('foreign key constraint') ||
              errorMessage.includes('FOREIGN KEY')) {
            throw new Error("Esta clase tiene registros asociados y no puede ser eliminada. " +
              "Por favor, contacta al administrador para eliminar primero los registros relacionados.");
          }
        }
      }

      throw error;
    }
  }

  /**
   * Obtiene estadísticas y datos para el dashboard
   * Esta función procesa los datos obtenidos de getMyClasses para generar estadísticas
   * @returns Objeto con estadísticas de las clases
   */
  async getClassesStats(): Promise<any> {
    try {
      const classes = await this.getMyClasses();
      
      // Calcular número de clases por día de la semana
      const dayCount = {
        'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 'Jueves': 0, 
        'Viernes': 0, 'Sábado': 0, 'Domingo': 0
      };
      
      classes.forEach(clase => {
        if (clase.Dia_Inicio in dayCount) {
          dayCount[clase.Dia_Inicio]++;
        }
      });
      
      // Calcular total de horas de clase
      const totalMinutos = classes.reduce((total, clase) => {
        return total + clase.Duracion_Minutos;
      }, 0);
      
      const totalHoras = Math.round(totalMinutos / 60);
      
      // Determinar clases activas vs inactivas
      const clasesActivas = classes.filter(clase => clase.Estatus).length;
      
      // Crear datos para el gráfico de barras
      const chartData = [
        dayCount['Lunes'],
        dayCount['Martes'], 
        dayCount['Miércoles'], 
        dayCount['Jueves'],
        dayCount['Viernes'], 
        dayCount['Sábado'], 
        dayCount['Domingo']
      ];
      
      // Próximas clases (simulado, en un entorno real podrías ordenar por fecha)
      const upcomingClasses = classes
        .filter(clase => clase.Estatus)
        .slice(0, 3)
        .map(clase => ({
          id: clase.ID,
          name: clase.Nombre,
          date: `${clase.Dia_Inicio} a ${clase.Dia_Fin}`,
          time: `${this.formatTime(clase.Hora_Inicio)} - ${this.formatTime(clase.Hora_Fin)}`,
          type: this.determineClassType(clase.Nombre),
          icon: this.getClassIcon(clase.Nombre)
        }));
      
      return {
        totalClasses: classes.length,
        activeClasses: clasesActivas,
        totalHours: totalHoras,
        chartData: chartData,
        upcomingClasses: upcomingClasses
      };
    } catch (error) {
      console.error("Error al obtener estadísticas de clases:", error);
      throw error;
    }
  }

  // Función auxiliar para determinar el tipo de clase basado en su nombre
  private determineClassType(className: string): string {
    const lowerName = className.toLowerCase();
    if (lowerName.includes('yoga') || lowerName.includes('pilates')) return 'yoga';
    if (lowerName.includes('cross') || lowerName.includes('fit')) return 'crossfit';
    if (lowerName.includes('cardio') || lowerName.includes('aerobic')) return 'cardio';
    return 'general';
  }

  // Función auxiliar para obtener el icono según el tipo de clase
  private getClassIcon(className: string): string {
    const type = this.determineClassType(className);
    const icons = {
      'yoga': 'mdi-yoga',
      'crossfit': 'mdi-dumbbell',
      'cardio': 'mdi-run',
      'general': 'mdi-arm-flex'
    };
    return icons[type] || 'mdi-calendar-clock';
  }

  // Función auxiliar para formatear la hora
  private formatTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.substring(0, 5);
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

export default new CoachClassesService();