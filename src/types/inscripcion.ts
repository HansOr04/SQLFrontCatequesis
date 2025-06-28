// src/types/inscripcion.ts
export interface Inscripcion {
  id_inscripcion: number
  id_catequizando: number
  id_grupo: number
  id_parroquia: number
  fecha_inscripcion: string
  pago_realizado: boolean
  observaciones?: string
  nombre_catequizando?: string
  documento_identidad?: string
  nombre_grupo?: string
  nombre_parroquia?: string
  periodo?: string
  nivel?: string
}

