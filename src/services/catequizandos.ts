// src/services/catequizandos.ts - VERSIÓN CON TIPOS UNIFICADOS
import { apiService } from './api';
import { ApiResponse, PaginatedResponseAlt } from '@/types/api';
import { 
  Catequizando, 
  CatequizandoFormData, 
  CatequizandoFilters, 
  CatequizandoStats 
} from '@/types/catequizando';

class CatequizandosService {
  /**
   * Obtener lista paginada de catequizandos
   * Retorna estructura con 'pagination' para coincidir con el backend
   */
  async getAll(filters: CatequizandoFilters = {}): Promise<PaginatedResponseAlt<Catequizando>> {
    try {
      console.log('🔍 Solicitando catequizandos con filtros:', filters);
      
      const response = await apiService.get<any>('/catequizandos', filters);
      console.log('📥 Respuesta completa de API:', response);
      
      if (response.success) {
        // NUEVO: Caso específico para tu backend - response.data.catequizandos y response.data.pagination
        if (response.data && response.data.catequizandos && response.data.pagination) {
          console.log('✅ Estructura catequizandos + pagination detectada');
          
          // Mapear id_catequizando a id para compatibilidad con el frontend
          const mappedData = response.data.catequizandos.map((item: any) => ({
            ...item,
            id: item.id_catequizando || item.id // Usar id_catequizando como id principal
          }));
          
          return {
            data: mappedData,
            pagination: response.data.pagination
          };
        }
        
        // Caso 1: La respuesta ya tiene la estructura correcta con 'pagination'
        if (response.data && response.data.data && response.data.pagination) {
          console.log('✅ Estructura con pagination detectada');
          
          // Mapear IDs si es necesario
          const mappedData = response.data.data.map((item: any) => ({
            ...item,
            id: item.id_catequizando || item.id
          }));
          
          return {
            data: mappedData,
            pagination: response.data.pagination
          };
        }
        
        // Caso 2: Los datos están directamente en response.data (array)
        if (Array.isArray(response.data)) {
          console.log('✅ Array directo detectado, creando paginación');
          
          // Mapear IDs
          const mappedData = response.data.map((item: any) => ({
            ...item,
            id: item.id_catequizando || item.id
          }));
          
          return {
            data: mappedData,
            pagination: {
              current_page: filters.page || 1,
              per_page: filters.limit || 12,
              total: response.data.length,
              total_pages: Math.ceil(response.data.length / (filters.limit || 12))
            }
          };
        }
        
        // Caso 3: Respuesta con meta en lugar de pagination
        if (response.data && response.meta) {
          console.log('✅ Estructura con meta detectada, convirtiendo a pagination');
          return {
            data: Array.isArray(response.data) ? response.data : [],
            pagination: {
              current_page: response.meta.page || filters.page || 1,
              per_page: response.meta.limit || filters.limit || 12,
              total: response.meta.total || 0,
              total_pages: response.meta.totalPages || 0
            }
          };
        }
        
        // Caso 4: response.data tiene propiedades data y meta
        if (response.data && response.data.data && response.data.meta) {
          console.log('✅ Estructura anidada con meta detectada');
          return {
            data: response.data.data,
            pagination: {
              current_page: response.data.meta.page || filters.page || 1,
              per_page: response.data.meta.limit || filters.limit || 12,
              total: response.data.meta.total || 0,
              total_pages: response.data.meta.totalPages || 0
            }
          };
        }
      }
      
      // Fallback para respuestas inesperadas
      console.warn('⚠️ Estructura de respuesta no reconocida, usando fallback');
      return {
        data: [],
        pagination: {
          current_page: 1,
          per_page: 12,
          total: 0,
          total_pages: 0
        }
      };
      
    } catch (error: any) {
      console.error('💥 Error completo en getAll:', error);
      
      // Analizar el tipo de error
      if (error.response) {
        console.error('📡 Error de respuesta HTTP:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('📡 Error de red/conexión:', error.request);
      } else {
        console.error('⚙️ Error de configuración:', error.message);
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al cargar catequizandos'
      );
    }
  }

  /**
   * Obtener catequizando por ID
   */
  async getById(id: number): Promise<ApiResponse<Catequizando>> {
    try {
      const response = await apiService.get<Catequizando>(`/catequizandos/${id}`);
      console.log('📥 Respuesta getById:', response);
      return response;
    } catch (error: any) {
      console.error('💥 Error en getById:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar catequizando');
    }
  }

  /**
   * Buscar catequizando por documento
   */
  async getByDocumento(documento: string): Promise<ApiResponse<Catequizando>> {
    try {
      const response = await apiService.get<Catequizando>(`/catequizandos/documento/${documento}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al buscar catequizando por documento');
    }
  }

  /**
   * Buscar catequizandos
   */
  async search(query: string, tipo?: string): Promise<ApiResponse<Catequizando[]>> {
    try {
      const response = await apiService.get<Catequizando[]>('/catequizandos/search', {
        q: query,
        tipo
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al buscar catequizandos');
    }
  }

  /**
   * Crear nuevo catequizando
   */
  async create(data: CatequizandoFormData): Promise<ApiResponse<Catequizando>> {
    try {
      const response = await apiService.post<Catequizando>('/catequizandos', data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear catequizando');
    }
  }

  /**
   * Actualizar catequizando
   */
  async update(id: number, data: Partial<CatequizandoFormData>): Promise<ApiResponse<Catequizando>> {
    try {
      const response = await apiService.put<Catequizando>(`/catequizandos/${id}`, data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar catequizando');
    }
  }

  /**
   * Eliminar catequizando
   */
  async delete(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.delete<any>(`/catequizandos/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar catequizando');
    }
  }

  /**
   * Obtener estadísticas de catequizandos con manejo robusto de errores
   */
  async getStats(): Promise<ApiResponse<CatequizandoStats>> {
    try {
      console.log('📊 Solicitando estadísticas de catequizandos...');
      
      const response = await apiService.get<CatequizandoStats>('/catequizandos/stats');
      console.log('📊 Respuesta de estadísticas:', response);
      
      return response;
    } catch (error: any) {
      console.error('💥 Error al cargar estadísticas:', error);
      
      // Para estadísticas, retornamos datos vacíos en lugar de fallar
      return {
        success: false,
        data: {
          total_catequizandos: 0,
          casos_especiales: 0,
          sin_inscripcion: 0,
          asistencia_promedio: 0,
          por_edad: [],
          por_nivel: [],
          por_parroquia: [],
          ninos: 0,
          adolescentes: 0,
          adultos: 0,
          activos_este_ano: 0,
          sin_inscripciones: 0
        },
        message: error.response?.data?.message || error.message || 'Error al cargar estadísticas'
      };
    }
  }

  /**
   * Obtener historial de inscripciones
   */
  async getInscripciones(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(`/catequizandos/${id}/inscripciones`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar inscripciones');
    }
  }

  /**
   * Obtener certificados obtenidos
   */
  async getCertificados(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(`/catequizandos/${id}/certificados`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar certificados');
    }
  }

  /**
   * Obtener sacramentos recibidos
   */
  async getSacramentos(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(`/catequizandos/${id}/sacramentos`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar sacramentos');
    }
  }

  /**
   * Obtener representantes
   */
  async getRepresentantes(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(`/catequizandos/${id}/representantes`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar representantes');
    }
  }

  /**
   * Obtener padrinos
   */
  async getPadrinos(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(`/catequizandos/${id}/padrinos`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar padrinos');
    }
  }

  /**
   * Obtener datos de bautismo
   */
  async getBautismo(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.get<any>(`/catequizandos/${id}/bautismo`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cargar datos de bautismo');
    }
  }

  /**
   * Validar elegibilidad para inscripción
   */
  async validarInscripcion(id: number, idNivel: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.post<any>(`/catequizandos/${id}/validar-inscripcion`, {
        id_nivel: idNivel
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al validar inscripción');
    }
  }
}

export const catequizandosService = new CatequizandosService();
export default catequizandosService;