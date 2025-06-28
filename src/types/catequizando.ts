// src/types/catequizando.ts
export interface Catequizando {
  id_catequizando: number
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  documento_identidad: string
  caso_especial: boolean
  edad?: number
  nombre_completo?: string
  total_inscripciones?: number
  nivel_actual?: string
  parroquia_actual?: string
  porcentaje_asistencia?: number
}

export interface CatequizandoStats {
  total_catequizandos: number
  casos_especiales: number
  ninos: number
  adolescentes: number
  adultos: number
  activos_este_ano: number
  sin_inscripciones: number
}
