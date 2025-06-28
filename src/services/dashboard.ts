// src/services/dashboard.ts
import { apiService } from './api';
import { ApiResponse } from '@/types/api';

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

// Función auxiliar para crear respuestas de error
const createErrorResponse = <T>(message: string, defaultData: T): ApiResponse<T> => ({
  success: false,
  message,
  data: defaultData,
  timestamp: new Date().toISOString()
});

class DashboardService {
  /**
   * Obtener estadísticas generales del dashboard
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      return await apiService.get<DashboardStats>('/dashboard/stats');
    } catch (error) {
      return createErrorResponse(
        'Error al cargar estadísticas',
        {
          total_catequizandos: 0,
          total_catequistas: 0,
          total_grupos: 0,
          total_inscripciones: 0,
          porcentaje_asistencia_promedio: 0,
          certificados_pendientes: 0,
        }
      );
    }
  }

  /**
   * Obtener actividad reciente
   */
  async getRecentActivity(limit = 10): Promise<ApiResponse<ActivityItem[]>> {
    try {
      return await apiService.get<ActivityItem[]>('/dashboard/activity', { limit });
    } catch (error) {
      return createErrorResponse('Error al cargar actividad', []);
    }
  }

  /**
   * Obtener datos para gráficos
   */
  async getChartData(): Promise<ApiResponse<ChartData>> {
    try {
      return await apiService.get<ChartData>('/dashboard/charts');
    } catch (error) {
      return createErrorResponse(
        'Error al cargar gráficos',
        {
          inscripciones_por_mes: [],
          catequizandos_por_nivel: [],
          asistencia_por_grupo: [],
        }
      );
    }
  }

  /**
   * Obtener próximos eventos
   */
  async getUpcomingEvents(limit = 10): Promise<ApiResponse<Event[]>> {
    try {
      return await apiService.get<Event[]>('/dashboard/events', { limit });
    } catch (error) {
      return createErrorResponse('Error al cargar eventos', []);
    }
  }

  /**
   * Obtener resumen completo del dashboard
   */
  async getDashboardData(): Promise<{
    stats: ApiResponse<DashboardStats>;
    activity: ApiResponse<ActivityItem[]>;
    charts: ApiResponse<ChartData>;
    events: ApiResponse<Event[]>;
  }> {
    const [stats, activity, charts, events] = await Promise.allSettled([
      this.getStats(),
      this.getRecentActivity(),
      this.getChartData(),
      this.getUpcomingEvents(),
    ]);

    return {
      stats: stats.status === 'fulfilled' ? stats.value : createErrorResponse(
        'Error al cargar estadísticas',
        {
          total_catequizandos: 0,
          total_catequistas: 0,
          total_grupos: 0,
          total_inscripciones: 0,
          porcentaje_asistencia_promedio: 0,
          certificados_pendientes: 0,
        }
      ),
      activity: activity.status === 'fulfilled' ? activity.value : createErrorResponse(
        'Error al cargar actividad',
        []
      ),
      charts: charts.status === 'fulfilled' ? charts.value : createErrorResponse(
        'Error al cargar gráficos',
        {
          inscripciones_por_mes: [],
          catequizandos_por_nivel: [],
          asistencia_por_grupo: [],
        }
      ),
      events: events.status === 'fulfilled' ? events.value : createErrorResponse(
        'Error al cargar eventos',
        []
      ),
    };
  }

  /**
   * Obtener alertas importantes
   */
  async getAlerts(): Promise<ApiResponse<any[]>> {
    try {
      return await apiService.get('/dashboard/alerts');
    } catch (error) {
      return createErrorResponse('Error al cargar alertas', []);
    }
  }

  /**
   * Obtener estadísticas por parroquia (solo para admin)
   */
  async getParroquiaStats(): Promise<ApiResponse<any[]>> {
    try {
      return await apiService.get('/dashboard/parroquias-stats');
    } catch (error) {
      return createErrorResponse('Error al cargar estadísticas de parroquias', []);
    }
  }

  /**
   * Obtener métricas de rendimiento
   */
  async getPerformanceMetrics(): Promise<ApiResponse<any>> {
    try {
      return await apiService.get('/dashboard/performance');
    } catch (error) {
      return createErrorResponse('Error al cargar métricas de rendimiento', {});
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;