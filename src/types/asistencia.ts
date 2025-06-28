
export interface Asistencia {
  id_asistencia: number
  id_inscripcion: number
  fecha: string
  asistio: boolean
  nombre_catequizando?: string
  documento_identidad?: string
  nombre_grupo?: string
}

export interface AsistenciaStats {
  total_catequizandos: number
  total_registros_asistencia: number
  total_asistencias: number
  total_inasistencias: number
  total_fechas_clase: number
  porcentaje_asistencia_general: number
}

export interface AsistenciaResumen {
  id_inscripcion: number
  nombre_catequizando: string
  documento_identidad: string
  total_clases: number
  asistencias: number
  inasistencias: number
  porcentaje_asistencia: number
}

