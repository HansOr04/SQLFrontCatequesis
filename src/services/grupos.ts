// src/services/grupos.ts
import { apiService } from './api';
import { ApiResponse, PaginationParams } from '@/types/api';
import { Grupo, GrupoFormData, GrupoFilters, GrupoStats } from '@/types/grupo';
import { Inscripcion } from '@/types/inscripcion';
import { Usuario } from '@/types/usuario';

class GruposService {
  private readonly baseUrl = '/grupos';

  // Obtener todos los grupos con filtros y paginación
  async getAll(params: GrupoFilters & PaginationParams = {}): Promise<ApiResponse<Grupo[]>> {
    return apiService.get(this.baseUrl, params);
  }

  // Obtener grupo por ID
  async getById(id: number): Promise<ApiResponse<Grupo>> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }

  // Obtener grupos por parroquia
  async getByParroquia(idParroquia: number): Promise<ApiResponse<Grupo[]>> {
    return apiService.get(`${this.baseUrl}/parroquia/${idParroquia}`);
  }

  // Obtener grupos por nivel
  async getByNivel(idNivel: number): Promise<ApiResponse<Grupo[]>> {
    return apiService.get(`${this.baseUrl}/nivel/${idNivel}`);
  }

  // Buscar grupos
  async search(query: string, filters?: Omit<GrupoFilters, 'search'>): Promise<ApiResponse<Grupo[]>> {
    return apiService.get(`${this.baseUrl}/search`, { q: query, ...filters });
  }

  // Crear nuevo grupo
  async create(data: GrupoFormData): Promise<ApiResponse<Grupo>> {
    return apiService.post(this.baseUrl, data);
  }

  // Actualizar grupo
  async update(id: number, data: GrupoFormData): Promise<ApiResponse<Grupo>> {
    return apiService.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar grupo
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  // Obtener inscripciones de un grupo
  async getInscripciones(id: number): Promise<ApiResponse<Inscripcion[]>> {
    return apiService.get(`${this.baseUrl}/${id}/inscripciones`);
  }

  // Obtener catequistas de un grupo
  async getCatequistas(id: number): Promise<ApiResponse<Usuario[]>> {
    return apiService.get(`${this.baseUrl}/${id}/catequistas`);
  }

  // Obtener estadísticas de un grupo
  async getStats(id: number): Promise<ApiResponse<GrupoStats>> {
    return apiService.get(`${this.baseUrl}/${id}/stats`);
  }

  // Generar nombre automático para grupo
  generateGroupName(nivel: string, parroquia: string, existingGroups: Grupo[] = []): string {
    const letra = String.fromCharCode(65 + existingGroups.length); // A, B, C, etc.
    return `Grupo ${letra} - ${nivel}`;
  }

  // Validar capacidad del grupo
  validateCapacity(totalInscripciones: number, maxCapacity: number = 30): {
    isValid: boolean;
    message: string;
    warningLevel: 'low' | 'medium' | 'high';
  } {
    const percentage = (totalInscripciones / maxCapacity) * 100;
    
    if (percentage >= 100) {
      return {
        isValid: false,
        message: 'El grupo ha alcanzado su capacidad máxima',
        warningLevel: 'high'
      };
    }
    
    if (percentage >= 90) {
      return {
        isValid: true,
        message: 'El grupo está cerca de su capacidad máxima',
        warningLevel: 'high'
      };
    }
    
    if (percentage >= 75) {
      return {
        isValid: true,
        message: 'El grupo tiene alta ocupación',
        warningLevel: 'medium'
      };
    }
    
    return {
      isValid: true,
      message: 'El grupo tiene capacidad disponible',
      warningLevel: 'low'
    };
  }
}

export const gruposService = new GruposService();
export default gruposService;