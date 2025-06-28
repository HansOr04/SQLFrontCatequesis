import { Catequista } from './catequista'
export interface Grupo {
  id_grupo: number
  id_parroquia: number
  id_nivel: number
  nombre: string
  periodo: string
  nombre_parroquia: string
  nombre_nivel: string
  orden_nivel: number
  total_inscripciones: number
  capacidad?: number
  catequistas?: Catequista[]
  porcentaje_asistencia?: number
}
