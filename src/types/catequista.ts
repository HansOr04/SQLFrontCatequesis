import { Grupo } from './grupo'
export interface Catequista {
  id_catequista: number
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  documento_identidad: string
  telefono?: string
  email?: string
  id_parroquia: number
  nombre_parroquia: string
  nivel_actual?: string
  activo: boolean
  porcentaje_asistencia?: number
  grupos?: Grupo[]
}

