// src/services/parroquias.ts
import { apiService } from './api';
import { ApiResponse } from '@/types/api';
import { Parroquia } from '@/types/parroquia';

class ParroquiasService {
  async getAll(): Promise<ApiResponse<Parroquia[]>> {
    try {
      return await apiService.get<Parroquia[]>('/parroquias');
    } catch (error) {
      throw new Error('Error al cargar parroquias');
    }
  }

  async getById(id: number): Promise<ApiResponse<Parroquia>> {
    try {
      return await apiService.get<Parroquia>(`/parroquias/${id}`);
    } catch (error) {
      throw new Error('Error al cargar parroquia');
    }
  }
}

export const parroquiasService = new ParroquiasService();

