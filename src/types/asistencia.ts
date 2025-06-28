// src/types/asistencia.ts - Actualizado
export interface Asistencia {
  id_asistencia: number;
  id_inscripcion: number;
  fecha: string;
  asistio: boolean;
  observaciones?: string;
  nombre_catequizando?: string;
  apellidos_catequizando?: string;
  documento_identidad?: string;
  nombre_grupo?: string;
}

export interface AsistenciaRegistro {
  id_inscripcion: number;
  asistio: boolean;
  observaciones?: string;
}

export interface AsistenciaMasiva {
  fecha: string;
  asistencias: AsistenciaRegistro[];
}

export interface AsistenciaStats {
  total_catequizandos: number;
  total_registros_asistencia: number;
  total_asistencias: number;
  total_inasistencias: number;
  total_fechas_clase: number;
  porcentaje_asistencia_general: number;
}

export interface AsistenciaResumen {
  id_inscripcion: number;
  id_catequizando: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  grupo: string;
  total_clases: number;
  total_asistencias: number;
  total_ausencias: number;
  porcentaje_asistencia: number;
  ultima_asistencia: string | null;
  estado_asistencia: 'excelente' | 'buena' | 'regular' | 'deficiente';
  en_riesgo: boolean;
}

export interface AsistenciaPorFecha {
  fecha: string;
  presentes: number;
  ausentes: number;
  total: number;
  porcentaje: number;
}

export interface AsistenciaPorGrupo {
  grupo: string;
  total_catequizandos: number;
  promedio_asistencia: number;
  clases_realizadas: number;
}

export interface CatequizandoRiesgo {
  id_catequizando: number;
  nombres: string;
  apellidos: string;
  grupo: string;
  porcentaje_asistencia: number;
  total_ausencias: number;
}

export interface EstadisticasAsistencia {
  total_clases: number;
  total_catequizandos: number;
  promedio_asistencia: number;
  mejor_asistencia: number;
  peor_asistencia: number;
  tendencia: 'up' | 'down' | 'stable';
  catequizandos_riesgo: number;
}

export interface AsistenciaFilters {
  parroquia?: number;
  nivel?: number;
  grupo?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  periodo?: string;
  porcentaje_minimo?: number;
}