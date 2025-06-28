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

  async search(query: string): Promise<ApiResponse<Parroquia[]>> {
    try {
      return await apiService.get<Parroquia[]>('/parroquias/search', { q: query });
    } catch (error) {
      throw new Error('Error al buscar parroquias');
    }
  }
}

export const parroquiasService = new ParroquiasService();

// src/services/niveles.ts
import { Nivel } from '@/types/nivel';

class NivelesService {
  async getAll(): Promise<ApiResponse<Nivel[]>> {
    try {
      return await apiService.get<Nivel[]>('/niveles');
    } catch (error) {
      throw new Error('Error al cargar niveles');
    }
  }

  async getOrdenados(): Promise<ApiResponse<Nivel[]>> {
    try {
      return await apiService.get<Nivel[]>('/niveles/ordenados');
    } catch (error) {
      throw new Error('Error al cargar niveles ordenados');
    }
  }

  async getById(id: number): Promise<ApiResponse<Nivel>> {
    try {
      return await apiService.get<Nivel>(`/niveles/${id}`);
    } catch (error) {
      throw new Error('Error al cargar nivel');
    }
  }

  async search(query: string): Promise<ApiResponse<Nivel[]>> {
    try {
      return await apiService.get<Nivel[]>('/niveles/search', { q: query });
    } catch (error) {
      throw new Error('Error al buscar niveles');
    }
  }
}

export const nivelesService = new NivelesService();