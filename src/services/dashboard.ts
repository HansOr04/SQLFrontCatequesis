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

class DashboardService {
  /**
   * Obtener estadísticas generales del dashboard
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiService.get<DashboardStats>('/dashboard/stats');
  }

  /**
   * Obtener actividad reciente
   */
  async getRecentActivity(limit = 10): Promise<ApiResponse<ActivityItem[]>> {
    return apiService.get<ActivityItem[]>('/dashboard/activity', { limit });
  }

  /**
   * Obtener datos para gráficos
   */
  async getChartData(): Promise<ApiResponse<ChartData>> {
    return apiService.get<ChartData>('/dashboard/charts');
  }

  /**
   * Obtener próximos eventos
   */
  async getUpcomingEvents(limit = 10): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>('/dashboard/events', { limit });
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
      stats: stats.status === 'fulfilled' ? stats.value : { 
        success: false, 
        message: 'Error al cargar estadísticas',
        data: {} as DashboardStats,
        timestamp: new Date().toISOString()
      },
      activity: activity.status === 'fulfilled' ? activity.value : { 
        success: false, 
        message: 'Error al cargar actividad',
        data: [],
        timestamp: new Date().toISOString()
      },
      charts: charts.status === 'fulfilled' ? charts.value : { 
        success: false, 
        message: 'Error al cargar gráficos',
        data: {} as ChartData,
        timestamp: new Date().toISOString()
      },
      events: events.status === 'fulfilled' ? events.value : { 
        success: false, 
        message: 'Error al cargar eventos',
        data: [],
        timestamp: new Date().toISOString()
      },
    };
  }

  /**
   * Obtener alertas importantes
   */
  async getAlerts(): Promise<ApiResponse<any[]>> {
    return apiService.get('/dashboard/alerts');
  }

  /**
   * Obtener estadísticas por parroquia (solo para admin)
   */
  async getParroquiaStats(): Promise<ApiResponse<any[]>> {
    return apiService.get('/dashboard/parroquias-stats');
  }

  /**
   * Obtener métricas de rendimiento
   */
  async getPerformanceMetrics(): Promise<ApiResponse<any>> {
    return apiService.get('/dashboard/performance');
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;