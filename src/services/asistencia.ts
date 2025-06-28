// src/services/asistencia.ts
import { apiService } from './api';
import { ApiResponse, PaginationParams } from '@/types/api';
import { 
  Asistencia, 
  AsistenciaRegistro, 
  AsistenciaMasiva, 
  AsistenciaStats, 
  AsistenciaResumen,
  AsistenciaPorFecha,
  AsistenciaPorGrupo,
  CatequizandoRiesgo,
  EstadisticasAsistencia,
  AsistenciaFilters
} from '@/types/asistencia';

class AsistenciaService {
  private readonly baseUrl = '/asistencias';

  // Registrar asistencia individual
  async registrarIndividual(data: {
    id_inscripcion: number;
    fecha: string;
    asistio: boolean;
    observaciones?: string;
  }): Promise<ApiResponse<Asistencia>> {
    return apiService.post(this.baseUrl, data);
  }

  // Registrar asistencia masiva para un grupo
  async registrarMasiva(idGrupo: number, data: AsistenciaMasiva): Promise<ApiResponse<Asistencia[]>> {
    return apiService.post(`${this.baseUrl}/grupo/${idGrupo}/masiva`, data);
  }

  // Obtener asistencias por inscripción
  async getByInscripcion(idInscripcion: number): Promise<ApiResponse<Asistencia[]>> {
    return apiService.get(`${this.baseUrl}/inscripcion/${idInscripcion}`);
  }

  // Obtener asistencias por grupo y fecha
  async getByGrupoYFecha(idGrupo: number, fecha: string): Promise<ApiResponse<Asistencia[]>> {
    return apiService.get(`${this.baseUrl}/grupo/${idGrupo}/fecha/${fecha}`);
  }

  // Obtener resumen de asistencias de un grupo
  async getResumenGrupo(
    idGrupo: number, 
    fechaInicio?: string, 
    fechaFin?: string
  ): Promise<ApiResponse<AsistenciaResumen[]>> {
    const params: any = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    return apiService.get(`${this.baseUrl}/grupo/${idGrupo}/resumen`, params);
  }

  // Generar reporte de asistencias
  async generarReporte(
    idGrupo: number,
    params: {
      fecha_inicio?: string;
      fecha_fin?: string;
      formato?: 'json' | 'csv';
    } = {}
  ): Promise<ApiResponse<any>> {
    return apiService.get(`${this.baseUrl}/grupo/${idGrupo}/reporte`, params);
  }

  // Obtener estadísticas de asistencia por grupo
  async getStatsGrupo(idGrupo: number, periodo?: string): Promise<ApiResponse<EstadisticasAsistencia>> {
    const params = periodo ? { periodo } : {};
    return apiService.get(`${this.baseUrl}/grupo/${idGrupo}/stats`, params);
  }

  // Obtener fechas con asistencias registradas para un grupo
  async getFechasGrupo(idGrupo: number): Promise<ApiResponse<string[]>> {
    return apiService.get(`${this.baseUrl}/grupo/${idGrupo}/fechas`);
  }

  // Obtener catequizandos con baja asistencia
  async getCatequizandosBajaAsistencia(params: {
    porcentaje_minimo?: number;
    parroquia?: number;
    grupo?: number;
  } = {}): Promise<ApiResponse<CatequizandoRiesgo[]>> {
    return apiService.get(`${this.baseUrl}/baja-asistencia`, params);
  }

  // Actualizar asistencia
  async update(id: number, data: { asistio: boolean; observaciones?: string }): Promise<ApiResponse<Asistencia>> {
    return apiService.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar asistencia
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  // Obtener estadísticas generales con filtros
  async getEstadisticasGenerales(filters: AsistenciaFilters = {}): Promise<ApiResponse<{
    asistencia_por_fecha: AsistenciaPorFecha[];
    asistencia_por_grupo: AsistenciaPorGrupo[];
    estadisticas_generales: EstadisticasAsistencia;
    catequizandos_riesgo: CatequizandoRiesgo[];
  }>> {
    return apiService.get(`${this.baseUrl}/estadisticas`, filters);
  }

  // Exportar datos de asistencia
  async exportarDatos(
    filters: AsistenciaFilters & { formato: 'csv' | 'excel' }
  ): Promise<void> {
    const response = await apiService.get(`${this.baseUrl}/exportar`, filters);
    
    if (response.success && (response.data as any)?.url) {
      await apiService.download((response.data as any).url, `asistencia_${new Date().toISOString().split('T')[0]}.${filters.formato}`);
    }
  }

  // Validar fecha para registro de asistencia
  validateFecha(fecha: string): { isValid: boolean; message: string } {
    const fechaAsistencia = new Date(fecha);
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    if (fechaAsistencia > hoy) {
      return {
        isValid: false,
        message: 'No se puede registrar asistencia para fechas futuras'
      };
    }

    if (fechaAsistencia < hace30Dias) {
      return {
        isValid: false,
        message: 'No se puede registrar asistencia para fechas anteriores a 30 días'
      };
    }

    return {
      isValid: true,
      message: 'Fecha válida para registro'
    };
  }

  // Calcular estadísticas de un conjunto de asistencias
  calcularEstadisticas(asistencias: Asistencia[]): {
    totalRegistros: number;
    totalPresentes: number;
    totalAusentes: number;
    porcentajeAsistencia: number;
  } {
    const totalRegistros = asistencias.length;
    const totalPresentes = asistencias.filter(a => a.asistio).length;
    const totalAusentes = totalRegistros - totalPresentes;
    const porcentajeAsistencia = totalRegistros > 0 ? (totalPresentes / totalRegistros) * 100 : 0;

    return {
      totalRegistros,
      totalPresentes,
      totalAusentes,
      porcentajeAsistencia: Math.round(porcentajeAsistencia * 100) / 100
    };
  }

  // Generar resumen por catequizando desde datos locales
  generarResumenPorCatequizando(asistencias: Asistencia[]): AsistenciaResumen[] {
    const groupedByInscripcion = asistencias.reduce((acc, asistencia) => {
      const key = asistencia.id_inscripcion;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(asistencia);
      return acc;
    }, {} as Record<number, Asistencia[]>);

    return Object.entries(groupedByInscripcion).map(([idInscripcion, asistenciasCatequizando]) => {
      const primera = asistenciasCatequizando[0];
      const stats = this.calcularEstadisticas(asistenciasCatequizando);
      
      let estadoAsistencia: 'excelente' | 'buena' | 'regular' | 'deficiente' = 'deficiente';
      if (stats.porcentajeAsistencia >= 90) estadoAsistencia = 'excelente';
      else if (stats.porcentajeAsistencia >= 80) estadoAsistencia = 'buena';
      else if (stats.porcentajeAsistencia >= 70) estadoAsistencia = 'regular';

      const ultimaAsistencia = asistenciasCatequizando
        .filter(a => a.asistio)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];

      return {
        id_inscripcion: Number(idInscripcion),
        id_catequizando: 0, // Se completará desde el backend
        nombres: primera.nombre_catequizando || '',
        apellidos: primera.apellidos_catequizando || '',
        documento_identidad: primera.documento_identidad || '',
        grupo: primera.nombre_grupo || '',
        total_clases: stats.totalRegistros,
        total_asistencias: stats.totalPresentes,
        total_ausencias: stats.totalAusentes,
        porcentaje_asistencia: stats.porcentajeAsistencia,
        ultima_asistencia: ultimaAsistencia?.fecha || null,
        estado_asistencia: estadoAsistencia,
        en_riesgo: stats.porcentajeAsistencia < 70
      };
    });
  }
}

export const asistenciaService = new AsistenciaService();
export default asistenciaService;