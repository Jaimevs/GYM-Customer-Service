import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://gymtoday1243.com";

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
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  /**
   * Obtiene los datos personales del usuario autenticado
   * @returns Una promesa con los datos personales del usuario
   */
  async getPersonalData(): Promise<PersonProfile> {
    try {
      const response = await axios.get(`${API_URL}/persons/profile/`, {
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
   * Actualiza los datos personales del usuario autenticado
   * @param data Los datos personales a actualizar
   * @returns Una promesa con los datos personales actualizados
   */
  async updatePersonalData(data: PersonalData): Promise<PersonProfile> {
    try {
      const response = await axios.put(`${API_URL}/persons/update-profile/`, data, {
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
   * Actualiza todos los datos personales incluyendo la fotografía
   * @param data Los datos personales a actualizar
   * @param photoFile El archivo de imagen a subir (opcional)
   * @returns Una promesa con los datos personales actualizados
   */
  async saveCompleteProfile(data: PersonalData, photoFile?: File | null): Promise<PersonProfile> {
    try {
      // Si hay una fotografía, la convertimos a Base64
      if (photoFile) {
        const photoBase64 = await this.fileToBase64(photoFile);
        // Guardamos solo la cadena Base64 en el campo Fotografia
        data.Fotografia = photoBase64;
      }

      // Luego actualizamos todos los datos personales
      return await this.updatePersonalData(data);
    } catch (error) {
      console.error("Error al guardar perfil completo:", error);
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

  // Agregar este método a la clase PersonalDataService

/**
 * Crea un nuevo perfil para el usuario autenticado
 * @param data Los datos personales a insertar
 * @returns Una promesa con los datos personales creados
 */
async createPersonalData(data: PersonalData): Promise<PersonProfile> {
  try {
    const response = await axios.post(`${API_URL}/persons/create-profile/`, data, {
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
      // Si no existe, creamos uno nuevo
      return await this.createPersonalData(data);
    }
  } catch (error) {
    console.error("Error al guardar o crear perfil:", error);
    throw error;
  }
}
}

export default new PersonalDataService();