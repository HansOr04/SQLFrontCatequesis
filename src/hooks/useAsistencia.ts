// src/hooks/useAsistencia.ts
import { useState, useCallback } from 'react';
import { asistenciaService } from '@/services/asistencia';
import { 
  Asistencia, 
  AsistenciaMasiva, 
  AsistenciaResumen,
  EstadisticasAsistencia,
  AsistenciaFilters,
  CatequizandoRiesgo
} from '@/types/asistencia';
import { ApiResponse } from '@/types/api';

export const useAsistencia = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [resumen, setResumen] = useState<AsistenciaResumen[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAsistencia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function para manejar llamadas async
  const handleAsyncCall = useCallback(async <T>(
    asyncFn: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void
  ): Promise<ApiResponse<T> | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await asyncFn();
      
      if (response.success && response.data && onSuccess) {
        onSuccess(response.data);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar asistencia individual
  const registrarIndividual = useCallback(async (data: {
    id_inscripcion: number;
    fecha: string;
    asistio: boolean;
    observaciones?: string;
  }) => {
    return await handleAsyncCall(() => asistenciaService.registrarIndividual(data));
  }, [handleAsyncCall]);

  // Registrar asistencia masiva
  const registrarMasiva = useCallback(async (
    idGrupo: number, 
    data: AsistenciaMasiva
  ) => {
    return await handleAsyncCall(() => asistenciaService.registrarMasiva(idGrupo, data));
  }, [handleAsyncCall]);

  // Obtener asistencias por grupo y fecha
  const getAsistenciasByGrupoYFecha = useCallback(async (
    idGrupo: number, 
    fecha: string
  ) => {
    return await handleAsyncCall(
      () => asistenciaService.getByGrupoYFecha(idGrupo, fecha),
      (data) => setAsistencias(data)
    );
  }, [handleAsyncCall]);

  // Obtener resumen de asistencias
  const getResumenGrupo = useCallback(async (
    idGrupo: number,
    fechaInicio?: string,
    fechaFin?: string
  ) => {
    return await handleAsyncCall(
      () => asistenciaService.getResumenGrupo(idGrupo, fechaInicio, fechaFin),
      (data) => setResumen(data)
    );
  }, [handleAsyncCall]);

  // Obtener estadísticas de grupo
  const getStatsGrupo = useCallback(async (
    idGrupo: number,
    periodo?: string
  ) => {
    return await handleAsyncCall(
      () => asistenciaService.getStatsGrupo(idGrupo, periodo),
      (data) => setEstadisticas(data)
    );
  }, [handleAsyncCall]);

  // Obtener estadísticas generales
  const getEstadisticasGenerales = useCallback(async (
    filters: AsistenciaFilters = {}
  ) => {
    return await handleAsyncCall(() => asistenciaService.getEstadisticasGenerales(filters));
  }, [handleAsyncCall]);

  // Obtener fechas con asistencias
  const getFechasGrupo = useCallback(async (idGrupo: number) => {
    return await handleAsyncCall(() => asistenciaService.getFechasGrupo(idGrupo));
  }, [handleAsyncCall]);

  // Obtener catequizandos con baja asistencia
  const getCatequizandosBajaAsistencia = useCallback(async (params: {
    porcentaje_minimo?: number;
    parroquia?: number;
    grupo?: number;
  } = {}) => {
    return await handleAsyncCall(() => asistenciaService.getCatequizandosBajaAsistencia(params));
  }, [handleAsyncCall]);

  // Actualizar asistencia
  const updateAsistencia = useCallback(async (
    id: number, 
    data: { asistio: boolean; observaciones?: string }
  ) => {
    return await handleAsyncCall(() => asistenciaService.update(id, data));
  }, [handleAsyncCall]);

  // Eliminar asistencia
  const deleteAsistencia = useCallback(async (id: number) => {
    return await handleAsyncCall(() => asistenciaService.delete(id));
  }, [handleAsyncCall]);

  // Generar reporte
  const generarReporte = useCallback(async (
    idGrupo: number,
    params: {
      fecha_inicio?: string;
      fecha_fin?: string;
      formato?: 'json' | 'csv';
    } = {}
  ) => {
    return await handleAsyncCall(() => asistenciaService.generarReporte(idGrupo, params));
  }, [handleAsyncCall]);

  // Exportar datos
  const exportarDatos = useCallback(async (
    filters: AsistenciaFilters & { formato: 'csv' | 'excel' }
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      await asistenciaService.exportarDatos(filters);
      
      return { 
        success: true, 
        message: 'Exportación iniciada correctamente' 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al exportar datos';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Validar fecha
  const validarFecha = useCallback((fecha: string) => {
    return asistenciaService.validateFecha(fecha);
  }, []);

  // Calcular estadísticas locales
  const calcularEstadisticas = useCallback((asistencias: Asistencia[]) => {
    return asistenciaService.calcularEstadisticas(asistencias);
  }, []);

  // Generar resumen por catequizando
  const generarResumenPorCatequizando = useCallback((asistencias: Asistencia[]) => {
    return asistenciaService.generarResumenPorCatequizando(asistencias);
  }, []);

  // Limpiar estados
  const clearData = useCallback(() => {
    setAsistencias([]);
    setResumen([]);
    setEstadisticas(null);
    setError(null);
  }, []);

  return {
    // Data
    asistencias,
    resumen,
    estadisticas,
    
    // States
    loading,
    error,
    
    // Actions
    registrarIndividual,
    registrarMasiva,
    getAsistenciasByGrupoYFecha,
    getResumenGrupo,
    getStatsGrupo,
    getEstadisticasGenerales,
    getFechasGrupo,
    getCatequizandosBajaAsistencia,
    updateAsistencia,
    deleteAsistencia,
    generarReporte,
    exportarDatos,
    
    // Utils
    validarFecha,
    calcularEstadisticas,
    generarResumenPorCatequizando,
    clearData,
  };
};

export default useAsistencia;