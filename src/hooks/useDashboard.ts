// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboard';

interface DashboardStats {
  total_catequizandos: number;
  total_catequistas: number;
  total_grupos: number;
  total_inscripciones: number;
  porcentaje_asistencia_promedio: number;
  certificados_pendientes: number;
  parroquias_activas?: number;
}

interface ActivityItem {
  id: number;
  tipo: 'inscripcion' | 'certificado' | 'asistencia' | 'grupo';
  descripcion: string;
  fecha: string;
  usuario?: string;
  entidad_id?: number;
  entidad_nombre?: string;
}

interface ChartData {
  inscripciones_por_mes: {
    mes: string;
    inscripciones: number;
    año: number;
  }[];
  catequizandos_por_nivel: {
    nivel: string;
    catequizandos: number;
    porcentaje: number;
  }[];
  asistencia_por_grupo: {
    grupo: string;
    porcentaje_asistencia: number;
    total_catequizandos: number;
  }[];
}

interface Event {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion?: string;
  tipo: 'clase' | 'ceremonia' | 'reunion' | 'evaluacion' | 'retiro';
  grupo?: string;
  nivel?: string;
  prioridad: 'alta' | 'media' | 'baja';
  participantes?: number;
}

interface UseDashboardState {
  stats: {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
  };
  activity: {
    data: ActivityItem[];
    loading: boolean;
    error: string | null;
  };
  charts: {
    data: ChartData | null;
    loading: boolean;
    error: string | null;
  };
  events: {
    data: Event[];
    loading: boolean;
    error: string | null;
  };
}

export const useDashboard = (autoLoad = true) => {
  const [state, setState] = useState<UseDashboardState>({
    stats: { data: null, loading: false, error: null },
    activity: { data: [], loading: false, error: null },
    charts: { data: null, loading: false, error: null },
    events: { data: [], loading: false, error: null },
  });

  const updateSection = <T extends keyof UseDashboardState>(
    section: T,
    updates: Partial<UseDashboardState[T]>
  ) => {
    setState(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const loadStats = async () => {
    updateSection('stats', { loading: true, error: null });
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        updateSection('stats', { data: response.data, loading: false });
      } else {
        updateSection('stats', { error: response.message, loading: false });
      }
    } catch (error) {
      updateSection('stats', { 
        error: error instanceof Error ? error.message : 'Error al cargar estadísticas', 
        loading: false 
      });
    }
  };

  const loadActivity = async () => {
    updateSection('activity', { loading: true, error: null });
    try {
      const response = await dashboardService.getRecentActivity();
      if (response.success) {
        updateSection('activity', { data: response.data, loading: false });
      } else {
        updateSection('activity', { error: response.message, loading: false });
      }
    } catch (error) {
      updateSection('activity', { 
        error: error instanceof Error ? error.message : 'Error al cargar actividad', 
        loading: false 
      });
    }
  };

  const loadCharts = async () => {
    updateSection('charts', { loading: true, error: null });
    try {
      const response = await dashboardService.getChartData();
      if (response.success) {
        updateSection('charts', { data: response.data, loading: false });
      } else {
        updateSection('charts', { error: response.message, loading: false });
      }
    } catch (error) {
      updateSection('charts', { 
        error: error instanceof Error ? error.message : 'Error al cargar gráficos', 
        loading: false 
      });
    }
  };

  const loadEvents = async () => {
    updateSection('events', { loading: true, error: null });
    try {
      const response = await dashboardService.getUpcomingEvents();
      if (response.success) {
        updateSection('events', { data: response.data, loading: false });
      } else {
        updateSection('events', { error: response.message, loading: false });
      }
    } catch (error) {
      updateSection('events', { 
        error: error instanceof Error ? error.message : 'Error al cargar eventos', 
        loading: false 
      });
    }
  };

  const loadAllData = async () => {
    try {
      const results = await dashboardService.getDashboardData();
      
      // Procesar estadísticas
      if (results.stats.success) {
        updateSection('stats', { data: results.stats.data, loading: false, error: null });
      } else {
        updateSection('stats', { error: results.stats.message, loading: false });
      }

      // Procesar actividad
      if (results.activity.success) {
        updateSection('activity', { data: results.activity.data, loading: false, error: null });
      } else {
        updateSection('activity', { error: results.activity.message, loading: false });
      }

      // Procesar gráficos
      if (results.charts.success) {
        updateSection('charts', { data: results.charts.data, loading: false, error: null });
      } else {
        updateSection('charts', { error: results.charts.message, loading: false });
      }

      // Procesar eventos
      if (results.events.success) {
        updateSection('events', { data: results.events.data, loading: false, error: null });
      } else {
        updateSection('events', { error: results.events.message, loading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar datos del dashboard';
      setState(prev => ({
        stats: { ...prev.stats, error: errorMessage, loading: false },
        activity: { ...prev.activity, error: errorMessage, loading: false },
        charts: { ...prev.charts, error: errorMessage, loading: false },
        events: { ...prev.events, error: errorMessage, loading: false },
      }));
    }
  };

  const refresh = () => {
    loadAllData();
  };

  const isLoading = state.stats.loading || state.activity.loading || 
                   state.charts.loading || state.events.loading;

  const hasError = state.stats.error || state.activity.error || 
                   state.charts.error || state.events.error;

  useEffect(() => {
    if (autoLoad) {
      // Marcar todas las secciones como loading al inicio
      setState({
        stats: { data: null, loading: true, error: null },
        activity: { data: [], loading: true, error: null },
        charts: { data: null, loading: true, error: null },
        events: { data: [], loading: true, error: null },
      });
      
      loadAllData();
    }
  }, [autoLoad]);

  return {
    ...state,
    isLoading,
    hasError,
    refresh,
    loadStats,
    loadActivity,
    loadCharts,
    loadEvents,
  };
};