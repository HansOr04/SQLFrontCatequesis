// src/hooks/useGrupos.ts - Actualizado para tu useApi
import { useState, useEffect, useCallback } from 'react';
import { gruposService } from '@/services/grupos';
import { Grupo, GrupoFormData, GrupoFilters } from '@/types/grupo';
import { PaginationParams } from '@/types/api';
import { useApi } from './useApi';

interface UseGruposOptions {
  autoLoad?: boolean;
  filters?: GrupoFilters;
  pagination?: PaginationParams;
}

export const useGrupos = (options: UseGruposOptions = {}) => {
  const { autoLoad = true, filters = {}, pagination = {} } = options;
  
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [total, setTotal] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<GrupoFilters>(filters);
  const [currentPagination, setCurrentPagination] = useState<PaginationParams>(pagination);

  const { 
    loading, 
    error, 
    execute,
    data,
    success
  } = useApi<Grupo[]>();

  // Cargar grupos
  const loadGrupos = useCallback(async (
    customFilters?: GrupoFilters,
    customPagination?: PaginationParams
  ) => {
    const finalFilters = { ...currentFilters, ...customFilters };
    const finalPagination = { ...currentPagination, ...customPagination };

    await execute(() => 
      gruposService.getAll({ ...finalFilters, ...finalPagination })
    );
  }, [currentFilters, currentPagination, execute]);

  // Actualizar estado cuando se carguen los datos
  useEffect(() => {
    if (success && data) {
      setGrupos(data);
      setTotal(data.length); // Ajustar según tu respuesta de API
    }
  }, [success, data]);

  // Buscar grupos
  const searchGrupos = useCallback(async (query: string) => {
    await execute(() => 
      gruposService.search(query, currentFilters)
    );
  }, [currentFilters, execute]);

  // Crear grupo
  const createGrupo = useCallback(async (data: GrupoFormData) => {
    const createApi = useApi<Grupo>();
    await createApi.execute(() => gruposService.create(data));
    
    if (createApi.success) {
      await loadGrupos(); // Recargar lista
    }

    return { success: createApi.success, error: createApi.error };
  }, [loadGrupos]);

  // Actualizar grupo
  const updateGrupo = useCallback(async (id: number, data: GrupoFormData) => {
    const updateApi = useApi<Grupo>();
    await updateApi.execute(() => gruposService.update(id, data));
    
    if (updateApi.success) {
      await loadGrupos(); // Recargar lista
    }

    return { success: updateApi.success, error: updateApi.error };
  }, [loadGrupos]);

  // Eliminar grupo
  const deleteGrupo = useCallback(async (id: number) => {
    const deleteApi = useApi<void>();
    await deleteApi.execute(() => gruposService.delete(id));
    
    if (deleteApi.success) {
      await loadGrupos(); // Recargar lista
    }

    return { success: deleteApi.success, error: deleteApi.error };
  }, [loadGrupos]);

  // Actualizar filtros
  const setFilters = useCallback((newFilters: GrupoFilters) => {
    setCurrentFilters(newFilters);
  }, []);

  // Actualizar paginación
  const setPagination = useCallback((newPagination: PaginationParams) => {
    setCurrentPagination(newPagination);
  }, []);

  // Cargar al montar si autoLoad está habilitado
  useEffect(() => {
    if (autoLoad) {
      loadGrupos();
    }
  }, [autoLoad, loadGrupos]);

  // Recargar cuando cambien filtros o paginación
  useEffect(() => {
    if (autoLoad) {
      loadGrupos();
    }
  }, [currentFilters, currentPagination]);

  return {
    // Data
    grupos,
    total,
    
    // States
    loading,
    error,
    success,
    
    // Actions
    loadGrupos,
    searchGrupos,
    createGrupo,
    updateGrupo,
    deleteGrupo,
    
    // Filters & Pagination
    filters: currentFilters,
    setFilters,
    pagination: currentPagination,
    setPagination,
    
    // Utils
    refresh: () => loadGrupos(),
  };
};

export default useGrupos;