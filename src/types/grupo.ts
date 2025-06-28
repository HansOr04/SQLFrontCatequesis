export interface Grupo {
  id_grupo: number;
  id_parroquia: number;
  id_nivel: number;
  nombre: string;
  periodo: string;
  nombre_parroquia?: string;
  nombre_nivel?: string;
  orden_nivel?: number;
  total_inscripciones?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GrupoFormData {
  id_parroquia: number;
  id_nivel: number;
  nombre: string;
  periodo: string;
}

export interface GrupoFilters {
  search?: string;
  parroquia?: number;
  nivel?: number;
  periodo?: string;
}

export interface GrupoStats {
  total_inscripciones: number;
  total_catequistas: number;
  inscripciones_con_asistencias: number;
  porcentaje_asistencia_promedio: number;
}
