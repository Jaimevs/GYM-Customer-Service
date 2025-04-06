import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://gymtoday12.com";

interface PersonalData {
  Titulo_Cortesia?: string | null;
  Nombre?: string | null;
  Primer_Apellido?: string | null;
  Segundo_Apellido?: string | null;
  Numero_Telefonico?: string | null;
  Fecha_Nacimiento?: string | null;
  Genero?: string | null;
  Tipo_Sangre?: string | null;
  Estatura?: number | null;
  Peso?: number | null;
  Fotografia?: string | null;
}

interface PersonProfile {
  ID: number;
  Usuario_ID: number;
  Titulo_Cortesia?: string;
  Nombre?: string;
  Primer_Apellido?: string;
  Segundo_Apellido?: string;
  Numero_Telefonico?: string;
  Fecha_Nacimiento?: string;
  Genero?: string;
  Tipo_Sangre?: string;
  Estatura?: number;
  Peso?: number;
  Fotografia?: string;
  Estatus?: boolean;
  Fecha_Registro?: string;
  Fecha_Actualizacion?: string;
}

class PersonalDataService {
  // Constructor que verifica si hay token en localStorage
  constructor() {
    this.setupAuthHeaders();
  }

  // Método para configurar los headers de autenticación
  setupAuthHeaders() {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Verificar si el token ya tiene el prefijo "Bearer "
      if (token.startsWith("Bearer ")) {
        axios.defaults.headers.common["Authorization"] = token;
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      
      console.log("Token configurado para solicitudes:", 
        axios.defaults.headers.common["Authorization"].substring(0, 20) + "...");
    } else {
      console.warn("No hay token disponible para autenticación");
    }
    
    // Verificar si estamos usando autenticación de Google
    const isGoogleAuth = localStorage.getItem("googleAuth") === "true";
    console.log("¿Autenticación con Google?:", isGoogleAuth);
  }

  /**
   * Obtiene los datos personales del usuario autenticado
   * @returns Una promesa con los datos personales del usuario
   */
  async getPersonalData(): Promise<PersonProfile> {
    try {
      // Asegurar que los headers estén configurados
      this.setupAuthHeaders();
      
      // Depurar el token que se está usando
      console.log("Haciendo solicitud autenticada a:", `${API_URL}/userprofile/`);
      
      // Usar el nuevo endpoint de perfil de usuario
      const response = await axios.get(`${API_URL}/userprofile/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Datos personales obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos personales:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Convierte un archivo de imagen a una cadena Base64
   * @param file El archivo de imagen a convertir
   * @returns Una promesa con la cadena Base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Crea un nuevo perfil para el usuario autenticado
   * @param data Los datos personales a crear
   * @returns Una promesa con los datos personales creados
   */
  async createPersonalData(data: PersonalData): Promise<PersonProfile> {
    try {
      // Asegurar que los headers estén configurados
      this.setupAuthHeaders();
      
      // Usar el nuevo endpoint para crear perfil de usuario
      const response = await axios.post(`${API_URL}/userprofile/`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Perfil personal creado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear perfil personal:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza los datos personales del usuario autenticado
   * @param data Los datos personales a actualizar
   * @returns Una promesa con los datos personales actualizados
   */
  async updatePersonalData(data: PersonalData): Promise<PersonProfile> {
    try {
      // Asegurar que los headers estén configurados
      this.setupAuthHeaders();
      
      // Usar el nuevo endpoint para actualizar perfil de usuario
      const response = await axios.put(`${API_URL}/userprofile/`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Datos personales actualizados:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar datos personales:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Guarda o crea un perfil completo dependiendo si existe o no
   * @param data Los datos personales
   * @param photoFile El archivo de imagen (opcional)
   * @returns Una promesa con los datos personales
   */
  async saveOrCreateProfile(data: PersonalData, photoFile?: File | null): Promise<PersonProfile> {
    try {
      // Si hay una fotografía, convertirla a Base64
      if (photoFile) {
        const photoBase64 = await this.fileToBase64(photoFile);
        data.Fotografia = photoBase64;
      }

      try {
        // Intentamos obtener el perfil existente
        await this.getPersonalData();
        // Si existe, actualizamos
        return await this.updatePersonalData(data);
      } catch (error) {
        // Si no existe o hay un error 404, creamos uno nuevo
        if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 401)) {
          return await this.createPersonalData(data);
        }
        // Si es otro tipo de error, lo propagamos
        throw error;
      }
    } catch (error) {
      console.error("Error al guardar o crear perfil:", error);
      throw error;
    }
  }

  // Utilidad para registrar errores de Axios con más detalle
  logAxiosError(error: any): void {
    if (axios.isAxiosError(error)) {
      // Incluir headers en la depuración para verificar el token
      const headers = error.config?.headers || {};
      const authHeader = headers['Authorization'] || headers['authorization'];
      
      console.error('Detalles del error Axios:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        authHeaderPresent: !!authHeader,
        authHeaderPreview: authHeader ? `${String(authHeader).substring(0, 15)}...` : 'ninguno'
      });
    } else {
      console.error('Error no relacionado con Axios:', error);
    }
  }
}

export default new PersonalDataService();