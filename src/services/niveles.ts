// src/services/niveles.ts
import { apiService } from './api';
import { ApiResponse } from '@/types/api';
import { Nivel, NivelFormData, NivelStats } from '@/types/nivel';

class NivelesService {
  private readonly baseUrl = '/niveles';

  // Obtener todos los niveles
  async getAll(): Promise<ApiResponse<Nivel[]>> {
    return apiService.get(this.baseUrl);
  }

  // Obtener niveles ordenados por secuencia
  async getOrdenados(): Promise<ApiResponse<Nivel[]>> {
    return apiService.get(`${this.baseUrl}/ordenados`);
  }

  // Obtener nivel por ID
  async getById(id: number): Promise<ApiResponse<Nivel>> {
    return apiService.get(`${this.baseUrl}/${id}`);
  }

  // Buscar niveles
  async search(query: string): Promise<ApiResponse<Nivel[]>> {
    return apiService.get(`${this.baseUrl}/search`, { q: query });
  }

  // Obtener estadísticas de un nivel
  async getStats(id: number): Promise<ApiResponse<NivelStats>> {
    return apiService.get(`${this.baseUrl}/${id}/stats`);
  }

  // Obtener progresión de niveles para un catequizando
  async getProgresion(idCatequizando: number): Promise<ApiResponse<{
    niveles_completados: Nivel[];
    nivel_actual: Nivel | null;
    siguiente_nivel: Nivel | null;
    puede_avanzar: boolean;
  }>> {
    return apiService.get(`${this.baseUrl}/progresion/${idCatequizando}`);
  }

  // Crear nuevo nivel
  async create(data: NivelFormData): Promise<ApiResponse<Nivel>> {
    return apiService.post(this.baseUrl, data);
  }

  // Actualizar nivel
  async update(id: number, data: NivelFormData): Promise<ApiResponse<Nivel>> {
    return apiService.put(`${this.baseUrl}/${id}`, data);
  }

  // Reordenar niveles
  async reorder(ordenData: Array<{ id_nivel: number; nuevo_orden: number }>): Promise<ApiResponse<Nivel[]>> {
    return apiService.put(`${this.baseUrl}/reorder`, { ordenData });
  }

  // Eliminar nivel
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }
}

export const nivelesService = new NivelesService();
export default nivelesService;