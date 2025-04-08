import axios from "axios";
import AuthService from "@/services/AuthService";

// URL base de la API
const API_URL = "https://gymtoday12.com";

// Interfaces para tipado
export interface Usuario {
  ID: number;
  Nombre_Usuario: string;
  Correo_Electronico: string;
  Nombre: string;
  Roles?: string[];
  selectedRol?: string;
}

export interface CambioRolRequest {
  user_id: number;
  new_role_name: string;
}

class UserManagementService {
  // Configuración de axios para manejar CORS y errores
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      withCredentials: true,  // Habilitar credenciales para CORS
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

    // Interceptor para añadir token
    this.axiosInstance.interceptors.request.use(
      config => {
        const token = this.obtenerTokenCompleto();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Interceptor para manejar errores
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        console.error('Error en la solicitud:', error);
        
        // Manejar específicamente errores de red o CORS
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error('Datos del error:', error.response.data);
          console.error('Código de estado:', error.response.status);
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió respuesta
          console.error('Sin respuesta del servidor');
        } else {
          // Algo sucedió al configurar la solicitud
          console.error('Error de configuración:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Método para obtener el token completo
  private obtenerTokenCompleto(): string {
    try {
      // Obtener token de localStorage
      const tokenAlmacenado = localStorage.getItem('token');
      
      if (!tokenAlmacenado) {
        throw new Error('No hay token almacenado');
      }

      // Intentar parsear como objeto JSON
      const tokenObj = JSON.parse(tokenAlmacenado);
      
      // Extraer token de diferentes estructuras posibles
      if (tokenObj.access_token) {
        return tokenObj.access_token;
      }
      
      if (tokenObj.token && tokenObj.token.access_token) {
        return tokenObj.token.access_token;
      }
      
      // Si es un token JWT directo
      if (tokenAlmacenado.split('.').length === 3) {
        return tokenAlmacenado;
      }
      
      throw new Error('No se pudo extraer un token válido');
    } catch (error) {
      console.error('Error al obtener token:', error);
      return '';
    }
  }

  // Obtener usuarios con roles
  async obtenerUsuariosConRoles(): Promise<Usuario[]> {
    try {
      const response = await this.axiosInstance.get('/users-with-roles/');
      
      // Transformar los datos para asegurar que el rol se muestre
      const usuariosConRol = response.data.map((usuario: any) => ({
        ...usuario,
        Nombre: usuario.Roles && usuario.Roles.length > 0 ? usuario.Roles[0] : 'usuario',
        selectedRol: usuario.Roles && usuario.Roles.length > 0 ? usuario.Roles[0] : 'usuario'
      }));
      
      return usuariosConRol;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Cambiar rol de usuario
  async cambiarRolUsuario(usuarioId: number, rolId: number): Promise<any> {
    try {
      const rolNombre = this.convertirIdARol(rolId);
      
      // Payload exacto
      const payload = {
        user_id: usuarioId,
        new_role_name: rolNombre
      };

      console.log('Payload para cambio de rol:', payload);

      const response = await this.axiosInstance.put('/change-user-role/', payload);
      
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar rol para usuario ${usuarioId}:`, error);
      throw error;
    }
  }

  // Método auxiliar para convertir ID de rol a nombre
  private convertirIdARol(rolId: number): string {
    switch(rolId) {
      case 1: return 'admin';
      case 2: return 'usuario';
      case 3: return 'entrenador';
      default: return 'usuario';
    }
  }
}

export default new UserManagementService();