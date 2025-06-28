// src/services/catequizandos.ts - Corregido
import { apiService } from './api';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { 
  Catequizando, 
  CatequizandoFormData, 
  CatequizandoFilters, 
  CatequizandoStats 
} from '@/types/catequizando';

class CatequizandosService {
  /**
   * Obtener lista paginada de catequizandos
   */
  async getAll(filters: CatequizandoFilters = {}): Promise<PaginatedResponse<Catequizando>> {
    try {
      const response = await apiService.get<PaginatedResponse<Catequizando>>('/catequizandos', filters);
      // Extraer los datos de la respuesta de la API
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar catequizandos');
    }
  }

  /**
   * Obtener catequizando por ID
   */
  async getById(id: number): Promise<ApiResponse<Catequizando>> {
    try {
      return await apiService.get<Catequizando>(`/catequizandos/${id}`);
    } catch (error) {
      throw new Error('Error al cargar catequizando');
    }
  }

  /**
   * Buscar catequizando por documento
   */
  async getByDocumento(documento: string): Promise<ApiResponse<Catequizando>> {
    try {
      return await apiService.get<Catequizando>(`/catequizandos/documento/${documento}`);
    } catch (error) {
      throw new Error('Error al buscar catequizando por documento');
    }
  }

  /**
   * Buscar catequizandos
   */
  async search(query: string, tipo?: string): Promise<ApiResponse<Catequizando[]>> {
    try {
      return await apiService.get<Catequizando[]>('/catequizandos/search', {
        q: query,
        tipo
      });
    } catch (error) {
      throw new Error('Error al buscar catequizandos');
    }
  }

  /**
   * Crear nuevo catequizando
   */
  async create(data: CatequizandoFormData): Promise<ApiResponse<Catequizando>> {
    try {
      return await apiService.post<Catequizando>('/catequizandos', data);
    } catch (error) {
      throw new Error('Error al crear catequizando');
    }
  }

  /**
   * Actualizar catequizando
   */
  async update(id: number, data: Partial<CatequizandoFormData>): Promise<ApiResponse<Catequizando>> {
    try {
      return await apiService.put<Catequizando>(`/catequizandos/${id}`, data);
    } catch (error) {
      throw new Error('Error al actualizar catequizando');
    }
  }

  /**
   * Eliminar catequizando
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      return await apiService.delete(`/catequizandos/${id}`);
    } catch (error) {
      throw new Error('Error al eliminar catequizando');
    }
  }

  /**
   * Obtener estadísticas de catequizandos
   */
  async getStats(): Promise<ApiResponse<CatequizandoStats>> {
    try {
      return await apiService.get<CatequizandoStats>('/catequizandos/stats');
    } catch (error) {
      throw new Error('Error al cargar estadísticas');
    }
  }

  /**
   * Obtener historial de inscripciones
   */
  async getInscripciones(id: number): Promise<ApiResponse<any[]>> {
    try {
      return await apiService.get<any[]>(`/catequizandos/${id}/inscripciones`);
    } catch (error) {
      throw new Error('Error al cargar inscripciones');
    }
  }

  /**
   * Obtener certificados obtenidos
   */
  async getCertificados(id: number): Promise<ApiResponse<any[]>> {
    try {
      return await apiService.get<any[]>(`/catequizandos/${id}/certificados`);
    } catch (error) {
      throw new Error('Error al cargar certificados');
    }
  }

  /**
   * Obtener sacramentos recibidos
   */
  async getSacramentos(id: number): Promise<ApiResponse<any[]>> {
    try {
      return await apiService.get<any[]>(`/catequizandos/${id}/sacramentos`);
    } catch (error) {
      throw new Error('Error al cargar sacramentos');
    }
  }

  /**
   * Obtener representantes
   */
  async getRepresentantes(id: number): Promise<ApiResponse<any[]>> {
    try {
      return await apiService.get<any[]>(`/catequizandos/${id}/representantes`);
    } catch (error) {
      throw new Error('Error al cargar representantes');
    }
  }

  /**
   * Obtener padrinos
   */
  async getPadrinos(id: number): Promise<ApiResponse<any[]>> {
    try {
      return await apiService.get<any[]>(`/catequizandos/${id}/padrinos`);
    } catch (error) {
      throw new Error('Error al cargar padrinos');
    }
  }

  /**
   * Obtener datos de bautismo
   */
  async getBautismo(id: number): Promise<ApiResponse<any>> {
    try {
      return await apiService.get<any>(`/catequizandos/${id}/bautismo`);
    } catch (error) {
      throw new Error('Error al cargar datos de bautismo');
    }
  }

  /**
   * Validar elegibilidad para inscripción
   */
  async validarInscripcion(id: number, idNivel: number): Promise<ApiResponse<any>> {
    try {
      return await apiService.post<any>(`/catequizandos/${id}/validar-inscripcion`, {
        id_nivel: idNivel
      });
    } catch (error) {
      throw new Error('Error al validar inscripción');
    }
  }
}

export const catequizandosService = new CatequizandosService();
export default catequizandosService;