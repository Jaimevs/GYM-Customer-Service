import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://18.130.133.242:8000";

// Interfaz para Reservaciones
export interface Reservacion {
  ID: number;
  Usuario_ID: number;
  Clase_ID: number;
  Fecha_Reservacion: string;
  Estatus: string;
  Comentario: string | null;
  Fecha_Registro: string;
  Fecha_Actualizacion: string | null;
}

export interface ReservacionCreate {
  Usuario_ID?: number; // Opcional en la interfaz, lo hacemos requerido al enviarlo
  Clase_ID: number;
  Fecha_Reservacion: string;
  Comentario?: string | null;
}

export interface ReservacionUpdate {
  Fecha_Reservacion?: string;
  Estatus?: string;
  Comentario?: string | null;
}

export interface ReservacionWithDetails extends Reservacion {
  Nombre_Usuario?: string;
  Nombre_Clase?: string;
  Dia_Clase?: string;
  Hora_Inicio?: string;
  Hora_Fin?: string;
  Entrenador_Nombre?: string;
}

class ReservationService {
  // Constructor que verifica si hay token en localStorage
  constructor() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  /**
   * Obtiene información del usuario actual desde el token JWT
   * @returns Información del usuario o null si no se puede obtener
   */
  getCurrentUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      // Decodificar el token para obtener la información del usuario
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      return null;
    }
  }

  /**
   * Obtiene el ID del usuario actual
   * @returns ID del usuario o 0 si no se puede obtener
   */
  getUserId(): number {
    try {
      // Simplificar la lógica para evitar ambigüedades
      const userData = this.getCurrentUser();
      if (userData) {
        if (userData.user_id) return userData.user_id;
        if (userData.ID) return userData.ID;
        if (userData.id) return userData.id;
      }

      // Intentar obtener de localStorage como respaldo
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.ID) return user.ID;
      }

      console.error("No se pudo identificar al usuario actual");
      return 0;
    } catch (e) {
      console.error("Error al obtener ID de usuario:", e);
      return 0;
    }
  }

  /**
   * Obtiene todas las reservaciones del usuario actual
   * @returns Una promesa con la lista de reservaciones
   */
  async getMyReservations(
    fechaInicio?: string,
    fechaFin?: string,
    estatus?: string
  ): Promise<ReservacionWithDetails[]> {
    try {
      let url = `${API_URL}/mis-reservaciones/`;
      const params: any = {};

      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;
      if (estatus) params.estatus = estatus;

      const response = await axios.get(url, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Mis reservaciones obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis reservaciones:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene una reservación específica con todos sus detalles
   * @param id ID de la reservación
   * @returns Promesa con los detalles de la reservación
   */
  async getReservationDetails(id: number): Promise<ReservacionWithDetails> {
    try {
      const response = await axios.get(`${API_URL}/reservaciones/${id}/with-details/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Detalles de reservación obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalles de la reservación ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva reservación para el usuario actual
   * @param reservacion Datos de la reservación a crear
   * @returns Promesa con la reservación creada
   */
  async createReservation(reservacion: Partial<ReservacionCreate>): Promise<Reservacion> {
    try {
      // Asegurar que el token esté configurado antes de cada solicitud
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación disponible");
      }

      console.log("Token actual:", token);
      console.log("Usuario decodificado:", this.getCurrentUser());

      // Obtener el ID del usuario actual si no se proporcionó
      let userId = reservacion.Usuario_ID;
      if (!userId) {
        userId = this.getUserId();

        if (!userId) {
          throw new Error("No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.");
        }
      }

      // Formatear correctamente la fecha
      let fechaReservacion = reservacion.Fecha_Reservacion;
      if (fechaReservacion) {
        try {
          // Primero, intentar extraer solo la fecha y la hora
          let fechaYHora;

          if (fechaReservacion.includes('T')) {
            // Si ya está en formato "YYYY-MM-DDTHH:MM:SS" o similares
            // Extraer la parte antes de la T y después de la T
            const [datePart, timePart] = fechaReservacion.split('T');

            // Si la parte de fecha incluye espacios, es un formato incorrecto
            if (datePart.includes(' ')) {
              // Es algo como "Tue Mar 25 2025..."
              const fecha = new Date(datePart);
              // Formatear manualmente para evitar problemas con zonas horarias
              const año = fecha.getFullYear();
              const mes = String(fecha.getMonth() + 1).padStart(2, '0');
              const dia = String(fecha.getDate()).padStart(2, '0');
              fechaYHora = `${año}-${mes}-${dia}T${timePart}`;
            } else {
              // El formato de fecha ya es correcto, mantenerlo
              fechaYHora = fechaReservacion;
            }
          } else if (fechaReservacion.includes('GMT')) {
            // Si es una fecha completa con zona horaria "Tue Mar 25 2025..."
            const fecha = new Date(fechaReservacion);
            // Formatear manualmente la fecha en formato ISO sin la Z
            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            const horas = String(fecha.getHours()).padStart(2, '0');
            const minutos = String(fecha.getMinutes()).padStart(2, '0');
            const segundos = String(fecha.getSeconds()).padStart(2, '0');

            fechaYHora = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
          } else {
            // Otro formato desconocido, intentar convertir con Date
            const fecha = new Date(fechaReservacion);
            // Formatear manualmente para evitar problemas con zonas horarias
            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            const horas = String(fecha.getHours()).padStart(2, '0');
            const minutos = String(fecha.getMinutes()).padStart(2, '0');
            const segundos = String(fecha.getSeconds()).padStart(2, '0');

            fechaYHora = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
          }

          // Asegurarnos de que no tiene Z al final (que indica UTC)
          if (fechaYHora.endsWith('Z')) {
            fechaYHora = fechaYHora.slice(0, -1);
          }

          fechaReservacion = fechaYHora;
          console.log("Fecha formateada:", fechaReservacion);
        } catch (e) {
          console.error("Error al formatear fecha:", e);
          // Si hay error en todo lo anterior, último intento
          try {
            // Intentar identificar la estructura de la fecha
            if (typeof fechaReservacion === 'string') {
              if (fechaReservacion.includes('T')) {
                // Ya tiene formato ISO pero podría tener problemas
                const [fechaPart, horaPart] = fechaReservacion.split('T');

                // Si fechaPart tiene formato incorrecto
                if (fechaPart.includes(' ')) {
                  // Es algo como "Tue Mar 25 2025..."
                  // Crear un objeto Date y extraer componentes
                  const d = new Date(fechaPart);
                  const fechaCorrecta = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  fechaReservacion = `${fechaCorrecta}T${horaPart}`;
                }
              } else if (fechaReservacion.includes('GMT')) {
                // Es una fecha completa con zona horaria
                const d = new Date(fechaReservacion);
                fechaReservacion = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00`;
              }
            }
          } catch (e2) {
            console.error("Error en último intento de formateo:", e2);
            // Si todo falla, dejar la fecha como está y esperar que el backend pueda manejarla
          }
        }
      }

      // Crear el payload con todos los datos necesarios
      const payload = {
        Usuario_ID: userId,
        Clase_ID: reservacion.Clase_ID,
        Fecha_Reservacion: fechaReservacion,
        Comentario: reservacion.Comentario || null,
        Estatus: "Confirmada" // Añadir estatus para evitar problemas
      };

      console.log("Enviando datos para crear reservación:", payload);

      // Configurar el token en los headers para esta solicitud específica
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(`${API_URL}/reservaciones/`, payload, {
        headers: headers
      });

      console.log("Reservación creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear reservación:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza una reservación existente
   * @param id ID de la reservación a actualizar
   * @param data Datos a actualizar
   * @returns Promesa con la reservación actualizada
   */
  async updateReservation(id: number, data: ReservacionUpdate): Promise<Reservacion> {
    try {
      // Formatear correctamente la fecha si está presente
      let payload = { ...data };
      if (data.Fecha_Reservacion) {
        try {
          const fecha = new Date(data.Fecha_Reservacion);
          // Formatear manualmente para evitar problemas con zonas horarias
          const año = fecha.getFullYear();
          const mes = String(fecha.getMonth() + 1).padStart(2, '0');
          const dia = String(fecha.getDate()).padStart(2, '0');
          const horas = String(fecha.getHours()).padStart(2, '0');
          const minutos = String(fecha.getMinutes()).padStart(2, '0');
          const segundos = String(fecha.getSeconds()).padStart(2, '0');

          payload.Fecha_Reservacion = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
        } catch (e) {
          console.error("Error al formatear fecha para actualización:", e);
          // Si hay error, mantenemos la fecha original
        }
      }

      const response = await axios.put(`${API_URL}/reservaciones/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Reservación actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar reservación ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Cancela una reservación existente
   * @param id ID de la reservación a cancelar
   * @returns Promesa con la reservación cancelada
   */
  async cancelReservation(id: number): Promise<Reservacion> {
    try {
      const response = await axios.put(`${API_URL}/reservaciones/${id}/cancelar`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Reservación cancelada:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al cancelar reservación ${id}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Obtiene las reservaciones de una clase específica (solo para entrenadores)
   * @param claseId ID de la clase
   * @param fecha Fecha opcional para filtrar
   * @returns Promesa con la lista de reservaciones
   */
  async getReservationsByClass(claseId: number, fecha?: string): Promise<ReservacionWithDetails[]> {
    try {
      let url = `${API_URL}/reservaciones/clase/${claseId}`;
      const params: any = {};

      if (fecha) params.fecha = fecha;

      const response = await axios.get(url, {
        params,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(`Reservaciones de la clase ${claseId} obtenidas:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener reservaciones de la clase ${claseId}:`, error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Marca la asistencia en una reservación (solo para entrenadores)
   * @param id ID de la reservación
   * @param asistio true si asistió, false si no asistió
   * @returns Promesa con la reservación actualizada
   */
  async markAttendance(id: number, asistio: boolean): Promise<Reservacion> {
    try {
      const response = await axios.put(`${API_URL}/reservaciones/${id}/asistencia`, null, {
        params: { asistio },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(`Asistencia marcada para reservación ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al marcar asistencia para reservación ${id}:`, error);
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

export default new ReservationService();
