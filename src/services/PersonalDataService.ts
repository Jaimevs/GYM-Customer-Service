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
      // Asegurar que el formato del token sea correcto
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
  }

  /**
   * Obtiene los datos personales del usuario autenticado
   * @returns Una promesa con los datos personales del usuario
   */
  async getPersonalData(): Promise<PersonProfile> {
    try {
      // Asegurar que los headers estén configurados
      this.setupAuthHeaders();
      
      const response = await axios.get(`${API_URL}/userprofile/`);

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
      if (!file || !(file instanceof Blob)) {
        reject(new Error("Archivo inválido"));
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Redimensiona una imagen para reducir su tamaño
   * @param file Archivo de imagen original
   * @param maxWidth Ancho máximo
   * @param maxHeight Alto máximo
   * @returns Promesa con el archivo redimensionado en formato Blob
   */
  private async resizeImage(file: File, maxWidth = 800, maxHeight = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof Blob)) {
        reject(new Error("Archivo inválido"));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          // Calcular dimensiones manteniendo proporción
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          } else if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
          
          // Crear canvas para redimensionar
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Dibujar imagen redimensionada
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convertir a blob con calidad reducida
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Error al redimensionar imagen"));
            }
          }, file.type, 0.7); // Calidad 70%
        };
        
        img.onerror = () => {
          reject(new Error("Error al cargar la imagen"));
        };
      };
      
      reader.onerror = () => {
        reject(new Error("Error al leer el archivo"));
      };
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
      
      const response = await axios.post(`${API_URL}/userprofile/`, data);

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
      
      const response = await axios.put(`${API_URL}/userprofile/`, data);

      console.log("Datos personales actualizados:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar datos personales:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Sube una imagen de perfil como archivo
   * @param file El archivo de imagen a subir
   * @returns Una promesa con la URL de la imagen subida
   */
  async uploadProfileImage(file: File): Promise<string> {
    try {
      // Asegurar que los headers estén configurados
      this.setupAuthHeaders();
      
      // Comprobar y redimensionar la imagen si es demasiado grande
      let imageToUpload = file;
      if (file.size > 1000000) { // 1MB
        try {
          const resizedBlob = await this.resizeImage(file);
          imageToUpload = new File([resizedBlob], file.name, { type: file.type });
          console.log(`Imagen redimensionada de ${file.size/1024}KB a ${imageToUpload.size/1024}KB`);
        } catch (resizeError) {
          console.warn("No se pudo redimensionar la imagen:", resizeError);
        }
      }
      
      // Crear FormData
      const formData = new FormData();
      formData.append('file', imageToUpload);
      
      const response = await axios.post(`${API_URL}/upload-profile-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Configurar timeout más largo para subidas de archivos
        timeout: 30000,
      });
      
      console.log("Imagen subida:", response.data);
      return response.data.image_url;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      this.logAxiosError(error);
      throw error;
    }
  }

  /**
   * Actualiza la imagen de perfil como Base64
   * @param imageBase64 Cadena Base64 de la imagen
   * @returns Una promesa con la URL de la imagen subida
   */
  async updateProfileImageBase64(imageBase64: string): Promise<string> {
    try {
      // Asegurar que los headers estén configurados
      this.setupAuthHeaders();
      
      const formData = new FormData();
      formData.append('image_data', imageBase64);
      
      const response = await axios.put(`${API_URL}/update-profile-image/`, formData, {
        // Configurar timeout más largo para subidas de archivos
        timeout: 30000,
      });
      
      console.log("Imagen actualizada:", response.data);
      return response.data.image_url;
    } catch (error) {
      console.error("Error al actualizar imagen:", error);
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
      // Si hay una foto, intentar procesarla
      if (photoFile && photoFile instanceof File) {
        try {
          // Verificar el tamaño y tipo de archivo
          if (photoFile.size <= 5000000) { // 5MB máximo
            // Opción 1: Subir como archivo
            const imageUrl = await this.uploadProfileImage(photoFile);
            data.Fotografia = imageUrl;
          } else {
            throw new Error("La imagen es demasiado grande (máximo 5MB)");
          }
        } catch (imageError) {
          console.error("Error al subir imagen como archivo, intentando como base64:", imageError);
          
          try {
            // Opción 2: Redimensionar y convertir a base64
            const resizedBlob = await this.resizeImage(photoFile, 600, 600);
            const base64Reader = new FileReader();
            base64Reader.readAsDataURL(resizedBlob);
            
            const photoBase64 = await new Promise<string>((resolve, reject) => {
              base64Reader.onload = () => resolve(base64Reader.result as string);
              base64Reader.onerror = reject;
            });
            
            const imageUrl = await this.updateProfileImageBase64(photoBase64);
            data.Fotografia = imageUrl;
          } catch (base64Error) {
            console.error("Error al procesar imagen como base64:", base64Error);
            throw new Error("No se pudo procesar la imagen. Intente con una imagen más pequeña.");
          }
        }
      }
      
      // Continuar con la lógica de guardar/crear perfil
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