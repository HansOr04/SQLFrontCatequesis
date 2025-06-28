import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';
import { APP_CONFIG, STORAGE_KEYS } from '@/lib/constants';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: APP_CONFIG.API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  private formatError(error: AxiosError): ApiError {
    // Si hay una respuesta del servidor
    if (error.response?.data) {
      const responseData = error.response.data as any;
      return {
        message: responseData.message || responseData.error || 'Error del servidor',
        code: responseData.code || error.code,
        status: error.response.status,
        details: responseData.details,
      };
    }

    // Si es un error de red
    if (error.request) {
      return {
        message: 'Error de conexión. Verifique su conexión a internet.',
        code: 'NETWORK_ERROR',
        status: 0,
      };
    }

    // Error en la configuración de la petición
    return {
      message: error.message || 'Error inesperado',
      code: error.code || 'UNKNOWN_ERROR',
    };
  }

  // Métodos públicos
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      console.error('PATCH Error:', error);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 segundos para uploads
      });
      return response.data;
    } catch (error) {
      console.error('UPLOAD Error:', error);
      throw error;
    }
  }

  // Método para download de archivos
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      // Crear URL del blob
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('DOWNLOAD Error:', error);
      throw error;
    }
  }

  // Método para verificar conectividad
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Método para obtener configuración actual
  getConfig() {
    return {
      baseURL: this.client.defaults.baseURL,
      timeout: this.client.defaults.timeout,
      hasToken: !!this.getToken(),
    };
  }

  // Método para limpiar tokens manualmente
  clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }
}

// Instancia singleton
export const apiService = new ApiService();
export default apiService;